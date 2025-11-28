"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ParticleScene from "@/components/three/ParticleScene";

export default function AboutSection() {
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.6, // más lento entre cada hijo
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2, // animación más lenta
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
      className="py-20 bg-[#f5faff] text-gray-800"
    >
      <motion.div
        variants={item}
        className="max-w-7xl mx-auto px-4 text-center mb-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold">
          ¿Qué es Xhiggz?
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
      >
        {/* Texto */}
        <motion.div variants={item}>
          <p className="text-gray-600 mb-6">
            Xhiggz es una escuela digital donde la tecnología y la creatividad se
            encuentran. Usamos herramientas como programación, IA, Minecraft,
            robótica y más, para que aprendas a crear desde tu esencia.
          </p>
          <ul className="space-y-2 mb-6 text-left list-disc list-inside">
            <li>🚀 Aprendizaje 100% práctico y virtual</li>
            <li>🌍 Comunidad creativa global</li>
            <li>🧠 Foco en innovación y pensamiento crítico</li>
          </ul>
          <Link
            href="/cursos"
            className="inline-block bg-blue-600 text-white py-2 px-5 rounded-xl hover:bg-blue-700 transition"
          >
            Explora nuestros cursos
          </Link>
        </motion.div>

        {/* Partícula 3D */}
        <motion.div variants={item} className="flex justify-center">
          <div className="w-full h-[400px]">
            <ParticleScene />
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
