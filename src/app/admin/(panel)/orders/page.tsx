import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const PER_PAGE = 25;

interface SP {
  page?: string;
  status?: string;
  course?: string;
  q?: string;
}

async function getData(sp: SP) {
  const page = Math.max(1, Number(sp.page) || 1);
  const status = (sp.status as OrderStatus | "") || undefined;
  const courseId = sp.course ? Number(sp.course) : undefined;
  const q = sp.q?.trim() || undefined;

  const where = {
    ...(status ? { status } : {}),
    ...(courseId ? { courseId } : {}),
    ...(q
      ? { customerEmail: { contains: q, mode: "insensitive" as const } }
      : {}),
  };

  const [total, rows, courses] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      include: {
        course: { select: { title: true } },
        user: { select: { id: true, name: true } },
      },
    }),
    prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { id: "asc" },
    }),
  ]);

  return { rows, total, page, courses, status, courseId, q };
}

function formatEur(cents: number, currency: string): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const colors: Record<OrderStatus, string> = {
    PAID: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
    PENDING: "bg-amber-900/40 text-amber-300 border-amber-800",
    FAILED: "bg-red-900/40 text-red-300 border-red-800",
    REFUNDED: "bg-slate-800 text-slate-400 border-slate-700",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md text-xs border ${colors[status]}`}
    >
      {status}
    </span>
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const { rows, total, page, courses, status, courseId, q } = await getData(sp);
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));

  function buildLink(next: number) {
    const params = new URLSearchParams();
    params.set("page", String(next));
    if (status) params.set("status", status);
    if (courseId) params.set("course", String(courseId));
    if (q) params.set("q", q);
    return `?${params.toString()}`;
  }

  return (
    <div className="max-w-6xl">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Orders</h1>
        <p className="text-slate-400 text-sm mt-1">
          Pagos one-time (incluye anuales). {total.toLocaleString("es-ES")}{" "}
          totales con los filtros actuales.
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
          {(["PAID", "PENDING", "FAILED", "REFUNDED"] as const).map((s) => (
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
          href="/admin/orders"
          className="text-slate-400 hover:text-slate-100 text-sm self-center"
        >
          Limpiar
        </Link>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Fecha</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Curso</th>
              <th className="text-right px-4 py-3">Importe</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-slate-500 py-12"
                >
                  Sin resultados con esos filtros.
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-slate-800 hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                    {new Date(o.createdAt).toLocaleString("es-ES", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3">{o.customerEmail}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {o.course?.title ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatEur(o.amount, o.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))
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
