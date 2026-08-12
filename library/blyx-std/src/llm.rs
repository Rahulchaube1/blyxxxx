use std::process::Command;

pub struct LlmConfig {
    pub endpoint: String,
    pub api_key: String,
    pub model: String,
    pub max_tokens: u32,
    pub temperature: f32,
}

impl Default for LlmConfig {
    fn default() -> Self {
        Self {
            endpoint: "http://localhost:11434".to_string(),
            api_key: String::new(),
            model: "llama3".to_string(),
            max_tokens: 2048,
            temperature: 0.7,
        }
    }
}

#[derive(Debug)]
pub struct LlmResponse {
    pub content: String,
    pub model: String,
    pub tokens_used: u32,
    pub finish_reason: String,
}

#[derive(Debug)]
pub enum LlmErrorKind { NetworkError, ParseError, ApiError, Timeout, NotConfigured }

#[derive(Debug)]
pub struct LlmError {
    pub kind: LlmErrorKind,
    pub message: String,
}

impl std::fmt::Display for LlmError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}: {}", self.kind, self.message)
    }
}

pub struct LlmClient {
    config: LlmConfig,
}

impl LlmClient {
    pub fn new(config: LlmConfig) -> Self {
        Self { config }
    }

    pub fn from_env() -> Self {
        let mut config = LlmConfig::default();
        if let Ok(ep) = std::env::var("BLYX_LLM_ENDPOINT") { config.endpoint = ep; }
        if let Ok(key) = std::env::var("BLYX_LLM_KEY") { config.api_key = key; }
        if let Ok(m) = std::env::var("BLYX_LLM_MODEL") { config.model = m; }
        Self { config }
    }

    pub fn call(&self, prompt: &str) -> Result<LlmResponse, LlmError> {
        let body = self.build_request_body(prompt);
        let resp = self.http_post(&self.config.endpoint, &body)?;
        self.parse_response(&resp)
    }

    pub fn call_stream(&self, prompt: &str) -> Result<LlmStream, LlmError> {
        let body = self.build_request_body(prompt);
        let resp = self.http_post(&self.config.endpoint, &body)?;
        let parsed = self.parse_response(&resp)?;
        Ok(LlmStream {
            chunks: parsed.content.split_whitespace().map(|s| s.to_string() + " ").collect(),
            pos: 0,
        })
    }

    pub fn generate(&self, prompt: &str) -> Result<String, LlmError> {
        Ok(self.call(prompt)?.content)
    }

    fn build_request_body(&self, prompt: &str) -> String {
        let p_esc = prompt.replace('\"', "\\\"");
        format!(
            r#"{{"model":"{}","prompt":"{}","max_tokens":{},"temperature":{}}}"#,
            self.config.model, p_esc, self.config.max_tokens, self.config.temperature
        )
    }

    fn parse_response(&self, body: &str) -> Result<LlmResponse, LlmError> {
        let mut content = String::new();
        if let Some(c) = body.split("\"content\":\"").nth(1) {
            if let Some(c) = c.split('\"').next() {
                content = c.replace("\\\"", "\"").replace("\\n", "\n");
            }
        } else if let Some(c) = body.split("\"response\":\"").nth(1) {
            if let Some(c) = c.split('\"').next() {
                content = c.replace("\\\"", "\"").replace("\\n", "\n");
            }
        }

        Ok(LlmResponse {
            content,
            model: self.config.model.clone(),
            tokens_used: 0,
            finish_reason: "stop".to_string(),
        })
    }

    fn http_post(&self, path: &str, body: &str) -> Result<String, LlmError> {
        if path.starts_with("http://") || path.starts_with("https://") {
            let output = Command::new("curl")
                .arg("-s")
                .arg("-X")
                .arg("POST")
                .arg(path)
                .arg("-H")
                .arg("Content-Type: application/json")
                .arg("-d")
                .arg(body)
                .output()
                .map_err(|e| LlmError { kind: LlmErrorKind::NetworkError, message: e.to_string() })?;

            if output.status.success() {
                Ok(String::from_utf8_lossy(&output.stdout).to_string())
            } else {
                Err(LlmError { kind: LlmErrorKind::ApiError, message: String::from_utf8_lossy(&output.stderr).to_string() })
            }
        } else {
            Err(LlmError { kind: LlmErrorKind::NotConfigured, message: "Invalid URL".into() })
        }
    }
}

pub struct LlmStream {
    chunks: Vec<String>,
    pos: usize,
}

impl Iterator for LlmStream {
    type Item = String;
    fn next(&mut self) -> Option<String> {
        if self.pos < self.chunks.len() {
            let r = self.chunks[self.pos].clone();
            self.pos += 1;
            Some(r)
        } else {
            None
        }
    }
}
