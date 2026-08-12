// Blyx GPU Kernel Dispatcher (blyx-std::gpu)
// Created by Rahul Chaube — https://blyx-lang.space
// Open Source — MIT + Apache 2.0
// Repository: https://github.com/Blyx-lang-space/blyx

pub fn dispatch_kernel(_kernel_name: &str, _grid: [u32; 3], _block: [u32; 3], _args: &[*const u8]) {}
pub fn gpu_sync() {}

