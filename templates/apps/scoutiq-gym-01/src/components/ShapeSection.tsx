'use client'

import { motion } from 'framer-motion'
import type { SiteContent } from '@scoutiq/site-shared'
import type { GymColors } from '@/lib/theme'

interface ShapeProps {
  content: SiteContent
  colors: GymColors
}

const SHAPE_IMG =
  'https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=1200&q=80'

export function ShapeSection({ content, colors }: ShapeProps) {
  return (
    <section id="about" className="py-24 md:py-28 px-6" style={{ background: colors.surface }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        {/* Left — photo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SHAPE_IMG} alt="Training session" className="w-full h-[460px] object-cover img-duo" />
          </div>
          {/* Orange corner accent */}
          <div
            className="absolute -bottom-4 -left-4 w-28 h-28 rounded-2xl -z-10"
            style={{ background: colors.primary, opacity: 0.25 }}
          />
        </motion.div>

        {/* Right — copy */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="blaze-rule mb-6" />
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase leading-[1.05] text-white mb-6 text-balance">
            {content.about.headline}
          </h2>
          <p className="text-base font-light leading-relaxed mb-8" style={{ color: colors.textMuted }}>
            {content.about.body}
          </p>

          <ul className="space-y-4 mb-10">
            {content.about.highlights.map((h, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black shrink-0"
                  style={{ background: colors.primary }}
                >
                  ✓
                </span>
                <span className="text-sm font-medium text-white/85">{h}</span>
              </motion.li>
            ))}
          </ul>

          <motion.a
            href="#schedule"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-black hover:shadow-blaze transition-shadow"
            style={{ background: colors.primary }}
          >
            Explore More
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
