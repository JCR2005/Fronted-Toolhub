import { FileText } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Img2PDF</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#upload" className="text-gray-600 hover:text-gray-900 transition-colors">
              Convertir
            </a>
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Características
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              Cómo funciona
            </a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
              Ayuda
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href="#upload"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subir imágenes
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}