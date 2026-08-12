use std::io::{self, Write};

pub fn print(s: &str) {
    print!("{}", s);
    let _ = io::stdout().flush();
}

pub fn println(s: &str) {
    println!("{}", s);
}

pub fn eprintln(s: &str) {
    eprintln!("{}", s);
}

pub fn stdin_line() -> String {
    let mut s = String::new();
    let _ = io::stdin().read_line(&mut s);
    s.trim_end().to_string()
}

pub struct StdinReader {
    stdin: io::Stdin,
}

impl Default for StdinReader {
    fn default() -> Self {
        Self::new()
    }
}

impl StdinReader {
    pub fn new() -> Self {
        Self { stdin: io::stdin() }
    }
}

impl Iterator for StdinReader {
    type Item = String;
    fn next(&mut self) -> Option<String> {
        let mut buf = String::new();
        match self.stdin.read_line(&mut buf) {
            Ok(0) => None,
            Ok(_) => Some(buf),
            Err(_) => None,
        }
    }
}

pub struct StdoutWriter {
    stdout: io::Stdout,
}

impl Default for StdoutWriter {
    fn default() -> Self {
        Self::new()
    }
}

impl StdoutWriter {
    pub fn new() -> Self {
        Self { stdout: io::stdout() }
    }

    pub fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.stdout.write(buf)
    }

    pub fn flush(&mut self) -> io::Result<()> {
        self.stdout.flush()
    }

    pub fn writeln(&mut self, s: &str) -> io::Result<()> {
        self.write(s.as_bytes())?;
        self.write(b"\n")?;
        Ok(())
    }
}
