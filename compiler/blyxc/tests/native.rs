use std::{path::Path, process::Command};

#[test]
fn native_and_interpreter_agree_on_shipped_programs() {
    let dir = tempfile::tempdir().unwrap();
    let bin = dir.path().join(format!("sample{}", std::env::consts::EXE_SUFFIX));
    let examples = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../examples");
    for (name, expected) in [
        ("ml/linear_fit.blyx", "2\n10\n"),
        ("basic/fibonacci.blyx", "Fibonacci(10):\n55\n"),
        ("basic/loops.blyx", "Factorial(6):\n720\n10\n"),
    ] {
        let path = examples.join(name);
        let cli = env!("CARGO_BIN_EXE_blyxc");
        let built = Command::new(cli).arg("build").arg(&path).arg("-o").arg(&bin).output().unwrap();
        assert!(built.status.success(), "{}", String::from_utf8_lossy(&built.stderr));
        for result in [
            Command::new(cli).arg("run").arg(&path).output().unwrap(),
            Command::new(&bin).output().unwrap(),
        ] {
            assert!(result.status.success());
            assert_eq!(String::from_utf8(result.stdout).unwrap().replace("\r\n", "\n"), expected);
        }
    }
}

#[test]
fn vector_errors_and_bad_literals_are_reported() {
    let dir = tempfile::tempdir().unwrap();
    let input = dir.path().join("test.blyx");
    for (expr, code, text) in [
        ("dot([1], [])", 4, "equal length"),
        ("at([1], -1)", 4, "out of bounds"),
        ("[true]", 4, "expected a number"),
        ("1.0e+", 1, "numeric literal"),
        ("18446744073709551616", 1, "numeric literal"),
    ] {
        std::fs::write(&input, format!("fn main() {{ println!({expr}); }}")).unwrap();
        let result =
            Command::new(env!("CARGO_BIN_EXE_blyxc")).arg("run").arg(&input).output().unwrap();
        assert_eq!(result.status.code(), Some(code));
        assert!(String::from_utf8_lossy(&result.stderr).contains(text));
    }
}
