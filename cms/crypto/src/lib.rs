//! Small ABI around RustCrypto PBKDF2. No custom cryptographic algorithm.
//! Every call gets a fresh WASM instance; the JS wrapper clears its input/output buffers.
use pbkdf2::pbkdf2_hmac;
use sha2::Sha256;

#[no_mangle]
pub extern "C" fn allocate(len: usize) -> *mut u8 {
    Box::into_raw(vec![0u8; len].into_boxed_slice()) as *mut u8
}

/// Pointers and lengths must refer to live allocations in this instance.
#[no_mangle]
pub unsafe extern "C" fn derive(password: *const u8, password_len: usize, salt: *const u8, salt_len: usize, output: *mut u8) {
    pbkdf2_hmac::<Sha256>(
        std::slice::from_raw_parts(password, password_len),
        std::slice::from_raw_parts(salt, salt_len),
        600_000,
        std::slice::from_raw_parts_mut(output, 32),
    );
}

/// The pointer and length must match a live allocation returned by allocate.
#[no_mangle]
pub unsafe extern "C" fn release(ptr: *mut u8, len: usize) {
    let data = std::slice::from_raw_parts_mut(ptr, len);
    for byte in data.iter_mut() {
        std::ptr::write_volatile(byte, 0);
    }
    drop(Box::from_raw(data));
}
