import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getMetrics() {
  const now = new Date();
  const [
    totalLeads,
    totalUsers,
    ordersPaid,
    revenueAgg,
    subsActive,
    enrollmentsActive,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    }),
    prisma.subscription.count({
      where: { status: { in: ["ACTIVE", "TRIALING"] } },
    }),
    prisma.enrollment.count({
      where: {
        status: "ACTIVE",
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    }),
  ]);

  return {
    totalLeads,
    totalUsers,
    ordersPaid,
    revenueCents: revenueAgg._sum.amount ?? 0,
    subsActive,
    enrollmentsActive,
  };
}

function formatEur(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default async function AdminDashboard() {
  const m = await getMetrics();

  const cards = [
    {
      label: "Leads",
      value: m.totalLeads.toLocaleString("es-ES"),
      hint: "Personas que clickearon comprar (no necesariamente pagaron)",
    },
    {
      label: "Users",
      value: m.totalUsers.toLocaleString("es-ES"),
      hint: "Cuentas creadas tras pago",
    },
    {
      label: "Orders pagadas",
      value: m.ordersPaid.toLocaleString("es-ES"),
      hint: "One-time / planes anuales",
    },
    {
      label: "Subscripciones activas",
      value: m.subsActive.toLocaleString("es-ES"),
      hint: "Status ACTIVE o TRIALING",
    },
    {
      label: "Enrollments activos",
      value: m.enrollmentsActive.toLocaleString("es-ES"),
      hint: "Con acceso vigente al curso",
    },
    {
      label: "Ingresos totales",
      value: formatEur(m.revenueCents),
      hint: "Suma de Orders PAID (no incluye subs)",
    },
  ];

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Resumen del estado actual del CRM y los pagos.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-2">
              {c.label}
            </div>
            <div className="text-3xl font-semibold">{c.value}</div>
            <div className="text-slate-500 text-xs mt-2">{c.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
