import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pbkdf2, pbkdf2Sync } from 'node:crypto'
import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'
import { createWorkersPbkdf2 } from '../src/lib/workers-crypto'

const module = await WebAssembly.compile(await readFile(new URL('../crypto/payload-pbkdf2.wasm', import.meta.url)))

test('Worker password hashing matches Node for Payload hashes, including Unicode', async () => {
 const unavailable: typeof pbkdf2 = () => { throw new Error('Workers native iteration limit') }
 const derive = promisify(createWorkersPbkdf2(unavailable, module))
 for (const password of ['a-long-test-password', 'Ọlá-🔐-long-test-password', 'long'.repeat(100)]) {
  const salt = '0123456789abcdef'.repeat(4)
  const expected = pbkdf2Sync(password, salt, 600_000, 32, 'sha256')
  assert.deepEqual(await derive(password, salt, 600_000, 32, 'sha256'), expected)
 }
})

test('Legacy hashes still use native PBKDF2 and retain compatibility', async () => {
 let calls = 0
 const native: typeof pbkdf2 = (...args) => { calls++; pbkdf2(...args) }
 const derive = promisify(createWorkersPbkdf2(native, module))
 assert.deepEqual(await derive('legacy-password', 'salt', 25_000, 512, 'sha256'), pbkdf2Sync('legacy-password', 'salt', 25_000, 512, 'sha256'))
 assert.equal(calls, 1)
})
