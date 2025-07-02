// src/data/testimonials.ts
export interface Testimonial {
  name: string;
  course: string;
  message: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Sofía G.",
    course: "Arte digital con Minecraft",
    message:
      "Aprendí a diseñar mundos increíbles mientras me divertía. ¡Xhiggz es otro nivel!",
    avatar: "/avatars/avatar1.png",
  },
  {
    name: "Luis R.",
    course: "Desarrollo con Roblox",
    message:
      "Ahora sé cómo crear mis propios juegos. Todo fue práctico y emocionante.",
    avatar: "/avatars/avatar2.png",
  },
  {
    name: "Valentina M.",
    course: "Programación creativa",
    message:
      "Nunca pensé que la programación pudiera ser tan divertida. Me encantó.",
    avatar: "/avatars/avatar3.png",
  },
];
