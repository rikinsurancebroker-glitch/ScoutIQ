require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  const uploads = await p.upload.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { _count: { select: { businesses: true } } },
  })
  console.log('--- Uploads ---')
  uploads.forEach((u) =>
    console.log(`${u.fileName} | status=${u.status} | businesses=${u._count.businesses} | rows=${u.processedRows}/${u.totalRows}`)
  )

  const totalBiz = await p.business.count()
  const scored = await p.presenceScore.count()
  const below50 = await p.presenceScore.count({ where: { total: { lt: 50 } } })
  const skipped = await p.business.count({ where: { crmStatus: 'SKIPPED' } })
  const sites = await p.generatedWebsite.count()
  const siteLive = await p.generatedWebsite.count({ where: { status: 'LIVE' } })

  console.log('\n--- Pipeline ---')
  console.log(`Businesses: ${totalBiz}`)
  console.log(`Scored: ${scored}`)
  console.log(`Score < 50 (should get sites): ${below50}`)
  console.log(`CRM SKIPPED (score >= 50): ${skipped}`)
  console.log(`GeneratedWebsite records: ${sites} (${siteLive} LIVE)`)

  const sample = await p.business.findFirst({
    where: { presenceScore: { total: { lt: 50 } } },
    include: { presenceScore: true, websiteGen: true },
  })
  if (sample) {
    console.log('\n--- Sample low-score business ---')
    console.log(`Name: ${sample.name} | score: ${sample.presenceScore?.total}`)
    console.log(`Website: ${sample.websiteGen ? sample.websiteGen.siteUrl : 'NONE'}`)
  } else {
    console.log('\nNo business with score < 50 found')
  }

  const failedJobs = await p.jobLog.findMany({
    where: { status: 'failed' },
    orderBy: { startedAt: 'desc' },
    take: 3,
  })
  if (failedJobs.length) {
    console.log('\n--- Failed job logs ---')
    failedJobs.forEach((j) => console.log(`${j.jobType}: ${j.errorMsg?.slice(0, 120)}`))
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => p.$disconnect())
