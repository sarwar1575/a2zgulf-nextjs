"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "../../redux/features/slice";

/** Try to read CSRF from common cookie names */
const CSRF_COOKIE_KEYS = ["XSRF-TOKEN", "csrf_token", "csrf", "X_CSRF_TOKEN"];
const getCookie = (name) => {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
};
const saveCsrfIfPresent = (maybe) => {
  if (!maybe) return false;
  try {
    localStorage.setItem("X_CSRF_TOKEN", String(maybe));
    return true;
  } catch {
    return false;
  }
};

function SigninForm({ onSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔐 Redux thunk -> backend login; .unwrap() throws on failure
      const result = await dispatch(login(formData)).unwrap();

      // ✅ CSRF capture (response body or cookies)
      const csrfFromBody =
        result?.csrfToken ||
        result?.data?.csrfToken ||
        result?.csrf ||
        result?.data?.csrf ||
        result?.X_CSRF_TOKEN ||
        result?.data?.X_CSRF_TOKEN;

      let stored = false;
      if (csrfFromBody) stored = saveCsrfIfPresent(csrfFromBody);
      if (!stored) {
        for (const key of CSRF_COOKIE_KEYS) {
          const v = getCookie(key);
          if (v) {
            stored = saveCsrfIfPresent(v);
            if (stored) break;
          }
        }
      }
      // (optional fallback for dev) if (!stored) localStorage.setItem("X_CSRF_TOKEN", "{{X_CSRF_TOKEN}}");

      // 🎯 Login success (since unwrap resolved):
      // 1) Close modal (if provided), 2) Redirect to dashboard.
      if (typeof onSuccess === "function") onSuccess();
      // small delay so modal close animation doesn't interrupt nav (optional)
      setTimeout(() => router.replace("/dashboard"), 10);
    } catch (err) {
      // unwrap threw => login failed
      setError(typeof err === "string" ? err : err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="john@domain.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-red-400 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <a href="#" className="text-xs text-blue-500 hover:underline">Forgot Password?</a>
        </div>
        <input
          id="password"
          type="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-blue-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center">
        <input id="terms" type="checkbox" className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500" />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
          I hereby accept the{" "}
          <a href="#" className="text-blue-500 hover:underline">T&amp;C</a> of A2Z
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-400 text-white font-semibold py-3 rounded-lg hover:bg-sky-500 transition disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default SigninForm;
