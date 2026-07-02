import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'
import { AnimateIn } from './AnimateIn'

export function ReservationCTA({ content, colors }: { content: SiteContent; colors: SiteColors }) {
  const ctaHref =
    content.contact.whatsapp ??
    (content.contact.phone ? `tel:${content.contact.phone}` : '#contact')

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimateIn>
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center shadow-lift"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 50%, #ea580c 100%)`,
            }}
          >
            <div className="absolute inset-0 hero-grain" />
            <div
              className="absolute inset-0 opacity-20 animate-gradient"
              style={{
                background: `linear-gradient(45deg, transparent, ${colors.accent}40, transparent)`,
                backgroundSize: '200% 200%',
              }}
            />

            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200 mb-4">
                Reserve Your Experience
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 text-balance">
                Ready for an Unforgettable Evening?
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
                Join us at {content.businessName} for a dining experience crafted with care,
                passion, and the finest ingredients.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href={ctaHref}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-glow"
                  style={{ background: colors.accent, color: colors.primary }}
                >
                  Book a Table Now
                  <span>→</span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm border-2 border-white/40 text-white hover:bg-white/10 transition-all duration-300"
                >
                  View Hours & Location
                </a>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
