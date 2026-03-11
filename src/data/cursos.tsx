// src/data/cursos.tsx
import MineCurse1 from "@/components/three/MineCurse1Model";
import Minecurse2 from "@/components/three/MineCurse2Model";
import RobloxCurse1 from "@/components/three/RobloxCurse1";
import RobloxCurse2 from "@/components/three/RobloxCurse2";
import RobloxCurse3 from "@/components/three/RobloxCurse3";
import GodotCurse1 from "@/components/three/GodotCurse1Model";
import GodotCurse2 from "@/components/three/GodotCurse2Model";

import { Course } from "@/types";

export const courses: Course[] = [
  {
    id: "1",
    slug: "minecraft-education-basico",
    title: "Minecraft Education: Creación Digital Básica",
    description: "Aprende diseño, automatización y programación dentro de Minecraft Education creando un mundo interactivo paso a paso.",
    emoji: "⛏️",
    model3D: <MineCurse1 />,
    categoria: "Tecnología y Videojuegos",
    img: "/images/cursos_img/minecraft_card.png",

    nivel: "Principiante",
    duracion: "12 semanas",
    precio: {
      mensual: 39,
      completo: 99,
      moneda: "€"
    },
    rating: 4.9,
    estudiantes: 0,
    destacado: true,
    tags: [
      "Minecraft Education",
      "Programación",
      "Redstone",
      "Arquitectura",
      "Command Blocks",
      "MakeCode"
    ],

    contenido: {
      modulos: 8,
      horas: 18,
      proyectos: 6
    },

    requisitos: [
      "Computadora con acceso a internet",
      "Minecraft Education Edition instalado",
      "Cuenta activa para acceder a Minecraft Education",
      "Ganas de crear, explorar y aprender tecnología"
    ],

    objetivos: [
      "Aprender fundamentos de diseño y arquitectura dentro de Minecraft",
      "Comprender la lógica de automatización usando Redstone",
      "Introducirse en la programación con comandos, bloques y Agent",
      "Construir un mundo interactivo con sistemas funcionales y narrativa"
    ],

    beneficios: [
      "Aprendizaje práctico basado en proyectos",
      "Introducción amigable a programación, diseño y automatización",
      "Desarrollo de pensamiento lógico y creativo",
      "Experiencia colaborativa construyendo una ciudad digital"
    ],

    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,

    estadisticas: {
      satisfaccion: 96,
      empleabilidad: 0,
      completacion: 90
    },

    temario: [
      {
        modulo: "Preparación técnica",
        semanas: "Semana 1",
        temas: [
          "Instalación de Minecraft Education",
          "Configuración inicial",
          "Ingreso al mundo online",
          "Primera construcción libre"
        ]
      },
      {
        modulo: "Diseño y arquitectura",
        semanas: "Semanas 2-3",
        temas: [
          "Paletas de colores",
          "Texturización",
          "Profundidad en fachadas",
          "Construcción de casas",
          "Creación colaborativa del pueblo"
        ]
      },
      {
        modulo: "Ingeniería con Redstone",
        semanas: "Semanas 4-5",
        temas: [
          "Introducción a Redstone",
          "Circuitos básicos",
          "Puertas secretas",
          "Puertas automáticas",
          "Automatización aplicada a edificios"
        ]
      },
      {
        modulo: "Programación con comandos",
        semanas: "Semanas 6-7",
        temas: [
          "Comandos del chat",
          "Teleport",
          "Effects",
          "Give",
          "Uso de Command Blocks"
        ]
      },
      {
        modulo: "Programación con Agent",
        semanas: "Semanas 8-9",
        temas: [
          "Introducción a MakeCode",
          "Programación por bloques",
          "Movimientos del Agent",
          "Resolución de laberintos",
          "Automatización de tareas"
        ]
      },
      {
        modulo: "Geometría y construcción",
        semanas: "Semana 10",
        temas: [
          "Línea",
          "Cuadrado",
          "Cubo",
          "Pirámide",
          "Construcción espacial"
        ]
      },
      {
        modulo: "Narrativa interactiva",
        semanas: "Semana 11",
        temas: [
          "Construcción de pirámide temática",
          "Decoración egipcia",
          "NPCs",
          "Historia interactiva",
          "Bendiciones con efectos"
        ]
      },
      {
        modulo: "Economía y sistemas",
        semanas: "Semana 12",
        temas: [
          "Creación de mercado",
          "Intercambios con NPCs",
          "Sistemas de recompensas",
          "Integración del mundo final"
        ]
      }
    ]
  },
  {
    id: "2",
    slug: "minecraft-java-creator",
    title: "Minecraft Java: Dungeon Creator & Modding",
    description: "Aprende arquitectura avanzada, comandos, diseño de niveles y creación de mods en Minecraft Java construyendo una mazmorra interactiva con jefe final propio.",
    emoji: "🏰",
    model3D: <Minecurse2 />,
    categoria: "Tecnología y Videojuegos",
    img: "/images/cursos_img/micraft_card_lvl2.png",

    nivel: "Intermedio",
    duracion: "16 semanas",
    precio: {
      mensual: 49,
      completo: 169,
      moneda: "€"
    },
    rating: 4.9,
    estudiantes: 0,
    destacado: true,
    tags: [
      "Minecraft Java",
      "WorldEdit",
      "Axiom",
      "Command Blocks",
      "Scoreboards",
      "Blockbench",
      "MCreator",
      "Modding",
      "Level Design"
    ],

    contenido: {
      modulos: 4,
      horas: 24,
      proyectos: 4
    },

    requisitos: [
      "Computadora con acceso a internet",
      "Minecraft Java Edition instalado",
      "Conocimientos básicos de construcción y lógica en Minecraft",
      "Interés en diseño de videojuegos, arquitectura digital y programación"
    ],

    objetivos: [
      "Aprender a usar herramientas profesionales de construcción como WorldEdit y Axiom",
      "Diseñar y construir una mazmorra o coliseo temático con identidad propia",
      "Programar eventos, hordas, recompensas y progresión usando command blocks y scoreboards",
      "Crear un jefe final personalizado con Blockbench y darle vida dentro del juego con MCreator"
    ],

    beneficios: [
      "Aprendizaje práctico basado en un proyecto de videojuego completo",
      "Introducción real al diseño de niveles y programación orientada a eventos",
      "Desarrollo de creatividad, pensamiento lógico y visión de game design",
      "Primer acercamiento al modelado 3D, animación y modding dentro del ecosistema Minecraft Java"
    ],

    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,

    estadisticas: {
      satisfaccion: 97,
      empleabilidad: 0,
      completacion: 88
    },

    temario: [
      {
        modulo: "Setup y herramientas profesionales",
        semanas: "Semanas 1-3",
        temas: [
          "Instalación de Minecraft Java",
          "Instalación de Forge o Fabric",
          "Configuración del entorno moddeado",
          "Instalación de mods en local y en Aternos",
          "Introducción a WorldEdit y Axiom",
          "Selección de áreas, copiado, pegado y rotación",
          "Diseño de arquitectura temática"
        ]
      },
      {
        modulo: "Arquitectura y construcción del dungeon",
        semanas: "Semanas 4-7",
        temas: [
          "Terraformación y creación del terreno",
          "Construcción de la base estructural del coliseo o mazmorra",
          "Diseño de salas con temáticas propias",
          "Ambientación y storytelling visual",
          "Decoración avanzada",
          "Escala arquitectónica",
          "Introducción al level design"
        ]
      },
      {
        modulo: "Programación del dungeon",
        semanas: "Semanas 8-12",
        temas: [
          "Introducción a command blocks",
          "Coordenadas y activación de eventos",
          "Uso del comando execute",
          "Detección de jugadores en zonas",
          "Spawn de enemigos por oleadas",
          "Uso de scoreboards como variables",
          "Sistema de progresión por salas",
          "Recompensas automáticas al completar objetivos"
        ]
      },
      {
        modulo: "Creación del jefe final",
        semanas: "Semanas 13-16",
        temas: [
          "Introducción a Blockbench",
          "Modelado 3D del boss",
          "Texturización del personaje",
          "Animaciones básicas: idle, caminar y atacar",
          "Introducción a MCreator",
          "Importación del modelo",
          "Creación de entidad personalizada",
          "Integración del jefe final dentro del dungeon"
        ]
      }
    ]
  },
  {
    id: "3",
    slug: "roblox-studio-theme-park",
    title: "Roblox Studio: Theme Park Creator",
    description: "Aprende modelado 3D, scripting en Lua, interfaces y diseño de mecánicas creando un parque de atracciones interactivo con obbys temáticos y sistema de tickets.",
    emoji: "🎢",
    model3D: <RobloxCurse1 />,
    categoria: "Tecnología y Videojuegos",
    img: "/images/cursos_img/roblox_card_lvl1.png",

    nivel: "Principiante",
    duracion: "12 semanas",
    precio: {
      mensual: 39,
      completo: 99,
      moneda: "€"
    },
    rating: 4.9,
    estudiantes: 0,
    destacado: true,
    tags: [
      "Roblox Studio",
      "Lua",
      "Parts",
      "Models",
      "Explorer",
      "UI",
      "Tools",
      "Obby",
      "Game Design"
    ],

    contenido: {
      modulos: 4,
      horas: 18,
      proyectos: 4
    },

    requisitos: [
      "Computadora con acceso a internet",
      "Roblox Studio instalado",
      "No se requieren conocimientos previos de programación",
      "Interés en videojuegos, diseño creativo y creación de mundos interactivos"
    ],

    objetivos: [
      "Aprender a usar Roblox Studio y comprender su interfaz principal",
      "Modelar objetos y escenarios utilizando Parts y Models",
      "Comprender la jerarquía de objetos dentro del Explorer",
      "Introducirse en la programación con Lua usando variables, funciones, parámetros y eventos",
      "Crear herramientas interactivas y una interfaz gráfica básica",
      "Diseñar una atracción tipo obby dentro de un parque de atracciones digital",
      "Implementar un sistema de tickets para recompensar al jugador al completar atracciones"
    ],

    beneficios: [
      "Aprendizaje práctico basado en la creación de un videojuego real en Roblox",
      "Desarrollo de pensamiento lógico, creatividad y visión de game design",
      "Introducción amigable al scripting en Lua y a la interacción entre jugador y entorno",
      "Primer acercamiento al diseño de interfaces, mecánicas y niveles dentro del ecosistema Roblox"
    ],

    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,

    estadisticas: {
      satisfaccion: 97,
      empleabilidad: 0,
      completacion: 90
    },

    temario: [
      {
        modulo: "Setup y modelado con Parts",
        semanas: "Semanas 1-3",
        temas: [
          "Instalación de Roblox Studio",
          "Exploración de la interfaz principal",
          "Uso de Explorer y Properties",
          "Movimiento de cámara y manipulación de objetos",
          "Introducción a las Parts: Block, Cylinder, Sphere y Wedge",
          "Descomposición de objetos reales en formas geométricas",
          "Creación de modelos básicos como televisores, escritorios y decoración",
          "Agrupación y organización de objetos en Models"
        ]
      },
      {
        modulo: "Jerarquía y scripting inicial",
        semanas: "Semanas 4-6",
        temas: [
          "Comprensión de Parent y Child dentro del Explorer",
          "Organización correcta de modelos y objetos",
          "Introducción a variables en Lua",
          "Guardar referencias a piezas dentro del script",
          "Modificación de propiedades como Color, Size y CanCollide",
          "Creación de funciones",
          "Uso de parámetros en funciones",
          "Introducción a eventos y conexión entre eventos y funciones"
        ]
      },
      {
        modulo: "Interacción, Tools y UI",
        semanas: "Semanas 7-8",
        temas: [
          "Creación de una Tool básica",
          "Uso del evento Activated",
          "Interacción del jugador con objetos del entorno",
          "Programación de un control remoto que modifica el televisor",
          "Introducción a ScreenGui",
          "Uso de TextLabel, Frame e ImageButton",
          "Creación de un control visual con interfaz gráfica",
          "Cambio de colores e imágenes desde la UI"
        ]
      },
      {
        modulo: "Diseño del parque y obbys interactivos",
        semanas: "Semanas 9-12",
        temas: [
          "Introducción a las mecánicas de obby",
          "Creación de kill bricks personalizadas",
          "Plataformas móviles",
          "Puentes activados por botones",
          "Checkpoints y teletransportadores",
          "Diseño de una atracción temática propia",
          "Construcción del lobby del parque",
          "Sistema de tickets al completar atracciones",
          "UI para mostrar tickets del jugador",
          "Uso de Toolbox para ambientación y decoración final"
        ]
      }
    ]
  },
  {
    id: "4",
    slug: "roblox-studio-xhiggs-archipelago",
    title: "Roblox Studio: Xhiggs Archipelago",
    description: "Aprende construcción low poly, programación intermedia en Lua, NPCs, animaciones y combate básico creando un archipiélago de islas temáticas con aliados, enemigos y tools interactivas.",
    emoji: "🏝️",
    model3D: <RobloxCurse2 />,
    categoria: "Tecnología y Videojuegos",
    img: "/images/cursos_img/roblox_card_lvl2.png",

    nivel: "Intermedio",
    duracion: "16 semanas",
    precio: {
      mensual: 54,
      completo: 189,
      moneda: "€"
    },
    rating: 4.9,
    estudiantes: 0,
    destacado: true,
    tags: [
      "Roblox Studio",
      "Lua",
      "Low Poly",
      "Archimedes",
      "NPCs",
      "Animación",
      "Tools",
      "Combate",
      "World Building"
    ],

    contenido: {
      modulos: 5,
      horas: 24,
      proyectos: 5
    },

    requisitos: [
      "Computadora con acceso a internet",
      "Roblox Studio instalado",
      "Haber completado un curso básico de Roblox Studio o tener conocimientos equivalentes",
      "Conocimientos básicos de modelado con Parts, Explorer y scripting inicial en Lua",
      "Interés en creación de videojuegos, construcción de mundos y sistemas interactivos"
    ],

    objetivos: [
      "Construir una isla temática estilo low poly dentro de un archipiélago compartido",
      "Aprender a utilizar plugins de construcción como Archimedes para modelado más avanzado",
      "Fortalecer la lógica de programación en Lua con variables, comparadores, condicionales, funciones, tablas y ciclos",
      "Crear NPCs aliados con diálogos simples para ambientar el mundo",
      "Diseñar NPCs enemigos con movimiento en zona, detección de rango y ataque automático",
      "Utilizar el animador nativo de Roblox para crear animaciones de caminar, correr y atacar",
      "Programar tools como pico, arma de melee y arma a distancia para interactuar con los enemigos",
      "Integrar construcción, programación, animación y combate en un mundo explorable llamado Xhiggs Archipelago"
    ],

    beneficios: [
      "Aprendizaje práctico creando una experiencia de videojuego más completa dentro de Roblox",
      "Evolución natural desde scripting básico hacia sistemas jugables con NPCs y combate",
      "Desarrollo de pensamiento lógico, diseño de niveles y construcción de mundos con identidad visual",
      "Introducción sólida a la lógica que luego servirá para cursos más avanzados de Roblox y motores como Godot o Unity"
    ],

    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,

    estadisticas: {
      satisfaccion: 97,
      empleabilidad: 0,
      completacion: 88
    },

    temario: [
      {
        modulo: "Construcción del archipiélago low poly",
        semanas: "Semanas 1-3",
        temas: [
          "Presentación del proyecto Xhiggs Archipelago",
          "Planificación de la temática de cada isla",
          "Introducción a plugins de construcción como Archimedes",
          "Construcción de la base de una isla low poly",
          "Composición de terreno, alturas y volúmenes",
          "Diseño de caminos, zonas jugables y puntos de interés",
          "Ambientación visual de la isla",
          "Uso de Toolbox solo para objetos decorativos sin scripts"
        ]
      },
      {
        modulo: "Fundamentos intermedios de programación en Lua",
        semanas: "Semanas 4-7",
        temas: [
          "Introducción a variables con ejemplos aplicados a vida y daño",
          "Comparadores y operadores lógicos",
          "Condicionales aplicados a muerte de NPCs y detección de eventos",
          "Funciones para organizar acciones del juego",
          "Parámetros y reutilización de lógica",
          "Introducción a tablas para manejar datos simples",
          "Uso de ciclos para comprobaciones repetidas",
          "Micro ejemplos aplicados al mundo antes de entrar en sistemas de NPCs"
        ]
      },
      {
        modulo: "NPCs aliados, diálogos y animación",
        semanas: "Semanas 8-9",
        temas: [
          "Creación de NPCs aliados dentro de la isla",
          "Personalización visual de personajes con accesorios y colores",
          "Programación de diálogos simples de bienvenida o ambientación",
          "Introducción al animador nativo de Roblox",
          "Creación de animaciones básicas de caminar",
          "Creación de animaciones de correr",
          "Relación entre personaje, animación y comportamiento dentro del mundo"
        ]
      },
      {
        modulo: "Tools, daño y enemigos",
        semanas: "Semanas 10-13",
        temas: [
          "Diseño y programación de un pico",
          "Diseño y programación de un arma cuerpo a cuerpo",
          "Diseño y programación de un arma a distancia",
          "Sistema de daño aplicado a NPCs enemigos",
          "Variables de vida y condicionales de muerte",
          "Animaciones de ataque para tools y enemigos",
          "Movimiento de NPCs enemigos dentro de una zona específica",
          "Detección del jugador al entrar en rango",
          "Ataque automático básico de enemigos"
        ]
      },
      {
        modulo: "Integración final del mundo",
        semanas: "Semanas 14-16",
        temas: [
          "Integración de todas las islas dentro del archipiélago compartido",
          "Revisión de NPCs aliados y enemigos",
          "Ajuste de zonas jugables y combate",
          "Mejora de ambientación y detalles visuales",
          "Balance básico de enemigos y tools",
          "Pulido general del proyecto final",
          "Presentación del mundo completo Xhiggs Archipelago"
        ]
      }
    ]
  },
  {
    id: "5",
    slug: "roblox-studio-xhiggs-rpg",
    title: "Roblox Studio: Xhiggs RPG Systems",
    description: "Transforma el mundo del Xhiggs Archipelago en un RPG completo aprendiendo programación orientada a objetos en Lua, sistemas de clases, enemigos, loot, inventario y UI de personaje.",
    emoji: "⚔️",
    model3D: <RobloxCurse3 />,
    categoria: "Tecnología y Videojuegos",
    img: "/images/cursos_img/roblox_card_lvl3.png",

    nivel: "Avanzado",
    duracion: "20 semanas",
    precio: {
      mensual: 64,
      completo: 279,
      moneda: "€"
    },

    rating: 5,
    estudiantes: 0,
    destacado: true,

    tags: [
      "Roblox Studio",
      "Lua",
      "Programación Orientada a Objetos",
      "RPG Systems",
      "Inventario",
      "Game Systems",
      "NPC AI",
      "UI",
      "Game Design"
    ],

    contenido: {
      modulos: 6,
      horas: 30,
      proyectos: 1
    },

    requisitos: [
      "Computadora con acceso a internet",
      "Roblox Studio instalado",
      "Haber completado el curso Roblox Studio: Xhiggs Archipelago o tener conocimientos equivalentes",
      "Conocimientos intermedios de Lua y scripting en Roblox",
      "Interés en diseño de sistemas de videojuegos y RPGs"
    ],

    objetivos: [
      "Aprender programación orientada a objetos aplicada en Lua dentro de Roblox",
      "Crear un sistema de clases de personaje como Guerrero, Mago y Arquero",
      "Diseñar un sistema de atributos como vida, mana, fuerza, defensa y experiencia",
      "Crear enemigos basados en clases como tanque, arquero y mago",
      "Diseñar un sistema de combate basado en estadísticas",
      "Crear un sistema de objetos con propiedades como daño, tipo y rareza",
      "Programar un sistema de inventario para almacenar y equipar objetos",
      "Crear una interfaz visual para mostrar inventario y estadísticas del personaje"
    ],

    beneficios: [
      "Comprender cómo se estructuran los sistemas de un RPG",
      "Aprender programación orientada a objetos aplicada al desarrollo de videojuegos",
      "Desarrollar pensamiento de arquitectura de software en juegos",
      "Crear sistemas de inventario, enemigos y combate reutilizables",
      "Prepararse para motores profesionales de desarrollo de videojuegos como Godot o Unity"
    ],

    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,

    estadisticas: {
      satisfaccion: 98,
      empleabilidad: 0,
      completacion: 85
    },

    temario: [
      {
        modulo: "Introducción a Programación Orientada a Objetos",
        semanas: "Semanas 1-3",
        temas: [
          "Concepto de objeto en programación",
          "Propiedades y métodos",
          "Ejemplos simples como coche o computadora",
          "Introducción a tablas como objetos en Lua",
          "Creación de métodos dentro de objetos",
          "Instancias y reutilización de estructuras",
          "Primeros ejemplos de clases simples en Roblox"
        ]
      },
      {
        modulo: "Sistema de Clases del Jugador",
        semanas: "Semanas 4-7",
        temas: [
          "Creación del modelo de datos del jugador",
          "Atributos como vida, mana, fuerza, defensa y nivel",
          "Diseño de clases de personaje",
          "Implementación de Guerrero, Mago y Arquero",
          "Diferencias entre atributos de cada clase",
          "Sistema de selección de clase al entrar al juego",
          "Pruebas de balance entre clases"
        ]
      },
      {
        modulo: "Sistema de Enemigos",
        semanas: "Semanas 8-11",
        temas: [
          "Creación de una clase base de enemigo",
          "Propiedades como vida, daño y velocidad",
          "Métodos como atacar, recibir daño y morir",
          "Creación de enemigos tanque",
          "Creación de enemigos arquero",
          "Creación de enemigos mago",
          "Integración del sistema de combate"
        ]
      },
      {
        modulo: "Sistema de Objetos y Loot",
        semanas: "Semanas 12-14",
        temas: [
          "Modelo de datos de objetos",
          "Propiedades como nombre, tipo, daño y rareza",
          "Creación de diferentes tipos de armas",
          "Sistema de loot al derrotar enemigos",
          "Asignación aleatoria de recompensas",
          "Integración del loot con el jugador"
        ]
      },
      {
        modulo: "Sistema de Inventario",
        semanas: "Semanas 15-16",
        temas: [
          "Estructura de datos del inventario",
          "Agregar objetos al inventario",
          "Eliminar objetos",
          "Equipar objetos",
          "Modificar atributos del jugador al equipar objetos"
        ]
      },
      {
        modulo: "UI del Personaje e Integración Final",
        semanas: "Semanas 17-20",
        temas: [
          "Introducción a interfaces avanzadas en Roblox",
          "Creación del panel de inventario",
          "Visualización de objetos dentro del inventario",
          "Panel de estadísticas del personaje",
          "Equipamiento desde la interfaz",
          "Integración final del sistema RPG",
          "Pruebas del juego completo",
          "Presentación del proyecto final"
        ]
      }
    ]
  },
  {
    id: "6",
    slug: "godot-2d-xhiggs-xelda",
    title: "Godot 2D: Xelda Dungeon Creator",
    description: "Aprende desarrollo de videojuegos desde cero utilizando Godot y crea un juego estilo Zelda donde diseñarás tu propia mazmorra con enemigos, puzzles, NPCs y recompensas dentro del universo Xhiggs.",
    emoji: "🗡️",
    model3D: <GodotCurse1 />,
    categoria: "Tecnología y Videojuegos",
    img: "/images/cursos_img/godot_card_lvl1.png",

    nivel: "Intermedio",
    duracion: "16 semanas",
    precio: {
      mensual: 54,
      completo: 189,
      moneda: "€"
    },

    rating: 5,
    estudiantes: 0,
    destacado: true,

    tags: [
      "Godot",
      "GDScript",
      "Game Development",
      "2D Games",
      "Game Design",
      "Enemies AI",
      "NPC Systems",
      "Level Design",
      "Dungeon Systems"
    ],

    contenido: {
      modulos: 8,
      horas: 24,
      proyectos: 1
    },

    requisitos: [
      "Computadora con acceso a internet",
      "Godot Engine instalado",
      "Haber completado cursos de Roblox o tener conocimientos básicos de lógica de programación",
      "Interés en desarrollo de videojuegos",
      "Conocimientos básicos de scripting o lógica de eventos"
    ],

    objetivos: [
      "Comprender cómo funciona un motor profesional de videojuegos",
      "Aprender la estructura de nodos y escenas en Godot",
      "Crear un personaje jugable con movimiento, colisiones y animaciones",
      "Programar sistemas de interacción con objetos del entorno",
      "Crear enemigos con comportamientos básicos",
      "Desarrollar NPCs con sistemas de diálogo e interacción",
      "Diseñar una mazmorra con enemigos, puzzles y recompensas",
      "Participar en la creación de un videojuego colaborativo dentro del universo Xhiggs"
    ],

    beneficios: [
      "Aprender a utilizar un motor profesional de videojuegos",
      "Desarrollar habilidades de programación aplicadas a videojuegos",
      "Comprender la arquitectura básica de un videojuego",
      "Crear enemigos, NPCs y sistemas interactivos reutilizables",
      "Diseñar niveles y mazmorras con lógica de gameplay",
      "Prepararse para el desarrollo de videojuegos 3D y motores profesionales como Unity"
    ],

    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,

    estadisticas: {
      satisfaccion: 98,
      empleabilidad: 0,
      completacion: 85
    },

    temario: [
      {
        modulo: "Introducción al Motor Godot",
        semanas: "Semanas 1-2",
        temas: [
          "Instalación y configuración de Godot",
          "Interfaz del motor y organización del proyecto",
          "Concepto de nodos y escenas",
          "Estructura del Scene Tree",
          "Sprites y recursos visuales",
          "Introducción a TileMaps",
          "Creación del primer mapa del juego"
        ]
      },
      {
        modulo: "Creación del Personaje Jugable",
        semanas: "Semanas 3-4",
        temas: [
          "Nodo CharacterBody2D",
          "Movimiento del personaje",
          "Colisiones y físicas básicas",
          "Entrada del jugador",
          "Introducción a GDScript",
          "Funciones _ready y _physics_process",
          "Control completo del personaje"
        ]
      },
      {
        modulo: "Sistema de Animaciones",
        semanas: "Semanas 5-6",
        temas: [
          "Spritesheets y frames de animación",
          "Uso del nodo AnimatedSprite2D",
          "Animaciones Idle y Walk",
          "Animaciones de ataque",
          "Sincronización entre movimiento y animación",
          "Estados básicos del personaje"
        ]
      },
      {
        modulo: "Sistemas de Interacción",
        semanas: "Semanas 7-8",
        temas: [
          "Áreas de detección",
          "Sistema de señales (signals)",
          "Triggers e interacción con objetos",
          "Puertas y llaves",
          "Interruptores y mecanismos",
          "Primer dungeon interactivo"
        ]
      },
      {
        modulo: "Sistema de Enemigos",
        semanas: "Semanas 9-10",
        temas: [
          "Creación de enemigos",
          "Variables de vida y daño",
          "Sistema de combate básico",
          "Detección del jugador",
          "Estados de enemigo",
          "Patrullar, perseguir y atacar",
          "Integración del sistema de combate"
        ]
      },
      {
        modulo: "NPCs y Narrativa",
        semanas: "Semanas 11-12",
        temas: [
          "Creación de NPCs",
          "Sistemas de diálogo",
          "Interacciones con el jugador",
          "Entrega de recompensas",
          "Misiones simples",
          "Creación de una zona social o pueblo"
        ]
      },
      {
        modulo: "Diseño de Mazmorras",
        semanas: "Semanas 13-14",
        temas: [
          "Introducción al Level Design",
          "Diseño de mapas de mazmorra",
          "Integración de enemigos y puzzles",
          "Sistema de recompensas",
          "Diseño de una mazmorra temática",
          "Inspiración en mitología nórdica"
        ]
      },
      {
        modulo: "Proyecto Final: Xelda",
        semanas: "Semanas 15-16",
        temas: [
          "Integración de las mazmorras en el mundo principal",
          "Organización del proyecto final",
          "Introducción al trabajo colaborativo",
          "Pruebas del videojuego completo",
          "Optimización y corrección de errores",
          "Presentación del proyecto final",
          "Publicación del juego Xelda"
        ]
      }
    ]
  },
  {
    id: "7",
    slug: "godot-3d-xelda-realms-of-xhiggs",
    title: "Godot 3D: Xelda — Realms of Xhiggs",
    description: "Expande el universo de Xhiggs creando un videojuego 3D en tercera persona inspirado en Zelda. Aprende movimiento 3D, cámara, combate, NPCs, enemigos, animaciones y diseño de reinos conectados.",
    emoji: "🗡️",
    model3D: <GodotCurse2 />,
    categoria: "Tecnología y Videojuegos",
    img: "/images/cursos_img/godot_card_lvl2.png",

    nivel: "Avanzado",
    duracion: "16 semanas",
    precio: {
      mensual: 69,
      completo: 239,
      moneda: "€"
    },

    rating: 5,
    estudiantes: 0,
    destacado: true,

    tags: [
      "Godot",
      "Godot 3D",
      "GDScript",
      "Videojuegos 3D",
      "Third Person Controller",
      "Game Design",
      "Level Design",
      "NPC AI",
      "Combat System"
    ],

    contenido: {
      modulos: 6,
      horas: 24,
      proyectos: 1
    },

    requisitos: [
      "Computadora con acceso a internet",
      "Godot Engine instalado",
      "Haber completado el curso Godot 2D: Xelda — La Mazmorra de Xhiggs o tener conocimientos equivalentes",
      "Conocimientos básicos de programación y lógica de videojuegos",
      "Interés en desarrollo de videojuegos 3D y creación de mundos interactivos"
    ],

    objetivos: [
      "Comprender los fundamentos del desarrollo de videojuegos en 3D dentro de Godot",
      "Crear un sistema de movimiento en tercera persona con cámara estilo aventura",
      "Diseñar un reino 3D inspirado en un dios nórdico dentro del universo Xhiggs",
      "Implementar físicas, colisiones, saltos y navegación en escenarios tridimensionales",
      "Integrar modelos 3D, iluminación y ambientación para construir mundos inmersivos",
      "Crear animaciones básicas de personaje como idle, caminar, correr y atacar",
      "Diseñar enemigos con comportamiento básico, detección y combate",
      "Construir NPCs, diálogos, desafíos y un mini boss para el reino final"
    ],

    beneficios: [
      "Dar el salto de desarrollo 2D a desarrollo completo en 3D",
      "Aprender bases sólidas de videojuegos en tercera persona",
      "Comprender cómo se estructura un proyecto modular de mundo abierto por reinos",
      "Desarrollar habilidades transferibles a motores profesionales como Unity",
      "Construir una pieza real del universo compartido de Xhiggs que podrá crecer con futuras generaciones"
    ],

    certificado: true,
    accesoVitalicio: true,
    soporte: true,
    comunidad: true,

    estadisticas: {
      satisfaccion: 98,
      empleabilidad: 0,
      completacion: 85
    },

    temario: [
      {
        modulo: "Fundamentos del Espacio 3D en Godot",
        semanas: "Semanas 1-3",
        temas: [
          "Introducción al desarrollo de videojuegos en 3D",
          "Diferencias entre proyectos 2D y 3D",
          "Sistema de coordenadas X, Y, Z",
          "Node3D, jerarquías y transformaciones",
          "Escenas tridimensionales y organización del proyecto",
          "Creación de geometría básica para pruebas",
          "Primer prototipo de entorno 3D"
        ]
      },
      {
        modulo: "Control del Personaje y Cámara en Tercera Persona",
        semanas: "Semanas 4-6",
        temas: [
          "Uso de CharacterBody3D",
          "Movimiento del jugador en 3D",
          "Gravedad, salto y colisiones",
          "Rotación del personaje",
          "Creación de cámara en tercera persona",
          "Seguimiento del jugador con cámara estilo Zelda",
          "Control de cámara con mouse o joystick"
        ]
      },
      {
        modulo: "Construcción del Reino y Diseño de Niveles",
        semanas: "Semanas 7-9",
        temas: [
          "Bloqueo inicial del nivel con geometría simple",
          "Diseño del reino inspirado en mitología nórdica",
          "Construcción del terreno y zonas explorables",
          "Uso e importación de modelos 3D",
          "Introducción a assets modulares",
          "Iluminación básica, sombras y atmósfera",
          "Organización del reino en áreas de exploración"
        ]
      },
      {
        modulo: "Animación, Interacción y NPCs",
        semanas: "Semanas 10-11",
        temas: [
          "Introducción a animaciones en 3D",
          "Estados básicos: idle, caminar, correr y atacar",
          "AnimationPlayer y control de estados",
          "Creación de NPCs interactivos",
          "Sistemas de diálogo",
          "Eventos simples al hablar con personajes",
          "Integración narrativa dentro del reino"
        ]
      },
      {
        modulo: "Sistema de Combate y Enemigos",
        semanas: "Semanas 12-14",
        temas: [
          "Sistema básico de vida del jugador",
          "Hitboxes y detección de daño",
          "Ataque del personaje",
          "Creación de enemigos con IA básica",
          "Persecución del jugador y zonas de detección",
          "Recibir daño, morir y reiniciar combate",
          "Diseño de un mini boss del reino"
        ]
      },
      {
        modulo: "Integración Final del Reino y Presentación",
        semanas: "Semanas 15-16",
        temas: [
          "Diseño de un desafío o puzzle del reino",
          "Pulido visual del escenario",
          "Optimización básica del proyecto",
          "Conexión del reino con el universo de Xhiggs",
          "Preparación de portales o transición entre reinos",
          "Pruebas finales de jugabilidad",
          "Presentación del reino completo",
          "Integración del proyecto dentro de Xelda — Realms of Xhiggs"
        ]
      }
    ]
  }
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