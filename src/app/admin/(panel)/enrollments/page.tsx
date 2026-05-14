import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { EnrollmentStatus, EnrollmentSource } from "@prisma/client";

export const dynamic = "force-dynamic";

const PER_PAGE = 25;

interface SP {
  page?: string;
  status?: string;
  source?: string;
  course?: string;
  q?: string;
}

async function getData(sp: SP) {
  const page = Math.max(1, Number(sp.page) || 1);
  const status = (sp.status as EnrollmentStatus | "") || undefined;
  const source = (sp.source as EnrollmentSource | "") || undefined;
  const courseId = sp.course ? Number(sp.course) : undefined;
  const q = sp.q?.trim() || undefined;

  const where = {
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
    ...(courseId ? { courseId } : {}),
    ...(q
      ? { user: { email: { contains: q, mode: "insensitive" as const } } }
      : {}),
  };

  const [total, rows, courses] = await Promise.all([
    prisma.enrollment.count({ where }),
    prisma.enrollment.findMany({
      where,
      orderBy: { enrolledAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      include: {
        course: { select: { title: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { id: "asc" },
    }),
  ]);

  return { rows, total, page, courses, status, source, courseId, q };
}

function isAccessActive(e: {
  status: EnrollmentStatus;
  expiresAt: Date | null;
}): boolean {
  if (e.status !== "ACTIVE") return false;
  if (e.expiresAt === null) return true;
  return e.expiresAt > new Date();
}

export default async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const { rows, total, page, courses, status, source, courseId, q } =
    await getData(sp);
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));

  function buildLink(next: number) {
    const params = new URLSearchParams();
    params.set("page", String(next));
    if (status) params.set("status", status);
    if (source) params.set("source", source);
    if (courseId) params.set("course", String(courseId));
    if (q) params.set("q", q);
    return `?${params.toString()}`;
  }

  return (
    <div className="max-w-6xl">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Enrollments</h1>
        <p className="text-slate-400 text-sm mt-1">
          Inscripciones (fuente de verdad del acceso).{" "}
          {total.toLocaleString("es-ES")} totales con los filtros actuales.
        </p>
      </header>

      <form className="flex gap-3 mb-4 flex-wrap" method="GET">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por email…"
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm min-w-[220px]"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todos los status</option>
          {(["ACTIVE", "EXPIRED", "REFUNDED", "CANCELED"] as const).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          name="source"
          defaultValue={source ?? ""}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todos los orígenes</option>
          {(["ONE_TIME", "SUBSCRIPTION", "MANUAL"] as const).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          name="course"
          defaultValue={courseId ?? ""}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todos los cursos</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          Filtrar
        </button>
        <Link
          href="/admin/enrollments"
          className="text-slate-400 hover:text-slate-100 text-sm self-center"
        >
          Limpiar
        </Link>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Inscrito</th>
              <th className="text-left px-4 py-3">Usuario</th>
              <th className="text-left px-4 py-3">Curso</th>
              <th className="text-left px-4 py-3">Origen</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Expira</th>
              <th className="text-left px-4 py-3">Acceso</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-12">
                  Sin resultados con esos filtros.
                </td>
              </tr>
            ) : (
              rows.map((e) => {
                const active = isAccessActive(e);
                return (
                  <tr
                    key={e.id}
                    className="border-t border-slate-800 hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                      {new Date(e.enrolledAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-4 py-3">
                      <div>{e.user.email}</div>
                      <div className="text-xs text-slate-500">
                        {e.user.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {e.course?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {e.source}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {e.status}
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                      {e.expiresAt === null
                        ? "Vitalicio"
                        : new Date(e.expiresAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-xs border ${
                          active
                            ? "bg-emerald-900/40 text-emerald-300 border-emerald-800"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {active ? "Activo" : "Sin acceso"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {lastPage > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="text-slate-500">
            Página {page} de {lastPage}
          </div>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildLink(page - 1)}
                className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800"
              >
                ← Anterior
              </Link>
            )}
            {page < lastPage && (
              <Link
                href={buildLink(page + 1)}
                className="px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800"
              >
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
