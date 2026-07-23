'use client'

import { useEffect, useRef, useState } from 'react'
import type { SiteContent, SiteTheme } from '../types'
import { resolveColors } from '../utils'

// ─── Floating Navbar ──────────────────────────────────────────────────────────

export function Nav({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isBrutalist = theme.variant === 'mono-brutalist'
  const isGolden = theme.variant === 'golden-editorial'
  const navLinks = ['Services', 'About', 'Contact']

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? theme.dark
            ? 'rgba(5,5,5,0.92)'
            : 'rgba(255,255,255,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled
          ? `1px solid ${colors.border}`
          : '1px solid transparent',
        boxShadow: scrolled ? `0 1px 40px ${colors.primary}10` : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-bold text-xl tracking-tight transition-opacity hover:opacity-80"
          style={{
            fontFamily: theme.fontHeading,
            color: scrolled || !theme.dark ? colors.text : '#fff',
            letterSpacing: isGolden ? '0.05em' : undefined,
          }}
        >
          {content.businessName}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium transition-all relative group"
              style={{ color: scrolled || !theme.dark ? colors.textMuted : 'rgba(255,255,255,0.7)' }}
            >
              {isBrutalist ? link.toUpperCase() : link}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: colors.primary }}
              />
            </a>
          ))}
          <a
            href="#contact"
            className="px-5 py-2 text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg"
            style={{
              background: colors.primary,
              color: theme.dark ? '#000' : '#fff',
              borderRadius: theme.cardStyle === 'sharp' ? '2px' : theme.cardStyle === 'clay' ? '999px' : '8px',
              boxShadow: `0 0 0 0 ${colors.primary}40`,
            }}
          >
            {content.hero.ctaText}
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: scrolled || !theme.dark ? colors.text : '#fff' }}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-1.5">
            <span
              className="block h-0.5 transition-all duration-300"
              style={{
                background: 'currentColor',
                transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              }}
            />
            <span
              className="block h-0.5 transition-all duration-300"
              style={{
                background: 'currentColor',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 transition-all duration-300"
              style={{
                background: 'currentColor',
                transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '300px' : '0',
          background: theme.dark ? 'rgba(5,5,5,0.98)' : 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <nav className="px-6 py-4 space-y-3 border-t" style={{ borderColor: colors.border }}>
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="block py-2 text-sm font-medium"
              style={{ color: colors.text }}
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const year = new Date().getFullYear()

  const socialLinks = [
    { label: 'Instagram', url: content.social.instagram, icon: '📸' },
    { label: 'Facebook', url: content.social.facebook, icon: '👍' },
    { label: 'YouTube', url: content.social.youtube, icon: '▶️' },
    { label: 'Twitter', url: content.social.twitter, icon: '𝕏' },
    { label: 'Yelp', url: content.social.yelp, icon: '⭐' },
  ].filter((s) => s.url)

  const isBrutalist = theme.variant === 'mono-brutalist'
  const isGolden = theme.variant === 'golden-editorial'

  return (
    <footer
      className="py-16 px-6"
      style={{
        background: theme.dark ? '#000' : isGolden ? '#111111' : colors.surface,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p
              className="font-bold text-2xl mb-3"
              style={{
                fontFamily: theme.fontHeading,
                color: theme.dark || isGolden ? '#fff' : colors.text,
                fontSize: isBrutalist ? '2rem' : undefined,
                textTransform: isBrutalist ? 'uppercase' : undefined,
              }}
            >
              {content.businessName}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: theme.dark || isGolden ? '#888' : colors.textMuted }}
            >
              {content.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: colors.primary }}
            >
              Quick Links
            </p>
            <ul className="space-y-2">
              {['Services', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm transition-opacity hover:opacity-100 opacity-70"
                    style={{ color: theme.dark || isGolden ? '#aaa' : colors.text }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          {socialLinks.length > 0 && (
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: colors.primary }}
              >
                Follow Us
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 border"
                    style={{
                      borderColor: `${colors.primary}40`,
                      color: theme.dark || isGolden ? '#ccc' : colors.textMuted,
                      borderRadius: theme.cardStyle === 'sharp' ? '2px' : '6px',
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderTop: `1px solid ${colors.border}`,
            color: theme.dark || isGolden ? '#555' : colors.textMuted,
          }}
        >
          <p>© {year} {content.businessName}. All rights reserved.</p>
          <p style={{ color: `${colors.primary}99` }}>
            Preview powered by <strong style={{ color: colors.primary }}>ScoutIQ</strong>
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Expired Page ─────────────────────────────────────────────────────────────

export function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⏳</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Preview Expired</h1>
        <p className="text-slate-400">This free website preview is no longer available.</p>
      </div>
    </div>
  )
}
