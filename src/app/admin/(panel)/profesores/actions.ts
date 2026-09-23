// src/app/admin/(panel)/profesores/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminActor } from "@/server/admin-actor";

class AdminRuleError extends Error {}

function back(params: Record<string, string>): never {
  redirect(`/admin/profesores?${new URLSearchParams(params).toString()}`);
}

async function run(fn: () => Promise<string>): Promise<never> {
  await requireAdminActor(); // fuera del try: si no es admin, error real
  let result: Record<string, string>;
  try {
    result = { ok: await fn() };
  } catch (e) {
    if (e instanceof AdminRuleError) result = { error: e.message };
    else throw e;
  }
  revalidatePath("/admin/profesores");
  revalidatePath("/profesor");
  back(result);
}

/**
 * Da de alta a un profesor por email. Entrará con Google con ese email:
 * el login hace upsert por email y conserva el rol.
 * - Email nuevo → crea el User con role TEACHER.
 * - Email de un alumno SIN cursos → lo pasa a TEACHER.
 * - Email de un alumno CON cursos → rechaza (un User tiene un solo rol).
 */
export async function createTeacher(formData: FormData) {
  await run(async () => {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AdminRuleError("Email inválido");

    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, role: true, name: true, _count: { select: { enrollments: true } } },
    });

    if (!existing) {
      if (!name) throw new AdminRuleError("Pon el nombre del profesor");
      await prisma.user.create({ data: { name, email, role: "TEACHER" } });
      return `${name} dado de alta como profesor`;
    }
    if (existing.role === "TEACHER") throw new AdminRuleError("Ese email ya es profesor");
    if (existing.role === "ADMIN") throw new AdminRuleError("Ese email es de un admin");
    if (existing._count.enrollments > 0) {
      throw new AdminRuleError(
        "Ese email ya es de un alumno con cursos. Usa otro email para el profesor (por ejemplo uno institucional).",
      );
    }
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: "TEACHER", ...(name ? { name } : {}) },
    });
    return `${name || existing.name} ahora es profesor`;
  });
}

/** Asigna (o quita, con teacherId vacío) el profesor de un grupo. */
export async function setGroupTeacher(formData: FormData) {
  await run(async () => {
    const groupId = Number(formData.get("groupId"));
    const rawTeacher = String(formData.get("teacherId") ?? "");
    if (!Number.isInteger(groupId) || groupId <= 0) throw new AdminRuleError("Grupo inválido");

    let teacherId: number | null = null;
    if (rawTeacher !== "") {
      teacherId = Number(rawTeacher);
      const t = await prisma.user.findUnique({ where: { id: teacherId }, select: { role: true } });
      if (t?.role !== "TEACHER") throw new AdminRuleError("Ese usuario no es profesor");
    }

    const g = await prisma.courseGroup.update({
      where: { id: groupId },
      data: { teacherId },
      select: { nombre: true, course: { select: { title: true } } },
    });
    // Las sesiones pasadas conservan su teacherId: no se reasignan.
    return teacherId
      ? `Profesor asignado a ${g.course.title} · ${g.nombre}`
      : `${g.course.title} · ${g.nombre} queda sin profesor`;
  });
}

/** Quita el rol de profesor. Solo si ya no tiene grupos asignados. */
export async function removeTeacherRole(formData: FormData) {
  await run(async () => {
    const userId = Number(formData.get("userId"));
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, name: true, _count: { select: { groupsTaught: true } } },
    });
    if (!u || u.role !== "TEACHER") throw new AdminRuleError("Ese usuario no es profesor");
    if (u._count.groupsTaught > 0) {
      throw new AdminRuleError("Primero quítale sus grupos");
    }
    // Sus sesiones registradas se conservan (histórico de pagos).
    await prisma.user.update({ where: { id: userId }, data: { role: "STUDENT" } });
    return `${u.name} ya no es profesor`;
  });
}
