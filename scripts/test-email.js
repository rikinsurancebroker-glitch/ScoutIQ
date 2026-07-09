require('dotenv').config()
const nodemailer = require('nodemailer')
const readline = require('readline')

// Send a custom test email. Two ways to use it:
//
//   Interactive (it asks you for To / Subject / Body):
//     npm run test:email
//
//   Flags (non-interactive):
//     node scripts/test-email.js --to a@b.com --subject "Hi" --body "Hello there"
//     add --html to treat the body as raw HTML
//
// To defaults to SMTP_USER (sends to yourself) if left blank.

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--html') args.html = true
    else if (a.startsWith('--')) {
      args[a.slice(2)] = argv[i + 1]
      i++
    }
  }
  return args
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer)))
}

async function askMultiline(rl, prompt) {
  console.log(prompt)
  const lines = []
  for (;;) {
    const line = await ask(rl, '')
    if (line === '.') break
    lines.push(line)
  }
  return lines.join('\n')
}

async function main() {
  const { EMAIL_ENABLED, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

  if (EMAIL_ENABLED !== 'true') {
    console.error('EMAIL_ENABLED is not "true" — set it in .env before testing.')
    process.exit(1)
  }

  const missing = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'].filter((k) => !process.env[k])
  if (missing.length) {
    console.error(`Missing SMTP config: ${missing.join(', ')}`)
    process.exit(1)
  }
  if (SMTP_PASS === 'REPLACE_WITH_MAILBOX_PASSWORD') {
    console.error('SMTP_PASS is still the placeholder — paste the real mailbox password in .env.')
    process.exit(1)
  }

  const args = parseArgs(process.argv.slice(2))
  let { to, subject, body, html } = args

  // Interactive fallback for anything not supplied via flags.
  if (!to || !subject || !body) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    if (!to) to = (await ask(rl, `To (blank = send to yourself, ${SMTP_USER}): `)).trim()
    if (!subject) subject = (await ask(rl, 'Subject: ')).trim()
    if (!body) body = await askMultiline(rl, 'Body (finish with a single "." on its own line):')
    rl.close()
  }

  to = to || SMTP_USER
  subject = subject || '(no subject)'
  const from = SMTP_FROM || SMTP_USER

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  process.stdout.write('\nVerifying SMTP connection... ')
  await transporter.verify()
  console.log('OK')

  console.log(`Sending from ${from} to ${to}...`)
  const mail = { from, to, subject }
  if (html) mail.html = body
  else mail.text = body
  const info = await transporter.sendMail(mail)

  console.log(`Sent. Message ID: ${info.messageId}`)
  if (info.accepted?.length) console.log(`Accepted: ${info.accepted.join(', ')}`)
  if (info.rejected?.length) console.log(`Rejected: ${info.rejected.join(', ')}`)
}

main().catch((err) => {
  console.error('\nEmail test FAILED:')
  console.error(`  ${err.message}`)
  if (err.code) console.error(`  code: ${err.code}`)
  if (err.response) console.error(`  server said: ${err.response}`)
  process.exit(1)
})
