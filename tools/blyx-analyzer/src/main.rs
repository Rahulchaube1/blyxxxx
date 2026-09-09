use std::io::{self, BufRead};

fn main() {
    eprintln!("blyx-analyzer — Blyx language server prototype");
    eprintln!("Listening for JSON-RPC messages on stdio...");

    let stdin = io::stdin();
    for line in stdin.lock().lines() {
        let Ok(message) = line else { continue };

        if message.contains("\"method\":\"initialize\"") {
            println!(
                "{{\"jsonrpc\":\"2.0\",\"id\":1,\"result\":{{\"capabilities\":{{\"textDocumentSync\":1}}}}}}"
            );
        } else if message.contains("\"method\":\"shutdown\"") {
            println!("{{\"jsonrpc\":\"2.0\",\"id\":2,\"result\":null}}");
            break;
        }
    }
}
