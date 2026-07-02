/**
 * Updates existing GeneratedWebsite rows to use Vercel production template URLs.
 * Run when dashboard links still point at localhost after deploying templates.
 *
 * Usage: node scripts/fix-production-template-urls.js
 */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const PRODUCTION_URLS = {
  'restaurant-01': 'https://scoutiq-restaurant-01.vercel.app',
  'restaurant-02': 'https://scoutiq-restaurant-02.vercel.app',
  'clinic-01': 'https://scoutiq-clinic-01.vercel.app',
  'salon-01': 'https://scoutiq-salon-01.vercel.app',
  'gym-01': 'https://scoutiq-gym-01.vercel.app',
  'retail-01': 'https://scoutiq-retail-01.vercel.app',
  'law-01': 'https://scoutiq-law-01.vercel.app',
  'cafe-01': 'https://scoutiq-cafe-01.vercel.app',
  'education-01': 'https://scoutiq-education-01.vercel.app',
  'default-01': 'https://scoutiq-default-01.vercel.app',
}

function productionUrl(templateId) {
  return PRODUCTION_URLS[templateId] ?? PRODUCTION_URLS['default-01']
}

async function main() {
  const prisma = new PrismaClient()
  const sites = await prisma.generatedWebsite.findMany({
    select: { id: true, businessId: true, templateId: true, siteUrl: true, templateUrl: true },
  })

  let updated = 0
  for (const site of sites) {
    const base = productionUrl(site.templateId)
    const newSiteUrl = `${base}/${site.businessId}`
    if (site.siteUrl === newSiteUrl && site.templateUrl === base) continue

    await prisma.generatedWebsite.update({
      where: { id: site.id },
      data: { siteUrl: newSiteUrl, templateUrl: base },
    })
    updated++
    console.log(`Updated ${site.businessId} → ${newSiteUrl}`)
  }

  console.log(`\nDone. ${updated}/${sites.length} sites pointed at Vercel templates.`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
