"use client";

import { motion } from "framer-motion";
import { courses } from "@/data/cursos";
import CourseCard from "@/components/common/CourseCards";

export default function LearningAreas() {
  // Eliminamos el stagger para que todos los hijos animen simultáneamente
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0,
        delayChildren: 0,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
      className="py-20 bg-white text-gray-800"
    >
      <motion.h2
        variants={item}
        className="text-3xl sm:text-4xl font-bold text-center mb-10"
      >
        ¿Qué puedes aprender en Xhiggz?
      </motion.h2>

      <motion.div
        variants={container}
        className="w-[70%] mx-auto space-y-8 marginBottom: '2rem' overflow-hidden rounded-xl"
      >
        {courses.map((course, idx) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </motion.div>
    </motion.section>
  );
}
