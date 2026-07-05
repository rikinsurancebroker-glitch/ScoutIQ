require('dotenv').config()
const { Client } = require('pg')

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    const res = await client.query('select name, dead_letter from pgboss.queue')
    console.log(res.rows)
  } catch (err) {
    console.log('Query failed (schema may not exist yet):', err.message)
  }
  await client.end()
}

main()
