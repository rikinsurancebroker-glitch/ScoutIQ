'use client'

import { useEffect, useState } from 'react'
import type { SiteContent, SiteTheme } from '../types'
import { resolveColors, cardRadius } from '../utils'
import { AnimateIn } from './AnimateIn'

interface HeroProps {
  content: SiteContent
  theme: SiteTheme
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  const [count, setCount] = useState(0)
  const num = parseInt(value.replace(/\D/g, ''))
  const suffix = value.replace(/[\d]/g, '')

  useEffect(() => {
    if (!num) return
    let start = 0
    const step = Math.ceil(num / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= num) { setCount(num); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [num])

  return (
    <div className="text-center">
      <p className="text-3xl font-bold" style={{ color }}>
        {num ? `${count}${suffix}` : value}
      </p>
      <p className="text-xs uppercase tracking-widest mt-1 opacity-60">{label}</p>
    </div>
  )
}

// ─── Aurora / Default ─────────────────────────────────────────────────────────

function AuroraHero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'
  const radius = cardRadius(theme.cardStyle)

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: colors.background }}
    >
      {/* Aurora blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, transparent)`,
            top: '-10%', left: '20%',
            animation: 'aurora-drift 12s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${colors.accent}, transparent)`,
            bottom: '10%', right: '15%',
            animation: 'aurora-drift 16s ease-in-out infinite alternate-reverse',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <AnimateIn delay={0}>
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8 border"
            style={{ color: colors.primary, borderColor: `${colors.primary}30`, background: `${colors.primary}08` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.primary }} />
            {content.category}
          </span>
        </AnimateIn>

        <AnimateIn delay={100}>
          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6 tracking-tight"
            style={{ fontFamily: theme.fontHeading, color: colors.text }}
          >
            {content.hero.headline.split(' ').map((word, i, arr) =>
              i === Math.floor(arr.length / 2) || i === Math.floor(arr.length / 2) - 1 ? (
                <span
                  key={i}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {word}{' '}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>
        </AnimateIn>

        <AnimateIn delay={200}>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: colors.textMuted }}>
            {content.hero.subheadline}
          </p>
        </AnimateIn>

        <AnimateIn delay={300}>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={ctaHref}
              className="px-8 py-3.5 font-semibold text-sm transition-all hover:scale-105 hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                color: '#fff',
                borderRadius: radius,
                boxShadow: `0 8px 32px ${colors.primary}40`,
              }}
            >
              {content.hero.ctaText}
            </a>
            <a
              href="#about"
              className="px-8 py-3.5 font-semibold text-sm border-2 transition-all hover:scale-105"
              style={{ borderColor: `${colors.primary}30`, color: colors.text, borderRadius: radius }}
            >
              {content.hero.ctaSecondary}
            </a>
          </div>
        </AnimateIn>

        {/* Stats */}
        <AnimateIn delay={500}>
          <div
            className="mt-16 inline-flex gap-12 px-10 py-6 border rounded-2xl"
            style={{
              borderColor: colors.border,
              background: colors.surface,
              boxShadow: `0 4px 40px ${colors.primary}08`,
            }}
          >
            <StatBadge label="Est." value={`${new Date().getFullYear() - 5}+`} color={colors.primary} />
            <div className="w-px" style={{ background: colors.border }} />
            <StatBadge label="Clients" value="200+" color={colors.primary} />
            <div className="w-px" style={{ background: colors.border }} />
            <StatBadge label="Rating" value="4.9★" color={colors.primary} />
          </div>
        </AnimateIn>
      </div>

      <style>{`
        @keyframes aurora-drift {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.2); }
        }
      `}</style>
    </section>
  )
}

// ─── Neo Dark ─────────────────────────────────────────────────────────────────

function NeoHero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: colors.background }}
    >
      {/* Grid + glow */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(${colors.primary}33 1px, transparent 1px), linear-gradient(90deg, ${colors.primary}33 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: colors.primary }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <AnimateIn delay={0}>
          <span
            className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-[0.3em] mb-8"
            style={{ color: colors.primary, border: `1px solid ${colors.primary}40` }}
          >
            {content.category}
          </span>
        </AnimateIn>

        <AnimateIn delay={100}>
          <h1
            className="text-5xl md:text-8xl font-black leading-[0.95] mb-6 uppercase tracking-tight"
            style={{ fontFamily: theme.fontHeading, color: colors.text }}
          >
            <span style={{ color: colors.primary, textShadow: `0 0 40px ${colors.primary}80` }}>
              {content.hero.headline.split(' ')[0]}
            </span>{' '}
            {content.hero.headline.split(' ').slice(1).join(' ')}
          </h1>
        </AnimateIn>

        <AnimateIn delay={200}>
          <p className="text-base font-mono max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: colors.textMuted }}>
            {content.hero.subheadline}
          </p>
        </AnimateIn>

        <AnimateIn delay={300}>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={ctaHref}
              className="px-8 py-4 font-black text-sm uppercase tracking-widest transition-all hover:scale-105"
              style={{
                background: colors.primary,
                color: '#000',
                boxShadow: `0 0 40px ${colors.primary}60`,
              }}
            >
              {content.hero.ctaText}
            </a>
            <a
              href="#about"
              className="px-8 py-4 font-bold text-sm uppercase tracking-widest border transition-all hover:scale-105"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              {content.hero.ctaSecondary}
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

// ─── Golden Editorial ─────────────────────────────────────────────────────────

function GoldenHero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <section className="min-h-screen flex flex-col md:flex-row pt-16">
      {/* Left — dark editorial */}
      <div
        className="flex-1 flex items-end p-12 md:p-16 pb-16"
        style={{ background: '#111111', minHeight: '60vh' }}
      >
        <AnimateIn delay={100} direction="left">
          <div>
            <p
              className="text-xs uppercase tracking-[0.4em] mb-8"
              style={{ color: colors.primary }}
            >
              {content.category} · Est. {new Date().getFullYear() - 10}
            </p>
            <h1
              className="text-5xl md:text-7xl font-normal leading-[1.05] mb-8"
              style={{ fontFamily: theme.fontHeading, color: '#fff', letterSpacing: '-0.01em' }}
            >
              {content.hero.headline}
            </h1>
            <div className="flex gap-1 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ color: colors.primary, fontSize: '20px' }}>★</span>
              ))}
            </div>
            <div className="flex gap-4">
              <a
                href={ctaHref}
                className="px-8 py-3.5 font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: colors.primary, color: '#111' }}
              >
                {content.hero.ctaText}
              </a>
              <a
                href="#about"
                className="px-8 py-3.5 font-semibold text-sm border transition-all hover:opacity-90"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
              >
                {content.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </AnimateIn>
      </div>

      {/* Right — ivory */}
      <div
        className="flex-1 flex items-center p-12 md:p-16"
        style={{ background: colors.background }}
      >
        <AnimateIn delay={300} direction="right">
          <div>
            <p
              className="text-6xl font-light mb-6 leading-none"
              style={{ fontFamily: theme.fontHeading, color: colors.primary }}
            >
              &ldquo;
            </p>
            <p
              className="text-xl leading-relaxed mb-8"
              style={{ fontFamily: theme.fontHeading, color: colors.text, fontStyle: 'italic' }}
            >
              {content.hero.subheadline}
            </p>
            <div className="flex gap-10">
              <StatBadge label="Years" value="15+" color={colors.primary} />
              <StatBadge label="Cases" value="500+" color={colors.primary} />
              <StatBadge label="Rate" value="98%" color={colors.primary} />
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

// ─── Emerald Minimal ──────────────────────────────────────────────────────────

function EmeraldHero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'
  const radius = cardRadius(theme.cardStyle)

  return (
    <section
      className="min-h-screen flex flex-col md:flex-row items-stretch pt-16"
      style={{ background: colors.background }}
    >
      <div className="flex-1 flex items-center justify-center p-12 md:p-16">
        <AnimateIn delay={100}>
          <div className="max-w-xl">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 px-3 py-1.5 rounded-full"
              style={{ background: `${colors.primary}15`, color: colors.primary }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.primary }} />
              {content.category}
            </span>
            <h1
              className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6"
              style={{ fontFamily: theme.fontHeading, color: colors.text }}
            >
              {content.hero.headline}
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: colors.textMuted }}>
              {content.hero.subheadline}
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href={ctaHref}
                className="px-7 py-3.5 font-semibold text-sm transition-all hover:scale-105"
                style={{ background: colors.primary, color: '#fff', borderRadius: radius, boxShadow: `0 8px 24px ${colors.primary}40` }}
              >
                {content.hero.ctaText}
              </a>
              <a
                href="#about"
                className="px-7 py-3.5 font-semibold text-sm border transition-all hover:scale-105"
                style={{ borderColor: `${colors.primary}40`, color: colors.primary, borderRadius: radius }}
              >
                {content.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </AnimateIn>
      </div>

      {/* Right — decorative */}
      <div
        className="flex-1 flex items-center justify-center p-12 relative overflow-hidden"
        style={{ background: `${colors.primary}10` }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.primary}40 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
        <AnimateIn delay={300}>
          <div
            className="relative z-10 text-center p-10 rounded-3xl"
            style={{ background: '#fff', boxShadow: `0 24px 80px ${colors.primary}20` }}
          >
            <p className="text-6xl mb-4">🌿</p>
            <p
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: theme.fontHeading, color: colors.text }}
            >
              {content.businessName}
            </p>
            <p className="text-sm" style={{ color: colors.textMuted }}>{content.tagline}</p>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

// ─── Clay UI ──────────────────────────────────────────────────────────────────

function ClayHero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: colors.background }}
    >
      {/* Clay blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-2xl"
          style={{
            background: colors.accent,
            top: '-15%', right: '-10%',
            animation: 'blob-float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-20 blur-2xl"
          style={{
            background: colors.primary,
            bottom: '-10%', left: '-5%',
            animation: 'blob-float 10s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <AnimateIn delay={0}>
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-8"
            style={{
              background: '#fff',
              color: colors.primary,
              boxShadow: `0 8px 32px ${colors.primary}25`,
            }}
          >
            ✨ {content.category}
          </div>
        </AnimateIn>

        <AnimateIn delay={150}>
          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6"
            style={{ fontFamily: theme.fontHeading, color: colors.text }}
          >
            {content.hero.headline}
          </h1>
        </AnimateIn>

        <AnimateIn delay={250}>
          <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: colors.textMuted }}>
            {content.hero.subheadline}
          </p>
        </AnimateIn>

        <AnimateIn delay={350}>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={ctaHref}
              className="px-8 py-4 font-bold text-sm text-white rounded-full transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
              style={{ background: colors.primary, boxShadow: `0 12px 40px ${colors.primary}50` }}
            >
              {content.hero.ctaText}
            </a>
            <a
              href="#about"
              className="px-8 py-4 font-bold text-sm rounded-full border-2 transition-all hover:scale-105 active:scale-95"
              style={{ borderColor: colors.primary, color: colors.primary, background: '#fff' }}
            >
              {content.hero.ctaSecondary}
            </a>
          </div>
        </AnimateIn>
      </div>

      <style>{`
        @keyframes blob-float {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
      `}</style>
    </section>
  )
}

// ─── Mono Brutalist ───────────────────────────────────────────────────────────

function BrutalistHero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <section
      className="min-h-screen flex items-end pb-16 pt-24 px-6 relative overflow-hidden"
      style={{ background: colors.background }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div
          className="text-xs font-mono uppercase tracking-[0.5em] mb-8 px-4 py-2 inline-block"
          style={{ background: colors.primary, color: '#000' }}
        >
          {content.category}
        </div>

        <h1
          className="text-6xl md:text-[8rem] font-black leading-[0.9] uppercase mb-8"
          style={{ fontFamily: theme.fontHeading, color: colors.text, letterSpacing: '-0.02em' }}
        >
          {content.hero.headline.split(' ').map((w, i) => (
            <span key={i}>
              {i % 2 === 0 ? (
                w
              ) : (
                <span style={{ color: colors.primary, WebkitTextStroke: `2px ${colors.primary}`, WebkitTextFillColor: 'transparent' }}>
                  {w}
                </span>
              )}{' '}
            </span>
          ))}
        </h1>

        <div className="flex flex-wrap items-center gap-8 mt-8">
          <a
            href={ctaHref}
            className="px-10 py-4 font-black text-sm uppercase tracking-widest transition-all hover:opacity-90"
            style={{ background: colors.primary, color: '#000' }}
          >
            {content.hero.ctaText}
          </a>
          <p
            className="text-base font-mono max-w-sm leading-relaxed"
            style={{ color: colors.textMuted }}
          >
            {content.hero.subheadline}
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Scandinavian ─────────────────────────────────────────────────────────────

function ScandinavianHero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <section
      className="min-h-screen flex items-center pt-16"
      style={{ background: colors.background }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 items-center">
        <AnimateIn delay={100}>
          <div>
            <p
              className="text-xs uppercase tracking-[0.4em] mb-6"
              style={{ color: colors.textMuted }}
            >
              {content.category}
            </p>
            <h1
              className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6"
              style={{ fontFamily: theme.fontHeading, color: colors.text, letterSpacing: '-0.02em' }}
            >
              {content.hero.headline}
            </h1>
            <p className="text-lg leading-relaxed mb-10" style={{ color: colors.textMuted }}>
              {content.hero.subheadline}
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href={ctaHref}
                className="px-8 py-3.5 font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: colors.text, borderRadius: '8px' }}
              >
                {content.hero.ctaText}
              </a>
              <a
                href="#about"
                className="px-8 py-3.5 font-semibold text-sm transition-all hover:opacity-80"
                style={{ color: colors.textMuted, textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                {content.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={300} direction="right">
          <div
            className="aspect-square rounded-3xl flex items-center justify-center relative overflow-hidden"
            style={{ background: colors.border }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `linear-gradient(45deg, ${colors.textMuted}08 25%, transparent 25%), linear-gradient(-45deg, ${colors.textMuted}08 25%, transparent 25%)`,
                backgroundSize: '8px 8px',
              }}
            />
            <div className="relative z-10 text-center p-10">
              <p className="text-6xl mb-4">📐</p>
              <p className="font-bold text-xl" style={{ color: colors.text }}>{content.businessName}</p>
              <p className="text-sm mt-2" style={{ color: colors.textMuted }}>{content.tagline}</p>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

// ─── Liquid Motion ────────────────────────────────────────────────────────────

function LiquidHero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: colors.background }}
    >
      {/* Liquid gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-40 blur-3xl"
          style={{
            background: `conic-gradient(from 0deg, ${colors.primary}, ${colors.secondary}, ${colors.accent}, ${colors.primary})`,
            top: '-20%', left: '-20%',
            animation: 'liquid-spin 20s linear infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
          style={{
            background: `conic-gradient(from 180deg, ${colors.secondary}, ${colors.accent}, ${colors.primary})`,
            bottom: '-20%', right: '-15%',
            animation: 'liquid-spin 15s linear infinite reverse',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <AnimateIn delay={0}>
          <span
            className="inline-block text-sm font-medium mb-6 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            {content.category}
          </span>
        </AnimateIn>

        <AnimateIn delay={150}>
          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6"
            style={{
              fontFamily: theme.fontHeading,
              background: `linear-gradient(135deg, #fff 0%, ${colors.accent} 50%, #fff 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {content.hero.headline}
          </h1>
        </AnimateIn>

        <AnimateIn delay={250}>
          <p
            className="text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {content.hero.subheadline}
          </p>
        </AnimateIn>

        <AnimateIn delay={350}>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={ctaHref}
              className="px-8 py-4 font-bold text-sm rounded-full transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: colors.primary,
                boxShadow: '0 8px 40px rgba(255,255,255,0.3)',
              }}
            >
              {content.hero.ctaText}
            </a>
            <a
              href="#about"
              className="px-8 py-4 font-bold text-sm rounded-full border-2 transition-all hover:scale-105"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
            >
              {content.hero.ctaSecondary}
            </a>
          </div>
        </AnimateIn>
      </div>

      <style>{`
        @keyframes liquid-spin {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          to { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </section>
  )
}

// ─── Cinematic ────────────────────────────────────────────────────────────────

function CinematicHero({ content, theme }: HeroProps) {
  const colors = resolveColors(content, theme)
  const ctaHref = content.contact.phone ? `tel:${content.contact.phone}` : '#contact'

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: colors.background }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${colors.accent}30, transparent 70%), radial-gradient(ellipse at 70% 50%, ${colors.primary}20, transparent 70%)`,
          animation: 'cinematic-zoom 20s ease-in-out infinite alternate',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <AnimateIn delay={0}>
          <p
            className="text-xs uppercase tracking-[0.6em] mb-8"
            style={{ color: colors.accent }}
          >
            {content.category}
          </p>
        </AnimateIn>
        <AnimateIn delay={150}>
          <h1
            className="text-5xl md:text-8xl font-light leading-[1.0] mb-8"
            style={{
              fontFamily: theme.fontHeading,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            {content.hero.headline.split(' ').slice(0, 3).join(' ')}{' '}
            <span style={{ color: colors.accent }}>
              {content.hero.headline.split(' ').slice(3).join(' ')}
            </span>
          </h1>
        </AnimateIn>
        <AnimateIn delay={300}>
          <p className="text-lg max-w-xl mx-auto mb-12" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {content.hero.subheadline}
          </p>
        </AnimateIn>
        <AnimateIn delay={450}>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={ctaHref}
              className="px-10 py-4 font-semibold text-sm transition-all hover:scale-105 rounded-full"
              style={{ background: colors.accent, color: '#0D1B2A' }}
            >
              {content.hero.ctaText}
            </a>
            <a
              href="#about"
              className="px-10 py-4 font-semibold text-sm border transition-all hover:scale-105 rounded-full"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
            >
              {content.hero.ctaSecondary}
            </a>
          </div>
        </AnimateIn>
      </div>

      <style>{`
        @keyframes cinematic-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
      `}</style>
    </section>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function Hero({ content, theme }: HeroProps) {
  switch (theme.variant) {
    case 'neo-dark': return <NeoHero content={content} theme={theme} />
    case 'golden-editorial': return <GoldenHero content={content} theme={theme} />
    case 'emerald-minimal': return <EmeraldHero content={content} theme={theme} />
    case 'clay-ui': return <ClayHero content={content} theme={theme} />
    case 'mono-brutalist': return <BrutalistHero content={content} theme={theme} />
    case 'scandinavian': return <ScandinavianHero content={content} theme={theme} />
    case 'liquid-motion': return <LiquidHero content={content} theme={theme} />
    case 'cinematic': return <CinematicHero content={content} theme={theme} />
    default: return <AuroraHero content={content} theme={theme} />
  }
}
