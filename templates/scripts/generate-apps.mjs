/**
 * Generates all 10 ScoutIQ template Next.js apps.
 * Run: node templates/scripts/generate-apps.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appsDir = path.join(__dirname, '..', 'apps')

const APPS = [
  {
    folder: 'scoutiq-restaurant-01',
    themeImport: 'restaurant01',
    themeId: 'restaurant-01',
    port: 3011,
    fonts: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;600;700&family=Playfair+Display:wght@600;700&display=swap',
  },
  {
    folder: 'scoutiq-restaurant-02',
    themeImport: 'restaurant02',
    themeId: 'restaurant-02',
    port: 3012,
    fonts: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lato:wght@400;700&display=swap',
  },
  {
    folder: 'scoutiq-clinic-01',
    themeImport: 'clinic01',
    themeId: 'clinic-01',
    port: 3013,
    fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap',
  },
  {
    folder: 'scoutiq-salon-01',
    themeImport: 'salon01',
    themeId: 'salon-01',
    port: 3014,
    fonts: 'https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap',
  },
  {
    folder: 'scoutiq-gym-01',
    themeImport: 'gym01',
    themeId: 'gym-01',
    port: 3015,
    fonts: 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Roboto:wght@400;500;700&display=swap',
  },
  {
    folder: 'scoutiq-retail-01',
    themeImport: 'retail01',
    themeId: 'retail-01',
    port: 3016,
    fonts: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Poppins:wght@600;700&display=swap',
  },
  {
    folder: 'scoutiq-law-01',
    themeImport: 'law01',
    themeId: 'law-01',
    port: 3017,
    fonts: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;600&display=swap',
  },
  {
    folder: 'scoutiq-cafe-01',
    themeImport: 'cafe01',
    themeId: 'cafe-01',
    port: 3018,
    fonts: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Karla:wght@400;500;600&display=swap',
  },
  {
    folder: 'scoutiq-education-01',
    themeImport: 'education01',
    themeId: 'education-01',
    port: 3019,
    fonts: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Work+Sans:wght@400;500;600&display=swap',
  },
  {
    folder: 'scoutiq-default-01',
    themeImport: 'default01',
    themeId: 'default-01',
    port: 3020,
    fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
]

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

for (const app of APPS) {
  const root = path.join(appsDir, app.folder)

  write(
    path.join(root, 'package.json'),
    JSON.stringify(
      {
        name: app.folder,
        version: '1.0.0',
        private: true,
        scripts: {
          predev: 'node ../../scripts/ensure-deps.mjs',
          dev: `node ./node_modules/next/dist/bin/next dev -p ${app.port}`,
          build: `npm install --prefix ../../site-shared && node ./node_modules/next/dist/bin/next build`,
          start: `node ./node_modules/next/dist/bin/next start -p ${app.port}`,
        },
        dependencies: {
          '@scoutiq/site-shared': 'file:../../site-shared',
          next: '^14.2.18',
          react: '^18.3.1',
          'react-dom': '^18.3.1',
        },
        devDependencies: {
          '@types/node': '^22.8.6',
          '@types/react': '^18.3.12',
          autoprefixer: '^10.4.20',
          postcss: '^8.4.47',
          tailwindcss: '^3.4.14',
          typescript: '^5.6.3',
        },
      },
      null,
      2
    )
  )

  write(
    path.join(root, 'next.config.mjs'),
    `/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@scoutiq/site-shared'],
}

export default nextConfig
`
  )

  write(
    path.join(root, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2017',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: { '@/*': ['./src/*'] },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      },
      null,
      2
    )
  )

  write(
    path.join(root, 'tailwind.config.ts'),
    `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../site-shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
export default config
`
  )

  write(
    path.join(root, 'postcss.config.js'),
    `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
`
  )

  write(
    path.join(root, '.env.example'),
    `NEXT_PUBLIC_API_URL=http://localhost:4000
`
  )

  write(
    path.join(root, 'src/app/globals.css'),
    `@tailwind base;
@tailwind components;
@tailwind utilities;

html { scroll-behavior: smooth; }
`
  )

  write(
    path.join(root, 'src/app/layout.tsx'),
    `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScoutIQ Preview — ${app.themeId}',
  description: 'Business website preview',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="${app.fonts}" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
`
  )

  write(
    path.join(root, 'src/app/page.tsx'),
    `export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
      <div className="max-w-md text-center">
        <p className="text-indigo-400 text-xs font-semibold uppercase tracking-[0.3em] mb-4">
          ScoutIQ Preview
        </p>
        <h1 className="text-3xl font-bold text-white mb-4">${app.themeId} template</h1>
        <p className="text-slate-400 mb-4 leading-relaxed">
          Open a preview at <code className="text-indigo-200">/{'{businessId}'}</code> using an ID from your dashboard.
        </p>
        <p className="text-slate-500 text-sm">
          Example: <code className="text-slate-300">http://localhost:${app.port}/your-business-id</code>
        </p>
      </div>
    </div>
  )
}
`
  )

  write(
    path.join(root, 'src/app/[businessId]/page.tsx'),
    `import { SitePage } from '@scoutiq/site-shared'
import { ${app.themeImport} } from '@scoutiq/site-shared/themes'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: { businessId: string }
}

export default function Page({ params }: Props) {
  return <SitePage businessId={params.businessId} theme={${app.themeImport}} />
}
`
  )

  write(
    path.join(root, 'src/app/api/site-content/[businessId]/route.ts'),
    `import { PRODUCTION_API_URL } from '@scoutiq/site-shared'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { businessId: string } }
): Promise<Response> {
  const res = await fetch(\`\${PRODUCTION_API_URL}/sites/\${params.businessId}/content\`, {
    cache: 'no-store',
  })
  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}
`
  )
}

console.log(`Generated ${APPS.length} template apps in templates/apps/`)
