// src/data/cursos.tsx
import BrainModel from "@/components/three/BrainModel";
import GamepadModel from "@/components/three/GamepadModel";
import PaintbrushModel from "@/components/three/PaintbrushModel";
import BuildingModel from "@/components/three/BuildingModel";
import { Course } from "@/types";

export const courses: Course[] = [
  {
    id: "1",
    slug: "diseno-grafico",
    title: "Diseño Gráfico",
    description: "Exprésate con arte visual y herramientas creativas digitales.",
    emoji: "🎨",
    model3D: <PaintbrushModel />,
    categoria: "Arte y Creatividad",
    img: "/images/cursos_img/Banner-diseño-grafico.jpg"
  },
  {
    id: "2",
    slug: "logica-y-pensamiento-computacional",
    title: "Lógica y pensamiento computacional",
    description:
      "Aprende a resolver problemas desde cero, estructurar ideas y pensar como un programador.",
    emoji: "🧠",
    model3D: <BrainModel />,
    categoria: "Lógica y Pensamiento",
    img: "/images/cursos_img/Pensamiento_logico-bg.png"
  },
  {
    id: "3",
    slug: "diseno-y-arquitectura-digital",
    title: "Diseño y arquitectura digital",
    description:
      "Crea estructuras, espacios y mundos con visión de arquitecto usando herramientas visuales.",
    emoji: "🏗️",
    model3D: <BuildingModel />,
    categoria: "Arquitectura Digital",
    img: "/images/cursos_img/Diseño_AD-bg.jpeg"
  },
  {
    id: "4",
    slug: "creacion-de-videojuegos",
    title: "Creación de videojuegos",
    description:
      "Diseña y programa experiencias interactivas y mundos jugables con Roblox y más.",
    emoji: "🎮",
    model3D: <GamepadModel />,
    categoria: "Videojuegos",
    img: "/images/cursos_img/videojuegos.jpg"
  },
  {
    id: "5",
    slug: "arte-y-expresion-digital",
    title: "Arte y expresión digital",
    description:
      "Explora el diseño visual, la creatividad y el estilo mediante herramientas gráficas.",
    emoji: "🎨",
    model3D: <PaintbrushModel />,
    categoria: "Arte y Creatividad",
    img: "/images/cursos_img/Art_DE-bg.png"
  },
];
