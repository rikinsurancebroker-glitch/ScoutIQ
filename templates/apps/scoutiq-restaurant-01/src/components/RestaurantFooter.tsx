import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'

export function RestaurantFooter({ content, colors }: { content: SiteContent; colors: SiteColors }) {
  const year = new Date().getFullYear()

  return (
    <footer
      className="pt-16 pb-8 px-6"
      style={{ background: colors.secondary }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <p className="font-display text-2xl font-bold text-white mb-3">
              {content.businessName}
            </p>
            <p className="text-white/60 leading-relaxed">{content.tagline}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-4">Navigate</p>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Menu', href: '#menu' },
                { label: 'Our Story', href: '#story' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-4">Contact</p>
            {content.contact.address && (
              <p className="text-white/60 text-sm leading-relaxed mb-2">{content.contact.address}</p>
            )}
            {content.contact.phone && (
              <a href={`tel:${content.contact.phone}`} className="text-white/80 text-sm hover:text-white">
                {content.contact.phone}
              </a>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {year} {content.businessName}. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">Preview site powered by ScoutIQ</p>
        </div>
      </div>
    </footer>
  )
}
