import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'
import { AnimateIn } from './AnimateIn'

const GRADIENTS = [
  'from-amber-900/80 via-orange-800/60 to-amber-700/40',
  'from-stone-800/80 via-amber-900/50 to-orange-900/40',
  'from-orange-900/70 via-red-900/50 to-amber-800/40',
  'from-yellow-900/60 via-amber-800/50 to-stone-900/40',
  'from-red-900/70 via-orange-800/60 to-amber-900/40',
  'from-stone-900/80 via-amber-950/60 to-orange-950/40',
]

export function MenuShowcase({ content, colors }: { content: SiteContent; colors: SiteColors }) {
  const featured = content.services.slice(0, 3)
  const rest = content.services.slice(3)

  return (
    <section id="menu" className="py-24 md:py-32 px-6" style={{ background: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-4"
              style={{ color: colors.primary }}
            >
              Culinary Excellence
            </p>
            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance"
              style={{ color: colors.text }}
            >
              Our Signature Menu
            </h2>
            <p className="max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: colors.textMuted }}>
              {content.description}
            </p>
          </div>
        </AnimateIn>

        {/* Bento featured dishes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-12">
          {featured.map((item, i) => (
            <AnimateIn
              key={item.title}
              delay={i * 120}
              className={`card-shine group relative overflow-hidden rounded-2xl min-h-[280px] flex flex-col justify-end p-8 transition-transform duration-500 hover:-translate-y-2 hover:shadow-lift ${
                i === 0 ? 'md:col-span-7' : 'md:col-span-5'
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="absolute top-6 right-6 text-5xl opacity-80 group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/15 text-white/90 backdrop-blur-sm mb-4">
                  Chef&apos;s Pick
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/75 text-sm leading-relaxed max-w-md">{item.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Remaining items grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 80}>
                <div
                  className="card-shine group p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-card h-full"
                  style={{
                    background: colors.surface,
                    borderColor: `${colors.primary}12`,
                  }}
                >
                  <span className="text-4xl mb-5 block group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <h3
                    className="font-display text-xl font-bold mb-3"
                    style={{ color: colors.primary }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
                    {item.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
