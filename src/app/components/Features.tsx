import { 
  Sparkles, 
  Lock, 
  Zap, 
  Cloud, 
  FileCheck, 
  Palette 
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'Formato Perfecto',
  description: 'Mantén tus imágenes nítidas con un PDF final listo para compartir o imprimir.',
    },
    {
      icon: Lock,
      title: 'Seguridad Bancaria',
  description: 'Tus archivos están encriptados con SSL de 256 bits. Se eliminan automáticamente después de la conversión.',
    },
    {
      icon: Zap,
      title: 'Súper Rápido',
  description: 'Convierte lotes de imágenes en segundos. Sin esperas, sin colas, resultados instantáneos.',
    },
    {
      icon: Cloud,
      title: 'Procesamiento en la Nube',
  description: 'Toda la conversión ocurre en la nube. No necesitas instalar software ni requisitos del sistema.',
    },
    {
      icon: FileCheck,
      title: 'Alta Precisión',
  description: 'PDFs consistentes con páginas ordenadas y tamaño optimizado.',
    },
    {
      icon: Palette,
      title: 'Preserva el Diseño',
  description: 'Mantiene colores y proporciones para un resultado profesional.',
    },
  ];

  return (
    <section id="features" className="w-full bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Características Potentes
          </h2>
          <p className="text-xl text-gray-600">
            Todo lo que necesitas para una conversión perfecta de imágenes a PDF
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}