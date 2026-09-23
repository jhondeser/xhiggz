// src/app/admin/(panel)/contenido/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { extractYoutubeId } from "@/lib/video";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { setModuleRelease, type ReleaseActor } from "@/server/module-releases";

/**
 * Las server actions son endpoints POST: no basta con que el middleware
 * proteja la página, se vuelve a verificar la sesión de admin aquí dentro.
 */
async function requireAdminActor(): Promise<ReleaseActor> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret || !(await verifySessionToken(token, secret))) {
    throw new Error("No autorizado");
  }
  return { kind: "admin" };
}

export async function setModuleVideo(formData: FormData) {
  await requireAdminActor();

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

/**
 * Libera u oculta el vídeo de un módulo para UN grupo (una celda de la
 * matriz módulos × grupos). La autorización real la hace setModuleRelease.
 */
export async function toggleGroupRelease(formData: FormData) {
  const actor = await requireAdminActor();

  const moduleId = Number(formData.get("moduleId"));
  const groupId = Number(formData.get("groupId"));
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const released = String(formData.get("nextValue")) === "true";

  await setModuleRelease({ actor, groupId, moduleId, released });

  revalidatePath(`/admin/contenido`);
  if (courseSlug) revalidatePath(`/cursos/${courseSlug}/aula`);
}
