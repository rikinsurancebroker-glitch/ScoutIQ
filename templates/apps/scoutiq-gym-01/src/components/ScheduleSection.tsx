'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SiteContent } from '@scoutiq/site-shared'
import type { GymColors } from '@/lib/theme'

interface ScheduleProps {
  content: SiteContent
  colors: GymColors
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Deterministic pseudo-random slots per tab so each class shows a distinct timetable
const SLOT_SETS = [
  ['6:00am – 7:00am', '9:00am – 10:00am', '5:30pm – 6:30pm'],
  ['7:00am – 8:00am', '12:00pm – 1:00pm', '6:00pm – 7:00pm'],
  ['8:00am – 9:00am', '4:00pm – 5:00pm', '7:30pm – 8:30pm'],
  ['6:30am – 7:30am', '11:00am – 12:00pm', '8:00pm – 9:00pm'],
]

export function ScheduleSection({ content, colors }: ScheduleProps) {
  const classes = content.services.slice(0, 6)
  const [active, setActive] = useState(0)

  return (
    <section id="schedule" className="py-24 md:py-28 px-6" style={{ background: colors.background }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white mb-4">
            Our <span style={{ color: colors.primary }}>Schedule</span>
          </h2>
          <p className="text-sm font-light max-w-md mx-auto" style={{ color: colors.textMuted }}>
            Plan your week — find the session that fits your rhythm.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {classes.map((c, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="px-5 py-2 rounded-full text-[12px] font-semibold uppercase tracking-[0.1em] border transition-all duration-300"
              style={{
                background: active === i ? colors.primary : 'transparent',
                color: active === i ? '#000' : colors.textMuted,
                borderColor: active === i ? colors.primary : colors.border,
              }}
            >
              {c.title}
            </button>
          ))}
        </motion.div>

        {/* Timetable */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: colors.card, borderColor: colors.border }}
          >
            {DAYS.map((day, di) => {
              const slots = SLOT_SETS[(active + di) % SLOT_SETS.length]
              const rest = (di + active) % 6 === 5
              return (
                <div
                  key={day}
                  className="grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr] items-center border-b last:border-b-0"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="px-5 py-4 font-display text-sm font-bold uppercase tracking-wider"
                    style={{ color: colors.primary }}
                  >
                    {day}
                  </div>
                  <div className="px-5 py-4 flex flex-wrap gap-2">
                    {rest ? (
                      <span className="text-[12px] uppercase tracking-[0.2em]" style={{ color: colors.textMuted }}>
                        Rest / Open Floor
                      </span>
                    ) : (
                      slots.map((s) => (
                        <span
                          key={s}
                          className="px-3.5 py-1.5 rounded-md text-[12px] font-medium border"
                          style={{ color: colors.text, borderColor: colors.border, background: colors.surface }}
                        >
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
