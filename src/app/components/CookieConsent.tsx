import { useEffect, useState } from 'react'
import { initGA } from '../../lib/analytics'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const status = localStorage.getItem('cookie_consent')
      if (status === 'granted') {
        // If already granted, init GA immediately (if measurement id present)
        const id = (import.meta as any).env.VITE_GA_MEASUREMENT_ID
        if (id) initGA(id)
        setVisible(false)
        return
      }
    } catch (e) {
      // ignore localStorage errors
    }

    // show banner if no decision yet
    setVisible(true)
  }, [])

  const accept = () => {
    try {
      localStorage.setItem('cookie_consent', 'granted')
    } catch (e) {}
    const id = (import.meta as any).env.VITE_GA_MEASUREMENT_ID
    if (id) initGA(id)
    setVisible(false)
  }

  const decline = () => {
    try {
      localStorage.setItem('cookie_consent', 'denied')
    } catch (e) {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-50 max-w-xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="flex-1 text-sm text-gray-800">
          Usamos cookies para mejorar la experiencia y analizar el uso del sitio. ¿Aceptas
          que usemos Google Analytics para medir visitas?
        </div>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Aceptar
          </button>
          <button
            onClick={decline}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  )
}
