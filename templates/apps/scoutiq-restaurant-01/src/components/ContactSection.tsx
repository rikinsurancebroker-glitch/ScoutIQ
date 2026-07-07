import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'
import { AnimateIn } from './AnimateIn'

interface ContactProps {
  content: SiteContent
  colors: SiteColors
}

export function ContactSection({ content, colors }: ContactProps) {
  const { contact, hours, social } = content

  const socialLinks = [
    { label: 'Instagram', url: social.instagram },
    { label: 'Facebook', url: social.facebook },
    { label: 'YouTube', url: social.youtube },
    { label: 'Twitter', url: social.twitter },
    { label: 'Yelp', url: social.yelp },
  ].filter((s) => s.url)

  return (
    <section id="contact" className="py-24 md:py-32 px-6" style={{ background: colors.surface }}>
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-[12px] font-medium uppercase tracking-[0.4em] mb-4" style={{ color: colors.primary }}>
              Visit Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-6" style={{ color: colors.dark }}>
              Find Your Way to Us
            </h2>
            <div className="gold-rule mx-auto" />
          </div>
        </AnimateIn>

        <div className="grid md:grid-cols-3 gap-10 md:gap-6 mb-16 text-center">
          {/* Address */}
          {contact.address && (
            <AnimateIn delay={0}>
              <div className="px-4">
                <p className="text-2xl mb-4" style={{ color: colors.primary }}>⚲</p>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: colors.dark }}>
                  Address
                </h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: colors.textMuted }}>
                  {contact.address}
                </p>
              </div>
            </AnimateIn>
          )}

          {/* Contact */}
          <AnimateIn delay={120}>
            <div className="px-4">
              <p className="text-2xl mb-4" style={{ color: colors.primary }}>✆</p>
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: colors.dark }}>
                Contact
              </h3>
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="block text-sm font-light mb-1.5 transition-opacity hover:opacity-70" style={{ color: colors.textMuted }}>
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block text-sm font-light transition-opacity hover:opacity-70" style={{ color: colors.textMuted }}>
                  {contact.email}
                </a>
              )}
            </div>
          </AnimateIn>

          {/* Hours */}
          {hours.length > 0 && (
            <AnimateIn delay={240}>
              <div className="px-4">
                <p className="text-2xl mb-4" style={{ color: colors.primary }}>◷</p>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.3em] mb-3" style={{ color: colors.dark }}>
                  Opening Hours
                </h3>
                <dl className="space-y-1.5">
                  {hours.map((h) => (
                    <div key={h.day} className="text-sm font-light" style={{ color: colors.textMuted }}>
                      <dt className="inline">{h.day}: </dt>
                      <dd className="inline" style={{ color: colors.text }}>{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </AnimateIn>
          )}
        </div>

        {/* Socials */}
        {socialLinks.length > 0 && (
          <AnimateIn>
            <div className="flex flex-wrap justify-center gap-3 mb-14">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] border transition-all duration-300 hover:-translate-y-0.5"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </AnimateIn>
        )}

        {/* Map */}
        {contact.mapEmbed && (
          <AnimateIn>
            <div className="shadow-card border-8 border-white">
              <iframe
                src={contact.mapEmbed}
                width="100%"
                height="360"
                style={{ border: 0, display: 'block', filter: 'grayscale(60%)' }}
                loading="lazy"
                title="Map"
              />
            </div>
          </AnimateIn>
        )}
      </div>
    </section>
  )
}
