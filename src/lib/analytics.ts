// Minimal Google Analytics (GA4) helper using gtag.js
// Loads gtag only when a VITE_GA_MEASUREMENT_ID is provided.
export const initGA = (measurementId?: string) => {
  if (!measurementId) return
  if (typeof window === 'undefined') return

  // Avoid injecting multiple times for the same id
  const src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  if (!document.querySelector(`script[src="${src}"]`)) {
    const s = document.createElement('script')
    s.async = true
    s.src = src
    document.head.appendChild(s)
  }

  ;(window as any).dataLayer = (window as any).dataLayer || []
  function gtag(...args: any[]) {
    ;(window as any).dataLayer.push(args)
  }
  // expose gtag so other modules can use it
  ;(window as any).gtag = (window as any).gtag || gtag
  ;(window as any).gtag('js', new Date())
  ;(window as any).gtag('config', measurementId, { page_path: window.location.pathname })
}

export const trackPage = (path = window.location.pathname) => {
  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', 'page_view', { page_path: path })
  }
}

export const trackEvent = (name: string, params?: Record<string, any>) => {
  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', name, params || {})
  }
}
