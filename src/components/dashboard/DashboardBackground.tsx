"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const COLORS = ["bg-cyan-400/40", "bg-purple-500/40", "bg-blue-500/40"];

interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}

export default function DashboardBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generate = useCallback(() => {
    const count = window.innerWidth < 768 ? 10 : 22;
    return Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, []);

  useEffect(() => {
    setParticles(generate());
    const onResize = () => setParticles(generate());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [generate]);

  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pointer-events-none">
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
  );
}
