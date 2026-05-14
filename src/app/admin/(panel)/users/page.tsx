import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PER_PAGE = 25;

interface SP {
  page?: string;
  q?: string;
}

async function getData(sp: SP) {
  const page = Math.max(1, Number(sp.page) || 1);
  const q = sp.q?.trim() || undefined;

  const where: Prisma.UserWhereInput = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      include: {
        _count: {
          select: {
            enrollments: true,
            orders: true,
            subscriptions: true,
          },
        },
      },
    }),
  ]);

  return { rows, total, page, q };
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const { rows, total, page, q } = await getData(sp);
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));

  function buildLink(next: number) {
    const params = new URLSearchParams();
    params.set("page", String(next));
    if (q) params.set("q", q);
    return `?${params.toString()}`;
  }

  return (
    <div className="max-w-6xl">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="text-slate-400 text-sm mt-1">
          Cuentas registradas. {total.toLocaleString("es-ES")} totales con los
          filtros actuales.
        </p>
      </header>

      <form className="flex gap-3 mb-4 flex-wrap" method="GET">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por email o nombre…"
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm min-w-[280px]"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg px-4 py-2"
        >
          Buscar
        </button>
        <Link
          href="/admin/users"
          className="text-slate-400 hover:text-slate-100 text-sm self-center"
        >
          Limpiar
        </Link>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Alta</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-right px-4 py-3">Orders</th>
              <th className="text-right px-4 py-3">Subs</th>
              <th className="text-right px-4 py-3">Enrollments</th>
              <th className="text-left px-4 py-3">Stripe Customer</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-slate-500 py-12">
                  Sin resultados.
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-slate-800 hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                    {new Date(u.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{u.role}</td>
                  <td className="px-4 py-3 text-right">{u._count.orders}</td>
                  <td className="px-4 py-3 text-right">
                    {u._count.subscriptions}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u._count.enrollments}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">
                    {u.stripeCustomerId ?? "—"}
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
