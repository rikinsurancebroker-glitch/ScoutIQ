import type { SiteTheme } from './types'
import { buildMockSiteContent } from './mockContent'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { About } from './components/About'
import { Testimonials } from './components/Testimonials'
import { Contact } from './components/Contact'
import { Footer, Nav } from './components/Footer'
import { resolveColors } from './utils'

interface PreviewSitePageProps {
  theme: SiteTheme
}

/** Renders the template with built-in sample data — no business ID or API needed. */
export function PreviewSitePage({ theme }: PreviewSitePageProps) {
  const content = buildMockSiteContent(theme)
  const colors = resolveColors(content, theme)

  return (
    <div
      style={{
        fontFamily: theme.fontBody,
        color: colors.text,
        background: colors.background,
        scrollBehavior: 'smooth',
      }}
    >
      <div
        style={{
          background: theme.palette.primary,
          color: theme.dark ? '#fff' : theme.palette.text,
          textAlign: 'center',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >
        Design preview — sample data only. Use <code style={{ opacity: 0.9 }}>/{'{businessId}'}</code> for a live
        generated site.
      </div>
      <Nav content={content} theme={theme} />
      <Hero content={content} theme={theme} />
      <div id="services">
        <Services content={content} theme={theme} />
      </div>
      <div id="about">
        <About content={content} theme={theme} />
      </div>
      <Testimonials content={content} theme={theme} />
      <Contact content={content} theme={theme} />
      <Footer content={content} theme={theme} />
    </div>
  )
}
