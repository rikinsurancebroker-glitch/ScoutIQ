require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

async function test(label, url) {
  const p = new PrismaClient({ datasources: { db: { url } } })
  try {
    await p.$queryRaw`SELECT 1`
    console.log(`${label}: OK`)
    return true
  } catch (e) {
    console.log(`${label}: FAIL - ${e.message.split('\n').find((l) => l.includes("Can't") || l.includes('P1001')) || e.message.split('\n')[0]}`)
    return false
  } finally {
    await p.$disconnect()
  }
}

async function main() {
  await test('DATABASE_URL (pooler 6543)', process.env.DATABASE_URL)
  await test('DIRECT_URL', process.env.DIRECT_URL)

  const sessionPooler = process.env.DATABASE_URL?.replace(':6543', ':5432').replace('?pgbouncer=true', '')
  if (sessionPooler) {
    await test('Session pooler (5432)', sessionPooler)
  }
}

main()
