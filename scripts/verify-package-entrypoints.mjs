import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pkg from '../package.json' with { type: 'json' }

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const targets = []

for (const field of ['main', 'module', 'types', 'typings']) {
  if (typeof pkg[field] === 'string') {
    targets.push([field, pkg[field]])
  }
}

const packed = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json', '.'], {
    cwd: root,
    encoding: 'utf8',
  }),
)[0]
const packedFiles = new Set(packed.files.map((file) => file.path))
const missing = []

for (const [label, target] of targets) {
  const relative = target.replace(/^\.\//, '')
  const candidates = [
    relative,
    join(relative, 'index.js'),
    join(relative, 'index.d.ts'),
  ]

  if (!candidates.some((candidate) => existsSync(join(root, candidate)))) {
    missing.push(`${label}: ${target} is missing from the build output`)
    continue
  }

  if (!candidates.some((candidate) => packedFiles.has(candidate))) {
    missing.push(`${label}: ${target} is not included by npm pack`)
  }
}

if (missing.length > 0) {
  throw new Error(`Package entrypoint verification failed:\n${missing.join('\n')}`)
}

console.log(`Verified ${targets.length} package entrypoint targets.`)
