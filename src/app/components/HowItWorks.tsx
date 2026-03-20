import { Upload, Cog, Download } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
  title: 'Sube tus Imágenes',
  description: 'Arrastra y suelta tus imágenes (JPG, PNG o WebP) o haz clic para seleccionarlas.',
      color: 'blue',
    },
    {
      icon: Cog,
  title: 'Conversión Automática',
  description: 'Nuestro motor crea un PDF limpio con la mejor calidad y orden.',
      color: 'purple',
    },
    {
      icon: Download,
  title: 'Descarga PDF',
  description: 'Obtén tu PDF listo para compartir en segundos. ¡Listo para enviar!',
      color: 'green',
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cómo Funciona
          </h2>
          <p className="text-xl text-gray-600">
            Convierte tus imágenes en tres simples pasos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              green: 'bg-green-100 text-green-600',
            }[step.color];

            return (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`w-20 h-20 ${colorClasses} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  
                  <div className="absolute top-8 left-1/2 w-full hidden md:block">
                    {index < steps.length - 1 && (
                      <div className="border-t-2 border-dashed border-gray-300 w-full"></div>
                    )}
                  </div>

                  <div className="relative bg-white">
                    <div className="inline-block bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center mb-3">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}