// Standard-library operations for compiled native programs.
use std::ffi::OsString;
use std::path::PathBuf;
use std::process::Command;
use std::rc::Rc;

type ArgList = Rc<Vec<OsString>>;
fn buffer_fill(n: i64, value: f64) -> Vector {
    let n = usize::try_from(n).unwrap_or_else(|_| fail("invalid buffer length"));
    let mut data = Vec::new();
    data.try_reserve_exact(n).unwrap_or_else(|_| fail("buffer allocation failed"));
    data.resize(n, value);
    data.into()
}
fn buffer_write(data: &mut Vector, i: i64, value: f64) {
    let i = usize::try_from(i).ok().filter(|&i| i < data.len())
        .unwrap_or_else(|| fail("buffer index out of bounds"));
    Rc::make_mut(data)[i] = value;
}
fn buffer_set(mut data: Vector, i: i64, value: f64) -> Vector {
    buffer_write(&mut data, i, value);
    data
}
fn cli_args() -> ArgList {
    Rc::new(std::env::args_os().skip(1).collect())
}
fn args_new() -> ArgList {
    Rc::default()
}
fn args_len(args: ArgList) -> i64 {
    args.len() as i64
}
fn index(i: i64) -> usize {
    usize::try_from(i).unwrap_or_else(|_| fail("argument index out of bounds"))
}
fn args_at(args: ArgList, i: i64) -> String {
    args.get(index(i))
        .unwrap_or_else(|| fail("argument index out of bounds"))
        .to_string_lossy()
        .into_owned()
}
fn args_item(args: ArgList, i: i64) -> ArgList {
    Rc::new(vec![
        args.get(index(i)).unwrap_or_else(|| fail("argument index out of bounds")).clone(),
    ])
}
fn args_tail(args: ArgList, start: i64) -> ArgList {
    Rc::new(
        args.get(index(start)..).unwrap_or_else(|| fail("argument index out of bounds")).to_vec(),
    )
}
fn args_push(mut args: ArgList, text: String) -> ArgList {
    Rc::make_mut(&mut args).push(text.into());
    args
}
fn args_concat(mut left: ArgList, right: ArgList) -> ArgList {
    Rc::make_mut(&mut left).extend(right.iter().cloned());
    left
}
fn args_join(args: ArgList, separator: String) -> String {
    args.iter().map(|s| s.to_string_lossy()).collect::<Vec<_>>().join(&separator)
}
fn text_concat(mut left: String, right: String) -> String {
    left.push_str(&right);
    left
}
fn text_starts(text: String, prefix: String) -> bool {
    text.starts_with(&prefix)
}
fn text_ends(text: String, suffix: String) -> bool {
    text.ends_with(&suffix)
}
fn text_before(text: String, separator: String) -> String {
    text.split_once(&separator).map_or(text.as_str(), |(prefix, _)| prefix).to_owned()
}
fn text_after(text: String, prefix: String) -> String {
    text.strip_prefix(&prefix).unwrap_or(&text).to_owned()
}
fn text_lines(text: String) -> ArgList {
    Rc::new(text.lines().map(OsString::from).collect())
}
fn text_split(text: String, delimiter: String) -> ArgList {
    if delimiter.is_empty() { fail("text_split needs a nonempty delimiter") }
    Rc::new(text.split(&delimiter).map(OsString::from).collect())
}
fn text_trim(text: String) -> String { text.trim().to_owned() }
fn finite_number(text: &str) -> Option<f64> {
    text.trim().parse::<f64>().ok().filter(|n| n.is_finite())
}
fn text_is_number(text: String) -> bool { finite_number(&text).is_some() }
fn text_number(text: String) -> f64 {
    finite_number(&text).unwrap_or_else(|| fail("expected a finite number"))
}
fn int_text(value: i64) -> String { value.to_string() }
fn read_text(path: String) -> String {
    std::fs::read_to_string(&path).unwrap_or_else(|e| fail(&format!("cannot read {path}: {e}")))
}
fn is_file(path: String) -> bool {
    std::path::Path::new(&path).is_file()
}
fn path_text(path: PathBuf) -> String {
    path.into_os_string().into_string().unwrap_or_else(|_| fail("path is not valid Unicode"))
}
fn path_join(base: String, path: String) -> String {
    path_text(PathBuf::from(base).join(path))
}
fn exe_dir() -> String {
    let mut path = std::env::current_exe().unwrap_or_else(|e| fail(&e.to_string()));
    path.pop();
    path_text(path)
}
fn env_get(key: String, fallback: String) -> String {
    std::env::var(key).ok().filter(|s| !s.is_empty()).unwrap_or(fallback)
}
fn stdout_terminal() -> bool {
    std::io::IsTerminal::is_terminal(&std::io::stdout())
}
fn stderr_line(line: String) {
    eprintln!("{line}");
}

fn process_exit(code: i64) -> ! {
    std::process::exit(i32::try_from(code).unwrap_or_else(|_| fail("invalid exit status")))
}
fn command(program: &str, args: ArgList, env: ArgList) -> Command {
    let mut cmd = Command::new(program);
    cmd.args(args.iter());
    let mut pairs = env.chunks_exact(2);
    for pair in &mut pairs {
        if pair[0].is_empty() || pair[0].to_string_lossy().contains('=') {
            fail("invalid environment variable name")
        }
        cmd.env(&pair[0], &pair[1]);
    }
    if !pairs.remainder().is_empty() {
        fail("environment requires key/value pairs");
    }
    cmd
}
fn launch_error(program: &str, e: std::io::Error) -> i64 {
    eprintln!("Could not start {program}: {e}");
    1
}
fn process_run(program: String, args: ArgList, env: ArgList) -> i64 {
    match command(&program, args, env).status() {
        Ok(status) => {
            #[cfg(unix)]
            {
                use std::os::unix::process::ExitStatusExt;
                if let Some(signal) = status.signal() {
                    return i64::from(128 + signal);
                }
            }
            i64::from(status.code().unwrap_or(1))
        }
        Err(e) => launch_error(&program, e),
    }
}
fn process_exec(program: String, args: ArgList, env: ArgList) -> ! {
    #[cfg(unix)]
    {
        use std::os::unix::process::CommandExt;
        let e = command(&program, args, env).exec();
        process_exit(launch_error(&program, e))
    }
    #[cfg(not(unix))]
    process_exit(process_run(program, args, env))
}
