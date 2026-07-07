import type { SiteContent } from '@scoutiq/site-shared'
import type { GymColors } from '@/lib/theme'

interface FooterProps {
  content: SiteContent
  colors: GymColors
}

export function GymFooter({ content, colors }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="px-6 pt-16 pb-10 border-t" style={{ background: colors.background, borderColor: colors.border }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Brand */}
          <a href="#home" className="flex items-center gap-2">
            <span className="text-xl" style={{ color: colors.primary }}>⚡</span>
            <span className="font-display text-xl font-bold uppercase tracking-wide text-white">
              {content.businessName}
            </span>
          </a>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              { href: '#programs', label: 'Programs' },
              { href: '#schedule', label: 'Schedule' },
              { href: '#about', label: 'About' },
              { href: '#contact', label: 'Contact' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-light border-t"
          style={{ borderColor: colors.border, color: colors.textMuted }}
        >
          <p>© {year} {content.businessName}. All rights reserved.</p>
          <p>
            Preview powered by <strong style={{ color: colors.primary }}>ScoutIQ</strong>
          </p>
        </div>
      </div>
    </footer>
  )
}
