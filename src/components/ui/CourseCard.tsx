// src/components/ui/CourseCard.tsx
"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CourseCardProps {
  title: string;
  description: string;
  model3D?: ReactNode;
  emoji?: string;
}

export default function CourseCard({
  title,
  description,
  model3D,
  emoji,
}: CourseCardProps) {
  return (
    <motion.div
      className="relative w-full h-full flex flex-col"
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: { scale: 1, boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" },
        hover: {
          scale: 1.03,
          boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
        },
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-100 rounded-xl p-6 flex flex-col flex-grow">
        {/* 3D Model or Emoji */}
        <div className="w-full h-[150px] mb-4 flex justify-center items-center">
          {model3D ?? <div className="text-4xl">{emoji}</div>}
        </div>

        {/* Texto */}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}
