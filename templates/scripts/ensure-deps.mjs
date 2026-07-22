/**
 * Ensures site-shared + the current template app have node_modules before `next dev`.
 * Prevents the globally installed Next 15 CLI from booting against local Next 14 deps.
 */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const appRoot = process.cwd()
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const siteShared = path.join(scriptDir, '..', 'site-shared')

function npmInstall(cwd) {
  console.log(`[setup] npm install in ${path.relative(appRoot, cwd) || '.'}`)
  execSync('npm install', { cwd, stdio: 'inherit' })
}

npmInstall(siteShared)

if (!fs.existsSync(path.join(appRoot, 'node_modules', 'next', 'package.json'))) {
  npmInstall(appRoot)
}
