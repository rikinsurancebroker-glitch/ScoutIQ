import type { SiteContent } from '@scoutiq/site-shared'
import type { SiteColors } from '@/lib/theme'
import { AnimateIn } from './AnimateIn'

export function ContactSection({ content, colors }: { content: SiteContent; colors: SiteColors }) {
  const { contact, hours, social } = content

  const socialLinks = [
    { label: 'Instagram', url: social.instagram },
    { label: 'Facebook', url: social.facebook },
    { label: 'Yelp', url: social.yelp },
  ].filter((s) => s.url)

  const openToday = hours.find((h) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return h.day === days[new Date().getDay()]
  })

  return (
    <section id="contact" className="py-24 md:py-32 px-6" style={{ background: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-4"
              style={{ color: colors.primary }}
            >
              Visit Us
            </p>
            <h2
              className="font-display text-4xl md:text-5xl font-bold"
              style={{ color: colors.text }}
            >
              Get In Touch
            </h2>
          </div>
        </AnimateIn>

        <div className="grid lg:grid-cols-5 gap-8">
          <AnimateIn className="lg:col-span-2">
            <div
              className="p-8 md:p-10 rounded-3xl h-full shadow-card border"
              style={{ background: colors.surface, borderColor: `${colors.primary}10` }}
            >
              <h3 className="font-display text-2xl font-bold mb-8" style={{ color: colors.text }}>
                Contact Details
              </h3>

              <div className="space-y-7">
                {contact.phone && (
                  <div className="group">
                    <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: colors.textMuted }}>
                      Phone
                    </p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-xl font-semibold transition-colors hover:opacity-80"
                      style={{ color: colors.primary }}
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.email && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: colors.textMuted }}>
                      Email
                    </p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-lg font-medium"
                      style={{ color: colors.primary }}
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.address && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: colors.textMuted }}>
                      Address
                    </p>
                    <p className="text-lg leading-relaxed" style={{ color: colors.text }}>
                      {contact.address}
                    </p>
                  </div>
                )}
              </div>

              {contact.whatsapp && (
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white text-sm transition-transform hover:scale-105"
                  style={{ background: '#25D366' }}
                >
                  Chat on WhatsApp
                </a>
              )}

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t" style={{ borderColor: `${colors.primary}15` }}>
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium rounded-full border transition-all hover:scale-105"
                      style={{ borderColor: colors.primary, color: colors.primary }}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </AnimateIn>

          <AnimateIn delay={120} className="lg:col-span-3 space-y-6">
            {openToday && (
              <div
                className="flex items-center gap-4 px-6 py-4 rounded-2xl"
                style={{ background: `${colors.accent}30` }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <p className="font-medium" style={{ color: colors.text }}>
                  Today ({openToday.day}):{' '}
                  <span style={{ color: colors.primary }}>{openToday.hours}</span>
                </p>
              </div>
            )}

            {hours.length > 0 && (
              <div
                className="p-8 md:p-10 rounded-3xl shadow-card border"
                style={{ background: colors.surface, borderColor: `${colors.primary}10` }}
              >
                <h3 className="font-display text-2xl font-bold mb-6" style={{ color: colors.text }}>
                  Opening Hours
                </h3>
                <dl className="space-y-3">
                  {hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between items-center py-3 border-b last:border-0"
                      style={{ borderColor: `${colors.primary}08` }}
                    >
                      <dt className="font-medium" style={{ color: colors.text }}>
                        {h.day}
                      </dt>
                      <dd className="text-sm font-semibold" style={{ color: colors.primary }}>
                        {h.hours}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {contact.mapEmbed && (
              <div className="overflow-hidden rounded-3xl shadow-card border" style={{ borderColor: `${colors.primary}10` }}>
                <iframe
                  src={contact.mapEmbed}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Map"
                />
              </div>
            )}
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
