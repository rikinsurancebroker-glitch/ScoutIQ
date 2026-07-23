import type { SiteTheme } from './types'
import { fetchSiteContent } from './fetch'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { About } from './components/About'
import { Testimonials } from './components/Testimonials'
import { Contact } from './components/Contact'
import { Footer, ExpiredPage, Nav } from './components/Footer'
import { UnavailablePage } from './components/UnavailablePage'
import { resolveColors } from './utils'

interface SitePageProps {
  businessId: string
  theme: SiteTheme
}

export async function SitePage({ businessId, theme }: SitePageProps) {
  const result = await fetchSiteContent(businessId)

  if (result.status === 'unavailable') {
    return <UnavailablePage businessId={businessId} />
  }
  if (result.status === 'expired') {
    return <ExpiredPage />
  }

  const content = result.content
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
