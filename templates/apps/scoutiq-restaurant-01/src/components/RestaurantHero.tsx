import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'

interface HeroProps {
  content: SiteContent
  colors: SiteColors
}

const HERO_IMG =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80'

export function RestaurantHero({ content, colors }: HeroProps) {
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#reserve'

  return (
    <section className="relative h-[92vh] min-h-[560px] flex items-center justify-center overflow-hidden">
      {/* Full-bleed photography with slow ken-burns zoom */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMG}
          alt="Restaurant interior"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(27,26,23,0.45)' }} />
      </div>

      {/* Centered editorial content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-16">
        <p
          className="opacity-0-start animate-fade-up text-[12px] md:text-sm font-medium uppercase tracking-[0.45em] mb-6"
          style={{ color: colors.primary }}
        >
          {content.tagline}
        </p>

        <h1 className="opacity-0-start animate-fade-up delay-200 font-display text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.12] mb-8 text-balance">
          Welcome to {content.businessName}
        </h1>

        <div className="opacity-0-start animate-fade-up delay-300 flex justify-center mb-10">
          <div className="gold-rule" />
        </div>

        <p className="opacity-0-start animate-fade-up delay-300 font-accent italic text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-12">
          {content.hero.subheadline}
        </p>

        <div className="opacity-0-start animate-fade-up delay-400">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-3 px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-white border transition-all duration-300 hover:bg-white hover:text-black"
            style={{ borderColor: 'rgba(255,255,255,0.6)' }}
          >
            {content.hero.ctaText}
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/70 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
