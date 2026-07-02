import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'
import { AnimateIn } from './AnimateIn'

export function StorySection({ content, colors }: { content: SiteContent; colors: SiteColors }) {
  return (
    <section id="story" className="py-24 md:py-32 px-6" style={{ background: colors.surface }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimateIn>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
              />
              <div
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lift"
                style={{
                  background: `linear-gradient(160deg, ${colors.secondary} 0%, ${colors.primary} 50%, ${colors.accent} 100%)`,
                }}
              >
                <div className="absolute inset-0 hero-grain" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                  <span className="text-8xl mb-6 animate-float">🍽️</span>
                  <p className="font-accent text-3xl md:text-4xl italic text-white/90 leading-snug">
                    &ldquo;Every plate tells a story&rdquo;
                  </p>
                  <p className="mt-6 text-sm uppercase tracking-[0.25em] text-white/60">
                    — {content.businessName}
                  </p>
                </div>
              </div>
              <div
                className="absolute -bottom-6 -right-6 md:right-8 px-8 py-6 rounded-2xl shadow-card"
                style={{ background: colors.accent }}
              >
                <p className="font-display text-3xl font-bold" style={{ color: colors.primary }}>
                  Est. 2024
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: colors.secondary }}>
                  Crafted with passion
                </p>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={150}>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-4"
              style={{ color: colors.primary }}
            >
              Our Story
            </p>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight"
              style={{ color: colors.text }}
            >
              {content.about.headline}
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: colors.textMuted }}>
              {content.about.body}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {content.about.highlights.map((h, i) => (
                <div
                  key={h}
                  className="flex items-start gap-3 p-4 rounded-xl transition-colors duration-300"
                  style={{ background: `${colors.primary}08` }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: colors.accent, color: colors.primary }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-medium pt-1" style={{ color: colors.text }}>
                    {h}
                  </span>
                </div>
              ))}
            </div>

            <blockquote
              className="border-l-4 pl-6 italic text-lg"
              style={{ borderColor: colors.accent, color: colors.text }}
            >
              {content.description}
            </blockquote>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
