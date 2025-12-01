"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const PARTICLE_CONFIG = {
  count: 25,
  mobileCount: 12,
  colors: ["bg-cyan-400/40", "bg-purple-500/40", "bg-blue-500/40"],
};

interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const generateParticles = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = isMobile ? PARTICLE_CONFIG.mobileCount : PARTICLE_CONFIG.count;

    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 3,
      color: PARTICLE_CONFIG.colors[Math.floor(Math.random() * PARTICLE_CONFIG.colors.length)],
    }));
  }, [isMobile]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setParticles(generateParticles());

    const handleResize = () => {
      checkMobile();
      setParticles(generateParticles());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [generateParticles]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white px-4"
    >
      {/* Partículas optimizadas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[1px] ${p.color}`}
            style={{ width: p.size, height: p.size }}
            initial={{ x: p.x, y: p.y, opacity: 0 }}
            animate={{
              x: p.x + Math.sin(p.delay) * 40,
              y: p.y + Math.cos(p.delay) * 40,
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + p.delay,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Contenido principal MEJORADO */}
      <motion.div
        className="relative z-10 max-w-4xl flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.3 } },
        }}
      >
        {/* Título principal con gradiente */}
        <motion.h1
          variants={{ 
            hidden: { opacity: 0, y: -30 }, 
            visible: { opacity: 1, y: 0 } 
          }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
        >
          Domina la{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Tecnología
          </span>{" "}
          del Futuro
        </motion.h1>

        {/* Subtítulo persuasivo */}
        <motion.p
          variants={{ 
            hidden: { opacity: 0, y: -20 }, 
            visible: { opacity: 1, y: 0 } 
          }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl sm:text-2xl text-gray-300 max-w-2xl mb-4"
        >
          Aprende <strong className="text-cyan-300">Programación, IA y Robótica</strong> con proyectos reales. 
          
        </motion.p>

        {/* Social Proof */}
        <motion.div
          variants={{ 
            hidden: { opacity: 0 }, 
            visible: { opacity: 1 } 
          }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex items-center gap-2 text-lg text-cyan-200 mb-8"
        >
          <span className="flex items-center">
            ⭐ 4.9/5
          </span>
          <span className="text-gray-400">•</span>
          <span>500+ estudiantes</span>
          <span className="text-gray-400">•</span>
          <span>98% de satisfacción</span>
        </motion.div>

        {/* Botones CTA Mejorados */}
        <motion.div
          variants={{ 
            hidden: { opacity: 0, y: 20 }, 
            visible: { opacity: 1, y: 0 } 
          }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <motion.a
            href="#cursos"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.5)" 
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            Explorar Cursos
          </motion.a>
        
        </motion.div>

        {/* Beneficios rápidos */}
        <motion.div
          variants={{ 
            hidden: { opacity: 0 }, 
            visible: { opacity: 1 } 
          }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-400"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Acceso de por vida</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Certificación incluida</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Soporte 1:1</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}