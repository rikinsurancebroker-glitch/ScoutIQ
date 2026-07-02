require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

async function main() {
  const p = new PrismaClient()
  const sites = await p.generatedWebsite.findMany({
    where: { templateId: { startsWith: 'restaurant' } },
    take: 5,
    include: { business: { select: { name: true, category: true } } },
  })
  if (!sites.length) {
    console.log('No restaurant template sites found in DB.')
    return
  }
  sites.forEach((s) => {
    console.log(`${s.business.name} (${s.business.category})`)
    console.log(`  template: ${s.templateId}`)
    console.log(`  preview:  ${s.siteUrl}`)
    console.log('')
  })
  await p.$disconnect()
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
