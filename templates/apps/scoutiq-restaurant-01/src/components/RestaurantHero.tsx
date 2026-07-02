import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'

interface HeroProps {
  content: SiteContent
  colors: SiteColors
}

export function RestaurantHero({ content, colors }: HeroProps) {
  const ctaHref =
    content.contact.whatsapp ??
    (content.contact.phone ? `tel:${content.contact.phone}` : '#contact')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grain">
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 40%, #ea580c 70%, ${colors.accent} 100%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(251,191,36,0.3) 0%, transparent 40%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating accents */}
      <div className="absolute top-1/4 left-[8%] w-20 h-20 rounded-full bg-white/10 blur-sm animate-float opacity-60" />
      <div className="absolute bottom-1/3 right-[12%] w-32 h-32 rounded-full bg-amber-300/20 blur-md animate-float delay-300" />
      <div className="absolute top-[18%] right-[22%] text-6xl animate-float delay-500 opacity-40">✦</div>
      <div className="absolute bottom-[22%] left-[18%] text-5xl animate-float delay-200 opacity-30">❋</div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-20">
        <div className="opacity-0-start animate-fade-up">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.25em] mb-8 border border-white/25 text-white/90 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            {content.category || 'Fine Dining'}
          </span>
        </div>

        <p
          className="opacity-0-start animate-fade-up delay-100 text-sm md:text-base font-medium uppercase tracking-[0.3em] mb-5"
          style={{ color: colors.accent }}
        >
          {content.tagline}
        </p>

        <h1 className="opacity-0-start animate-fade-up delay-200 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-8 text-balance">
          {content.hero.headline}
        </h1>

        <p className="opacity-0-start animate-fade-up delay-300 text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-12 leading-relaxed">
          {content.hero.subheadline}
        </p>

        <div className="opacity-0-start animate-fade-up delay-400 flex flex-wrap gap-4 justify-center">
          <a
            href={ctaHref}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-glow"
            style={{ background: colors.accent, color: colors.primary }}
          >
            {content.hero.ctaText}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm border-2 border-white/40 text-white transition-all duration-300 hover:bg-white/10 hover:border-white/60"
          >
            {content.hero.ctaSecondary}
          </a>
        </div>

        {/* Quick stats */}
        <div className="opacity-0-start animate-fade-up delay-500 mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: `${content.services.length}+`, label: 'Signature Dishes' },
            { value: '4.9', label: 'Guest Rating' },
            { value: '7', label: 'Days Open' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-white/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
