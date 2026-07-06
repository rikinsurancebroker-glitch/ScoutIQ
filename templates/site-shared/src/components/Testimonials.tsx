'use client'

import type { SiteContent, SiteTheme } from '../types'
import { resolveColors, cardRadius } from '../utils'
import { AnimateIn } from './AnimateIn'

const GENERIC_TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Loyal Customer', text: 'Absolutely outstanding service. They exceeded every expectation and delivered results beyond what I thought was possible.' },
  { name: 'James T.', role: 'Regular Client', text: 'I have been coming here for years and the quality has never wavered. Truly one of the best in the business.' },
  { name: 'Priya K.', role: 'Happy Customer', text: 'The attention to detail and genuine care they show is remarkable. I recommend them to everyone I know.' },
]

export function Testimonials({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const radius = cardRadius(theme.cardStyle)

  const isBrutalist = theme.variant === 'mono-brutalist'
  const isGolden = theme.variant === 'golden-editorial'
  const isDark = theme.dark
  const isNeo = theme.variant === 'neo-dark'

  const bg = isDark
    ? colors.background
    : isGolden
    ? '#FFF9EF'
    : `${colors.primary}04`

  return (
    <section className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-6xl mx-auto">
        <AnimateIn delay={0}>
          <div className={`mb-14 ${isBrutalist ? '' : 'text-center'}`}>
            {isBrutalist ? (
              <div
                className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-[0.4em] mb-4"
                style={{ background: colors.primary, color: '#000' }}
              >
                Testimonials
              </div>
            ) : (
              <span
                className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
                style={{ background: `${colors.primary}15`, color: colors.primary }}
              >
                Client Reviews
              </span>
            )}
            <h2
              className={`font-bold ${isBrutalist ? 'text-5xl uppercase' : 'text-3xl md:text-4xl'}`}
              style={{
                fontFamily: theme.fontHeading,
                color: isDark ? colors.text : colors.text,
                fontWeight: isGolden ? 400 : undefined,
              }}
            >
              {isGolden ? 'What Clients Say' : 'Words from Our Clients'}
            </h2>
          </div>
        </AnimateIn>

        <div className="grid md:grid-cols-3 gap-6">
          {GENERIC_TESTIMONIALS.map((t, i) => (
            <AnimateIn key={i} delay={i * 100}>
              <div
                className="p-8 h-full flex flex-col"
                style={{
                  background: isDark ? colors.surface : '#fff',
                  borderRadius: isBrutalist ? '0' : radius,
                  border: isNeo
                    ? `1px solid ${colors.primary}20`
                    : isBrutalist
                    ? `2px solid ${colors.border}`
                    : `1px solid ${colors.border}`,
                  boxShadow: isNeo ? 'none' : '0 2px 16px rgba(0,0,0,0.04)',
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ color: colors.primary }}>★</span>
                  ))}
                </div>

                <p
                  className="text-sm leading-relaxed mb-6 flex-1 italic"
                  style={{ color: isDark ? '#aaa' : colors.textMuted }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: `${colors.primary}20`,
                      color: colors.primary,
                      borderRadius: isBrutalist ? '0' : '9999px',
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: isDark ? '#fff' : colors.text }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
