"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";  // <-- aquí

export default function Testimonials() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 16 },
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = () => {
    timerRef.current = setInterval(() => instanceRef.current?.next(), 4000);
  };
  const stopAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="py-20 bg-gray-50 text-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-bold mb-8 text-center"
        variants={item}
      >
        Lo que dice nuestra comunidad
      </motion.h2>

      <div
        ref={sliderRef}
        className="keen-slider"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="keen-slider__slide px-6"
            variants={item}
          >
            <div className="bg-white shadow-xl rounded-xl p-6 border flex flex-col items-center">
              <Image
                src={t.avatar}
                alt={`Avatar de ${t.name}`}
                width={64}
                height={64}
                className="rounded-full mb-4"
              />
              <p className="text-lg italic mb-4 text-center">“{t.message}”</p>
              <p className="font-semibold text-blue-600">{t.name}</p>
              <p className="text-sm text-gray-500">{t.course}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
