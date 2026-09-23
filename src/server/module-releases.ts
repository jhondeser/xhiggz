// src/server/module-releases.ts
//
// Liberación de vídeos por grupo (GroupModuleRelease).
//
// Cada CourseGroup avanza a su ritmo con su profesor: el vídeo de un módulo
// se libera solo para los grupos que ya dieron esa clase. Toda escritura pasa
// por setModuleRelease(), que recibe QUIÉN actúa (actor) y comprueba en el
// servidor que puede gestionar ese grupo.
//
// Hoy solo existe el actor "admin" (panel con contraseña compartida, sin User).
// Preparado para profesores: cuando exista CourseGroup.teacherId, basta con
// implementar la rama "teacher" de assertCanManageGroup().

import { prisma } from "@/lib/prisma";

export type ReleaseActor =
  | { kind: "admin" }
  | { kind: "teacher"; userId: number };

export class ReleaseForbiddenError extends Error {
  constructor(message = "No tienes permiso para gestionar este grupo") {
    super(message);
    this.name = "ReleaseForbiddenError";
  }
}

/**
 * Lanza ReleaseForbiddenError si el actor no puede liberar/ocultar módulos
 * de ese grupo.
 */
export async function assertCanManageGroup(
  actor: ReleaseActor,
  groupId: number,
): Promise<void> {
  if (actor.kind === "admin") return;

  // TODO(profesores): cuando exista CourseGroup.teacherId (y el User tenga
  // role TEACHER), comprobar aquí:
  //   const g = await prisma.courseGroup.findUnique({ where: { id: groupId }, select: { teacherId: true } });
  //   if (g?.teacherId !== actor.userId) throw new ReleaseForbiddenError();
  // Hasta entonces, ningún profesor puede liberar nada.
  void groupId;
  throw new ReleaseForbiddenError(
    "La liberación por profesor aún no está habilitada",
  );
}

/**
 * Libera (released = true) u oculta (released = false) el vídeo de un módulo
 * para un grupo. Idempotente.
 */
export async function setModuleRelease(params: {
  actor: ReleaseActor;
  groupId: number;
  moduleId: number;
  released: boolean;
}): Promise<void> {
  const { actor, groupId, moduleId, released } = params;

  if (!Number.isInteger(groupId) || groupId <= 0) throw new Error("groupId inválido");
  if (!Number.isInteger(moduleId) || moduleId <= 0) throw new Error("moduleId inválido");

  await assertCanManageGroup(actor, groupId);

  const [group, mod] = await Promise.all([
    prisma.courseGroup.findUnique({ where: { id: groupId }, select: { courseId: true } }),
    prisma.courseModule.findUnique({
      where: { id: moduleId },
      select: { courseId: true, videoUrl: true },
    }),
  ]);
  if (!group) throw new Error("El grupo no existe");
  if (!mod) throw new Error("El módulo no existe");
  if (group.courseId !== mod.courseId) {
    throw new Error("El módulo y el grupo no son del mismo curso");
  }

  if (!released) {
    await prisma.groupModuleRelease.deleteMany({ where: { groupId, moduleId } });
    return;
  }

  if (!mod.videoUrl) {
    throw new Error("Primero pega el link del vídeo de este módulo");
  }

  await prisma.groupModuleRelease.upsert({
    where: { groupId_moduleId: { groupId, moduleId } },
    create: {
      groupId,
      moduleId,
      publishedById: actor.kind === "teacher" ? actor.userId : null,
    },
    update: {}, // ya estaba liberado: se conserva la fecha original
  });
}

/** IDs de módulos liberados para un grupo (para el aula del alumno). */
export async function getReleasedModuleIds(
  groupId: number | null,
): Promise<Set<number>> {
  if (groupId === null) return new Set();
  const rows = await prisma.groupModuleRelease.findMany({
    where: { groupId },
    select: { moduleId: true },
  });
  return new Set(rows.map((r) => r.moduleId));
}
