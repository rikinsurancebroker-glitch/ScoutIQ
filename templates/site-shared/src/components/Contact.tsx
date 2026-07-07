'use client'

import type { SiteContent, SiteTheme } from '../types'
import { resolveColors, cardRadius } from '../utils'
import { AnimateIn } from './AnimateIn'

export function Contact({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const radius = cardRadius(theme.cardStyle)
  const { contact, hours, social } = content

  const isBrutalist = theme.variant === 'mono-brutalist'
  const isGolden = theme.variant === 'golden-editorial'
  const isDark = theme.dark
  const isNeo = theme.variant === 'neo-dark'
  const isClay = theme.variant === 'clay-ui'

  const socialLinks = [
    { label: 'Instagram', url: social.instagram, emoji: '📸' },
    { label: 'Facebook', url: social.facebook, emoji: '👍' },
    { label: 'YouTube', url: social.youtube, emoji: '▶️' },
    { label: 'Twitter', url: social.twitter, emoji: '𝕏' },
    { label: 'Yelp', url: social.yelp, emoji: '⭐' },
  ].filter((s) => s.url)

  const sectionBg = isDark
    ? colors.surface
    : isGolden
    ? '#111'
    : `${colors.primary}05`

  const cardBg = isDark ? colors.background : isGolden ? '#1a1a1a' : '#fff'
  const textColor = isDark || isGolden ? '#fff' : colors.text
  const mutedColor = isDark || isGolden ? '#888' : colors.textMuted
  const borderColor = isDark || isGolden ? '#333' : colors.border

  return (
    <section id="contact" className="py-24 px-6" style={{ background: sectionBg }}>
      <div className="max-w-6xl mx-auto">
        <AnimateIn delay={0}>
          <div className={`mb-14 ${isBrutalist ? '' : 'text-center'}`}>
            {isBrutalist ? (
              <div
                className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-[0.4em] mb-4"
                style={{ background: colors.primary, color: '#000' }}
              >
                Contact
              </div>
            ) : null}
            <h2
              className={`font-bold ${isBrutalist ? 'text-5xl uppercase' : 'text-3xl md:text-4xl'}`}
              style={{
                fontFamily: theme.fontHeading,
                color: isDark || isGolden ? '#fff' : colors.text,
                fontWeight: isGolden ? 400 : undefined,
              }}
            >
              {isGolden ? 'Reach Us' : isBrutalist ? 'Get In Touch' : 'Contact Us'}
            </h2>
            <p
              className={`mt-3 ${isBrutalist ? '' : 'text-center'} max-w-lg ${isBrutalist ? '' : 'mx-auto'}`}
              style={{ color: mutedColor }}
            >
              We would love to hear from you.
            </p>
          </div>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact details */}
          <AnimateIn delay={100} direction="left">
            <div
              className="p-8 space-y-6 h-full"
              style={{
                background: cardBg,
                borderRadius: isBrutalist ? '0' : radius,
                border: isNeo
                  ? `1px solid ${colors.primary}20`
                  : `1px solid ${borderColor}`,
                boxShadow: isClay
                  ? `0 8px 32px ${colors.primary}15`
                  : '0 2px 16px rgba(0,0,0,0.04)',
              }}
            >
              {contact.phone && (
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em] mb-1.5"
                    style={{ color: mutedColor }}
                  >
                    Phone
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-lg font-semibold transition-opacity hover:opacity-80"
                    style={{ color: colors.primary }}
                  >
                    {contact.phone}
                  </a>
                </div>
              )}

              {contact.email && (
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em] mb-1.5"
                    style={{ color: mutedColor }}
                  >
                    Email
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-base font-medium transition-opacity hover:opacity-80"
                    style={{ color: colors.primary }}
                  >
                    {contact.email}
                  </a>
                </div>
              )}

              {contact.address && (
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em] mb-1.5"
                    style={{ color: mutedColor }}
                  >
                    Address
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: textColor }}>
                    {contact.address}
                  </p>
                </div>
              )}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
                    style={{ color: mutedColor }}
                  >
                    Follow Us
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium border transition-all hover:scale-105"
                        style={{
                          borderColor: `${colors.primary}40`,
                          color: textColor,
                          borderRadius: isBrutalist ? '0' : '8px',
                        }}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AnimateIn>

          {/* Hours + Map */}
          <AnimateIn delay={200} direction="right">
            <div className="space-y-6 h-full">
              {hours.length > 0 && (
                <div
                  className="p-8"
                  style={{
                    background: cardBg,
                    borderRadius: isBrutalist ? '0' : radius,
                    border: isNeo ? `1px solid ${colors.primary}20` : `1px solid ${borderColor}`,
                    boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                  }}
                >
                  <h3
                    className="font-semibold mb-5 text-sm uppercase tracking-widest"
                    style={{ color: colors.primary }}
                  >
                    Opening Hours
                  </h3>
                  <dl className="space-y-3">
                    {hours.map((h) => (
                      <div key={h.day} className="flex justify-between text-sm">
                        <dt style={{ color: mutedColor }}>{h.day}</dt>
                        <dd className="font-semibold" style={{ color: textColor }}>
                          {h.hours}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {contact.mapEmbed && (
                <div
                  className="overflow-hidden"
                  style={{ borderRadius: isBrutalist ? '0' : radius }}
                >
                  <iframe
                    src={contact.mapEmbed}
                    width="100%"
                    height="220"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    title="Map"
                  />
                </div>
              )}
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
