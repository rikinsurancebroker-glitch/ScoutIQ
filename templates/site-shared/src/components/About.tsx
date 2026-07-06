'use client'

import type { SiteContent, SiteTheme } from '../types'
import { resolveColors, cardRadius } from '../utils'
import { AnimateIn } from './AnimateIn'

export function About({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const radius = cardRadius(theme.cardStyle)

  const isBrutalist = theme.variant === 'mono-brutalist'
  const isGolden = theme.variant === 'golden-editorial'
  const isDark = theme.dark

  const bg = isDark ? colors.surface : isGolden ? '#111' : colors.surface

  const checkIcon = isGolden
    ? '—'
    : isBrutalist
    ? '→'
    : theme.variant === 'neo-dark'
    ? '◆'
    : '✓'

  return (
    <section id="about" className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <AnimateIn delay={0} direction="left">
          <div>
            {!isBrutalist && (
              <span
                className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
                style={{
                  background: `${colors.primary}15`,
                  color: colors.primary,
                }}
              >
                About Us
              </span>
            )}
            {isBrutalist && (
              <div
                className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-[0.4em] mb-4"
                style={{ background: colors.primary, color: '#000' }}
              >
                About
              </div>
            )}
            <h2
              className={`font-bold mb-5 ${isBrutalist ? 'text-5xl uppercase' : 'text-3xl md:text-4xl'}`}
              style={{
                fontFamily: theme.fontHeading,
                color: isDark || isGolden ? '#fff' : colors.text,
                fontWeight: isGolden ? 400 : undefined,
                letterSpacing: isBrutalist ? '-0.02em' : undefined,
              }}
            >
              {content.about.headline}
            </h2>
            <p
              className="leading-relaxed mb-8 text-base"
              style={{ color: isDark || isGolden ? '#888' : colors.textMuted }}
            >
              {content.about.body}
            </p>

            <ul className="space-y-3">
              {content.about.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 font-bold"
                    style={{ color: colors.primary }}
                  >
                    {checkIcon}
                  </span>
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: isDark || isGolden ? '#ccc' : colors.text }}
                  >
                    {h}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </AnimateIn>

        {/* Right */}
        <AnimateIn delay={200} direction="right">
          <div
            className="p-10 relative overflow-hidden"
            style={{
              background: isDark ? colors.background : `${colors.primary}06`,
              borderRadius: isBrutalist ? '0' : radius,
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Decorative accent */}
            {!isBrutalist && (
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent ?? colors.primary}80)` }}
              />
            )}
            {isBrutalist && (
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: colors.primary }}
              />
            )}

            <p
              className="text-6xl font-light mb-4 leading-none"
              style={{
                color: colors.primary,
                fontFamily: isGolden ? theme.fontHeading : undefined,
                opacity: 0.4,
              }}
            >
              &ldquo;
            </p>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{
                fontFamily: isGolden ? theme.fontHeading : undefined,
                fontStyle: isGolden ? 'italic' : undefined,
                color: isDark ? colors.text : isGolden ? colors.text : colors.text,
              }}
            >
              {content.description}
            </p>
            <div
              className="flex items-center gap-3 pt-4"
              style={{ borderTop: `1px solid ${colors.border}` }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: colors.primary }}
              >
                {content.businessName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: isDark ? '#fff' : colors.text }}>
                  {content.businessName}
                </p>
                <p className="text-xs" style={{ color: colors.textMuted }}>{content.tagline}</p>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
