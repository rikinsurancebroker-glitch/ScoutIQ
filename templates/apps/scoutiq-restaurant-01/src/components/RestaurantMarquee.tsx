import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'

export function RestaurantMarquee({ content, colors }: { content: SiteContent; colors: SiteColors }) {
  const items = [
    ...content.about.highlights,
    content.tagline,
    content.businessName,
    'Farm to Table',
    'Chef Crafted',
    'Seasonal Menu',
  ]

  const doubled = [...items, ...items]

  return (
    <section
      className="py-5 border-y overflow-hidden"
      style={{ background: colors.primary, borderColor: `${colors.accent}30` }}
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-6 px-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/90"
          >
            <span>{item}</span>
            <span style={{ color: colors.accent }}>✦</span>
          </span>
        ))}
      </div>
    </section>
  )
}
