/**
 * Bundle size checker — run after `vite build`.
 * Reads dist/ and reports gzip-estimated sizes.
 * Thresholds: warn > 150 KB, fail > 200 KB (gzipped total JS).
 */
import { readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'
import { createWriteStream } from 'fs'
import { tmpdir } from 'os'

const WARN_KB = 150
const FAIL_KB = 200
const DIST_JS = new URL('../dist/assets', import.meta.url).pathname

async function gzipSize(filePath) {
  const content = readFileSync(filePath)
  const tmp = join(tmpdir(), `size-check-${Date.now()}.gz`)
  await pipeline(Readable.from(content), createGzip(), createWriteStream(tmp))
  const size = statSync(tmp).size
  return size
}

let files
try {
  files = readdirSync(DIST_JS).filter(f => f.endsWith('.js'))
} catch {
  console.error('dist/assets not found — run `npm run build` first.')
  process.exit(1)
}

let totalGzip = 0
const rows = []

for (const file of files) {
  const gz = await gzipSize(join(DIST_JS, file))
  totalGzip += gz
  rows.push({ file, kb: (gz / 1024).toFixed(1) })
}

const totalKb = totalGzip / 1024

console.log('\nBundle size report (gzip estimates)')
console.log('─'.repeat(50))
for (const { file, kb } of rows.sort((a, b) => b.kb - a.kb)) {
  console.log(`  ${kb.padStart(7)} KB  ${file}`)
}
console.log('─'.repeat(50))
console.log(`  ${totalKb.toFixed(1).padStart(7)} KB  TOTAL JS (gzipped)\n`)

if (totalKb > FAIL_KB) {
  console.error(
    `FAIL  Total JS ${totalKb.toFixed(1)} KB exceeds ${FAIL_KB} KB limit. Investigate code splitting or dep removal.`
  )
  process.exit(1)
} else if (totalKb > WARN_KB) {
  console.warn(`WARN  Total JS ${totalKb.toFixed(1)} KB exceeds ${WARN_KB} KB target. Consider splitting.`)
} else {
  console.log(`PASS  Total JS ${totalKb.toFixed(1)} KB is within the ${WARN_KB} KB target.`)
}
