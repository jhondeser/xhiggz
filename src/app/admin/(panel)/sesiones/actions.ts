// src/app/admin/(panel)/sesiones/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminActor } from "@/server/admin-actor";
import { registerGroupSession, setSessionEstado, SessionRuleError } from "@/server/group-sessions";

function back(mes: string, params: Record<string, string>): never {
  const qs = new URLSearchParams({ ...(mes ? { mes } : {}), ...params }).toString();
  redirect(`/admin/sesiones?${qs}`);
}

/** Registrar una clase desde el admin (recuperaciones, cambios de día…). */
export async function adminRegisterSession(formData: FormData) {
  const actor = await requireAdminActor();
  const mes = String(formData.get("mes") ?? "");
  let result: Record<string, string>;
  try {
    await registerGroupSession({
      actor,
      groupId: Number(formData.get("groupId")),
      fecha: String(formData.get("fecha") ?? ""),
      observaciones: String(formData.get("observaciones") ?? ""),
    });
    result = { ok: "Clase registrada" };
  } catch (e) {
    if (e instanceof SessionRuleError) result = { error: e.message };
    else throw e;
  }
  revalidatePath("/admin/sesiones");
  back(mes, result);
}

/** Anular o restaurar una clase. */
export async function adminSetSessionEstado(formData: FormData) {
  const actor = await requireAdminActor();
  const mes = String(formData.get("mes") ?? "");
  const estado = String(formData.get("estado")) === "ANULADA" ? "ANULADA" : "IMPARTIDA";
  await setSessionEstado({ actor, sessionId: Number(formData.get("sessionId")), estado });
  revalidatePath("/admin/sesiones");
  back(mes, { ok: estado === "ANULADA" ? "Clase anulada" : "Clase restaurada" });
}
