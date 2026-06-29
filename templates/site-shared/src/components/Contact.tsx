import type { SiteContent, SiteTheme } from '../types'
import { resolveColors, cardRadius } from '../utils'

export function Contact({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const radius = cardRadius(theme.cardStyle)
  const { contact, hours, social } = content

  const socialLinks = [
    { label: 'Instagram', url: social.instagram },
    { label: 'Facebook', url: social.facebook },
    { label: 'YouTube', url: social.youtube },
    { label: 'Twitter', url: social.twitter },
    { label: 'Yelp', url: social.yelp },
  ].filter((s) => s.url)

  return (
    <section id="contact" className="py-20 px-6" style={{ background: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ fontFamily: theme.fontHeading, color: colors.text }}
        >
          Get In Touch
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="p-8 space-y-6"
            style={{ background: colors.surface, borderRadius: radius, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            {contact.phone && (
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Phone</p>
                <a href={`tel:${contact.phone}`} className="text-lg font-medium" style={{ color: colors.primary }}>
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.email && (
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Email</p>
                <a href={`mailto:${contact.email}`} className="text-lg font-medium" style={{ color: colors.primary }}>
                  {contact.email}
                </a>
              </div>
            )}
            {contact.address && (
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Address</p>
                <p style={{ color: colors.text }}>{contact.address}</p>
              </div>
            )}
            {contact.whatsapp && (
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 font-semibold text-white text-sm"
                style={{ background: '#25D366', borderRadius: radius }}
              >
                Chat on WhatsApp
              </a>
            )}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium border"
                    style={{ borderColor: colors.primary, color: colors.primary, borderRadius: radius }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            {hours.length > 0 && (
              <div
                className="p-8"
                style={{ background: colors.surface, borderRadius: radius, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              >
                <h3 className="font-bold mb-4" style={{ color: colors.text }}>Opening Hours</h3>
                <dl className="space-y-2">
                  {hours.map((h) => (
                    <div key={h.day} className="flex justify-between text-sm">
                      <dt style={{ color: colors.textMuted }}>{h.day}</dt>
                      <dd className="font-medium" style={{ color: colors.text }}>{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {contact.mapEmbed && (
              <div className="overflow-hidden" style={{ borderRadius: radius }}>
                <iframe
                  src={contact.mapEmbed}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Map"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
