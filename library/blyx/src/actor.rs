// Blyx Actor Model — Work-stealing actor scheduler with typed message channels
// Created by Rahul Chaube — https://blyx-lang.space
// Open Source — MIT + Apache 2.0

use std::sync::mpsc::{Receiver, Sender, channel};
use std::sync::{Arc, Mutex};
use std::thread;

/// Core Actor trait — implement this to define actor behaviour.
pub trait Actor: Send + 'static {
    type Message: Send;
    /// Called for each message delivered to this actor.
    fn handle(&mut self, msg: Self::Message);
    /// Called once before the actor starts processing messages.
    fn on_start(&mut self) {}
    /// Called once after the actor stops (channel closed or terminate).
    fn on_stop(&mut self) {}
}

/// A handle to a running actor — can send messages and join the actor thread.
pub struct ActorHandle<M: Send + 'static> {
    sender: Sender<ActorMessage<M>>,
    thread: Option<thread::JoinHandle<()>>,
}

enum ActorMessage<M> {
    User(M),
    Stop,
}

impl<M: Send + 'static> ActorHandle<M> {
    /// Send a message to the actor. Non-blocking.
    pub fn send(&self, msg: M) -> Result<(), ActorError> {
        self.sender.send(ActorMessage::User(msg)).map_err(|_| ActorError::Disconnected)
    }

    /// Send a stop signal and wait for the actor to finish.
    pub fn stop(mut self) -> Result<(), ActorError> {
        let _ = self.sender.send(ActorMessage::Stop);
        if let Some(h) = self.thread.take() {
            h.join().map_err(|_| ActorError::ThreadPanic)?;
        }
        Ok(())
    }

    /// Wait for the actor thread to finish (blocks until channel closes).
    pub fn join(mut self) -> Result<(), ActorError> {
        drop(self.sender);
        if let Some(h) = self.thread.take() {
            h.join().map_err(|_| ActorError::ThreadPanic)?;
        }
        Ok(())
    }

    /// Check if the actor thread is still alive.
    pub fn is_alive(&self) -> bool {
        self.thread.as_ref().map(|t| !t.is_finished()).unwrap_or(false)
    }
}

#[derive(Debug)]
pub enum ActorError {
    Disconnected,
    ThreadPanic,
    QueueFull,
}

impl std::fmt::Display for ActorError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ActorError::Disconnected => write!(f, "Actor channel disconnected"),
            ActorError::ThreadPanic => write!(f, "Actor thread panicked"),
            ActorError::QueueFull => write!(f, "Actor message queue is full"),
        }
    }
}

/// Spawn an actor in its own thread and return a handle to communicate with it.
pub fn spawn_actor<A: Actor>(mut actor: A) -> ActorHandle<A::Message> {
    let (sender, receiver): (Sender<ActorMessage<A::Message>>, Receiver<ActorMessage<A::Message>>) =
        channel();

    let handle = thread::spawn(move || {
        actor.on_start();
        loop {
            match receiver.recv() {
                Ok(ActorMessage::User(msg)) => actor.handle(msg),
                Ok(ActorMessage::Stop) | Err(_) => break,
            }
        }
        actor.on_stop();
    });

    ActorHandle { sender, thread: Some(handle) }
}

/// Spawn multiple identical actors and return a round-robin dispatcher.
pub fn spawn_pool<A, F>(count: usize, factory: F) -> ActorPool<A::Message>
where
    A: Actor,
    F: Fn(usize) -> A,
{
    let handles: Vec<ActorHandle<A::Message>> =
        (0..count).map(|i| spawn_actor(factory(i))).collect();

    ActorPool { handles, next: Arc::new(Mutex::new(0)) }
}

/// A pool of actors with round-robin dispatch.
pub struct ActorPool<M: Send + 'static> {
    handles: Vec<ActorHandle<M>>,
    next: Arc<Mutex<usize>>,
}

impl<M: Send + Clone + 'static> ActorPool<M> {
    /// Send a message to the next actor in round-robin order.
    pub fn send(&self, msg: M) -> Result<(), ActorError> {
        if self.handles.is_empty() {
            return Err(ActorError::Disconnected);
        }
        let idx = {
            let mut n = self.next.lock().unwrap();
            let i = *n;
            *n = (i + 1) % self.handles.len();
            i
        };
        self.handles[idx].send(msg)
    }

    /// Broadcast a message to all actors in the pool.
    pub fn broadcast(&self, msg: M) -> Vec<Result<(), ActorError>> {
        self.handles.iter().map(|h| h.send(msg.clone())).collect()
    }

    /// Number of actors in the pool.
    pub fn len(&self) -> usize {
        self.handles.len()
    }

    pub fn is_empty(&self) -> bool {
        self.handles.is_empty()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    struct CounterActor {
        count: Arc<Mutex<u32>>,
    }

    impl Actor for CounterActor {
        type Message = u32;
        fn handle(&mut self, msg: u32) {
            let mut c = self.count.lock().unwrap();
            *c += msg;
        }
    }

    #[test]
    fn test_actor_spawn_and_send() {
        let count = Arc::new(Mutex::new(0u32));
        let actor = CounterActor { count: Arc::clone(&count) };
        let handle = spawn_actor(actor);

        handle.send(5).unwrap();
        handle.send(10).unwrap();
        handle.send(3).unwrap();
        handle.stop().unwrap();

        assert_eq!(*count.lock().unwrap(), 18);
    }

    #[test]
    fn test_actor_on_start_on_stop() {
        struct LifecycleActor {
            started: Arc<Mutex<bool>>,
            stopped: Arc<Mutex<bool>>,
        }
        impl Actor for LifecycleActor {
            type Message = ();
            fn handle(&mut self, _: ()) {}
            fn on_start(&mut self) {
                *self.started.lock().unwrap() = true;
            }
            fn on_stop(&mut self) {
                *self.stopped.lock().unwrap() = true;
            }
        }

        let started = Arc::new(Mutex::new(false));
        let stopped = Arc::new(Mutex::new(false));
        let a = LifecycleActor { started: Arc::clone(&started), stopped: Arc::clone(&stopped) };
        let h = spawn_actor(a);
        h.stop().unwrap();

        assert!(*started.lock().unwrap());
        assert!(*stopped.lock().unwrap());
    }
}
