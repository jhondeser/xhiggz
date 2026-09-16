// src/app/admin/(panel)/contenido/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { extractYoutubeId } from "@/lib/video";

export async function setModuleVideo(formData: FormData) {
  const moduleId = Number(formData.get("moduleId"));
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const rawUrl = String(formData.get("videoUrl") ?? "").trim();

  if (!moduleId) {
    throw new Error("moduleId inválido");
  }

  // Vacío = quitar el vídeo del módulo (volver a "Próximamente")
  if (rawUrl === "") {
    await prisma.courseModule.update({
      where: { id: moduleId },
      data: { videoUrl: null },
    });
  } else {
    const id = extractYoutubeId(rawUrl);
    if (!id) {
      throw new Error(
        "No reconozco ese link de YouTube. Pega la URL completa (youtube.com/watch?v=... o youtu.be/...) o solo el ID.",
      );
    }
    await prisma.courseModule.update({
      where: { id: moduleId },
      data: { videoUrl: rawUrl },
    });
  }

  if (courseSlug) {
    revalidatePath(`/admin/contenido`);
    revalidatePath(`/cursos/${courseSlug}/aula`);
  }
}

/** Prende/apaga el interruptor de "publicado" de un módulo — un clic. */
export async function togglePublicado(formData: FormData) {
  const moduleId = Number(formData.get("moduleId"));
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const nextValue = String(formData.get("nextValue")) === "true";

  if (!moduleId) {
    throw new Error("moduleId inválido");
  }

  await prisma.courseModule.update({
    where: { id: moduleId },
    data: { publicado: nextValue },
  });

  if (courseSlug) {
    revalidatePath(`/admin/contenido`);
    revalidatePath(`/cursos/${courseSlug}/aula`);
  }
}
