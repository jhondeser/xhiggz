"use client";

import { motion } from "framer-motion";

export default function CoursesHeader() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-blue-800 to-purple-800 text-white py-24 px-4 text-center"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          Explora nuestros cursos
        </h1>
        <p className="text-lg sm:text-xl text-blue-200">
          Aprende a diseñar, programar y crear mundos digitales con herramientas como Minecraft, Roblox, IA y más.
        </p>
      </div>
    </motion.section>
  );
}
