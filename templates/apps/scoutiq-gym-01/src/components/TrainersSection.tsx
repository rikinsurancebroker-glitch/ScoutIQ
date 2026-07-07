'use client'

import { motion } from 'framer-motion'
import type { SiteContent } from '@scoutiq/site-shared'
import type { GymColors } from '@/lib/theme'

interface TrainersProps {
  content: SiteContent
  colors: GymColors
}

const TRAINER_IMG =
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80'

const SKILLS = [
  { label: 'Fitness Training', pct: 92 },
  { label: 'Strength & Conditioning', pct: 88 },
  { label: 'Body Building', pct: 84 },
  { label: 'Nutrition Coaching', pct: 78 },
]

export function TrainersSection({ content, colors }: TrainersProps) {
  return (
    <section className="py-24 md:py-28 px-6" style={{ background: colors.surface }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* Left — trainer photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-2 lg:order-1"
        >
          <div className="rounded-2xl overflow-hidden shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TRAINER_IMG} alt="Experienced trainer" className="w-full h-[480px] object-cover img-duo" />
          </div>
          <div
            className="absolute -top-4 -right-4 w-28 h-28 rounded-2xl -z-10"
            style={{ background: colors.primary, opacity: 0.25 }}
          />
        </motion.div>

        {/* Right — copy + skill bars */}
        <div className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="blaze-rule mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase leading-[1.05] text-white mb-6 text-balance">
              Get Stronger With Our <span style={{ color: colors.primary }}>Experienced Trainers</span>
            </h2>
            <p className="text-base font-light leading-relaxed mb-10" style={{ color: colors.textMuted }}>
              {content.description}
            </p>
          </motion.div>

          <div className="space-y-7">
            {SKILLS.map((skill, i) => (
              <div key={skill.label}>
                <div className="flex justify-between items-baseline mb-2.5">
                  <span className="text-sm font-semibold uppercase tracking-[0.08em] text-white/85">
                    {skill.label}
                  </span>
                  <span className="font-display text-sm font-bold" style={{ color: colors.primary }}>
                    {skill.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: colors.border }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.pct}%` }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 1.1, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryHover})` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
