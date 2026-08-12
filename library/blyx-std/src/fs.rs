use std::fs;
use std::io;
use std::path::Path;

#[derive(Debug)]
pub enum FsErrorKind { NotFound, PermissionDenied, AlreadyExists, Other }

#[derive(Debug)]
pub struct FsError {
    pub kind: FsErrorKind,
    pub message: String,
}

impl From<io::Error> for FsError {
    fn from(err: io::Error) -> Self {
        let kind = match err.kind() {
            io::ErrorKind::NotFound => FsErrorKind::NotFound,
            io::ErrorKind::PermissionDenied => FsErrorKind::PermissionDenied,
            io::ErrorKind::AlreadyExists => FsErrorKind::AlreadyExists,
            _ => FsErrorKind::Other,
        };
        Self {
            kind,
            message: err.to_string(),
        }
    }
}

pub fn read_to_string(path: &str) -> Result<String, FsError> {
    Ok(fs::read_to_string(path)?)
}

pub fn write(path: &str, content: &str) -> Result<(), FsError> {
    Ok(fs::write(path, content)?)
}

pub fn append(path: &str, content: &str) -> Result<(), FsError> {
    use std::fs::OpenOptions;
    use std::io::Write;
    let mut file = OpenOptions::new().create(true).append(true).open(path)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}

pub fn exists(path: &str) -> bool {
    Path::new(path).exists()
}

pub fn create_dir_all(path: &str) -> Result<(), FsError> {
    Ok(fs::create_dir_all(path)?)
}

pub fn list_dir(path: &str) -> Result<Vec<String>, FsError> {
    let mut entries = Vec::new();
    for entry in fs::read_dir(path)? {
        let entry = entry?;
        if let Some(name) = entry.file_name().to_str() {
            entries.push(name.to_string());
        }
    }
    Ok(entries)
}
