"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import ParticleScene from "@/components/three/ParticleScene";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const item = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // Curva personalizada
      },
    },
  };

  const stats = [
    { number: "500+", label: "Estudiantes" },
    { number: "98%", label: "Satisfacción" },
    { number: "24/7", label: "Soporte" },
    { number: "∞", label: "Acceso" },
  ];

  const features = [
    {
      icon: "🚀",
      title: "Aprendizaje Práctico",
      description: "Proyectos reales desde el día 1"
    },
    {
      icon: "🌍",
      title: "Comunidad Global",
      description: "Conecta con creadores worldwide"
    },
    {
      icon: "🧠",
      title: "Pensamiento Crítico",
      description: "Más allá del código, crea soluciones"
    },
    {
      icon: "⚡",
      title: "Tecnología Vanguardista",
      description: "IA, Robótica, Web3 y más"
    }
  ];

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={container}
      className="relative py-28 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden"
    >
      {/* Elementos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Mejorado */}
        <motion.div
          variants={item}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold py-2 px-4 rounded-full mb-6"
          >
            ✨ La Revolución del Aprendizaje
          </motion.span>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-6">
            Más Allá del Código
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            En <span className="font-bold text-blue-600">Xhiggz</span> no solo enseñamos tecnología, 
            cultivamos <span className="text-purple-600">creadores del futuro</span> que transforman 
            ideas en realidades digitales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Texto Principal */}
          <motion.div variants={container} className="space-y-8">
            <motion.div variants={item}>
              <p className="text-lg text-gray-700 leading-relaxed">
                Somos el puente entre tu <strong className="text-blue-600">curiosidad</strong> y el 
                dominio de las tecnologías que están moldeando el mundo. A través de programación, 
                IA, robótica y experiencias inmersivas como Minecraft, desbloqueamos tu potencial 
                creativo.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              variants={item}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Mejorado */}
            <motion.div variants={item} className="pt-4">
              <Link
                href="/cursos"
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  🚀 Descubre Tu Potencial
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Partícula 3D Mejorada */}
          <motion.div 
            variants={item}
            className="relative flex justify-center items-center"
          >
            <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
              <ParticleScene />
            </div>
            
            {/* Elemento decorativo flotante */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50"
            >
              <div className="text-2xl">🎯</div>
              <p className="text-sm font-semibold text-gray-800">Aprende Creando</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          variants={container}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}