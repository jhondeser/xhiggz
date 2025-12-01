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
    img: "/images/cursos_img/Banner-diseño-grafico.jpg",
    
    // Nuevos campos
    nivel: "Principiante",
    duracion: "8 semanas",
    precio: {
      mensual: 29,
      completo: 199,
      moneda: "USD"
    },
    rating: 4.8,
    estudiantes: 120,
    destacado: true,
    tags: ["Photoshop", "Illustrator", "Diseño UX", "Creatividad", "Branding"],
    contenido: {
      modulos: 6,
      horas: 40,
      proyectos: 4
    },
    requisitos: [
      "Computadora con acceso a internet",
      "Software de diseño (se enseñarán opciones gratuitas)",
      "Creatividad y ganas de aprender"
    ],
    objetivos: [
      "Dominar herramientas de diseño profesional",
      "Crear identidades visuales completas",
      "Desarrollar portfolio de proyectos reales"
    ],
    beneficios: [
      "Certificación reconocida",
      "Portfolio profesional",
      "Acceso a comunidad de diseñadores"
    ],
    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,
    estadisticas: {
      satisfaccion: 95,
      empleabilidad: 88,
      completacion: 85
    }
  },
  {
    id: "2",
    slug: "logica-y-pensamiento-computacional",
    title: "Lógica y Pensamiento Computacional",
    description: "Aprende a resolver problemas desde cero, estructurar ideas y pensar como un programador.",
    emoji: "🧠",
    model3D: <BrainModel />,
    categoria: "Lógica y Pensamiento",
    img: "/images/cursos_img/Pensamiento_logico-bg.png",
    
    // Nuevos campos
    nivel: "Principiante",
    duracion: "6 semanas",
    precio: {
      mensual: 25,
      completo: 149,
      moneda: "USD"
    },
    rating: 4.9,
    estudiantes: 200,
    destacado: true,
    tags: ["Lógica", "Algoritmos", "Resolución de Problemas", "Pensamiento Crítico", "Fundamentos"],
    contenido: {
      modulos: 5,
      horas: 30,
      proyectos: 3
    },
    requisitos: [
      "No se requiere experiencia previa",
      "Computadora básica",
      "Curiosidad por aprender"
    ],
    objetivos: [
      "Desarrollar pensamiento algorítmico",
      "Resolver problemas complejos sistemáticamente",
      "Prepararse para programación avanzada"
    ],
    beneficios: [
      "Base sólida para cualquier carrera tecnológica",
      "Mejora en resolución de problemas cotidianos",
      "Certificación en pensamiento computacional"
    ],
    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,
    estadisticas: {
      satisfaccion: 97,
      empleabilidad: 92,
      completacion: 90
    }
  },
  {
    id: "3",
    slug: "diseno-y-arquitectura-digital",
    title: "Diseño y Arquitectura Digital",
    description: "Crea estructuras, espacios y mundos con visión de arquitecto usando herramientas visuales.",
    emoji: "🏗️",
    model3D: <BuildingModel />,
    categoria: "Arquitectura Digital",
    img: "/images/cursos_img/diseño_ARdigital-bg.jpg",
    
    // Nuevos campos
    nivel: "Intermedio",
    duracion: "10 semanas",
    precio: {
      mensual: 35,
      completo: 249,
      moneda: "USD"
    },
    rating: 4.7,
    estudiantes: 85,
    destacado: false,
    tags: ["3D Modeling", "Arquitectura", "Blender", "Diseño Espacial", "Render"],
    contenido: {
      modulos: 7,
      horas: 50,
      proyectos: 5
    },
    requisitos: [
      "Conocimientos básicos de diseño",
      "Computadora con capacidad para software 3D",
      "Interés en arquitectura y espacios"
    ],
    objetivos: [
      "Crear modelos arquitectónicos 3D profesionales",
      "Renderizar escenas realistas",
      "Presentar proyectos arquitectónicos digitales"
    ],
    beneficios: [
      "Portfolio de proyectos arquitectónicos",
      "Certificación en diseño 3D",
      "Acceso a herramientas profesionales"
    ],
    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,
    estadisticas: {
      satisfaccion: 93,
      empleabilidad: 85,
      completacion: 80
    }
  },
  {
    id: "4",
    slug: "creacion-de-videojuegos",
    title: "Creación de Videojuegos",
    description: "Diseña y programa experiencias interactivas y mundos jugables con Roblox y más.",
    emoji: "🎮",
    model3D: <GamepadModel />,
    categoria: "Videojuegos",
    img: "/images/cursos_img/videojuegos.jpg",
    
    // Nuevos campos
    nivel: "Todos los niveles",
    duracion: "12 semanas",
    precio: {
      mensual: 39,
      completo: 299,
      moneda: "USD"
    },
    rating: 4.9,
    estudiantes: 180,
    destacado: true,
    tags: ["Roblox Studio", "Game Design", "Lua", "Narrativa", "Mecánicas de Juego"],
    contenido: {
      modulos: 8,
      horas: 60,
      proyectos: 6
    },
    requisitos: [
      "Computadora con internet",
      "Creatividad para contar historias",
      "Ganas de crear juegos divertidos"
    ],
    objetivos: [
      "Crear videojuegos completos desde cero",
      "Publicar juegos en plataformas populares",
      "Entender el ciclo completo de desarrollo"
    ],
    beneficios: [
      "Publicación de tu primer videojuego",
      "Certificación en desarrollo de juegos",
      "Acceso a comunidad de game developers"
    ],
    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,
    estadisticas: {
      satisfaccion: 96,
      empleabilidad: 90,
      completacion: 87
    }
  },
  {
    id: "5",
    slug: "arte-y-expresion-digital",
    title: "Arte y Expresión Digital",
    description: "Explora el diseño visual, la creatividad y el estilo mediante herramientas gráficas.",
    emoji: "🎨",
    model3D: <PaintbrushModel />,
    categoria: "Arte y Creatividad",
    img: "/images/cursos_img/Art_DE-bg.png",
    
    // Nuevos campos
    nivel: "Principiante",
    duracion: "8 semanas",
    precio: {
      mensual: 29,
      completo: 199,
      moneda: "USD"
    },
    rating: 4.6,
    estudiantes: 95,
    destacado: false,
    tags: ["Arte Digital", "Ilustración", "Tableta Gráfica", "Expresión Artística", "Técnicas"],
    contenido: {
      modulos: 6,
      horas: 40,
      proyectos: 4
    },
    requisitos: [
      "Tableta gráfica o mouse",
      "Software de dibujo (opciones gratuitas incluidas)",
      "Pasión por el arte"
    ],
    objetivos: [
      "Dominar técnicas de ilustración digital",
      "Crear obras de arte personalizadas",
      "Desarrollar estilo artístico único"
    ],
    beneficios: [
      "Portfolio artístico digital",
      "Certificación en arte digital",
      "Acceso a comunidad de artistas"
    ],
    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,
    estadisticas: {
      satisfaccion: 94,
      empleabilidad: 82,
      completacion: 83
    }
  },
];

// Función para obtener cursos destacados
export const getCursosDestacados = (): Course[] => {
  return courses.filter(curso => curso.destacado);
};

// Función para obtener cursos por categoría
export const getCursosPorCategoria = (categoria: string): Course[] => {
  return courses.filter(curso => curso.categoria === categoria);
};

// Función para obtener curso por slug
export const getCursoPorSlug = (slug: string): Course | undefined => {
  return courses.find(curso => curso.slug === slug);
};

// Función para obtener todas las categorías
export const getCategorias = (): string[] => {
  const categorias = courses.map(curso => curso.categoria);
  return [...new Set(categorias)];
};