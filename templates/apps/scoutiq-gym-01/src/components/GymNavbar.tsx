'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { SiteContent } from '@scoutiq/site-shared'
import type { GymColors } from '@/lib/theme'

interface NavbarProps {
  content: SiteContent
  colors: GymColors
}

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#programs', label: 'Programs' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact Us' },
]

export function GymNavbar({ content, colors }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
      style={{
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${colors.border}` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <span className="text-xl" style={{ color: colors.primary }}>⚡</span>
          <span className="font-display text-xl font-700 font-bold uppercase tracking-wide text-white">
            {content.businessName}
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-9">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-[13px] font-medium uppercase tracking-[0.12em] text-white/75 transition-colors hover:text-white"
            >
              {link.label}
              <span
                className="absolute -bottom-1.5 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: colors.primary }}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <motion.a
            href={ctaHref}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="hidden sm:inline-flex items-center px-6 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-[0.1em] text-black transition-shadow hover:shadow-blaze"
            style={{ background: colors.primary }}
          >
            Join Now
          </motion.a>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <div className="w-6 space-y-1.5">
              <span className="block h-0.5 bg-current transition-transform duration-300" style={{ transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span className="block h-0.5 bg-current transition-opacity duration-300" style={{ opacity: open ? 0 : 1 }} />
              <span className="block h-0.5 bg-current transition-transform duration-300" style={{ transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden overflow-hidden transition-all duration-400" style={{ maxHeight: open ? '320px' : '0', background: 'rgba(10,10,10,0.97)' }}>
        <nav className="px-6 py-4 space-y-3 border-t" style={{ borderColor: colors.border }}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-1.5 text-sm font-medium uppercase tracking-[0.12em] text-white/80"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}
