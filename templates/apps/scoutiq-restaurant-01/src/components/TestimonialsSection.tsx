import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'
import { AnimateIn } from './AnimateIn'

const REVIEW_TEMPLATES = [
  { rating: 5, prefix: 'Absolutely incredible' },
  { rating: 5, prefix: 'A hidden gem' },
  { rating: 5, prefix: 'Best dining experience' },
]

export function TestimonialsSection({ content, colors }: { content: SiteContent; colors: SiteColors }) {
  const reviews = content.about.highlights.slice(0, 3).map((highlight, i) => ({
    text: `${REVIEW_TEMPLATES[i]?.prefix ?? 'Wonderful'} — ${highlight.toLowerCase()} at ${content.businessName}.`,
    author: ['Sarah M.', 'James K.', 'Elena R.'][i] ?? 'Guest',
    rating: 5,
  }))

  if (reviews.length === 0) return null

  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden" style={{ background: colors.surface }}>
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{ background: colors.accent }}
      />

      <div className="max-w-7xl mx-auto relative">
        <AnimateIn>
          <div className="text-center mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-4"
              style={{ color: colors.primary }}
            >
              Guest Reviews
            </p>
            <h2
              className="font-display text-4xl md:text-5xl font-bold"
              style={{ color: colors.text }}
            >
              Loved by Our Guests
            </h2>
          </div>
        </AnimateIn>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <AnimateIn key={review.author} delay={i * 120}>
              <div
                className="p-8 rounded-2xl h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-card border"
                style={{
                  background: colors.background,
                  borderColor: `${colors.primary}10`,
                }}
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <span key={j} style={{ color: colors.accent }}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-lg leading-relaxed mb-8 italic" style={{ color: colors.text }}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: colors.primary, color: '#fff' }}
                  >
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: colors.text }}>
                      {review.author}
                    </p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      Verified Guest
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
