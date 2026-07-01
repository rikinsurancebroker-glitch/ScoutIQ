/**
 * Updates existing GeneratedWebsite rows to use localhost template URLs.
 * Run when USE_LOCAL_TEMPLATES=true but sites were generated with Vercel URLs.
 *
 * Usage: node scripts/fix-local-template-urls.js
 */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const LOCAL_PORTS = {
  'restaurant-01': 3011,
  'restaurant-02': 3012,
  'clinic-01': 3013,
  'salon-01': 3014,
  'gym-01': 3015,
  'retail-01': 3016,
  'law-01': 3017,
  'cafe-01': 3018,
  'education-01': 3019,
  'default-01': 3020,
}

function localUrl(templateId) {
  const port = LOCAL_PORTS[templateId] ?? 3020
  return `http://localhost:${port}`
}

async function main() {
  if (process.env.USE_LOCAL_TEMPLATES !== 'true') {
    console.log('Set USE_LOCAL_TEMPLATES=true in .env first, then re-run.')
    process.exit(1)
  }

  const prisma = new PrismaClient()
  const sites = await prisma.generatedWebsite.findMany({
    select: { id: true, businessId: true, templateId: true, siteUrl: true, templateUrl: true },
  })

  let updated = 0
  for (const site of sites) {
    const base = localUrl(site.templateId)
    const newSiteUrl = `${base}/${site.businessId}`
    if (site.siteUrl === newSiteUrl && site.templateUrl === base) continue

    await prisma.generatedWebsite.update({
      where: { id: site.id },
      data: { siteUrl: newSiteUrl, templateUrl: base },
    })
    updated++
    console.log(`Updated ${site.businessId} → ${newSiteUrl}`)
  }

  console.log(`\nDone. ${updated}/${sites.length} sites pointed at local templates.`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
