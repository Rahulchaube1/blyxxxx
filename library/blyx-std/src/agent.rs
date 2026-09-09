use std::sync::{Arc, Mutex};
use std::thread;

#[derive(Clone, Debug)]
pub enum AgentMessage {
    Text(String),
    Json(String),
    Terminate,
    Error(String),
}

#[derive(Debug)]
pub enum AgentErrorKind {
    Disconnected,
    Timeout,
    ExecutionError,
    LlmError,
}

#[derive(Debug)]
pub struct AgentError {
    pub kind: AgentErrorKind,
    pub message: String,
}

pub struct AgentHandle {
    pub name: String,
    sender: std::sync::mpsc::Sender<AgentMessage>,
    receiver: Arc<Mutex<std::sync::mpsc::Receiver<AgentMessage>>>,
    thread: Option<thread::JoinHandle<()>>,
}

impl AgentHandle {
    pub fn send(&self, msg: AgentMessage) -> Result<(), AgentError> {
        self.sender
            .send(msg)
            .map_err(|e| AgentError { kind: AgentErrorKind::Disconnected, message: e.to_string() })
    }

    pub fn receive(&self) -> Result<AgentMessage, AgentError> {
        self.receiver
            .lock()
            .unwrap()
            .recv()
            .map_err(|e| AgentError { kind: AgentErrorKind::Disconnected, message: e.to_string() })
    }

    pub fn try_receive(&self) -> Option<AgentMessage> {
        self.receiver.lock().unwrap().try_recv().ok()
    }

    pub fn terminate(mut self) -> Result<(), AgentError> {
        self.send(AgentMessage::Terminate)?;
        if let Some(t) = self.thread.take() {
            let _ = t.join();
        }
        Ok(())
    }

    pub fn is_alive(&self) -> bool {
        self.thread.as_ref().map(|t| !t.is_finished()).unwrap_or(false)
    }
}

pub struct AgentConfig {
    pub llm_model: String,
    pub system_prompt: String,
    pub max_iterations: u32,
}

impl Default for AgentConfig {
    fn default() -> Self {
        Self {
            llm_model: "llama3".into(),
            system_prompt: "You are a helpful agent.".into(),
            max_iterations: 10,
        }
    }
}

pub struct Agent {
    pub name: String,
    pub config: AgentConfig,
}

impl Agent {
    pub fn new(name: &str) -> Self {
        Self { name: name.to_string(), config: AgentConfig::default() }
    }

    pub fn with_config(name: &str, config: AgentConfig) -> Self {
        Self { name: name.to_string(), config }
    }

    pub fn spawn(self, task: String) -> AgentHandle {
        let (tx1, rx1) = std::sync::mpsc::channel();
        let (tx2, rx2) = std::sync::mpsc::channel();

        let thread = thread::spawn(move || {
            let _ = tx2.send(AgentMessage::Text(format!("Processing task: {}", task)));
            while let Ok(msg) = rx1.recv() {
                match msg {
                    AgentMessage::Terminate => break,
                    AgentMessage::Text(t) => {
                        let _ = tx2.send(AgentMessage::Text(format!("Echo: {}", t)));
                    }
                    _ => {}
                }
            }
        });

        AgentHandle {
            name: self.name,
            sender: tx1,
            receiver: Arc::new(Mutex::new(rx2)),
            thread: Some(thread),
        }
    }

    pub fn run_sync(&self, task: &str) -> Result<String, AgentError> {
        Ok(format!("Agent {} finished task: {}", self.name, task))
    }
}

pub struct AgentOrchestrator {
    agents: Vec<AgentHandle>,
}

impl Default for AgentOrchestrator {
    fn default() -> Self {
        Self::new()
    }
}

impl AgentOrchestrator {
    pub fn new() -> Self {
        Self { agents: Vec::new() }
    }

    pub fn add_agent(&mut self, handle: AgentHandle) {
        self.agents.push(handle);
    }

    pub fn broadcast(&self, msg: AgentMessage) -> Vec<Result<(), AgentError>> {
        self.agents.iter().map(|a| a.send(msg.clone())).collect()
    }

    pub fn collect_results(&self) -> Vec<Result<AgentMessage, AgentError>> {
        self.agents.iter().map(|a| a.receive()).collect()
    }

    pub fn shutdown_all(mut self) {
        for a in self.agents.drain(..) {
            let _ = a.terminate();
        }
    }
}
