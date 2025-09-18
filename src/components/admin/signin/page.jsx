"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "@/lib/cookies";

export default function AdminSignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- NO BACKEND CALL ---
    // Put anything in the fields; we'll just set a dummy token and go.
    const dummyToken = "demo_admin_token_" + Math.random().toString(36).slice(2);

    // Cookie for middleware (if you kept it)
    setCookie("admin_token", dummyToken, 7);

    // Optional: keep in localStorage for client fetches later
    try { localStorage.setItem("ADMIN_TOKEN", dummyToken); } catch {}

    router.replace(next); // -> /admin
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3FAFE] p-4">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Admin Sign In</h1>
          <p className="text-sm text-gray-500">Enter anything and continue.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <div className="mt-1 relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 pr-16 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs border rounded-lg px-2 py-1"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#38CBFF] hover:opacity-90 text-white py-2 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-[11px] text-gray-500 mt-4">
          Demo only — no backend call; just redirects to the admin dashboard.
        </p>
      </div>
    </div>
  );
}
