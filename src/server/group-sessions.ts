// src/server/group-sessions.ts
//
// Registro de clases impartidas (GroupSession). Es la base del pago a
// profesores, así que las reglas viven aquí, en el servidor:
//
// - Una sola sesión por grupo y día (@@unique en la BD).
// - Profesor: solo en SUS grupos, solo en el día de la semana del grupo, nunca
//   en el futuro y como mucho VENTANA_DIAS hacia atrás (por si se le olvidó).
// - Admin: puede registrar cualquier día no futuro (recuperaciones, cambios
//   de día) y anular/restaurar sesiones.
// - teacherId se copia del grupo AL REGISTRAR y queda fijo: cambiar después
//   el profesor del grupo no reasigna sesiones pasadas.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  isYmd,
  sameDia,
  todayMadridYmd,
  addDaysYmd,
  weekdayEs,
  ymdToDbDate,
} from "@/lib/madrid-date";
import { assertCanManageGroup, type ReleaseActor } from "@/server/module-releases";

export type SessionActor = ReleaseActor;

/** Días hacia atrás que un profesor puede registrar una clase olvidada. */
export const VENTANA_DIAS = 14;

const MAX_OBSERVACIONES = 2000;

export class SessionRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionRuleError";
  }
}

function cleanObservaciones(raw: string | null | undefined): string | null {
  const text = (raw ?? "").trim();
  if (text === "") return null;
  if (text.length > MAX_OBSERVACIONES) {
    throw new SessionRuleError(`Las observaciones no pueden pasar de ${MAX_OBSERVACIONES} caracteres`);
  }
  return text;
}

export async function registerGroupSession(params: {
  actor: SessionActor;
  groupId: number;
  fecha: string; // YYYY-MM-DD (día de Madrid)
  observaciones?: string | null;
}): Promise<void> {
  const { actor, groupId, fecha } = params;

  if (!Number.isInteger(groupId) || groupId <= 0) throw new SessionRuleError("Grupo inválido");
  if (!isYmd(fecha)) throw new SessionRuleError("Fecha inválida");

  // Profesor: tiene que ser el profesor del grupo (y seguir siendo TEACHER).
  await assertCanManageGroup(actor, groupId);

  const group = await prisma.courseGroup.findUnique({
    where: { id: groupId },
    select: { teacherId: true, dia: true },
  });
  if (!group) throw new SessionRuleError("El grupo no existe");
  if (group.teacherId === null) {
    throw new SessionRuleError("Este grupo no tiene profesor asignado");
  }

  const today = todayMadridYmd();
  if (fecha > today) throw new SessionRuleError("No se pueden registrar clases futuras");

  if (actor.kind === "teacher") {
    if (!sameDia(weekdayEs(fecha), group.dia)) {
      throw new SessionRuleError(`Este grupo tiene clase los ${group.dia.toLowerCase()}`);
    }
    if (fecha < addDaysYmd(today, -VENTANA_DIAS)) {
      throw new SessionRuleError(
        `Solo puedes registrar clases de los últimos ${VENTANA_DIAS} días. Para otras, habla con el admin.`,
      );
    }
  }

  try {
    await prisma.groupSession.create({
      data: {
        groupId,
        teacherId: group.teacherId,
        fecha: ymdToDbDate(fecha),
        observaciones: cleanObservaciones(params.observaciones),
        createdById: actor.kind === "teacher" ? actor.userId : null,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new SessionRuleError("Ya hay una clase registrada para este grupo ese día");
    }
    throw e;
  }
}

/** Edita las observaciones. Profesor: solo sus propias sesiones no anuladas. */
export async function updateSessionObservaciones(params: {
  actor: SessionActor;
  sessionId: number;
  observaciones: string | null;
}): Promise<void> {
  const { actor, sessionId } = params;
  const s = await prisma.groupSession.findUnique({
    where: { id: sessionId },
    select: { teacherId: true, groupId: true, estado: true },
  });
  if (!s) throw new SessionRuleError("La sesión no existe");

  if (actor.kind === "teacher") {
    if (s.teacherId !== actor.userId) throw new SessionRuleError("Esta sesión no es tuya");
    if (s.estado === "ANULADA") throw new SessionRuleError("Esta sesión está anulada");
    // Sigue siendo profesor del grupo (si se lo quitaron, ya no edita).
    await assertCanManageGroup(actor, s.groupId);
  }

  await prisma.groupSession.update({
    where: { id: sessionId },
    data: { observaciones: cleanObservaciones(params.observaciones) },
  });
}

/** Anular / restaurar: solo admin. */
export async function setSessionEstado(params: {
  actor: SessionActor;
  sessionId: number;
  estado: "IMPARTIDA" | "ANULADA";
}): Promise<void> {
  if (params.actor.kind !== "admin") throw new SessionRuleError("Solo el admin puede anular sesiones");
  await prisma.groupSession.update({
    where: { id: params.sessionId },
    data: { estado: params.estado },
  });
}
