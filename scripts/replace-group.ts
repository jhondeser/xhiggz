// scripts/replace-group.ts
//
// Sustituye el grupo de "Roblox Theme Park" del Martes (Franja A, 16:30-18:00)
// por un grupo nuevo de "Roblox Xhiggs RPG" en ese mismo día/franja, para
// poder inscribir al alumno que pidió esa clase a esa hora.
//
// No se borra el grupo viejo de Theme Park (así los alumnos ya inscritos ahí
// no se ven afectados) — simplemente se desactiva (activo=false) para que no
// se pueda seguir vendiendo, y se crea un grupo nuevo activo para RPG.
//
// Uso:
//   npx tsx scripts/replace-group.ts            # modo dry-run (no escribe)
//   npx tsx scripts/replace-group.ts --apply    # aplica cambios a la BD

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

const OLD_SLUG = "roblox-studio-theme-park";
const OLD_DIA = "Martes";
const OLD_FRANJA = "A";

const NEW_SLUG = "roblox-studio-xhiggs-rpg";
const NEW_NOMBRE = "Grupo 2";
const NEW_DIA = "Martes";
const NEW_FRANJA = "A";
const NEW_HORA_INICIO = "16:30";
const NEW_HORA_FIN = "18:00";
const NEW_PLAZAS_TOTAL = 8;

async function main() {
  console.log(`=== replace-group (${APPLY ? "APPLY" : "DRY-RUN"}) ===\n`);

  const oldCourse = await prisma.course.findUnique({ where: { slug: OLD_SLUG } });
  const newCourse = await prisma.course.findUnique({ where: { slug: NEW_SLUG } });

  if (!oldCourse) {
    console.error(`No se encontró el curso "${OLD_SLUG}"`);
    process.exit(1);
  }
  if (!newCourse) {
    console.error(`No se encontró el curso "${NEW_SLUG}"`);
    process.exit(1);
  }

  const oldGroup = await prisma.courseGroup.findFirst({
    where: { courseId: oldCourse.id, dia: OLD_DIA, franja: OLD_FRANJA },
  });

  if (!oldGroup) {
    console.error(
      `No se encontró grupo de "${OLD_SLUG}" en ${OLD_DIA} franja ${OLD_FRANJA}`,
    );
    process.exit(1);
  }

  console.log("─── Grupo actual a desactivar ───");
  console.log(
    `  ${oldCourse.title} → ${oldGroup.nombre} (${oldGroup.dia}, franja ${oldGroup.franja}, ${oldGroup.horaInicio}-${oldGroup.horaFin})`,
  );
  console.log(
    `  Plazas: ${oldGroup.plazasOcupadas}/${oldGroup.plazasTotal} ocupadas | activo=${oldGroup.activo}`,
  );
  if (oldGroup.plazasOcupadas > 0) {
    console.log(
      `  ⚠ Este grupo ya tiene ${oldGroup.plazasOcupadas} alumno(s) inscrito(s). Desactivarlo NO los afecta (siguen con su plaza y su horario tal cual) — solo deja de ofrecerse a alumnos nuevos.`,
    );
  }

  const existingNew = await prisma.courseGroup.findFirst({
    where: { courseId: newCourse.id, dia: NEW_DIA, franja: NEW_FRANJA },
  });

  console.log("\n─── Grupo nuevo a crear ───");
  if (existingNew) {
    console.log(
      `  ⚠ Ya existe un grupo de "${NEW_SLUG}" en ${NEW_DIA} franja ${NEW_FRANJA} (${existingNew.nombre}, id=${existingNew.id}, activo=${existingNew.activo}). No se creará uno duplicado.`,
    );
  } else {
    console.log(
      `  ${newCourse.title} → ${NEW_NOMBRE} (${NEW_DIA}, franja ${NEW_FRANJA}, ${NEW_HORA_INICIO}-${NEW_HORA_FIN}), plazasTotal=${NEW_PLAZAS_TOTAL}`,
    );
  }

  if (!APPLY) {
    console.log("\nDry-run: no se ha escrito nada. Repite con --apply para aplicar.");
    return;
  }

  console.log("\n─── Aplicando cambios ───");

  if (oldGroup.activo) {
    await prisma.courseGroup.update({
      where: { id: oldGroup.id },
      data: { activo: false },
    });
    console.log(`  ✓ Grupo "${oldGroup.nombre}" de ${oldCourse.title} desactivado`);
  } else {
    console.log(`  · Grupo "${oldGroup.nombre}" de ${oldCourse.title} ya estaba inactivo`);
  }

  if (!existingNew) {
    const created = await prisma.courseGroup.create({
      data: {
        courseId: newCourse.id,
        nombre: NEW_NOMBRE,
        dia: NEW_DIA,
        franja: NEW_FRANJA,
        horaInicio: NEW_HORA_INICIO,
        horaFin: NEW_HORA_FIN,
        plazasTotal: NEW_PLAZAS_TOTAL,
        plazasOcupadas: 0,
        activo: true,
      },
    });
    console.log(
      `  ✓ Grupo "${created.nombre}" de ${newCourse.title} creado (id=${created.id})`,
    );
  } else {
    console.log(`  · Ya existía, no se creó nada nuevo.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
