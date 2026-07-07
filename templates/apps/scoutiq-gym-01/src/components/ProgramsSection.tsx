'use client'

import { motion } from 'framer-motion'
import type { SiteContent } from '@scoutiq/site-shared'
import type { GymColors } from '@/lib/theme'

interface ProgramsProps {
  content: SiteContent
  colors: GymColors
}

const PROGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
]

export function ProgramsSection({ content, colors }: ProgramsProps) {
  const programs = content.services.slice(0, 4)

  return (
    <section id="programs" className="py-24 md:py-28 px-6" style={{ background: colors.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white mb-4">
            Our <span style={{ color: colors.primary }}>Programs</span>
          </h2>
          <p className="text-sm font-light max-w-md mx-auto" style={{ color: colors.textMuted }}>
            Choose the perfect program to match your goals and fitness level.
          </p>
        </motion.div>

        {/* 2×2 card grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl overflow-hidden border cursor-default"
              style={{ background: colors.card, borderColor: colors.border }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PROGRAM_IMAGES[i % PROGRAM_IMAGES.length]}
                  alt={p.title}
                  className="w-full h-full object-cover img-duo transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(10,10,10,0.95))' }} />

                {/* Orange arrow chip */}
                <div
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-black text-sm font-bold transition-transform duration-300 group-hover:rotate-45"
                  style={{ background: colors.primary }}
                >
                  ↗
                </div>
              </div>

              {/* Copy */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white mb-2">
                  <span className="mr-2">{p.icon}</span>
                  {p.title}
                </h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: colors.textMuted }}>
                  {p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
