// Blyx Timer System — sleep, after, interval
// Created by Rahul Chaube — https://blyx-lang.space
// Open Source — MIT + Apache 2.0

use std::time::{Duration, Instant};
use std::thread;
use std::sync::{Arc, Mutex};

/// Sleep for the given duration (blocking).
pub fn sleep(duration: Duration) {
    thread::sleep(duration);
}

/// Sleep for `ms` milliseconds (convenience wrapper).
pub fn sleep_ms(ms: u64) {
    thread::sleep(Duration::from_millis(ms));
}

/// Sleep for `secs` seconds (convenience wrapper).
pub fn sleep_secs(secs: u64) {
    thread::sleep(Duration::from_secs(secs));
}

/// Run a callback after a delay in a background thread.
/// Returns a CancellationToken that can be used to cancel the timer before it fires.
pub fn after<F: FnOnce() + Send + 'static>(delay: Duration, f: F) -> CancellationToken {
    let cancelled = Arc::new(Mutex::new(false));
    let token = CancellationToken { cancelled: Arc::clone(&cancelled) };

    thread::spawn(move || {
        thread::sleep(delay);
        if !*cancelled.lock().unwrap() {
            f();
        }
    });

    token
}

/// Run a callback on an interval until cancelled.
/// Returns a CancellationToken.
pub fn every<F: Fn() + Send + 'static>(interval: Duration, f: F) -> CancellationToken {
    let cancelled = Arc::new(Mutex::new(false));
    let token = CancellationToken { cancelled: Arc::clone(&cancelled) };

    thread::spawn(move || {
        loop {
            thread::sleep(interval);
            if *cancelled.lock().unwrap() {
                break;
            }
            f();
        }
    });

    token
}

/// A simple cancellation token for timers.
#[derive(Clone)]
pub struct CancellationToken {
    cancelled: Arc<Mutex<bool>>,
}

impl CancellationToken {
    /// Cancel the associated timer. The callback will not fire if it hasn't already.
    pub fn cancel(&self) {
        *self.cancelled.lock().unwrap() = true;
    }

    /// Check if the timer has been cancelled.
    pub fn is_cancelled(&self) -> bool {
        *self.cancelled.lock().unwrap()
    }
}

/// Measure elapsed time with a simple stopwatch.
pub struct Stopwatch {
    start: Instant,
}

impl Stopwatch {
    pub fn start() -> Self {
        Self { start: Instant::now() }
    }

    pub fn elapsed(&self) -> Duration {
        self.start.elapsed()
    }

    pub fn elapsed_ms(&self) -> u128 {
        self.start.elapsed().as_millis()
    }

    pub fn reset(&mut self) {
        self.start = Instant::now();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sleep_ms() {
        let sw = Stopwatch::start();
        sleep_ms(50);
        assert!(sw.elapsed_ms() >= 40);
    }

    #[test]
    fn test_stopwatch() {
        let sw = Stopwatch::start();
        sleep_ms(10);
        assert!(sw.elapsed().as_millis() >= 5);
    }

    #[test]
    fn test_after_fires() {
        let fired = Arc::new(Mutex::new(false));
        let f = Arc::clone(&fired);
        let _token = after(Duration::from_millis(20), move || {
            *f.lock().unwrap() = true;
        });
        sleep_ms(100);
        assert!(*fired.lock().unwrap());
    }

    #[test]
    fn test_after_cancelled() {
        let fired = Arc::new(Mutex::new(false));
        let f = Arc::clone(&fired);
        let token = after(Duration::from_millis(200), move || {
            *f.lock().unwrap() = true;
        });
        token.cancel();
        sleep_ms(300);
        assert!(!*fired.lock().unwrap());
    }
}
