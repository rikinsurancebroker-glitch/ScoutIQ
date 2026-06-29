import type { SiteContent, SiteTheme } from '../types'
import { resolveColors, cardRadius } from '../utils'

export function About({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const radius = cardRadius(theme.cardStyle)

  return (
    <section className="py-20 px-6" style={{ background: colors.surface }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ fontFamily: theme.fontHeading, color: colors.text }}
          >
            {content.about.headline}
          </h2>
          <p className="leading-relaxed mb-8" style={{ color: colors.textMuted }}>
            {content.about.body}
          </p>
          <ul className="space-y-3">
            {content.about.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: colors.accent }}
                />
                <span style={{ color: colors.text }}>{h}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="p-10 border-l-4"
          style={{
            background: colors.background,
            borderColor: colors.primary,
            borderRadius: radius,
          }}
        >
          <p className="text-6xl font-bold opacity-20 mb-2" style={{ color: colors.primary }}>
            &ldquo;
          </p>
          <p className="text-lg italic leading-relaxed" style={{ color: colors.text }}>
            {content.description}
          </p>
          <p className="mt-6 font-semibold" style={{ color: colors.primary }}>
            — {content.businessName}
          </p>
        </div>
      </div>
    </section>
  )
}
