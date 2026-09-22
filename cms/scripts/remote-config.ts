import {readFile,writeFile} from 'node:fs/promises'
const config=JSON.parse(await readFile('wrangler.jsonc','utf8'))
for(const binding of config.d1_databases) binding.remote=true
// Remote maintenance only needs the database; never send email from a seed or migration.
delete config.send_email
await writeFile('.remote.wrangler.json',JSON.stringify(config,null,2))
console.log('Prepared remote database configuration.')
