# Payload password hashing on Cloudflare Workers

Workers native PBKDF2 rejects iteration counts above 100,000. Payload 3.90 uses
PBKDF2-HMAC-SHA256 with 600,000 iterations and a 32-byte output. This module uses
RustCrypto's existing implementation without changing any algorithm parameters.
A JavaScript fallback produced correct hashes but took about 16 CPU seconds per
hash on the deployed Worker. Compiled WASM avoids that interpreter overhead. In the final live check, reset
took 2.50 seconds wall time (1.22 CPU seconds) and login 1.43 seconds wall time
(0.49 CPU seconds).

`src/lib.rs` is only an allocation / derivation / zeroization ABI. Each invocation
gets a separate instance, and the JavaScript wrapper releases and clears buffers.
Only the exact current Payload parameter combination is intercepted; native
crypto remains in use for everything else, including legacy hashes.

Built with Rust 1.88.0. Rebuild the committed binary from the locked sources:

```sh
rustup target add wasm32-unknown-unknown
cargo build --locked --manifest-path crypto/Cargo.toml --target wasm32-unknown-unknown --release
cp crypto/target/wasm32-unknown-unknown/release/newsroom_password_kdf.wasm crypto/payload-pbkdf2.wasm
node --import tsx --test tests/workers-crypto.test.ts
```

The Worker statically imports the module; it does not compile untrusted WASM at
runtime. CI checks outputs against Node crypto (ordinary, Unicode, long passwords,
and the unchanged native legacy path). Keep Cargo.lock and the binary together.

Dependencies: [RustCrypto PBKDF2](https://github.com/RustCrypto/password-hashes/tree/pbkdf2-v0.12.2/pbkdf2)
and [RustCrypto SHA-2](https://github.com/RustCrypto/hashes/tree/sha2-v0.10.9/sha2),
licensed MIT OR Apache-2.0. See Cargo.lock for their transitive dependencies.
