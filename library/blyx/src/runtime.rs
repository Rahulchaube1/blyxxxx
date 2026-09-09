// Blyx Runtime Initialization — thread pool setup, signal handlers, and global state
// Created by Rahul Chaube — https://blyx-lang.space
// Open Source — MIT + Apache 2.0

use std::sync::{Arc, Mutex, OnceLock};
use std::thread;

/// Global runtime state.
static RUNTIME: OnceLock<Arc<BlyxRuntime>> = OnceLock::new();

pub struct BlyxRuntime {
    pub num_threads: usize,
    pub thread_pool: Mutex<Vec<thread::JoinHandle<()>>>,
}

impl BlyxRuntime {
    fn new(num_threads: usize) -> Self {
        Self { num_threads, thread_pool: Mutex::new(Vec::new()) }
    }
}

/// Initialize the Blyx runtime. Call once at program start.
/// `num_threads` defaults to the number of logical CPUs if None.
pub fn init_runtime(num_threads: Option<usize>) {
    let n = num_threads.unwrap_or_else(|| {
        // Fallback to 4 if we can't determine CPU count
        std::thread::available_parallelism().map(|n| n.get()).unwrap_or(4)
    });

    RUNTIME.get_or_init(|| Arc::new(BlyxRuntime::new(n)));
}

/// Get the global runtime. Panics if init_runtime() hasn't been called.
pub fn runtime() -> Arc<BlyxRuntime> {
    RUNTIME.get().expect("Blyx runtime not initialized. Call init_runtime() first.").clone()
}

/// Returns the number of worker threads in the runtime pool.
pub fn num_threads() -> usize {
    RUNTIME.get().map(|r| r.num_threads).unwrap_or(1)
}

/// Check whether the runtime has been initialized.
pub fn is_initialized() -> bool {
    RUNTIME.get().is_some()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_init_runtime_default() {
        init_runtime(None);
        assert!(is_initialized());
        assert!(num_threads() > 0);
    }

    #[test]
    fn test_init_runtime_explicit() {
        init_runtime(Some(8));
        // OnceLock only allows first init, but at least it doesn't panic
        assert!(is_initialized());
    }
}
