"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

/** ---------------- Config ---------------- */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.a2zgulf.com/api").replace(/\/+$/, "");

/** ---------------- Utils ---------------- */
const clampLen = (s, n) => (s || "").toString().slice(0, n);
const onlyCodeChars = (s) => (s || "").toString().replace(/[^0-9A-Za-z]/g, "").toUpperCase();
const normMsg = (e) =>
  (typeof e === "string" && e) || e?.response?.data?.message || e?.message || "Something went wrong";

// read cookie by name (for CSRF fallbacks)
const getCookie = (name) => {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
};

// Pull bearer and csrf from the usual places your app uses
const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("authToken") || localStorage.getItem("ACCESS_TOKEN") || "";
};
const getCsrfToken = () => {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("X_CSRF_TOKEN") ||
    getCookie("XSRF-TOKEN") ||
    getCookie("csrf_token") ||
    getCookie("csrf") ||
    getCookie("X_CSRF_TOKEN") ||
    ""
  );
};

const saveAuthToken = (maybe) => {
  try {
    const t = maybe?.access_token || maybe?.token || maybe;
    if (t) localStorage.setItem("ACCESS_TOKEN", String(t));
  } catch {}
};

// Build headers like your Postman screenshots
const buildHeaders = (extra = {}, { withBearer = true, withCsrf = true } = {}) => {
  const h = { Accept: "application/json", ...extra };
  if (withBearer) {
    const tk = getAuthToken();
    if (tk) h["Authorization"] = `Bearer ${tk}`;
  }
  if (withCsrf) {
    const csrf = getCsrfToken();
    if (csrf) h["X-CSRF-TOKEN"] = csrf;
  }
  return h;
};

export default function VerifyOtp({ tokenId }) {
  const router = useRouter();
  const search = useSearchParams();

  // What to do after success:
  // 1) ?next=... (highest priority)
  // 2) role=buyer|seller
  const nextParam = search.get("next") || "";
  const role = (search.get("role") || "").toLowerCase(); // "buyer" or "seller"
  const emailFromQ = search.get("email") || "";

  const computeRedirect = (verifiedEmail) => {
    if (nextParam) return nextParam;
    if (role === "buyer") {
      const e = verifiedEmail || emailFromQ || "";
      const qs = e ? `?step=erp&email=${encodeURIComponent(e)}` : "?step=erp";
      return `/become-seller${qs}`;
    }
    // default & seller flow
    return "/";
  };

  // UI state
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // OTP state (alphanumeric)
  const [cells, setCells] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const otp = useMemo(() => cells.join(""), [cells]);
  const canVerify = useMemo(() => otp.length === 6, [otp]);

  const focusIndex = (i) => {
    const el = inputsRef.current[i];
    if (el?.focus) el.focus();
  };

  // Load verification info (email). GET /auth/verify/:tokenId
  useEffect(() => {
    if (!tokenId) {
      setError("Missing verification token.");
      setLoading(false);
      return;
    }
    let cancelled = false;

    const fetchInfo = async () => {
      setLoading(true);
      try {
        // Try without auth first (many backends allow public info)
        let res = await axios.get(`${API_BASE}/auth/verify/${tokenId}`, {
          headers: { Accept: "application/json" },
          validateStatus: () => true,
        });

        // If your server requires auth even for this, retry with auth headers:
        if (res.status === 401 || res.status === 419 || res.status === 403) {
          res = await axios.get(`${API_BASE}/auth/verify/${tokenId}`, {
            headers: buildHeaders(),
            validateStatus: () => true,
          });
        }

        if (cancelled) return;

        if (res.status >= 400) {
          setError(res.data?.message || `Unable to load verification info (HTTP ${res.status}).`);
        } else {
          setEmail(res.data?.email || res.data?.data?.email || emailFromQ || "");
        }
      } catch (e) {
        if (!cancelled) setError(normMsg(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchInfo();

    return () => { cancelled = true; };
  }, [tokenId, emailFromQ]);

  const setCell = useCallback((i, val) => {
    setCells((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  }, []);

  const handleChange = (i, val) => {
    const v = onlyCodeChars(clampLen(val, 1));
    setCell(i, v);
    if (v && i < 5) focusIndex(i + 1);
  };

  // Smooth keyboard UX (backspace/arrow keys)
  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !cells[i] && i > 0) {
      e.preventDefault();
      setCell(i - 1, "");
      focusIndex(i - 1);
    }
    if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      focusIndex(i - 1);
    }
    if (e.key === "ArrowRight" && i < 5) {
      e.preventDefault();
      focusIndex(i + 1);
    }
  };

  // Paste entire OTP at once (alphanumeric, uppercase)
  const handlePaste = (e) => {
    const raw = (e.clipboardData || window.clipboardData).getData("text");
    const text = onlyCodeChars(raw);
    if (!text) return;
    e.preventDefault();
    const arr = text.slice(0, 6).padEnd(6, " ").split("");
    setCells(arr.map((c) => (/^[0-9A-Z]$/.test(c) ? c : "")));
    focusIndex(Math.min(text.length, 5));
  };

  // === POST /auth/verify/:tokenId ===
  // Will first try with Bearer+CSRF headers (Postman), then gracefully
  // retry without if server allows public verification.
  const postVerify = async () => {
    // 1) try: with bearer+csrf
    let res = await axios.post(
      `${API_BASE}/auth/verify/${tokenId}`,
      { code: otp },
      {
        headers: buildHeaders({ "Content-Type": "application/json" }),
        validateStatus: () => true,
      }
    );

    // 2) fallback: without bearer/csrf
    if (res.status === 401 || res.status === 419 || res.status === 403) {
      res = await axios.post(
        `${API_BASE}/auth/verify/${tokenId}`,
        { code: otp },
        {
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          validateStatus: () => true,
        }
      );
    }
    return res;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!canVerify) return setError("Enter 6-character OTP.");
    setBusy(true);
    setError("");
    setInfo("");

    try {
      const res = await postVerify();

      if (res.status >= 500) {
        setError(res.data?.message || "Server error during verification. Please try again.");
        return;
      }
      if (res.status >= 400 || res.data?.success === false) {
        setError(res.data?.message || `Verification failed (HTTP ${res.status}).`);
        return;
      }

      // Save any fresh token if server returns it here
      saveAuthToken(res.data);

      setInfo("Verified! Redirecting…");
      const target = computeRedirect(res.data?.email || email);
      setTimeout(() => router.replace(target), 600);
    } catch (e) {
      setError(normMsg(e));
    } finally {
      setBusy(false);
    }
  };

  // === PUT /auth/verify/regenerate ===
  const handleResend = async () => {
    if (cooldown || busy) return;
    setBusy(true);
    setError("");
    setInfo("");

    try {
      // Try with auth headers (as per Postman)
      let res = await axios.put(
        `${API_BASE}/auth/verify/regenerate`,
        { tokenId },
        { headers: buildHeaders({ "Content-Type": "application/json" }), validateStatus: () => true }
      );

      // Fallback: no auth
      if (res.status === 401 || res.status === 419 || res.status === 403) {
        res = await axios.put(
          `${API_BASE}/auth/verify/regenerate`,
          { tokenId },
          { headers: { Accept: "application/json", "Content-Type": "application/json" }, validateStatus: () => true }
        );
      }

      if (res.status >= 400 || res.data?.success === false) {
        setError(res.data?.message || `Unable to resend code (HTTP ${res.status}).`);
        return;
      }
      setInfo("OTP sent again.");
      setCooldown(30);
    } catch (e) {
      setError(normMsg(e));
    } finally {
      setBusy(false);
    }
  };

  // Cooldown ticker
  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((n) => (n > 0 ? n - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (loading) return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8"
        aria-label="Verify your email"
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Verify your email</h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter the 6-character code sent to <span className="font-medium text-gray-700">{email || "your email"}</span>.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 select-none" onPaste={handlePaste}>
          {cells.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={v}
              inputMode="text"
              autoComplete="one-time-code"
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-12 rounded-lg border border-gray-300 text-center text-lg font-semibold tracking-widest outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 uppercase"
              maxLength={1}
              aria-label={`OTP character ${i + 1}`}
            />
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {info && <p className="mt-4 text-sm text-green-600">{info}</p>}

        <button
          type="submit"
          disabled={!canVerify || busy}
          className="mt-6 w-full py-3 rounded-xl bg-sky-600 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-sky-700 transition"
        >
          {busy ? "Verifying…" : "Verify"}
        </button>

        <div className="mt-4 text-sm text-gray-700 text-center">
          Didn’t get the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={busy || cooldown > 0}
            className="text-sky-700 font-medium hover:underline disabled:opacity-60"
          >
            Resend {cooldown > 0 ? `(${cooldown}s)` : ""}
          </button>
        </div>
      </form>
    </div>
  );
}
