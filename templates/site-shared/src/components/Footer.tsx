import type { SiteContent, SiteTheme } from '../types'
import { resolveColors } from '../utils'

export function Footer({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)
  const year = new Date().getFullYear()

  return (
    <footer
      className="py-10 px-6 text-center text-sm"
      style={{
        background: theme.dark ? '#000' : colors.primary,
        color: theme.dark ? colors.textMuted : 'rgba(255,255,255,0.85)',
      }}
    >
      <p className="font-semibold text-base mb-1" style={{ color: theme.dark ? colors.text : '#fff' }}>
        {content.businessName}
      </p>
      <p className="mb-4 opacity-80">{content.tagline}</p>
      <p className="opacity-60">
        © {year} {content.businessName}. Preview site powered by ScoutIQ.
      </p>
    </footer>
  )
}

export function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">⏳</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Preview Expired</h1>
        <p className="text-slate-500">This free website preview is no longer available.</p>
      </div>
    </div>
  )
}

export function Nav({ content, theme }: { content: SiteContent; theme: SiteTheme }) {
  const colors = resolveColors(content, theme)

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4"
      style={{
        background: theme.dark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        borderColor: `${colors.primary}20`,
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="font-bold text-lg" style={{ fontFamily: theme.fontHeading, color: colors.primary }}>
          {content.businessName}
        </span>
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          <a href="#services" style={{ color: colors.textMuted }} className="hover:opacity-80">Services</a>
          <a href="#about" style={{ color: colors.textMuted }} className="hover:opacity-80">About</a>
          <a href="#contact" style={{ color: colors.textMuted }} className="hover:opacity-80">Contact</a>
        </nav>
      </div>
    </header>
  )
}
