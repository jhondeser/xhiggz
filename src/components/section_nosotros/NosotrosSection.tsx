// components/AboutSections.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { 
  AcademicCapIcon, 
  LightBulbIcon, 
  UsersIcon, 
  GlobeAltIcon, 
  RocketLaunchIcon, 
  LockClosedIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Animaciones compartidas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 }
  }
};

// Componente wrapper para animaciones - CORREGIDO
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = "", id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      id={id} // ✅ Ahora acepta la prop id
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export const QuienesSomosSection: React.FC = () => (
  <AnimatedSection id="quienes-somos" className="relative py-24 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
    {/* Elementos decorativos de fondo */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <SparklesIcon className="w-4 h-4" />
            Conoce Nuestra Esencia
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
            Más Allá de una Escuela
          </h2>
          
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              <strong className="text-blue-600">Xhiggz</strong> nació de una convicción profunda: 
              el verdadero aprendizaje surge cuando <strong className="text-cyan-600">creas, experimentas y transformas</strong> 
              tus ideas en realidad.
            </p>
            
            <p>
              No somos solo una plataforma de cursos. Somos un <strong className="text-purple-600">ecosistema creativo</strong> 
              donde la tecnología se convierte en tu lenguaje de expresión.
            </p>

            <blockquote className="border-l-4 border-cyan-500 pl-6 italic text-gray-600 bg-white/50 p-4 rounded-r-2xl">
              "No enseñamos para que compitas. <strong>Enseñamos para que crees.</strong>"
            </blockquote>

            <p>
              Nuestro equipo son <strong>jóvenes innovadores</strong> del mundo tech: desarrolladores, 
              diseñadores, creadores de contenido y nómadas digitales que han recorrido el camino 
              que tú quieres transitar.
            </p>
          </div>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-4 pt-4"
          >
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-medium">Aprendizaje Práctico</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border">
              <span className="text-2xl">🌎</span>
              <span className="text-sm font-medium">Comunidad Global</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border">
              <span className="text-2xl">⚡</span>
              <span className="text-sm font-medium">Tecnología Vanguardista</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-8 text-white shadow-2xl">
            <AcademicCapIcon className="w-32 h-32 mx-auto mb-6" />
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Para Todos los Niveles</h3>
              <p className="text-blue-100">
                Desde niños hasta adultos, sin importar tu experiencia previa. 
                <strong> Tu curiosidad es el único requisito.</strong>
              </p>
            </div>
            
            {/* Stats flotantes */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-blue-200">Estudiantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-blue-200">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-blue-200">Soporte</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </AnimatedSection>
);

export const MisionSection: React.FC = () => (
  <AnimatedSection id="mision" className="relative py-24 bg-white overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent"></div>
    
    <div className="container mx-auto px-4 relative z-10">
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <HeartIcon className="w-4 h-4" />
          Nuestro Propósito
        </div>
        
        <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent mb-8">
          Nuestra Misión
        </h2>
        
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            Democratizar el acceso a la <strong className="text-green-600">educación tecnológica de calidad</strong>, 
            haciendo que cualquier persona con curiosidad pueda desarrollar habilidades digitales 
            que transformen su realidad.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200">
              <div className="text-3xl mb-4">🎨</div>
              <h4 className="font-bold text-green-800 mb-2">Aprendizaje Creativo</h4>
              <p className="text-green-700 text-sm">Donde cada proyecto es una obra de tu imaginación</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl border border-blue-200">
              <div className="text-3xl mb-4">🚀</div>
              <h4 className="font-bold text-blue-800 mb-2">Impacto Real</h4>
              <p className="text-blue-700 text-sm">Habilidades que cambian trayectorias profesionales</p>
            </div>
          </div>

          <p className="text-center text-gray-600 italic border-l-4 border-green-500 pl-6 bg-green-50/50 p-4 rounded-r-2xl">
            "Queremos que al finalizar cada curso, nuestros estudiantes no solo tengan un certificado, 
            sino <strong>el orgullo genuino de lo que han creado con sus propias manos.</strong>"
          </p>
        </div>
      </motion.div>
    </div>
  </AnimatedSection>
);

export const VisionSection: React.FC = () => (
  <AnimatedSection id="vision" className="relative py-24 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-60 h-60 bg-purple-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-pink-200 rounded-full blur-3xl opacity-40"></div>
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={itemVariants} className="order-2 lg:order-1">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl text-center">
            <GlobeAltIcon className="w-32 h-32 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Visión Global</h3>
            <p className="text-purple-100">
              Construyendo puentes digitales que conecten talento hispanohablante con oportunidades mundiales
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
            <RocketLaunchIcon className="w-4 h-4" />
            Mirando al Futuro
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
            Nuestra Visión 2028
          </h2>
          
          <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <p>
              Visualizamos a <strong className="text-purple-600">Xhiggz</strong> como el epicentro de 
              la <strong>educación tecnológica en español</strong>, con una comunidad de más de 
              50,000 creadores activos alrededor del mundo.
            </p>
            
            <p>
              Soñamos con llevar educación de calidad a <strong>zonas vulnerables de Latinoamérica</strong>, 
              donde niños y jóvenes puedan descubrir que su ubicación no define su potencial.
            </p>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-3">Nuestros Objetivos Clave:</h4>
              <ul className="space-y-2 text-purple-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Expandirnos a 10 países de Latinoamérica
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Implementar programas en zonas de bajos recursos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Crear la mayor comunidad tech en español
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </AnimatedSection>
);

const valores = [
  { 
    title: 'Creatividad', 
    Icon: LightBulbIcon, 
    description: 'Transformamos el aprendizaje en un acto de creación. Cada proyecto es una expresión única de tu potencial.',
    color: 'from-yellow-400 to-orange-400',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  { 
    title: 'Colaboración', 
    Icon: UsersIcon, 
    description: 'Crecemos juntos. Tu éxito es nuestro éxito, y cada logro individual celebra a la comunidad.',
    color: 'from-blue-400 to-cyan-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  { 
    title: 'Innovación', 
    Icon: GlobeAltIcon, 
    description: 'Mantenemos la vanguardia tecnológica. IA, Web3 y herramientas emergentes integradas en cada ruta.',
    color: 'from-green-400 to-emerald-400',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  { 
    title: 'Expansión', 
    Icon: RocketLaunchIcon, 
    description: 'Rompiendo límites geográficos y mentales. Tu aprendizaje no conoce fronteras.',
    color: 'from-purple-400 to-pink-400',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  { 
    title: 'Accesibilidad', 
    Icon: LockClosedIcon, 
    description: 'La educación de calidad como derecho, no privilegio. Programas inclusivos para todos.',
    color: 'from-gray-400 to-blue-400',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700'
  },
];

export const ValoresSection: React.FC = () => (
  <AnimatedSection id="valores" className="relative py-24 bg-gradient-to-br from-slate-900 to-blue-900 text-white overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <motion.div variants={itemVariants} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
          <SparklesIcon className="w-4 h-4" />
          Nuestra Esencia
        </div>
        <h2 className="text-5xl font-bold mb-4">Valores que Nos Definen</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Los principios que guían cada decisión, cada curso y cada interacción en nuestra comunidad
        </p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {valores.map(({ title, Icon, description, color, bgColor, textColor }, index) => (
          <motion.div
            key={title}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -8,
              transition: { duration: 0.3 }
            }}
            className="group relative"
          >
            <div className={`relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center h-full group-hover:bg-white/15 transition-all duration-300 ${bgColor} ${textColor} bg-opacity-5`}>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
              <p className="text-gray-300 leading-relaxed">{description}</p>
              
              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </AnimatedSection>
);

export const FinalCTASection: React.FC = () => (
  <AnimatedSection className="relative py-24 bg-gradient-to-br from-cyan-500 to-blue-600 text-white overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
        <h2 className="text-5xl font-bold mb-6">
          ¿Listo para Crear tu Futuro?
        </h2>
        <p className="text-xl mb-8 text-cyan-100 leading-relaxed">
          Únete a miles de estudiantes que ya están transformando sus ideas en realidad. 
          Tu viaje en la tecnología comienza con un solo click.
        </p>
        
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link 
            href="/registro"
            className="group bg-white text-cyan-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3"
          >
            <span>🚀 Comenzar Ahora Gratis</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="group-hover:translate-x-1 transition-transform"
            >
              →
            </motion.span>
          </Link>
          
          <Link 
            href="/cursos"
            className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-2xl backdrop-blur-sm transition-all duration-300"
          >
            Explorar Cursos
          </Link>
        </motion.div>
        
        <motion.p 
          variants={fadeInUp}
          className="mt-6 text-cyan-200 text-sm"
        >
          ✅ Sin compromisos • ✅ Acceso inmediato • ✅ Comunidad incluida
        </motion.p>
      </motion.div>
    </div>
  </AnimatedSection>
);