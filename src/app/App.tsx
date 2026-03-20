import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { QrGenerator } from './components/QrGenerator'
import { trackPage } from '../lib/analytics'

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
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname))

  useEffect(() => {
    const onLocationChange = () => {
      setRoute(normalizeRoute(window.location.pathname))
      try {
        trackPage(window.location.pathname)
      } catch (e) {
        // noop
      }
    }

    // Initial page view
    onLocationChange()

    // Bind history changes for SPA-style navigation
    bindHistoryListener()

    window.addEventListener('popstate', onLocationChange)
    window.addEventListener('locationchange', onLocationChange)

    return () => {
      window.removeEventListener('popstate', onLocationChange)
      window.removeEventListener('locationchange', onLocationChange)
    }
  }, [])

  const navigate = (path: string) => {
    const next = normalizeRoute(path)
    if (next === route) return
    window.history.pushState({}, '', next)
    setRoute(next)
    try {
      trackPage(next)
    } catch (e) {}
  }

  const renderRoute = () => {
    if (route === '/generador-qr') {
      return <QrGenerator />
    }
    // default: imágenes a PDF
    return (
      <>
        <Hero />
        <HowItWorks />
        <Features />
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar currentRoute={route} onNavigate={navigate} />
      <main className="flex-1">
        {renderRoute()}
      </main>
      <Footer />
    </div>
  )
}

function normalizeRoute(path: string) {
  if (path === '/generador-qr') return '/generador-qr'
  // default route for imágenes a pdf
  return '/img-a-pdf'
}
