use std::{fs, process::Command};

#[test]
fn real_program_output_and_runtime_exit_status() {
    let dir = std::env::temp_dir().join(format!("blyxc-cli-{}", std::process::id()));
    fs::create_dir_all(&dir).unwrap();
    let path = dir.join("main.blyx");
    fs::write(&path, "fn main() { println!(\"नमस्ते Blyx\"); println!(6 * 7); }").unwrap();
    let output = Command::new(env!("CARGO_BIN_EXE_blyxc")).arg("run").arg(&path).output().unwrap();
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    assert_eq!(String::from_utf8(output.stdout).unwrap().replace("\r\n", "\n"), "नमस्ते Blyx\n42\n");
    fs::write(&path, "fn main() { return 1 / 0; }").unwrap();
    let output = Command::new(env!("CARGO_BIN_EXE_blyxc")).arg("run").arg(&path).output().unwrap();
    assert_eq!(output.status.code(), Some(4));
    assert!(String::from_utf8_lossy(&output.stderr).contains("division by zero"));
    fs::remove_dir_all(dir).unwrap();
}
