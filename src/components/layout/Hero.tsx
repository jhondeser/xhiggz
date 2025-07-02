"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const colors = ["bg-cyan-400", "bg-purple-500", "bg-blue-500"];

    const newParticles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden bg-gradient-to-br from-black via-indigo-900 to-blue-950 text-white"
    >
      {/* Partículas animadas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[2px] opacity-50 ${p.color}`}
            style={{ width: p.size, height: p.size }}
            initial={{ x: p.x, y: p.y, opacity: 0 }}
            animate={{
              x: p.x + Math.random() * 50 - 25,
              y: p.y + Math.random() * 50 - 25,
              opacity: 0.7,
            }}
            transition={{
              duration: 3,
              delay: p.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Contenido principal con cascada */}
      <motion.div
        className="relative z-10 max-w-3xl px-6 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.3 } },
        }}
      >
        <motion.h1
          variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold leading-tight drop-shadow-xl"
        >
          La educación nace <br /> del campo de la creación
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-indigo-200"
        >
          Xhiggz: transforma tu energía en conocimiento con programación, IA, robótica y más.
        </motion.p>

        <motion.a
          variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
          href="#cursos"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 transition text-white py-3 px-6 rounded-xl font-semibold shadow-lg"
        >
          Explora los Cursos
        </motion.a>
      </motion.div>
    </motion.section>
  );
}
