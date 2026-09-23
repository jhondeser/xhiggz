// src/app/profesor/grupos/[id]/actions.ts
"use server";

// Las server actions son endpoints POST públicos: cada una vuelve a
// comprobar en el servidor que quien llama es TEACHER y profesor del grupo
// (lo hacen requireTeacher + setModuleRelease / registerGroupSession).
// Los errores de reglas se devuelven como ?error= en la URL para mostrarlos.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTeacher, TeacherForbiddenError } from "@/server/teachers";
import { setModuleRelease, ReleaseForbiddenError } from "@/server/module-releases";
import {
  registerGroupSession,
  updateSessionObservaciones,
  SessionRuleError,
} from "@/server/group-sessions";

function groupUrl(groupId: number, params: Record<string, string>): string {
  const qs = new URLSearchParams(params).toString();
  return `/profesor/grupos/${groupId}${qs ? `?${qs}` : ""}`;
}

/** Errores esperables → mensaje para el profesor. Lo demás se relanza. */
function userMessage(e: unknown): string {
  if (
    e instanceof SessionRuleError ||
    e instanceof ReleaseForbiddenError ||
    e instanceof TeacherForbiddenError
  ) {
    return e.message;
  }
  // setModuleRelease lanza Error normal para "Primero pega el link del vídeo", etc.
  if (e instanceof Error && e.message) return e.message;
  return "Algo ha fallado";
}

export async function teacherToggleRelease(formData: FormData) {
  const groupId = Number(formData.get("groupId"));
  const moduleId = Number(formData.get("moduleId"));
  const released = String(formData.get("nextValue")) === "true";

  let error: string | null = null;
  try {
    const teacher = await requireTeacher();
    await setModuleRelease({
      actor: { kind: "teacher", userId: teacher.id },
      groupId,
      moduleId,
      released,
    });
  } catch (e) {
    error = userMessage(e);
  }

  revalidatePath(`/profesor/grupos/${groupId}`);
  revalidatePath("/profesor");
  redirect(groupUrl(groupId, error ? { error } : {}) + `#modulo-${moduleId}`);
}

export async function teacherRegisterSession(formData: FormData) {
  const groupId = Number(formData.get("groupId"));
  const fecha = String(formData.get("fecha") ?? "");
  const observaciones = String(formData.get("observaciones") ?? "");

  let error: string | null = null;
  try {
    const teacher = await requireTeacher();
    await registerGroupSession({
      actor: { kind: "teacher", userId: teacher.id },
      groupId,
      fecha,
      observaciones,
    });
  } catch (e) {
    error = userMessage(e);
  }

  revalidatePath(`/profesor/grupos/${groupId}`);
  revalidatePath("/profesor");
  redirect(groupUrl(groupId, error ? { error } : { ok: "Clase registrada" }) + "#clases");
}

export async function teacherUpdateObservaciones(formData: FormData) {
  const groupId = Number(formData.get("groupId"));
  const sessionId = Number(formData.get("sessionId"));
  const observaciones = String(formData.get("observaciones") ?? "");

  let error: string | null = null;
  try {
    const teacher = await requireTeacher();
    await updateSessionObservaciones({
      actor: { kind: "teacher", userId: teacher.id },
      sessionId,
      observaciones,
    });
  } catch (e) {
    error = userMessage(e);
  }

  revalidatePath(`/profesor/grupos/${groupId}`);
  redirect(groupUrl(groupId, error ? { error } : { ok: "Observaciones guardadas" }) + "#clases");
}
