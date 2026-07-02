import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'
import { AnimateIn } from './AnimateIn'

const GALLERY_ITEMS = [
  { emoji: '🥘', label: 'Main Course', span: 'md:col-span-2 md:row-span-2' },
  { emoji: '🍷', label: 'Wine Selection', span: '' },
  { emoji: '🥗', label: 'Fresh Starters', span: '' },
  { emoji: '🍰', label: 'Desserts', span: 'md:col-span-2' },
  { emoji: '☕', label: 'Coffee Bar', span: '' },
  { emoji: '🌿', label: 'Garden Patio', span: '' },
]

export function GallerySection({ content, colors }: { content: SiteContent; colors: SiteColors }) {
  return (
    <section id="gallery" className="py-24 md:py-32 px-6" style={{ background: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em] mb-4"
                style={{ color: colors.primary }}
              >
                Atmosphere
              </p>
              <h2
                className="font-display text-4xl md:text-5xl font-bold"
                style={{ color: colors.text }}
              >
                A Feast for the Senses
              </h2>
            </div>
            <p className="max-w-md text-lg" style={{ color: colors.textMuted }}>
              Step inside {content.businessName} — where warm ambiance meets unforgettable flavors.
            </p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] md:auto-rows-[180px]">
          {GALLERY_ITEMS.map((item, i) => (
            <AnimateIn
              key={item.label}
              delay={i * 100}
              className={`group relative overflow-hidden rounded-2xl ${item.span}`}
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{
                  background: `linear-gradient(${135 + i * 30}deg, ${colors.secondary}ee, ${colors.primary}cc, ${colors.accent}88)`,
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-5xl md:text-6xl mb-3 group-hover:scale-125 transition-transform duration-500">
                  {item.emoji}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                  {item.label}
                </span>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
