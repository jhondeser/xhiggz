"use client";

import dynamic from "next/dynamic";
import type { CourseModelProps } from "./CourseModel";

// Carga única y diferida del visor 3D. Todos los modelos comparten el mismo
// chunk de Three.js + drei, así que esto es más eficiente que el patrón
// anterior de un dynamic() por archivo.
const CourseModel = dynamic(() => import("./CourseModel"), { ssr: false });

type ModelConfig = Omit<CourseModelProps, "onReady">;

/**
 * Tabla de configuración de modelos. Para añadir un curso 3D nuevo basta con
 * agregar una entrada aquí — no hace falta crear un componente nuevo.
 */
const modelConfigs = {
  "mine-1":   { src: "/models/CommandBlock.glb",     scale: 0.8,  rotation: [0.15, 0.5, 0] },
  "mine-2":   { src: "/models/PortalDungueon.glb",   scale: 0.95, rotation: [0.15, 0.5, 0] },
  "roblox-1": { src: "/models/Ticket.glb",            scale: 0.95, rotation: [0.15, 0.5, 1] },
  "roblox-2": { src: "/models/Isle_of_the_Sword.glb", scale: 0.95, rotation: [0.15, 0.5, 0] },
  "roblox-3": { src: "/models/rpg.glb",               scale: 0.95, rotation: [0.15, 0.5, 0] },
  "godot-1":  { src: "/models/mazmorra.glb",         scale: 0.8,  rotation: [0.15, 0.5, 0] },
  "godot-2":  { src: "/models/portal.glb",            scale: 0.9,  rotation: [0.15, 0.5, 0] },
} as const satisfies Record<string, ModelConfig>;

export type ModelKey = keyof typeof modelConfigs;

interface RegistryProps {
  onReady?: () => void;
}

// Genera un componente "wrapper" estable por cada modelKey, ya pre-configurado.
// Se ejecuta una sola vez al cargar el módulo, así que las referencias son estables
// y React no las trata como nuevos componentes en cada render.
const buildEntry = (config: ModelConfig) => {
  const Entry = ({ onReady }: RegistryProps) => (
    <CourseModel {...config} onReady={onReady} />
  );
  Entry.displayName = `CourseModel[${config.src}]`;
  return Entry;
};

export const modelRegistry = {
  "mine-1":   buildEntry(modelConfigs["mine-1"]),
  "mine-2":   buildEntry(modelConfigs["mine-2"]),
  "roblox-1": buildEntry(modelConfigs["roblox-1"]),
  "roblox-2": buildEntry(modelConfigs["roblox-2"]),
  "roblox-3": buildEntry(modelConfigs["roblox-3"]),
  "godot-1":  buildEntry(modelConfigs["godot-1"]),
  "godot-2":  buildEntry(modelConfigs["godot-2"]),
} as const;

// Cache de URLs ya solicitadas para no duplicar requests.
const preloadedSrcs = new Set<string>();

/**
 * Lanza una petición HTTP al .glb del modelKey indicado para meterlo en
 * la caché del navegador. Cuando después se monte el CourseModel y llame
 * a useGLTF, la descarga será instantánea (servida desde caché HTTP).
 *
 * Es seguro llamarla muchas veces — sólo dispara fetch la primera.
 * Es no-bloqueante y silenciosa: si falla, se reintentará más tarde
 * cuando el modelo se cargue de verdad.
 */
export function preloadModel(key: ModelKey): void {
  // Sólo en cliente — preloads en SSR no tienen sentido y romperían.
  if (typeof window === "undefined") return;

  const config = modelConfigs[key];
  if (!config) return;
  if (preloadedSrcs.has(config.src)) return;

  preloadedSrcs.add(config.src);

  fetch(config.src, { method: "GET", cache: "force-cache" }).catch(() => {
    // Si falla (offline, 404, etc.) limpiamos para permitir reintentos.
    preloadedSrcs.delete(config.src);
  });
}
