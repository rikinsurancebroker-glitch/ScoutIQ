require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

async function test(label, url) {
  const p = new PrismaClient({ datasources: { db: { url } } })
  try {
    await p.$queryRaw`SELECT 1`
    console.log(`${label}: OK`)
    return true
  } catch (e) {
    const line = e.message.split('\n').find((l) => l.includes("Can't") || l.includes('P1001')) || e.message.split('\n')[0]
    console.log(`${label}: FAIL - ${line}`)
    return false
  } finally {
    await p.$disconnect()
  }
}

async function main() {
  const okDb = await test('DATABASE_URL', process.env.DATABASE_URL)
  let okDirect = true
  if (process.env.DIRECT_URL && process.env.DIRECT_URL !== process.env.DATABASE_URL) {
    okDirect = await test('DIRECT_URL', process.env.DIRECT_URL)
  }
  if (!okDb || !okDirect) {
    console.log('\nTip: if pooler hosts fail but Supabase REST works, switch to the direct')
    console.log('db.<project-ref>.supabase.co URL (username postgres, add ?sslmode=require).')
    process.exit(1)
  }
}

main()
