import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'
import { AnimateIn } from './AnimateIn'

interface ReservationProps {
  content: SiteContent
  colors: SiteColors
}

const CTA_IMG =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80'

export function ReservationCTA({ content, colors }: ReservationProps) {
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <section id="reserve" className="relative py-28 md:py-36 px-6 overflow-hidden">
      {/* Dark photography backdrop */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CTA_IMG} alt="Table setting" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'rgba(27,26,23,0.82)' }} />
      </div>

      <AnimateIn className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="text-[12px] font-medium uppercase tracking-[0.4em] mb-5" style={{ color: colors.primary }}>
          Reservations
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-medium text-white leading-[1.15] mb-6 text-balance">
          Book Your Table Tonight
        </h2>
        <div className="flex justify-center mb-8">
          <div className="gold-rule" />
        </div>
        <p className="font-accent italic text-lg text-white/75 mb-12 max-w-lg mx-auto">
          {content.hero.subheadline}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-3 px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5"
            style={{ background: colors.primary }}
          >
            {content.hero.ctaText}
          </a>
          {content.contact.phone && (
            <a
              href={`tel:${content.contact.phone}`}
              className="inline-flex items-center gap-3 px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-white border transition-all duration-300 hover:bg-white hover:text-black"
              style={{ borderColor: 'rgba(255,255,255,0.5)' }}
            >
              {content.contact.phone}
            </a>
          )}
        </div>
      </AnimateIn>
    </section>
  )
}
