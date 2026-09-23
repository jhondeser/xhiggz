// src/server/teachers.ts
//
// Identidad del profesor. Un profesor es un User con role = TEACHER que entra
// con NextAuth (Google). El rol lo asigna solo el admin (/admin/profesores);
// el login con Google hace upsert por email y NO toca el rol.
//
// Regla: toda página, server action o query del área /profesor llama a
// getCurrentTeacher()/requireTeacher() en el servidor. El middleware solo
// comprueba que haya sesión, no el rol.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type Teacher = { id: number; name: string; email: string };

export class TeacherForbiddenError extends Error {
  constructor(message = "No tienes permiso para hacer esto") {
    super(message);
    this.name = "TeacherForbiddenError";
  }
}

/** El profesor con sesión iniciada, o null si no hay sesión o no es TEACHER. */
export async function getCurrentTeacher(): Promise<Teacher | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user || user.role !== "TEACHER") return null;
  return { id: user.id, name: user.name, email: user.email };
}

/** Para server actions: lanza si quien llama no es profesor. */
export async function requireTeacher(): Promise<Teacher> {
  const teacher = await getCurrentTeacher();
  if (!teacher) throw new TeacherForbiddenError();
  return teacher;
}

/** ¿Este profesor es el profesor asignado a este grupo? */
export async function isTeacherOfGroup(teacherId: number, groupId: number): Promise<boolean> {
  const g = await prisma.courseGroup.findUnique({
    where: { id: groupId },
    select: { teacherId: true },
  });
  return g !== null && g.teacherId === teacherId;
}
