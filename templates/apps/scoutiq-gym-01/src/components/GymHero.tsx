'use client'

import { motion, type Variants } from 'framer-motion'
import type { SiteContent } from '@scoutiq/site-shared'
import type { GymColors } from '@/lib/theme'

interface HeroProps {
  content: SiteContent
  colors: GymColors
}

const HERO_IMG =
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1400&q=80'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export function GymHero({ content, colors }: HeroProps) {
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  // Split headline so the last word gets the blaze treatment
  const words = content.hero.headline.toUpperCase().split(' ')
  const lastWord = words.pop()

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24" style={{ background: colors.background }}>
      {/* Ambient orange glow */}
      <div
        className="absolute top-1/3 -left-40 w-[480px] h-[480px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: colors.primary }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-14 items-center py-16">
        {/* Left — copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.35em] mb-6"
            style={{ color: colors.primary }}
          >
            <span className="blaze-rule" style={{ width: 32 }} />
            {content.category || 'Fitness Club'}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.02] text-white mb-6 text-balance"
          >
            {words.join(' ')}{' '}
            <span style={{ color: colors.primary }}>{lastWord}</span>
          </motion.h1>

          <motion.p variants={item} className="text-base md:text-lg font-light max-w-md leading-relaxed mb-10" style={{ color: colors.textMuted }}>
            {content.hero.subheadline}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4">
            <motion.a
              href={ctaHref}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-black hover:shadow-blaze transition-shadow"
              style={{ background: colors.primary }}
            >
              {content.hero.ctaText}
            </motion.a>
            <motion.a
              href="#programs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.1em] text-white border transition-colors hover:border-white"
              style={{ borderColor: colors.border }}
            >
              {content.hero.ctaSecondary}
            </motion.a>
          </motion.div>

          {/* Stats strip */}
          <motion.div variants={item} className="mt-14 flex gap-10">
            {[
              { value: '500+', label: 'Members' },
              { value: `${content.services.length}+`, label: 'Programs' },
              { value: '24/7', label: 'Access' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl md:text-3xl font-bold" style={{ color: colors.primary }}>
                  {s.value}
                </p>
                <p className="text-[11px] uppercase tracking-[0.25em] mt-1" style={{ color: colors.textMuted }}>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — dramatic athlete photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="relative hidden lg:block"
        >
          {/* Orange frame accent */}
          <div
            className="absolute -top-5 -right-5 w-full h-full rounded-2xl border-2 pointer-events-none"
            style={{ borderColor: colors.primary, opacity: 0.4 }}
          />
          <div className="relative rounded-2xl overflow-hidden shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_IMG} alt="Athletes training" className="w-full h-[560px] object-cover img-duo" />
            {/* Bottom gradient into page bg */}
            <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(180deg, transparent, rgba(10,10,10,0.9))' }} />
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 -left-8 px-6 py-4 rounded-xl backdrop-blur-md border"
            style={{ background: 'rgba(18,18,18,0.85)', borderColor: colors.border }}
          >
            <p className="font-display text-xl font-bold text-white">No Pain</p>
            <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: colors.primary }}>No Gain</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
