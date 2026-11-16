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


#[test]
fn loop_program_and_execution_budget() {
    let dir = std::env::temp_dir().join(format!("blyxc-loops-{}", std::process::id()));
    fs::create_dir_all(&dir).unwrap();
    let path = dir.join("main.blyx");
    fs::write(&path, "fn main() { let mut n = 0; while n < 3 { n += 1; println!(n); } }").unwrap();
    let output = Command::new(env!("CARGO_BIN_EXE_blyxc")).arg("run").arg(&path).output().unwrap();
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    assert_eq!(String::from_utf8(output.stdout).unwrap().replace("\r\n", "\n"), "1\n2\n3\n");
    fs::write(&path, "fn main() { loop {} }").unwrap();
    let output = Command::new(env!("CARGO_BIN_EXE_blyxc")).arg("run").arg(&path).args(["--max-steps", "50"]).output().unwrap();
    assert_eq!(output.status.code(), Some(4));
    assert!(String::from_utf8_lossy(&output.stderr).contains("step limit"));
    for args in [vec!["--max-steps", "0"], vec!["--max-steps", "bad"], vec!["--max-steps"], vec!["--unknown"]] {
        let output = Command::new(env!("CARGO_BIN_EXE_blyxc")).arg("run").arg(&path).args(args).output().unwrap();
        assert_eq!(output.status.code(), Some(2));
    }
    fs::remove_dir_all(dir).unwrap();
}
