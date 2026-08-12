fn main() {
    // Minimal build script — just tell cargo to rerun if build.rs changes
    println!("cargo:rerun-if-changed=build.rs");
}
