// src/components/section_community/CommunitySection.tsx
"use client";

import { motion } from "framer-motion";
import {
  ChatBubbleOvalLeftIcon,
  UsersIcon,
  CalendarDaysIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className: string }>;
  url: string;
  image: string;
}

const features: Feature[] = [
  {
    title: "Discord Oficial",
    description:
      "Únete a nuestro servidor para charlas, dudas y proyectos en tiempo real.",
    icon: ChatBubbleOvalLeftIcon,
    url: "https://discord.gg/tu-servidor",
    image: "/images/comunidad/dicord_blog.png",
  },
  {
    title: "Encuentros Mensuales",
    description:
      "Webinars y meetups para compartir avances y aprender en comunidad.",
    icon: CalendarDaysIcon,
    url: "/eventos",
    image: "/images/comunidad/Encuentros-bg.png",
  },
  {
    title: "Foro de Ayuda",
    description:
      "Plantea tus preguntas y obtén respuestas de instructores y compañeros.",
    icon: UsersIcon,
    url: "/foro",
    image: "/images/comunidad/support-bg.jpg",
  },
  {
    title: "Proyectos Colaborativos",
    description: "Participa en iniciativas abiertas y construye en equipo.",
    icon: HeartIcon,
    url: "/colaboracion",
    image: "/images/comunidad/coloboremos-bg_cambio.jpg",
  },
];

export default function CommunitySection() {
  return (
    <section>
      {/* Hero con gradient como antes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center text-center px-4 sm:px-6 py-20 bg-gradient-to-br from-black via-indigo-900 to-blue-950 text-white"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Únete a la comunidad Xhiggz
        </h2>
        <p className="max-w-2xl text-lg sm:text-xl mb-8 text-indigo-200">
          Compartimos conocimientos, resolvemos dudas y creamos proyectos juntos. Forma
          parte de nuestro ecosistema educativo.
        </p>
        <a
          href="https://discord.gg/tu-servidor"
          target="_blank"
          rel="noopener"
          className="inline-block bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-xl drop-shadow-lg"
        >
          Entrar a Discord
        </a>
      </motion.div>

      {/* Cards full-width con imagen overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 gap-8">
        {features.map((f) => (
          <motion.a
            key={f.title}
            href={f.url}
            target={f.url.startsWith("http") ? "_blank" : undefined}
            rel={f.url.startsWith("http") ? "noopener" : undefined}
            className="relative overflow-hidden rounded-xl shadow-lg h-60 group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Imagen cubriendo todo */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:translate-x-full"
              style={{ backgroundImage: `url(${f.image})` }}
            />

            {/* Contenido debajo de la imagen */}
            <div className="
              relative z-10 h-full flex flex-col justify-center px-6
              
              /* Arranca invisible y se hace visible al hover del padre */
              opacity-0 group-hover:opacity-100
              
              /* Color inicial y color al hover */
              text-gray-500 group-hover:text-black
              
              /* Transiciones para opacidad y color */
              transition-opacity transition-colors
              duration-400 ease-in-out
              
              /* Retraso antes de iniciar la transición */
              delay-200"
            >
              <div className="flex items-center space-x-4 mb-4">
                <f.icon className="h-10 w-10 text-black" />
                <h3 className="text-2xl  font-semibold text-black">{f.title}</h3>
              </div>
              <p className="text-black max-w-xl">{f.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

