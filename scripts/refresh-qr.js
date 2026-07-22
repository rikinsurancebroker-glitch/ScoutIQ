require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const QRCode = require('qrcode')

// Re-bakes every stored QR PNG with the CURRENT API_URL. Older PNGs were baked
// with http://localhost:4000 and keep sending scanners to localhost. This talks
// straight to Supabase storage (no API/auth/pg-boss), so it works even when the
// local dev stack is flaky. Run: node scripts/refresh-qr.js
async function main() {
  const apiUrl = process.env.API_URL
  if (!apiUrl || /localhost|127\.0\.0\.1/.test(apiUrl)) {
    throw new Error(`API_URL must be the public host, got: ${apiUrl}`)
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  const bucket = supabase.storage.from('generated-sites')

  console.log(`Re-baking QRs with API_URL=${apiUrl}\n`)

  let offset = 0
  const pageSize = 100
  let refreshed = 0
  const failures = []

  for (;;) {
    const { data: folders, error } = await bucket.list('qr', { limit: pageSize, offset })
    if (error) throw new Error(`list failed: ${error.message}`)
    if (!folders || folders.length === 0) break

    for (const folder of folders) {
      const businessId = folder.name
      const trackingUrl = `${apiUrl}/s/${businessId}`
      try {
        const qrBuffer = await QRCode.toBuffer(trackingUrl, { type: 'png', width: 300, margin: 2 })
        const { error: upErr } = await bucket.upload(`qr/${businessId}/qr.png`, qrBuffer, {
          contentType: 'image/png',
          upsert: true,
        })
        if (upErr) throw new Error(upErr.message)
        refreshed++
      } catch (err) {
        failures.push({ businessId, error: err.message })
      }
    }

    offset += folders.length
    if (folders.length < pageSize) break
  }

  console.log(`Done. Refreshed ${refreshed} QR(s).`)
  if (failures.length) {
    console.log(`${failures.length} failed:`)
    failures.forEach((f) => console.log(`  ${f.businessId}: ${f.error}`))
  }
}

main().catch((err) => {
  console.error('refresh-qr failed:', err.message)
  process.exit(1)
})
