require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const { PNG } = require('pngjs')
const jsQR = require('jsqr')

// Downloads a few stored QR PNGs from Supabase and decodes the literal URL
// baked into each one, so we can see exactly what a scanner would open.
async function main() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  const { data: folders, error: listErr } = await supabase.storage
    .from('generated-sites')
    .list('qr', { limit: 5 })
  if (listErr) throw new Error(`list failed: ${listErr.message}`)
  if (!folders || folders.length === 0) {
    console.log('No QR folders found under qr/.')
    return
  }

  console.log(`Runtime API_URL (what NEW QRs use): ${process.env.API_URL}\n`)

  for (const folder of folders) {
    const path = `qr/${folder.name}/qr.png`
    const { data, error } = await supabase.storage.from('generated-sites').download(path)
    if (error) {
      console.log(`${path} -> download error: ${error.message}`)
      continue
    }
    const buffer = Buffer.from(await data.arrayBuffer())
    const png = PNG.sync.read(buffer)
    const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)
    console.log(`${path}`)
    console.log(`   -> ${decoded ? decoded.data : '(could not decode)'}\n`)
  }
}

main().catch((err) => {
  console.error('decode-qr failed:', err.message)
  process.exit(1)
})
