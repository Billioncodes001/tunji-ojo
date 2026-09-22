import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
const root = path.resolve('..')
const html = await readFile(path.join(root, 'dist/index.html'), 'utf8')
const styles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(m => m[0]).join('')
const scripts = [...html.matchAll(/<script[^>]+src="[^"]+"[^>]*><\/script>/g)].map(m => m[0]).join('')
await mkdir('src/generated', { recursive: true })
await writeFile('src/generated/assets.ts', `export const styles = ${JSON.stringify(styles)};\nexport const scripts = ${JSON.stringify(scripts)};\n`)
await rm('public', { recursive: true, force: true })
await mkdir('public', { recursive: true })
for (const directory of ['assets', 'images', 'media']) {
 try { await cp(path.join(root, 'dist', directory), path.join('public', directory), { recursive: true, filter: source => !source.endsWith('.html') }) } catch (e: any) { if (e.code !== 'ENOENT') throw e }
}
for (const file of ['favicon.svg','favicon.ico','apple-touch-icon.png']) {
 try { await cp(path.join(root, 'dist', file), path.join('public', file)) } catch (e: any) { if (e.code !== 'ENOENT') throw e }
}
await writeFile('public/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0b0c0b"/><text x="32" y="41" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="28" fill="#b8c6ac">TO</text></svg>')
console.log('Prepared public assets and server HTML shell.')
