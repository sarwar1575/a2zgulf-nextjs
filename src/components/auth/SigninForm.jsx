"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "../../redux/features/slice";

/** ---------- Config ---------- */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.a2zgulf.com/api").replace(/\/+$/, "");
const LOGIN_URL = `${API_BASE}/auth/login`;
const REGISTER_URL = `${API_BASE}/auth/register`;

/** ---------- CSRF helpers ---------- */
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
const captureCsrfFromPayloadOrCookie = (payload) => {
  const csrfFromBody =
    (payload && (payload.csrfToken || payload.csrf || payload.X_CSRF_TOKEN)) ||
    (payload && payload.data && (payload.data.csrfToken || payload.data.csrf || payload.data.X_CSRF_TOKEN));

  let stored = false;
  if (csrfFromBody) stored = saveCsrfIfPresent(csrfFromBody);
  if (!stored) {
    for (const key of CSRF_COOKIE_KEYS) {
      const v = getCookie(key);
      if (v && saveCsrfIfPresent(v)) break;
    }
  }
};

/** ---------- Helpers ---------- */
const isProbablyInvalidPassword = (status, message) =>
  status === 401 || /invalid password|invalid credentials/i.test(message || "");
const isProbablyNoUser = (status, message) =>
  status === 404 || /not found|no user|user does not exist/i.test(message || "");
const normMsg = (e) =>
  (typeof e === "string" && e) ||
  (e && e.response && e.response.data && e.response.data.message) ||
  (e && e.message) ||
  "Something went wrong";

/** ---------- Component ---------- */
export default function SigninForm({ onSuccess }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [step, setStep] = useState("EMAIL");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  /** ---------- Step 1: Email submit -> probe ---------- */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!emailValid) return setError("Please enter a valid email.");
    setBusy(true);
    try {
      const res = await axios.post(
        LOGIN_URL,
        { email, password: "__probe__" },
        { validateStatus: () => true, headers: { Accept: "application/json" } }
      );

      const status = res.status;
      const msg = String((res && res.data && res.data.message) || "");

      if (status === 200 || isProbablyInvalidPassword(status, msg)) {
        setStep("PASSWORD");
        return;
      }

      if (isProbablyNoUser(status, msg) || status === 400) {
        setStep("SIGNUP");
        const guess = (email.split("@")[0] || "").replace(/[._-]+/g, " ");
        setName(guess ? guess.charAt(0).toUpperCase() + guess.slice(1) : "");
        return;
      }

      setError((res && res.data && res.data.message) || "Unable to determine account status. Try again.");
    } catch (err) {
      setError(normMsg(err));
    } finally {
      setBusy(false);
    }
  };

  /** ---------- Step 2b: Signup -> register (with OTP redirect) ---------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your full name.");
    if (!signupPassword) return setError("Please set a password.");
    if (signupPassword !== signupConfirm) return setError("Passwords do not match.");

    setBusy(true);
    try {
      const res = await axios.post(
        REGISTER_URL,
        {
          name: name.trim(),
          email: email.trim(),
          password: signupPassword,
          confirmPassword: signupConfirm,
        },
        { headers: { "Content-Type": "application/json", Accept: "application/json" }, validateStatus: () => true }
      );

      if (res.status >= 400 && !/already exists/i.test(res.data?.message)) {
        throw new Error(res.data?.message || "Registration failed");
      }

      const payload = res.data || {};
      captureCsrfFromPayloadOrCookie(payload);

      // Backend returns verification URL or token
      const verifyUrl = payload.url || payload.data?.url;
      if (verifyUrl) {
        let tokenId = verifyUrl.split("/").pop();
        const authToken = payload.token || payload.data?.token;
        if (authToken) localStorage.setItem("authToken", authToken);
        if (tokenId) {
          router.replace(`/verify-otp/${tokenId}`);
          return;
        }
      }

      // fallback: auto-login
      try {
        await dispatch(login({ email: email.trim(), password: signupPassword })).unwrap();
      } catch {}
      router.replace("/");
    } catch (err) {
      setError(normMsg(err));
    } finally {
      setBusy(false);
    }
  };

  /** ---------- Step 2a: Password -> real login ---------- */
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!password) return setError("Please enter your password.");
    setBusy(true);
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      captureCsrfFromPayloadOrCookie(result);
      if (typeof onSuccess === "function") onSuccess();

      const role = result?.role || result?.data?.role || result?.user?.role || result?.data?.user?.role;
      const r = role?.toLowerCase();
      if (r === "seller") router.replace("/dashboard");
      else if (r === "buyer") router.replace("/");
      else router.replace("/");
    } catch (err) {
      setError(normMsg(err));
    } finally {
      setBusy(false);
    }
  };

  /** ---------- UI omitted for brevity (EMAIL, PASSWORD, SIGNUP forms) ---------- */
  

  /** ---------- UI ---------- */
  return (
    <div className="space-y-6">
      {/* Step header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {step === "EMAIL" && "Sign in to A2Z"}
          {step === "PASSWORD" && "Welcome back"}
          {step === "SIGNUP" && "Create your account"}
        </h2>
        <p className="text-sm text-gray-500">
          {step === "EMAIL" && "Use your email to continue."}
          {step === "PASSWORD" && `Email: ${email}`}
          {step === "SIGNUP" && `We didn't find an account for ${email}.`}
        </p>
      </div>

      {/* EMAIL STEP */}
      {step === "EMAIL" && (
        <form className="space-y-4" onSubmit={handleEmailSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
              autoComplete="email"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={busy || !emailValid}
            className="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition disabled:opacity-60"
          >
            {busy ? "Checking..." : "Continue"}
          </button>
        </form>
      )}

      {/* PASSWORD STEP */}
      {step === "PASSWORD" && (
        <form className="space-y-4" onSubmit={handlePasswordLogin}>
          <div className="text-sm text-gray-700">
            Not you?{" "}
            <button
              type="button"
              onClick={() => {
                setStep("EMAIL");
                setPassword("");
                setError("");
              }}
              className="text-blue-600 hover:underline"
            >
              Use a different email
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <a href="#" className="text-xs text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      )}

      {/* SIGNUP STEP */}
      {step === "SIGNUP" && (
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="text-sm text-gray-700">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setStep("PASSWORD");
                setError("");
              }}
              className="text-blue-600 hover:underline"
            >
              Sign in instead
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              disabled
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input
              id="signup-confirm"
              type="password"
              placeholder="Re-enter password"
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition disabled:opacity-60"
          >
            {busy ? "Creating account..." : "Sign up"}
          </button>
        </form>
      )}
    </div>
  );
}
