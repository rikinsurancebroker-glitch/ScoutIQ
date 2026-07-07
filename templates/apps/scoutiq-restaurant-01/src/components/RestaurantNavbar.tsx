'use client'

import { useEffect, useState } from 'react'
import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'

interface NavbarProps {
  content: SiteContent
  colors: SiteColors
}

const LINKS = [
  { href: '#story', label: 'About' },
  { href: '#dishes', label: 'Dishes' },
  { href: '#menu', label: 'Menu' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export function RestaurantNavbar({ content, colors }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#reserve'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3 shadow-card' : 'py-5'
      }`}
      style={{ background: scrolled ? 'rgba(250,246,239,0.96)' : 'rgba(250,246,239,0.9)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="font-display text-xl md:text-2xl font-semibold tracking-tight" style={{ color: colors.dark }}>
            {content.businessName}
          </span>
          <span className="hidden md:block w-1.5 h-1.5 rounded-full" style={{ background: colors.primary }} />
        </a>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-9">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-[13px] font-medium uppercase tracking-[0.18em] transition-colors"
              style={{ color: colors.text }}
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: colors.primary }}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={ctaHref}
            className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5"
            style={{ background: colors.primary, color: '#fff' }}
          >
            Book a Table
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{ color: colors.dark }}
          >
            <div className="w-6 space-y-1.5">
              <span className="block h-px bg-current transition-transform duration-300" style={{ transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <span className="block h-px bg-current transition-opacity duration-300" style={{ opacity: open ? 0 : 1 }} />
              <span className="block h-px bg-current transition-transform duration-300" style={{ transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-400"
        style={{ maxHeight: open ? '320px' : '0' }}
      >
        <nav className="px-6 py-4 space-y-3 border-t" style={{ borderColor: colors.border }}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-1.5 text-sm font-medium uppercase tracking-[0.14em]"
              style={{ color: colors.text }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
