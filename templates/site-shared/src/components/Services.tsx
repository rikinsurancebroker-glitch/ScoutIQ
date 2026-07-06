'use client'

import type { SiteContent, SiteTheme } from '../types'
import { resolveColors, cardRadius } from '../utils'
import { AnimateIn } from './AnimateIn'

export function Services({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const radius = cardRadius(theme.cardStyle)

  const isBrutalist = theme.variant === 'mono-brutalist'
  const isGolden = theme.variant === 'golden-editorial'
  const isDark = theme.dark
  const isNeo = theme.variant === 'neo-dark'
  const isClay = theme.variant === 'clay-ui'
  const isLiquid = theme.variant === 'liquid-motion'

  const cardStyle = {
    background: isDark ? colors.surface : '#ffffff',
    borderRadius: isBrutalist ? '0' : radius,
    border: isNeo
      ? `1px solid ${colors.primary}30`
      : isBrutalist
      ? `2px solid ${colors.border}`
      : isGolden
      ? `1px solid ${colors.border}`
      : `1px solid ${colors.border}`,
    boxShadow: isClay
      ? `0 12px 40px ${colors.primary}20, inset 0 1px 0 rgba(255,255,255,0.8)`
      : isNeo
      ? `0 0 0 1px ${colors.primary}10`
      : '0 2px 16px rgba(0,0,0,0.04)',
  }

  const sectionBg = {
    background: isDark
      ? colors.background
      : isGolden
      ? colors.background
      : isClay
      ? '#fff'
      : isLiquid
      ? `${colors.primary}08`
      : `${colors.primary}04`,
  }

  return (
    <section id="services" className="py-24 px-6" style={sectionBg}>
      <div className="max-w-6xl mx-auto">
        <AnimateIn delay={0}>
          <div className={`mb-16 ${isBrutalist ? '' : 'text-center'}`}>
            {isBrutalist && (
              <div
                className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-[0.4em] mb-4"
                style={{ background: colors.primary, color: '#000' }}
              >
                Services
              </div>
            )}
            <h2
              className={`font-bold mb-4 ${isBrutalist ? 'text-5xl md:text-6xl uppercase' : 'text-3xl md:text-4xl'}`}
              style={{
                fontFamily: theme.fontHeading,
                color: isDark ? colors.text : isGolden ? colors.text : colors.text,
                letterSpacing: isBrutalist ? '-0.02em' : isGolden ? '0.01em' : undefined,
                fontWeight: isGolden ? 400 : undefined,
              }}
            >
              {isGolden ? 'Our Practice Areas' : isBrutalist ? 'What We Do' : 'What We Offer'}
            </h2>
            <p
              className={`max-w-xl leading-relaxed ${isBrutalist ? '' : 'mx-auto'}`}
              style={{ color: colors.textMuted }}
            >
              {content.description}
            </p>
          </div>
        </AnimateIn>

        {/* Bento-style grid for variety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.services.map((s, i) => (
            <AnimateIn key={i} delay={i * 80} direction="up">
              <div
                className="p-8 group transition-all duration-300 cursor-default h-full"
                style={{
                  ...cardStyle,
                  transform: undefined,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(-8px)'
                  if (isNeo) el.style.boxShadow = `0 0 40px ${colors.primary}20, 0 0 0 1px ${colors.primary}30`
                  if (isClay) el.style.boxShadow = `0 20px 60px ${colors.primary}30, inset 0 1px 0 rgba(255,255,255,0.8)`
                  if (!isNeo && !isClay) el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.08)`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = cardStyle.boxShadow ?? ''
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl mb-5 text-2xl transition-transform group-hover:rotate-6"
                  style={{
                    background: isNeo
                      ? `${colors.primary}15`
                      : isBrutalist
                      ? colors.primary
                      : isGolden
                      ? `${colors.primary}15`
                      : `${colors.primary}12`,
                    borderRadius: isBrutalist ? '0' : '12px',
                  }}
                >
                  {s.icon}
                </div>

                <h3
                  className="font-bold mb-3 text-lg"
                  style={{
                    color: isNeo ? colors.primary : isGolden ? colors.primary : colors.text,
                    fontFamily: isGolden ? theme.fontHeading : undefined,
                    textTransform: isBrutalist ? 'uppercase' : undefined,
                    letterSpacing: isBrutalist ? '0.05em' : undefined,
                    fontSize: isBrutalist ? '1rem' : undefined,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: colors.textMuted }}
                >
                  {s.description}
                </p>

                {isNeo && (
                  <div className="mt-5 flex items-center gap-2 text-xs font-mono" style={{ color: colors.primary }}>
                    <span>LEARN MORE</span>
                    <span>→</span>
                  </div>
                )}
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
