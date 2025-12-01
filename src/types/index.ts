// src/types/index.ts
import { ReactNode } from "react";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  emoji?: string;
  model3D: ReactNode;
  categoria: string;
  img: string;
  
  // Nuevos campos recomendados para mejorar la experiencia
  nivel?: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los niveles';
  duracion?: string;
  precio?: {
    mensual: number;
    completo: number;
    moneda?: string;
  };
  rating?: number;
  estudiantes?: number;
  destacado?: boolean;
  tags?: string[];
  contenido?: {
    modulos: number;
    horas: number;
    proyectos: number;
  };
  requisitos?: string[];
  objetivos?: string[];
  fechaInicio?: string;
  fechaFin?: string;
  instructor?: {
    nombre: string;
    avatar: string;
    rol: string;
    experiencia: string;
  };
  beneficios?: string[];
  certificado?: boolean;
  accesoVitalicio?: boolean;
  soporte?: boolean;
  comunidad?: boolean;
  // Estadísticas adicionales
  estadisticas?: {
    satisfaccion: number;
    empleabilidad: number;
    completacion: number;
  };
}

export interface Instructor {
  id: string;
  nombre: string;
  rol: string;
  experiencia: string;
  avatar: string;
  redes: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  bio: string;
  especialidades: string[];
  cursos: string[];
  calificacion: number;
}

export interface Testimonial {
  id: string;
  nombre: string;
  curso: string;
  mensaje: string;
  avatar: string;
  fecha?: string;
  rating: number;
  trabajo?: string;
  empresa?: string;
  destacado?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  contenido: string;
  autor: string;
  fecha: string;
  categoria: string;
  tags: string[];
  imagen: string;
  leeTiempo: number;
  destacado?: boolean;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
  rol: 'estudiante' | 'instructor' | 'admin';
  cursosInscritos: string[];
  progreso: {
    [courseId: string]: {
      completado: number;
      ultimaLeccion: string;
      fechaInscripcion: string;
    };
  };
  preferencias: {
    notificaciones: boolean;
    tema: 'claro' | 'oscuro';
    idioma: string;
  };
}

export interface PlanPago {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  moneda: string;
  intervalo: 'mensual' | 'anual' | 'unico';
  caracteristicas: string[];
  popular?: boolean;
  limiteCursos?: number;
  soportePrioritario?: boolean;
  certificados?: boolean;
}

export interface Certificado {
  id: string;
  cursoId: string;
  estudianteId: string;
  fechaEmision: string;
  fechaExpiracion?: string;
  codigoVerificacion: string;
  habilidades: string[];
  nivel: string;
  instructor: string;
  url: string;
}

// Tipos para filtros y búsqueda
export interface FiltroCursos {
  categoria?: string;
  nivel?: string;
  precioMin?: number;
  precioMax?: number;
  duracion?: string;
  rating?: number;
  certificado?: boolean;
  destacado?: boolean;
}

// Tipos para estadísticas
export interface EstadisticasPlataforma {
  totalEstudiantes: number;
  totalCursos: number;
  totalInstructores: number;
  satisfaccionPromedio: number;
  empleabilidadPromedio: number;
  paises: string[];
}

// Tipos para el carrito/compras
export interface CarritoItem {
  cursoId: string;
  precio: number;
  descuento?: number;
  fechaAgregado: string;
}

export interface Orden {
  id: string;
  usuarioId: string;
  items: CarritoItem[];
  total: number;
  descuento: number;
  fecha: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  metodoPago: string;
  transaccionId?: string;
}

// Tipos para la comunidad
export interface ForoPost {
  id: string;
  titulo: string;
  contenido: string;
  autor: string;
  cursoId?: string;
  fecha: string;
  respuestas: number;
  vistas: number;
  tags: string[];
  destacado?: boolean;
}

// Tipos para proyectos
export interface ProyectoEstudiante {
  id: string;
  estudianteId: string;
  cursoId: string;
  titulo: string;
  descripcion: string;
  tecnologias: string[];
  repositorio?: string;
  demo?: string;
  imagenes: string[];
  fecha: string;
  likes: number;
  comentarios: number;
  destacado?: boolean;
}