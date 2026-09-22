import type { pbkdf2 as nativePbkdf2 } from 'node:crypto'
import { Buffer } from 'node:buffer'

// Workers caps native PBKDF2 at 100,000 iterations; Payload 3.90 uses
// 600,000. Preserve Payload's exact algorithm, salt encoding and hash format.
// Installed only by the Worker entrypoint; Node maintenance keeps native crypto.
export function createWorkersPbkdf2(native: typeof nativePbkdf2, module: WebAssembly.Module): typeof nativePbkdf2 {
 return (password, salt, iterations, keylen, digest, callback) => {
  if (iterations !== 600_000 || keylen !== 32 || digest !== 'sha256' || typeof password !== 'string' || typeof salt !== 'string') {
   return native(password, salt, iterations, keylen, digest, callback)
  }
  void Promise.resolve().then(() => derivePayloadKey(module, password, salt)).then(
   hash => callback(null, Buffer.from(hash)),
   error => callback(error, Buffer.alloc(0)),
  )
 }
}

type KDFExports = {
 memory: WebAssembly.Memory
 allocate: (length: number) => number
 release: (pointer: number, length: number) => void
 derive: (password: number, passwordLength: number, salt: number, saltLength: number, output: number) => void
}

function derivePayloadKey(module: WebAssembly.Module, password: string, salt: string): Uint8Array {
 // Fresh memory per call avoids sharing password material between requests.
 const wasm = new WebAssembly.Instance(module).exports as unknown as KDFExports
 const passwordBytes = new TextEncoder().encode(password)
 const saltBytes = new TextEncoder().encode(salt)
 const allocations: [number, number][] = []
 const allocate = (length: number) => {
  const pointer = wasm.allocate(length)
  allocations.push([pointer, length])
  return pointer
 }
 try {
  const passwordPointer = allocate(passwordBytes.length)
  const saltPointer = allocate(saltBytes.length)
  const outputPointer = allocate(32)
  const memory = new Uint8Array(wasm.memory.buffer)
  memory.set(passwordBytes, passwordPointer)
  memory.set(saltBytes, saltPointer)
  wasm.derive(passwordPointer, passwordBytes.length, saltPointer, saltBytes.length, outputPointer)
  return new Uint8Array(wasm.memory.buffer, outputPointer, 32).slice()
 } finally {
  passwordBytes.fill(0)
  saltBytes.fill(0)
  for (const [pointer, length] of allocations) wasm.release(pointer, length)
 }
}
