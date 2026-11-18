use blyx_parser::BlyxParser;
use std::{
    cell::RefCell,
    io::{self, Write},
};

// The host fills this buffer between prepare and evaluate. Both run on one worker.
thread_local! { static SOURCE: RefCell<Vec<u8>> = const { RefCell::new(Vec::new()) }; }
#[link(wasm_import_module = "blyx")]
unsafe extern "C" {
    fn output(ptr: *const u8, len: usize);
    fn diagnostic(line: usize, column: usize, ptr: *const u8, len: usize);
}

struct Console;
impl Write for Console {
    fn write(&mut self, bytes: &[u8]) -> io::Result<usize> {
        unsafe { output(bytes.as_ptr(), bytes.len()) };
        Ok(bytes.len())
    }
    fn flush(&mut self) -> io::Result<()> {
        Ok(())
    }
}

#[unsafe(no_mangle)]
pub extern "C" fn prepare(len: usize) -> *mut u8 {
    if len > 256 * 1024 {
        return std::ptr::null_mut();
    }
    SOURCE.with_borrow_mut(|buffer| {
        buffer.resize(len, 0);
        buffer.as_mut_ptr()
    })
}

#[unsafe(no_mangle)]
pub extern "C" fn evaluate(run: bool) -> i32 {
    SOURCE.with_borrow(|buffer| {
        let Ok(source) = std::str::from_utf8(buffer) else { return 2 };
        let mut parser = BlyxParser::new(source);
        let file = parser.parse_file("main.blyx");
        for err in parser.errors().iter().take(100) {
            unsafe {
                diagnostic(err.span.line, err.span.column, err.message.as_ptr(), err.message.len())
            };
        }
        if parser.has_errors() {
            return 1;
        }
        if run {
            if let Err(msg) = super::execute(&file, super::DEFAULT_MAX_STEPS, Console) {
                unsafe { diagnostic(0, 0, msg.as_ptr(), msg.len()) };
                return 4;
            }
        }
        0
    })
}
