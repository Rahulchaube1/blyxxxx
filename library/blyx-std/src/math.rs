pub fn clamp<T: PartialOrd>(v: T, min: T, max: T) -> T {
    if v < min { min } else if v > max { max } else { v }
}

pub fn lerp(a: f64, b: f64, t: f64) -> f64 {
    a + (b - a) * t
}

pub fn log2_ceil(n: u64) -> u32 {
    if n <= 1 { 0 } else { 64 - (n - 1).leading_zeros() }
}

pub fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        let t = b;
        b = a % b;
        a = t;
    }
    a
}

pub fn lcm(a: u64, b: u64) -> u64 {
    if a == 0 || b == 0 { 0 } else { (a / gcd(a, b)) * b }
}

pub fn is_prime(n: u64) -> bool {
    if n <= 1 { return false; }
    if n <= 3 { return true; }
    if n % 2 == 0 || n % 3 == 0 { return false; }
    let mut i = 5;
    while i * i <= n {
        if n % i == 0 || n % (i + 2) == 0 { return false; }
        i += 6;
    }
    true
}

pub const PI: f64 = std::f64::consts::PI;
pub const E: f64 = std::f64::consts::E;
