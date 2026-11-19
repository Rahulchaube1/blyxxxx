use std::{fs, path::Path, process::Command};

const DRIVER: &str = env!("CARGO_BIN_EXE_blyxc");

fn source(dir: &Path, name: &str, text: &str) -> std::path::PathBuf {
    let path = dir.join(name);
    fs::write(&path, text).unwrap();
    path
}

#[test]
fn native_modules_and_host_calls_work_from_another_directory() {
    let dir = tempfile::tempdir().unwrap();
    source(
        dir.path(),
        "util.blyx",
        r#"
        use std::cli;
        use std::fs;
        use std::text;
        fn first(xs: arglist) -> String { args_at(xs, 0) }
        pub fn inspect(xs: arglist) {
            println!(text_concat(first(xs), env_get("BLYX_NATIVE_TEST", "!")));
            let path = path_join(exe_dir(), "irrelevant");
            println!(is_file(path));
            println!(read_text(args_at(xs, 1)));
        }"#,
    );
    let path = source(
        dir.path(),
        "main.blyx",
        r#"
        use util;
        use std::cli;
        fn main() {
            let args = cli_args();
            inspect(args);
            process_exit(23);
        }"#,
    );
    let data = source(dir.path(), "data with spaces", "héllo");
    let out = Command::new(DRIVER)
        .arg("native-run")
        .arg(&path)
        .args(["--", "hello ; $(echo)", data.to_str().unwrap()])
        .env("BLYX_NATIVE_TEST", "?")
        .output()
        .unwrap();
    assert_eq!(out.status.code(), Some(23), "{}", String::from_utf8_lossy(&out.stderr));
    assert_eq!(
        String::from_utf8(out.stdout).unwrap().replace("\r\n", "\n"),
        "hello ; $(echo)?\nfalse\nhéllo\n"
    );
    let interpreted = Command::new(DRIVER).arg("run").arg(path).output().unwrap();
    assert!(!interpreted.status.success());
}

#[test]
fn module_visibility_cycles_collisions_and_imported_source_overwrites_are_checked() {
    let dir = tempfile::tempdir().unwrap();
    let helper = source(dir.path(), "helper.blyx", "pub fn yes() {} fn private_fn() {}");
    for (text, expected) in [
        ("use missing; fn main() {}", "cannot import"),
        ("use main; fn main() {}", "cyclic"),
        ("use helper; fn main() { private_fn(); }", "unknown function"),
        ("use helper; fn yes() {} fn main() {}", "duplicate"),
        ("fn main() { cli_args(); }", "requires use"),
        ("use helper; fn main() {}", "replace the source"),
    ] {
        let path = source(dir.path(), "main.blyx", text);
        let out =
            Command::new(DRIVER).arg("build").arg(path).arg("-o").arg(&helper).output().unwrap();
        assert!(!out.status.success());
        assert!(String::from_utf8_lossy(&out.stderr).contains(expected), "{out:?}");
        assert!(fs::read_to_string(&helper).unwrap().contains("private_fn"));
    }
}

#[test]
fn executable_forwards_an_opaque_argument_vector_and_exit_status() {
    let dir = tempfile::tempdir().unwrap();
    let path = source(
        dir.path(),
        "forward.blyx",
        r#"
        use std::cli;
        fn main() {
            let xs = cli_args();
            if args_at(xs, 0) == "child" {
                println!(args_len(xs));
                println!(args_at(xs, 1));
                println!(env_get("BLYX_FORWARDED", "missing"));
                process_exit(19);
            }
            let env = args_push(args_push(args_new(), "BLYX_FORWARDED"), "active");
            let child = args_concat(args_push(args_new(), "child"), args_item(xs, 1));
            process_exit(process_run(args_at(xs, 0), child, env));
        }"#,
    );
    let exe = dir.path().join(format!("binary with spaces{}", std::env::consts::EXE_SUFFIX));
    let build = Command::new(DRIVER).arg("build").arg(path).arg("-o").arg(&exe).output().unwrap();
    assert!(build.status.success(), "{}", String::from_utf8_lossy(&build.stderr));
    let result = Command::new(&exe).arg(&exe).arg("hello & | $()").output().unwrap();
    assert_eq!(result.status.code(), Some(19));
    assert_eq!(
        String::from_utf8(result.stdout).unwrap().replace("\r\n", "\n"),
        "2\nhello & | $()\nactive\n"
    );
    let invalid = Command::new(exe).arg("child").output().unwrap();
    assert_eq!(invalid.status.code(), Some(4));
}
