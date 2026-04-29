"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import CourseModelViewer from "./CourseModelViwer";

export interface CourseModelProps {
  /** Ruta del archivo .glb dentro de /public (o URL absoluta del CDN). */
  src: string;
  /** Escala uniforme aplicada al modelo. */
  scale?: number;
  /** Posición [x, y, z]. */
  position?: [number, number, number];
  /** Rotación [x, y, z] en radianes. */
  rotation?: [number, number, number];
  /** Callback que se dispara cuando la escena GLTF queda lista. */
  onReady?: () => void;
}

function Model({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onReady,
}: CourseModelProps) {
  // El segundo argumento (true) activa el decoder Draco. Es transparente:
  // si el modelo NO está comprimido con Draco, simplemente se ignora.
  // Si lo está, drei descarga el decoder desde el CDN oficial de three.js.
  const { scene } = useGLTF(src, true);

  useEffect(() => {
    onReady?.();
  }, [scene, onReady]);

  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}

/**
 * Componente único para mostrar cualquier modelo .glb de un curso.
 * Sustituye a los antiguos archivos MineCurse*, RobloxCurse* y GodotCurse*.
 */
export default function CourseModel(props: CourseModelProps) {
  return (
    <CourseModelViewer>
      <Model {...props} />
    </CourseModelViewer>
  );
}
