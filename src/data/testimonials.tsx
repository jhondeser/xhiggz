// src/data/testimonials.tsx
// Testimonios reales extraídos de la "Encuesta de Satisfacción" (ago–sep 2026).
// Texto ligeramente editado (ortografía, puntuación, primera persona) sin cambiar el sentido.
// Solo nombre + inicial del apellido: son menores. No añadir datos de contacto.
import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    name: "Familia de Logan",
    role: "Madre/padre · alumno de 7 años",
    course: "Minecraft",
    message:
      "Nos encantó su profesor: les hace las clases muy amenas y el niño siempre se queda con ganas de más, esperando la próxima clase.",
    rating: 5,
  },
  {
    name: "Roc A.",
    role: "12 años",
    course: "Minecraft",
    message:
      "Me han gustado mucho estas clases porque puedo sacar partido a mi imaginación y demostrarla en un juego de cubos.",
    rating: 5,
  },
  {
    name: "Abel",
    role: "13 años",
    course: "Programación y videojuegos con Minecraft",
    message:
      "Lo que más me gustó fue la manera de enseñar y la comunicación entre el profesor y los estudiantes.",
    rating: 5,
  },
  {
    name: "Alisa",
    role: "15 años",
    course: "Programación web",
    message:
      "Todas las clases han sido muy educativas e interesantes, y me han gustado mucho. Dedicamos mucho tiempo a programar diseño gráfico.",
    rating: 5,
  },
  {
    name: "Frank y Adrián O.",
    role: "14 años",
    course: "Programación y desarrollo web",
    message: "Lo que más nos gustó fue hacer nuestros propios proyectos.",
    rating: 5,
  },
  {
    name: "Eurídice",
    role: "7 años",
    course: "Minecraft",
    message:
      "Me gustó todo lo que aprendíamos, que era divertido y que todos teníamos las mismas oportunidades de participar.",
    rating: 4,
  },
  {
    name: "David G.",
    role: "10 años",
    course: "Programación con Minecraft",
    message: "Me gustaba mucho construir, y Jhonatan me caía muy bien.",
    rating: 4,
  },
  {
    name: "Ian G.",
    role: "14 años",
    course: "Robótica y programación",
    message:
      "Me gustaron los proyectos y cómo los explicaba. El profesor es muy amable.",
    rating: 4,
  },
];

// Datos agregados reales de la encuesta (14 respuestas).
export const testimonialStats = {
  averageRating: "4.6/5", // 9×5 + 5×4 = 65 / 14 = 4.64
  recommendPct: "100%", // 14 de 14 respondieron "Sí"
};
