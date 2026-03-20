import React from 'react'
import { FileText } from 'lucide-react'

type NavbarProps = {
  currentRoute: string
  onNavigate: (path: string) => void
}

const links = [
  { label: 'Imágenes a PDF', path: '/img-a-pdf' },
  { label: 'Generador QR', path: '/generador-qr' },
]

export function Navbar({ currentRoute, onNavigate }: NavbarProps) {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    onNavigate(path)
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Toolhub</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNav(e, link.path)}
                className={`text-sm font-medium transition-colors ${
                  currentRoute === link.path ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/img-a-pdf"
              onClick={(e) => handleNav(e, '/img-a-pdf')}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              Ir a herramientas
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}