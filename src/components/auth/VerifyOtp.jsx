"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.a2zgulf.com/api").replace(/\/+$/, "");

const clampLen = (s, n) => (s || "").toString().slice(0, n);
const onlyCodeChars = (s) => (s || "").toString().replace(/[^0-9A-Za-z]/g, "").toUpperCase();
const normMsg = (e) => (typeof e === "string" && e) || (e?.response?.data?.message) || (e?.message) || "Something went wrong";

export default function VerifyOtp({ tokenId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [cells, setCells] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const otp = useMemo(() => cells.join(""), [cells]);
  const canVerify = useMemo(() => otp.length === 6, [otp]);

  const authToken = localStorage.getItem("authToken"); // Bearer token

  const focusIndex = (i) => {
    const el = inputsRef.current[i];
    if (el?.focus) el.focus();
  };

  useEffect(() => {
    if (!tokenId) return setError("Missing verification token.");
    const fetchInfo = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/auth/verify/${tokenId}`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${authToken}` },
          validateStatus: () => true,
        });
        if (res.status >= 400) return setError(res.data?.message || "Unable to load verification info.");
        setEmail(res.data?.email || res.data?.data?.email || "");
      } catch (e) {
        setError(normMsg(e));
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [tokenId]);

  const handleChange = (i, val) => {
    const v = onlyCodeChars(clampLen(val, 1));
    const next = [...cells];
    next[i] = v;
    setCells(next);
    if (v && i < 5) focusIndex(i + 1);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!canVerify) return setError("Enter 6-character OTP.");
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const res = await axios.post(`${API_BASE}/auth/verify/${tokenId}`, { otp }, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        validateStatus: () => true,
      });
      if (res.status >= 400 || res.data?.success === false) {
        setError(res.data?.message || "Verification failed.");
        setBusy(false);
        return;
      }
      setInfo("Verified! Redirecting…");
      setTimeout(() => router.replace("/"), 600);
    } catch (e) {
      setError(normMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (cooldown || busy) return;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const res = await axios.put(`${API_BASE}/auth/verify/regenerate`, { tokenId }, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        validateStatus: () => true,
      });
      if (res.status >= 400 || res.data?.success === false) {
        setError(res.data?.message || "Unable to resend code.");
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

  useEffect(() => {
    if (!cooldown) return;
    const timer = setInterval(() => setCooldown((n) => (n > 0 ? n - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (loading) return <div className="p-4 text-gray-500">Loading…</div>;

  return (
    <form className="space-y-6 p-4 max-w-md" onSubmit={handleVerify}>
      <div>
        <h2 className="text-xl font-semibold">Verify your email</h2>
        <p className="text-sm text-gray-500">Enter the 6-character code sent to {email || "your email"}.</p>
      </div>
      <div className="flex gap-2">
        {cells.map((v, i) => (
          <input key={i} ref={(el) => (inputsRef.current[i] = el)} value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            maxLength={1} className="w-12 h-12 text-center border rounded focus:ring-2 focus:ring-sky-400" />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {info && <p className="text-green-600 text-sm">{info}</p>}
      <button type="submit" disabled={!canVerify || busy} className="w-full bg-sky-500 text-white py-3 rounded">
        {busy ? "Verifying..." : "Verify"}
      </button>
      <div className="text-sm text-gray-700">
        Didn’t get the code?{" "}
        <button type="button" onClick={handleResend} disabled={busy || cooldown > 0} className="text-blue-600 hover:underline">
          Resend {cooldown > 0 ? `(${cooldown}s)` : ""}
        </button>
      </div>
    </form>
  );
}
