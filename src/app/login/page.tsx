"use client";

import { useState, useEffect } from 'react';
import { 
  WrenchScrewdriverIcon, 
  CodeBracketIcon, 
  RocketLaunchIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  BeakerIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: <CpuChipIcon className="h-8 w-8" />,
    title: "Arquitectura Moderna",
    description: "Construido con Next.js 14 y React 18"
  },
  {
    icon: <ShieldCheckIcon className="h-8 w-8" />,
    title: "Seguro y Estable",
    description: "Tipado TypeScript y validaciones robustas"
  },
  {
    icon: <BeakerIcon className="h-8 w-8" />,
    title: "En Constante Mejora",
    description: "Testing y optimizaciones continuas"
  },
  {
    icon: <SparklesIcon className="h-8 w-8" />,
    title: "Experiencia Premium",
    description: "UI/UX cuidadosamente diseñada"
  }
];

const progressItems = [
  { name: "Backend API", progress: 85 },
  { name: "Base de Datos", progress: 90 },
  { name: "Interfaz de Usuario", progress: 75 },
  { name: "Sistema de Pagos", progress: 60 },
  { name: "Dashboard Admin", progress: 70 },
  { name: "Documentación", progress: 45 }
];

export default function DesarrolloPage() {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-6">
              <WrenchScrewdriverIcon className="h-12 w-12 text-cyan-400" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Página en Desarrollo
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Estamos trabajando arduamente para traerte una experiencia increíble. 
              Mientras tanto, puedes explorar las características que estamos implementando.
            </p>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progreso Total</span>
                <span>{Math.round(currentProgress)}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-8">
            <ArrowPathIcon className="h-8 w-8 text-cyan-400" />
            <h2 className="text-2xl font-bold">Estado del Desarrollo</h2>
          </div>
          
          <div className="space-y-6">
            {progressItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-cyan-400 font-medium">{item.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-6">
          <RocketLaunchIcon className="h-12 w-12 text-cyan-400" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4">¡Pronto estaremos listos!</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Estamos implementando las últimas mejoras para garantizar una experiencia 
          excepcional. El lanzamiento está más cerca de lo que piensas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            Volver al Inicio
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700"
          >
            Actualizar Estado
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CodeBracketIcon className="h-6 w-6 text-gray-400" />
            <span className="text-gray-400">
              Desarrollado con ❤️ usando Next.js & Tailwind CSS
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}