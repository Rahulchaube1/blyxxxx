// Stage-zero implementation of the bounded services used by the Blyx bootstrap.
// The self-compiled executable supplies these services in its own machine code.
use std::cell::RefCell;
thread_local! {
    static BOOT_MEMORY: RefCell<Vec<i64>> = RefCell::new(vec![0; 2097152]);
    static BOOT_INPUT: RefCell<Option<std::io::BufReader<std::fs::File>>> = RefCell::new(None);
    static BOOT_OUTPUT: RefCell<Option<std::fs::File>> = RefCell::new(None);
}
fn boot_index(i: i64) -> usize {
    usize::try_from(i).ok().filter(|&i| i < 2097152).unwrap_or_else(|| fail("bootstrap memory index"))
}
fn boot_get(i: i64) -> i64 { BOOT_MEMORY.with(|m| m.borrow()[boot_index(i)]) }
fn boot_set(i: i64, n: i64) { BOOT_MEMORY.with(|m| m.borrow_mut()[boot_index(i)] = n); }
fn boot_len(s: String) -> i64 { s.len() as i64 }
fn boot_char(s: String, i: i64) -> i64 {
    i64::from(*s.as_bytes().get(boot_index(i)).unwrap_or_else(|| fail("string byte index")))
}
fn boot_read() -> i64 {
    use std::io::Read;
    let mut b = [0];
    match BOOT_INPUT.with(|f| match f.borrow_mut().as_mut() {
        Some(file) => file.read(&mut b), None => std::io::stdin().lock().read(&mut b),
    }) {
        Ok(0) => -1, Ok(_) => i64::from(b[0]), Err(_) => fail("stdin read failed")
    }
}
fn boot_write(n: i64) {
    use std::io::Write;
    let b = [u8::try_from(n).unwrap_or_else(|_| fail("byte range"))];
    BOOT_OUTPUT.with(|f| match f.borrow_mut().as_mut() {
        Some(file) => file.write_all(&b), None => std::io::stdout().lock().write_all(&b),
    }).unwrap();
}
fn boot_err(n: i64) {
    use std::io::Write;
    std::io::stderr().lock().write_all(&[u8::try_from(n).unwrap_or_else(|_| fail("byte range"))]).unwrap();
}
fn boot_exit(n: i64) { std::process::exit(i32::try_from(n).unwrap_or(1)); }
fn boot_windows() -> bool { cfg!(windows) }
fn boot_argc() -> i64 { std::env::args_os().skip(1).count() as i64 }
fn boot_arg(i: i64) -> std::ffi::OsString {
    std::env::args_os().skip(1).nth(boot_index(i)).unwrap_or_else(|| fail("argument index"))
}
fn boot_flag(i: i64, flag: String) -> bool { boot_arg(i) == std::ffi::OsStr::new(&flag) }
fn boot_input(i: i64) -> bool {
    std::fs::File::open(boot_arg(i)).map(|f| BOOT_INPUT.with(|v| *v.borrow_mut() = Some(std::io::BufReader::new(f)))).is_ok()
}
fn boot_output(i: i64) -> bool {
    let mut options = std::fs::OpenOptions::new();
    #[cfg(unix)] { use std::os::unix::fs::OpenOptionsExt; options.mode(0o755); }
    options.write(true).create_new(true).open(boot_arg(i)).map(|f| BOOT_OUTPUT.with(|v| *v.borrow_mut() = Some(f))).is_ok()
}
