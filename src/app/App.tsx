import { useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { trackPage } from '../lib/analytics'
import { CookieConsent } from './components/CookieConsent'

// Small helper: emit a custom event whenever history.pushState/replaceState is called
function bindHistoryListener() {
  const wrap = (type: 'pushState' | 'replaceState') => {
    const orig = (history as any)[type]
    return function (this: any, ...args: any[]) {
      const result = orig.apply(this, args)
      window.dispatchEvent(new Event('locationchange'))
      return result
    }
  }
  if (!(history as any).__analytics_wrapped) {
    ;(history as any).pushState = wrap('pushState')
    ;(history as any).replaceState = wrap('replaceState')
    ;(history as any).__analytics_wrapped = true
  }
}

export default function App() {
  useEffect(() => {
    // Initial page view
    try {
      trackPage(window.location.pathname)
    } catch (e) {
      // ignore if analytics not initialized
    }

    // Bind history changes for SPA-style navigation
    bindHistoryListener()

    const onLocationChange = () => {
      try {
        trackPage(window.location.pathname)
      } catch (e) {
        // noop
      }
    }

    window.addEventListener('popstate', onLocationChange)
    window.addEventListener('locationchange', onLocationChange)

    return () => {
      window.removeEventListener('popstate', onLocationChange)
      window.removeEventListener('locationchange', onLocationChange)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  )
}
