'use client'

import { useEffect, useState } from 'react'
import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'

interface NavbarProps {
  content: SiteContent
  colors: SiteColors
}

export function RestaurantNavbar({ content, colors }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const ctaHref =
    content.contact.whatsapp ??
    (content.contact.phone ? `tel:${content.contact.phone}` : '#contact')

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-card py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#"
          className={`font-display text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 ${
            scrolled ? 'text-stone-900' : 'text-white'
          }`}
        >
          {content.businessName}
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: '#menu', label: 'Menu' },
            { href: '#story', label: 'Our Story' },
            { href: '#gallery', label: 'Gallery' },
            { href: '#contact', label: 'Contact' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:opacity-80 ${
                scrolled ? 'text-stone-600' : 'text-white/85'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={ctaHref}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-glow"
          style={{
            background: scrolled ? colors.primary : colors.accent,
            color: scrolled ? '#fff' : colors.primary,
          }}
        >
          <span>Reserve a Table</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  )
}
