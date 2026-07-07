'use client'

import { motion } from 'framer-motion'
import type { SiteContent } from '@scoutiq/site-shared'
import type { GymColors } from '@/lib/theme'

interface PricingProps {
  content: SiteContent
  colors: GymColors
}

const PLANS = [
  {
    name: 'Basic Plan',
    price: '299',
    tag: null,
    features: ['Gym floor access', 'Locker room', 'Free fitness assessment', 'Open 6am – 10pm'],
  },
  {
    name: 'Regular Plan',
    price: '399',
    tag: 'Most Popular',
    features: ['Everything in Basic', 'All group classes', 'Sauna & recovery zone', '24/7 access'],
  },
  {
    name: 'Premium Plan',
    price: '599',
    tag: null,
    features: ['Everything in Regular', 'Personal trainer 2×/week', 'Nutrition plan', 'Guest passes'],
  },
]

export function PricingSection({ content, colors }: PricingProps) {
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <section className="py-24 md:py-28 px-6" style={{ background: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white mb-4 text-balance">
            Start Your Body Goal From <span style={{ color: colors.primary }}>Choosing Our Package</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => {
            const featured = Boolean(plan.tag)
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className="relative rounded-2xl border p-8 flex flex-col"
                style={{
                  background: colors.card,
                  borderColor: featured ? colors.primary : colors.border,
                  boxShadow: featured ? '0 0 56px -18px rgba(255,107,26,0.45)' : undefined,
                }}
              >
                {plan.tag && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.14em] text-black"
                    style={{ background: colors.primary }}
                  >
                    {plan.tag}
                  </span>
                )}

                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-6">
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-display text-5xl font-bold" style={{ color: featured ? colors.primary : '#fff' }}>
                    ${plan.price}
                  </span>
                  <span className="text-sm" style={{ color: colors.textMuted }}>/year</span>
                </div>

                <ul className="space-y-3.5 mb-10 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm font-light" style={{ color: colors.textMuted }}>
                      <span className="mt-0.5 text-xs" style={{ color: colors.primary }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={ctaHref}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="block text-center px-6 py-3.5 rounded-full text-sm font-bold uppercase tracking-[0.1em] transition-all"
                  style={
                    featured
                      ? { background: colors.primary, color: '#000' }
                      : { border: `1px solid ${colors.border}`, color: '#fff' }
                  }
                >
                  Choose Plan
                </motion.a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
