/**
 * Patches all template apps: local Next binary, ensure-deps predev, /preview route.
 * Run: node templates/scripts/fix-template-dev.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appsDir = path.join(__dirname, '..', 'apps')

const APPS = [
  { folder: 'scoutiq-restaurant-01', themeImport: 'restaurant01', port: 3011, custom: 'restaurant' },
  { folder: 'scoutiq-restaurant-02', themeImport: 'restaurant02', port: 3012 },
  { folder: 'scoutiq-clinic-01', themeImport: 'clinic01', port: 3013 },
  { folder: 'scoutiq-salon-01', themeImport: 'salon01', port: 3014 },
  { folder: 'scoutiq-gym-01', themeImport: 'gym01', port: 3015, custom: 'gym' },
  { folder: 'scoutiq-retail-01', themeImport: 'retail01', port: 3016 },
  { folder: 'scoutiq-law-01', themeImport: 'law01', port: 3017 },
  { folder: 'scoutiq-cafe-01', themeImport: 'cafe01', port: 3018 },
  { folder: 'scoutiq-education-01', themeImport: 'education01', port: 3019 },
  { folder: 'scoutiq-default-01', themeImport: 'default01', port: 3020 },
]

for (const app of APPS) {
  const root = path.join(appsDir, app.folder)
  const pkgPath = path.join(root, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

  pkg.scripts = {
    predev: 'node ../../scripts/ensure-deps.mjs',
    dev: `node ./node_modules/next/dist/bin/next dev -p ${app.port}`,
    build: `npm install --prefix ../../site-shared && node ./node_modules/next/dist/bin/next build`,
    start: `node ./node_modules/next/dist/bin/next start -p ${app.port}`,
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  // Root → design preview (no business ID needed)
  if (app.custom === 'gym' || app.custom === 'restaurant') {
    fs.writeFileSync(
      path.join(root, 'src/app/page.tsx'),
      `import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/preview')
}
`
    )
  } else {
    fs.writeFileSync(
      path.join(root, 'src/app/page.tsx'),
      `import { PreviewSitePage } from '@scoutiq/site-shared'
import { ${app.themeImport} } from '@scoutiq/site-shared/themes'

export default function HomePage() {
  return <PreviewSitePage theme={${app.themeImport}} />
}
`
    )

    fs.mkdirSync(path.join(root, 'src/app/preview'), { recursive: true })
    fs.writeFileSync(
      path.join(root, 'src/app/preview/page.tsx'),
      `import { PreviewSitePage } from '@scoutiq/site-shared'
import { ${app.themeImport} } from '@scoutiq/site-shared/themes'

export default function PreviewPage() {
  return <PreviewSitePage theme={${app.themeImport}} />
}
`
    )
  }

  for (const artifact of ['pnpm-lock.yaml']) {
    const p = path.join(root, artifact)
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true })
      console.log(`Removed ${app.folder}/${artifact}`)
    }
  }

  console.log(`Patched ${app.folder}`)
}

console.log('Done. Open http://localhost:<port>/ — no business ID required.')
