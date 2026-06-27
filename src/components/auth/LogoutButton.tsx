"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-slate-400 hover:text-slate-100 text-sm underline disabled:opacity-50"
    >
      {loading ? "Saliendo…" : "Logout"}
    </button>
  );
}
