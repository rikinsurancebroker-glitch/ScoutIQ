import type { SiteContent, SiteTheme } from '../types'
import { resolveColors, cardRadius } from '../utils'

export function Services({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const radius = cardRadius(theme.cardStyle)

  return (
    <section className="py-20 px-6" style={{ background: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          style={{ fontFamily: theme.fontHeading, color: colors.text }}
        >
          What We Offer
        </h2>
        <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: colors.textMuted }}>
          {content.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.services.map((s, i) => (
            <div
              key={i}
              className="p-8 shadow-sm border transition-transform hover:-translate-y-1"
              style={{
                background: colors.surface,
                borderColor: `${colors.primary}15`,
                borderRadius: radius,
              }}
            >
              <span className="text-4xl mb-4 block">{s.icon}</span>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
