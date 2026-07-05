/**
 * Category-aware HTML email templates.
 * Each returns a full HTML email with inline styles.
 * `content` is injected by OpenAI (subject + body paragraphs + cta text).
 */

export interface EmailContent {
  subject: string
  bodyHtml: string
  ctaText: string
}

interface TemplateOptions {
  businessName: string
  siteUrl: string
  content: EmailContent
  qrEmbedded?: boolean
}

type CategoryKey =
  | 'restaurant'
  | 'cafe'
  | 'clinic'
  | 'salon'
  | 'gym'
  | 'retail'
  | 'law'
  | 'education'
  | 'default'

const CATEGORY_CONFIG: Record<
  CategoryKey,
  { accent: string; headerBg: string; emoji: string; tagline: string }
> = {
  restaurant: {
    accent: '#E85D26',
    headerBg: '#1a0a00',
    emoji: '🍽️',
    tagline: 'More diners. More reservations. Online.',
  },
  cafe: {
    accent: '#6B4226',
    headerBg: '#1a1008',
    emoji: '☕',
    tagline: 'Brew more business online.',
  },
  clinic: {
    accent: '#0A84FF',
    headerBg: '#001a2c',
    emoji: '🏥',
    tagline: 'Grow your practice with a professional online presence.',
  },
  salon: {
    accent: '#C4449E',
    headerBg: '#1a0014',
    emoji: '✂️',
    tagline: 'Look as great online as you do in the chair.',
  },
  gym: {
    accent: '#FF3A2D',
    headerBg: '#1a0500',
    emoji: '💪',
    tagline: 'Build your online presence as strong as your members.',
  },
  retail: {
    accent: '#00875A',
    headerBg: '#001a0d',
    emoji: '🛍️',
    tagline: 'Bring your store online and reach more shoppers.',
  },
  law: {
    accent: '#1C3D5A',
    headerBg: '#0a1520',
    emoji: '⚖️',
    tagline: 'A professional online presence clients can trust.',
  },
  education: {
    accent: '#6558F5',
    headerBg: '#0d0a1a',
    emoji: '🎓',
    tagline: 'Reach more students with a modern online presence.',
  },
  default: {
    accent: '#4F46E5',
    headerBg: '#0f0e1a',
    emoji: '🌐',
    tagline: 'Your business deserves a stronger online presence.',
  },
}

function resolveCategory(category: string | null | undefined): CategoryKey {
  if (!category) return 'default'
  const lower = category.toLowerCase()
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('dining'))
    return 'restaurant'
  if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('bakery')) return 'cafe'
  if (
    lower.includes('clinic') ||
    lower.includes('doctor') ||
    lower.includes('medical') ||
    lower.includes('dental') ||
    lower.includes('health')
  )
    return 'clinic'
  if (
    lower.includes('salon') ||
    lower.includes('hair') ||
    lower.includes('beauty') ||
    lower.includes('spa') ||
    lower.includes('nail')
  )
    return 'salon'
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('yoga')) return 'gym'
  if (
    lower.includes('retail') ||
    lower.includes('shop') ||
    lower.includes('store') ||
    lower.includes('boutique')
  )
    return 'retail'
  if (lower.includes('law') || lower.includes('legal') || lower.includes('attorney')) return 'law'
  if (
    lower.includes('school') ||
    lower.includes('education') ||
    lower.includes('tutor') ||
    lower.includes('academy')
  )
    return 'education'
  return 'default'
}

export function buildEmailHtml(
  category: string | null | undefined,
  opts: TemplateOptions
): string {
  const cat = resolveCategory(category)
  const cfg = CATEGORY_CONFIG[cat]
  const { businessName, siteUrl, content, qrEmbedded } = opts

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${content.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:${cfg.headerBg};padding:36px 40px 28px;">
              <p style="margin:0 0 12px 0;font-size:28px;">${cfg.emoji}</p>
              <h1 style="margin:0 0 8px 0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;">
                We built a free website preview for<br/><span style="color:${cfg.accent};">${businessName}</span>
              </h1>
              <p style="margin:0;color:#94a3b8;font-size:13px;">${cfg.tagline}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">
              ${content.bodyHtml}

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="border-radius:8px;background:${cfg.accent};">
                    <a href="${siteUrl}"
                       style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                      ${content.ctaText}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#64748b;font-size:13px;">
                Or copy this link into your browser:
              </p>
              <p style="margin:0 0 24px;font-size:12px;">
                <a href="${siteUrl}" style="color:${cfg.accent};word-break:break-all;">${siteUrl}</a>
              </p>

              ${
                qrEmbedded
                  ? `<!-- QR Code -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;text-align:center;width:100%;">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 10px;color:#64748b;font-size:13px;">📱 Scan to view your free preview</p>
                    <img src="cid:qr-code" alt="Scan to preview your site" width="180" height="180"
                         style="border:4px solid #f1f5f9;border-radius:8px;display:block;margin:0 auto;" />
                  </td>
                </tr>
              </table>`
                  : ''
              }

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                This preview is live for <strong>7 days</strong>. After that it expires — but you can claim it
                permanently at no cost by visiting the link above.<br/><br/>
                You received this email because your business was identified as having growth opportunities
                in local online search. If you'd prefer not to receive future emails, simply reply with "unsubscribe".
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:11px;text-align:center;">
                Sent by <strong style="color:#64748b;">ScoutIQ</strong> · contact@theheracubragroup.ca
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
