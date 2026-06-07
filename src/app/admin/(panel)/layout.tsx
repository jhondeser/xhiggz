import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin",               label: "Dashboard" },
  { href: "/admin/orders",        label: "Orders" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/enrollments",   label: "Enrollments" },
  { href: "/admin/users",         label: "Users" },
];

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-900 p-4 flex flex-col">
        <div className="mb-8">
          <Link href="/admin" className="text-xl font-semibold text-slate-100">
            xhiggs Admin
          </Link>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 text-sm transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
