"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instructor, instructors } from "@/data/instructors";

export default function InstructorsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
        Profes de la ruta
      </div>
      <h2 className="text-3xl font-bold mb-8">Conoce quién enseña en esta ruta</h2>
      <div className="flex flex-wrap gap-8">
        {instructors.map((inst: Instructor) => (
          <div key={inst.name} className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={inst.avatar}
                alt={inst.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">{inst.name}</p>
              {inst.role && (
                <p className="text-sm text-gray-500">{inst.role}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
