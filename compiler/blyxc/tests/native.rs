use std::process::Command;

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
