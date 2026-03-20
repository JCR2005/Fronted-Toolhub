import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export function QrGenerator() {
  const [value, setValue] = useState('https://toolhub502.netlify.app')
  const [size, setSize] = useState(220)

  const downloadPng = () => {
    const canvas = document.querySelector('#qr-preview canvas') as HTMLCanvasElement | null
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'qr-code.png'
    link.click()
  }

  return (
    <section className="w-full bg-gradient-to-b from-purple-50 to-white py-16 px-4" id="generador-qr">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            Nueva herramienta
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Genera códigos QR en segundos
          </h1>
          <p className="text-lg text-gray-600">
            Pega un enlace o cualquier texto y obtén un QR listo para descargar como PNG.
          </p>

          <div className="space-y-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Texto o URL</label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://tu-sitio.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tamaño: {size}px</label>
              <input
                type="range"
                min={120}
                max={420}
                step={10}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadPng}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
              >
                Descargar PNG
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(value || '')}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50"
              >
                Copiar texto
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            id="qr-preview"
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center gap-4"
          >
            <QRCodeCanvas
              value={value || ' '}
              size={size}
              level="H"
              includeMargin
            />
            <div className="text-sm text-gray-600">Nivel de corrección: alto (H)</div>
          </div>
        </div>
      </div>
    </section>
  )
}
