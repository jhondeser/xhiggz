"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { testimonials, testimonialStats } from "@/data/testimonials";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { 
      perView: 1, 
      spacing: 32 
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        instanceRef.current?.next();
      }, 5000);
    }
  }, [instanceRef, isHovered]);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const nextSlide = () => {
    stopAutoplay();
    instanceRef.current?.next();
    startAutoplay();
  };

  const prevSlide = () => {
    stopAutoplay();
    instanceRef.current?.prev();
    startAutoplay();
  };

  const goToSlide = (index: number) => {
    stopAutoplay();
    instanceRef.current?.moveToIdx(index);
    startAutoplay();
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1] as const,
      } 
    },
  };

  const getInitials = (name: string) =>
    name
      .replace(/^Familia de /, "")
      .split(/\s+/)
      .filter((w) => w.length > 1 && w !== "y")
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={container}
          className="text-center mb-16"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4" />
            Testimonios Reales
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            variants={item}
          >
            Lo que Dicen Nuestros{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Alumnos y Familias
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={item}
          >
            Opiniones reales de alumnos y familias, sacadas de nuestra encuesta de satisfacción
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="relative max-w-4xl mx-auto"
        >
          {/* Controles de navegación */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-110 group"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-cyan-600" />
            </button>
            
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-110 group"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-cyan-600" />
            </button>
          </div>

          {/* Carousel */}
          <div
            ref={sliderRef}
            className="keen-slider"
            onMouseEnter={() => {
              setIsHovered(true);
              stopAutoplay();
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              startAutoplay();
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="keen-slider__slide px-4"
                variants={item}
              >
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
                  {/* Elemento decorativo */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  {/* Icono de comillas usando texto */}
                  <div className="absolute top-6 left-6 text-4xl text-cyan-500/20">
                    "
                  </div>

                  <div className="relative z-10">
                    {/* Avatar y info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div
                          aria-hidden="true"
                          className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300"
                        >
                          {getInitials(testimonial.name)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-cyan-500 rounded-full p-1 shadow-lg">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {testimonial.name}
                          {testimonial.role && (
                            <span className="ml-2 text-sm font-normal text-gray-500">
                              · {testimonial.role}
                            </span>
                          )}
                        </h3>
                        <p className="text-cyan-600 font-medium">{testimonial.course}</p>
                        <div
                          className="flex gap-1 mt-1"
                          aria-label={`Valoración: ${testimonial.rating} de 5`}
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mensaje del testimonio */}
                    <blockquote className="text-gray-700 text-lg leading-relaxed italic relative pl-8">
                      {testimonial.message}
                    </blockquote>

                    {/* Indicador de progreso - CORREGIDO */}
                    <div className ="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Testimonio {index + 1} de {testimonials.length}</span>
                        <span>Encuesta de satisfacción · 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Indicadores de puntos */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-cyan-500 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats de confianza */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="grid grid-cols-3 gap-8 mt-16 max-w-xl mx-auto"
        >
          <motion.div variants={item} className="text-center">
            <div className="text-3xl font-bold text-cyan-600">{testimonialStats.averageRating}</div>
            <div className="text-gray-600 text-sm">Valoración media</div>
          </motion.div>
          <motion.div variants={item} className="text-center">
            <div className="text-3xl font-bold text-cyan-600">{testimonialStats.recommendPct}</div>
            <div className="text-gray-600 text-sm">Nos recomendarían</div>
          </motion.div>
          <motion.div variants={item} className="text-center">
            <div className="text-3xl font-bold text-cyan-600">∞</div>
            <div className="text-gray-600 text-sm">Soporte</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}