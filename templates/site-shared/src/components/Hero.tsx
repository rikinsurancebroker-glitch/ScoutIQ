import type { SiteContent, SiteTheme } from '../types'
import { resolveColors } from '../utils'

interface HeroProps {
  content: SiteContent
  theme: SiteTheme
}

export function Hero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const isDark = theme.dark
  const textOnHero = theme.dark ? '#fafafa' : '#ffffff'

  const ctaHref =
    content.contact.whatsapp ??
    (content.contact.phone ? `tel:${content.contact.phone}` : '#contact')

  const ctaPrimary = (
    <a
      href={ctaHref}
      className="inline-block px-8 py-3.5 font-semibold text-sm tracking-wide transition-transform hover:scale-105"
      style={{
        background: colors.accent,
        color: isDark ? '#0c0a09' : colors.primary,
        borderRadius: theme.cardStyle === 'pill' ? '9999px' : theme.cardStyle === 'sharp' ? '2px' : '0.75rem',
      }}
    >
      {content.hero.ctaText}
    </a>
  )

  const ctaSecondary = (
    <a
      href="#contact"
      className="inline-block px-8 py-3.5 font-semibold text-sm border-2 transition-opacity hover:opacity-90"
      style={{
        borderColor: 'rgba(255,255,255,0.6)',
        color: textOnHero,
        borderRadius: theme.cardStyle === 'pill' ? '9999px' : theme.cardStyle === 'sharp' ? '2px' : '0.75rem',
      }}
    >
      {content.hero.ctaSecondary}
    </a>
  )

  const inner = (
    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <p
        className="text-sm font-medium uppercase tracking-[0.2em] mb-4 opacity-90"
        style={{ color: colors.accent }}
      >
        {content.tagline}
      </p>
      <h1
        className="text-4xl md:text-6xl font-bold leading-tight mb-6"
        style={{ fontFamily: theme.fontHeading, color: textOnHero }}
      >
        {content.hero.headline}
      </h1>
      <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90" style={{ color: textOnHero }}>
        {content.hero.subheadline}
      </p>
      <div className="flex flex-wrap gap-4 justify-center">{ctaPrimary}{ctaSecondary}</div>
    </div>
  )

  if (theme.heroLayout === 'split') {
    return (
      <section className="min-h-[85vh] flex flex-col md:flex-row">
        <div
          className="flex-1 flex items-center justify-center p-12 md:p-16"
          style={{ background: theme.heroGradient }}
        >
          <div className="max-w-lg">
            <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: colors.accent }}>
              {content.tagline}
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: theme.fontHeading, color: textOnHero }}
            >
              {content.hero.headline}
            </h1>
            <p className="text-lg mb-8 opacity-90" style={{ color: textOnHero }}>
              {content.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-3">{ctaPrimary}{ctaSecondary}</div>
          </div>
        </div>
        <div
          className="flex-1 flex items-center justify-center p-12"
          style={{ background: colors.surface, color: colors.text }}
        >
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
              {content.category}
            </p>
            <p className="text-2xl font-bold mb-4" style={{ fontFamily: theme.fontHeading }}>
              {content.businessName}
            </p>
            <p className="leading-relaxed" style={{ color: colors.textMuted }}>
              {content.description}
            </p>
          </div>
        </div>
      </section>
    )
  }

  const minH = theme.heroLayout === 'fullscreen' ? 'min-h-screen' : 'min-h-[75vh]'

  return (
    <section
      className={`${minH} flex items-center justify-center relative overflow-hidden`}
      style={{ background: theme.heroGradient }}
    >
      {theme.pattern === 'dots' && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      )}
      {theme.pattern === 'grid' && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      )}
      {inner}
    </section>
  )
}
