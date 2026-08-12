use std::io::{Read, Write};
use std::net::TcpStream;

pub struct Response {
    pub status: u16,
    pub body: String,
    pub headers: Vec<(String, String)>,
}

#[derive(Debug)]
pub enum NetErrorKind { DnsError, ConnectError, Timeout, ParseError, IoError }

#[derive(Debug)]
pub struct NetError {
    pub kind: NetErrorKind,
    pub message: String,
}

pub fn get(url: &str) -> Result<Response, NetError> {
    let (host, port, path, _) = parse_url(url)?;
    let req = format!("GET {} HTTP/1.1\r\nHost: {}\r\nConnection: close\r\n\r\n", path, host);
    let raw = tcp_request(&host, port, &req)?;
    parse_response(&raw)
}

pub fn post(url: &str, body: &str) -> Result<Response, NetError> {
    let (host, port, path, _) = parse_url(url)?;
    let req = format!("POST {} HTTP/1.1\r\nHost: {}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}", path, host, body.len(), body);
    let raw = tcp_request(&host, port, &req)?;
    parse_response(&raw)
}

pub fn post_json(url: &str, json_body: &str) -> Result<Response, NetError> {
    let (host, port, path, _) = parse_url(url)?;
    let req = format!("POST {} HTTP/1.1\r\nHost: {}\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}", path, host, json_body.len(), json_body);
    let raw = tcp_request(&host, port, &req)?;
    parse_response(&raw)
}

fn parse_url(url: &str) -> Result<(String, u16, String, String), NetError> {
    let parts: Vec<&str> = url.split("://").collect();
    if parts.len() != 2 {
        return Err(NetError { kind: NetErrorKind::ParseError, message: "Invalid URL".into() });
    }
    let scheme = parts[0].to_string();
    let port = if scheme == "https" { 443 } else { 80 };

    let host_path = parts[1];
    if let Some(slash_idx) = host_path.find('/') {
        let mut host = &host_path[..slash_idx];
        let path = &host_path[slash_idx..];
        let mut p = port;
        if let Some(colon_idx) = host.find(':') {
            p = host[colon_idx+1..].parse().unwrap_or(port);
            host = &host[..colon_idx];
        }
        Ok((host.to_string(), p, path.to_string(), scheme))
    } else {
        let mut host = host_path;
        let mut p = port;
        if let Some(colon_idx) = host.find(':') {
            p = host[colon_idx+1..].parse().unwrap_or(port);
            host = &host[..colon_idx];
        }
        Ok((host.to_string(), p, "/".to_string(), scheme))
    }
}

fn tcp_request(host: &str, port: u16, request: &str) -> Result<String, NetError> {
    let mut stream = TcpStream::connect((host, port)).map_err(|e| NetError { kind: NetErrorKind::ConnectError, message: e.to_string() })?;
    stream.write_all(request.as_bytes()).map_err(|e| NetError { kind: NetErrorKind::IoError, message: e.to_string() })?;

    let mut resp = String::new();
    stream.read_to_string(&mut resp).map_err(|e| NetError { kind: NetErrorKind::IoError, message: e.to_string() })?;
    Ok(resp)
}

fn parse_response(raw: &str) -> Result<Response, NetError> {
    let mut parts = raw.splitn(2, "\r\n\r\n");
    let head = parts.next().unwrap_or("");
    let body = parts.next().unwrap_or("").to_string();

    let mut lines = head.lines();
    let status_line = lines.next().unwrap_or("");
    let status = status_line.split_whitespace().nth(1).and_then(|s| s.parse().ok()).unwrap_or(0);

    let mut headers = Vec::new();
    for line in lines {
        if let Some((k, v)) = line.split_once(':') {
            headers.push((k.trim().to_string(), v.trim().to_string()));
        }
    }

    Ok(Response { status, body, headers })
}
