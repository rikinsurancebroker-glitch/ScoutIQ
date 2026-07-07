'use client'

import { motion } from 'framer-motion'
import type { SiteContent } from '@scoutiq/site-shared'
import type { GymColors } from '@/lib/theme'

interface ContactProps {
  content: SiteContent
  colors: GymColors
}

const CTA_IMG =
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=2000&q=80'

export function GymContact({ content, colors }: ContactProps) {
  const { contact, hours, social } = content
  const ctaHref = contact.phone ? `tel:${contact.phone}` : '#'

  const socialLinks = [
    { label: 'Instagram', url: social.instagram },
    { label: 'Facebook', url: social.facebook },
    { label: 'YouTube', url: social.youtube },
    { label: 'Twitter', url: social.twitter },
  ].filter((s) => s.url)

  return (
    <>
      {/* ── Full-width CTA banner ─────────────────────────────────────────── */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CTA_IMG} alt="Gym interior" className="absolute inset-0 w-full h-full object-cover img-duo" />
          <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.85)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase text-white leading-[1.05] mb-6 text-balance">
            Ready to <span style={{ color: colors.primary }}>Transform?</span>
          </h2>
          <p className="text-base font-light mb-10 max-w-md mx-auto" style={{ color: colors.textMuted }}>
            {content.hero.subheadline}
          </p>
          <motion.a
            href={ctaHref}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold uppercase tracking-[0.12em] text-black hover:shadow-blaze transition-shadow"
            style={{ background: colors.primary }}
          >
            {content.hero.ctaText}
          </motion.a>
        </motion.div>
      </section>

      {/* ── Contact info ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 md:py-28 px-6" style={{ background: colors.surface }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white mb-4">
              Contact <span style={{ color: colors.primary }}>Us</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              contact.address && { icon: '⚲', title: 'Address', lines: [contact.address] },
              (contact.phone || contact.email) && {
                icon: '✆',
                title: 'Contact',
                lines: [contact.phone, contact.email].filter(Boolean) as string[],
              },
              hours.length > 0 && {
                icon: '◷',
                title: 'Hours',
                lines: hours.map((h) => `${h.day}: ${h.hours}`),
              },
            ]
              .filter(Boolean)
              .map((card, i) => {
                const c = card as { icon: string; title: string; lines: string[] }
                return (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                    className="rounded-2xl border p-8 text-center"
                    style={{ background: colors.card, borderColor: colors.border }}
                  >
                    <p className="text-2xl mb-4" style={{ color: colors.primary }}>{c.icon}</p>
                    <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white mb-4">
                      {c.title}
                    </h3>
                    {c.lines.map((line, li) => (
                      <p key={li} className="text-sm font-light leading-relaxed" style={{ color: colors.textMuted }}>
                        {line}
                      </p>
                    ))}
                  </motion.div>
                )
              })}
          </div>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="px-6 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-[0.14em] border transition-colors"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  {s.label}
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
