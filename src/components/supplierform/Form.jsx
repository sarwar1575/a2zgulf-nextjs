'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import FormBanner from './FormBanner';
import ERPDATA from '../../data/ERPCO.json';
import { login as loginAction, register as registerAction } from '../../redux/features/slice';

/* ======================
   API CONFIG + HELPERS
   ====================== */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.a2zgulf.com/api').replace(/\/+$/, '');

const URLS = {
  REGISTER: `${API_BASE}/auth/register`,                         // POST
  LOGIN: `${API_BASE}/auth/login`,                               // POST
  VERIFY_OTP: (tokenId) => `${API_BASE}/auth/verify/${tokenId}`, // POST { code }
  REGENERATE_OTP: `${API_BASE}/auth/verify/regenerate`,          // PUT (Bearer)
  COUNTRIES: `${API_BASE}/core/countries`,                       // GET
  COUNTRY_FILETYPES: (code) => `${API_BASE}/core/countries/${encodeURIComponent(code)}/filetypes`, // GET
  PROFILE: `${API_BASE}/users/profile`,                          // GET (Bearer) optional
};

const DASHBOARD_PATH = '/dashboard';

const saveToken = (t) => { try { if (t) localStorage.setItem('ACCESS_TOKEN', t); } catch {} };
const getToken  = () => { try { return localStorage.getItem('ACCESS_TOKEN') || ''; } catch { return ''; } };

/* ======================
   MAIN COMPONENT
   ====================== */
export default function Form() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, error: reduxError } = useSelector((s) => s.auth || {});

  // Steps: email -> password -> signup -> otp -> erp
  const [step, setStep] = useState('email');

  // Shared UI
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  // Email step
  const [email, setEmail] = useState('');
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);

  // Existing user login step
  const [password, setPassword] = useState('');

  // Signup step (new)
  const [companyName, setCompanyName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Country + dynamic documents (UI-only; not sent to /auth/register)
  const [countryList, setCountryList] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [docFields, setDocFields] = useState([]);

  // OTP step
  const [pendingTokenId, setPendingTokenId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(30);

  // ERP step
  const [selectedERP, setSelectedERP] = useState(null);
  const [connectingERP, setConnectingERP] = useState(false);
  const [connectError, setConnectError] = useState('');

  /* ======================
     EMAIL → robust existence check
     ====================== */

  const looksLikeExistsMessage = (m = '') => {
    const msg = String(m).toLowerCase();
    return (
      msg.includes('already exist') ||
      msg.includes('already_exists') ||
      msg.includes('exists') ||
      msg.includes('email already') ||
      msg.includes('user already')
    );
  };

  const looksLikeInvalidPassword = (m = '') => {
    const s = String(m).toLowerCase();
    return s.includes('invalid password') || s.includes('wrong password') || s.includes('invalid credentials');
  };

  const looksLikeUserNotFound = (m = '') => {
    const s = String(m).toLowerCase();
    return s.includes('user not found') || s.includes('no user') || s.includes('account not found') || s.includes('email not found');
  };

  // Fallback: try login with dummy password to infer existence
  const probeByLoginDummy = async (probeEmail) => {
    const resp = await axios.post(
      URLS.LOGIN,
      { email: probeEmail, password: '__dummy_pw__' },
      { validateStatus: () => true }
    );
    const st = resp?.status ?? 0;
    const m = resp?.data?.message || '';
    if (st === 401 || looksLikeInvalidPassword(m)) return true;   // user exists but wrong password
    if (st === 404 || looksLikeUserNotFound(m)) return false;     // user doesn't exist
    return looksLikeExistsMessage(m);                              // best-guess
  };

  const onCheckEmail = async () => {
    setNotice('');
    if (!emailValid) { setNotice('Please enter a valid email address.'); return; }

    setBusy(true);
    try {
      // Primary probe via REGISTER (as requested)
      const res = await axios.post(
        URLS.REGISTER,
        { email, checkOnly: true },
        { validateStatus: () => true }
      );
      const status = res?.status ?? 0;
      const msg = res?.data?.message || '';

      if (status === 409 || looksLikeExistsMessage(msg)) { setStep('password'); return; }

      if (status === 422 || status === 400) { // validation path → fallback probe
        const exists = await probeByLoginDummy(email);
        setStep(exists ? 'password' : 'signup');
        return;
      }

      if (status >= 200 && status < 300) { setStep('signup'); return; }

      const exists = await probeByLoginDummy(email);
      setStep(exists ? 'password' : 'signup');
    } catch (err) {
      console.error(err);
      try {
        const exists = await probeByLoginDummy(email);
        setStep(exists ? 'password' : 'signup');
      } catch {
        setStep('signup');
      }
    } finally {
      setBusy(false);
    }
  };

  /* =========================
     EXISTING USER → LOGIN
     ========================= */
  const onExistingLogin = async () => {
    setNotice('');
    if (!emailValid) { setNotice('Invalid email.'); return; }
    if (!password) { setNotice('Please enter password.'); return; }

    setBusy(true);
    try {
      let access = null;
      try {
        const result = await dispatch(loginAction({ email, password })).unwrap();
        access = result?.access_token || result?.token || null;
      } catch (_) {
        const resp = await axios.post(URLS.LOGIN, { email, password }, { withCredentials: true });
        access = resp?.data?.access_token || resp?.data?.token || null;
      }
      if (!access) throw new Error('No token received from login.');
      saveToken(access);

      try { await axios.get(URLS.PROFILE, { headers: { Authorization: `Bearer ${access}` } }); } catch {}

      router.replace(DASHBOARD_PATH);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setNotice(msg);
    } finally {
      setBusy(false);
    }
  };

  /* =========================
     SIGNUP (NEW) → REGISTER → OTP
     ========================= */
  useEffect(() => {
    if (step !== 'signup') return;
    let abort = false;
    (async () => {
      try {
        const res = await axios.get(URLS.COUNTRIES);
        if (!abort) setCountryList(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch (e) {
        console.error('Countries fetch failed', e);
        if (!abort) setCountryList([]);
      }
    })();
    return () => { abort = true; };
  }, [step]);

  useEffect(() => {
    if (!countryCode) return;
    let abort = false;
    (async () => {
      try {
        const res = await axios.get(URLS.COUNTRY_FILETYPES(countryCode));
        if (!abort) setDocFields(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch (e) {
        console.error('Country filetypes fetch failed', e);
        if (!abort) setDocFields([]);
      }
    })();
    return () => { abort = true; };
  }, [countryCode]);

  const onRegisterNewUser = async () => {
    setNotice('');

    if (!companyName) { setNotice('Please enter company name.'); return; }
    if (!countryCode) { setNotice('Please select your country.'); return; } // UI-only requirement
    if (!signupPassword || !signupConfirmPassword) { setNotice('Please enter and confirm your password.'); return; }
    if (signupPassword !== signupConfirmPassword) { setNotice('Password and Confirm Password do not match.'); return; }

    setBusy(true);
    try {
      // IMPORTANT: do NOT send "country" to /auth/register (it causes 422)
      let tokenId = '';
      try {
        const result = await dispatch(
          registerAction({
            name: companyName,
            email,
            password: signupPassword,
            confirmPassword: signupConfirmPassword,
          })
        ).unwrap();
        tokenId = result?.tokenId || result?.data?.tokenId || '';
      } catch {
        const r = await axios.post(URLS.REGISTER, {
          name: companyName,
          email,
          password: signupPassword,
          confirmPassword: signupConfirmPassword,
        });
        tokenId = r?.data?.tokenId || r?.data?.data?.tokenId || '';
      }

      if (!tokenId) {
        setNotice('Could not get verification token from server.');
        setBusy(false);
        return;
      }

      setPendingTokenId(tokenId);
      setStep('otp');
      setOtp(['', '', '', '', '', '']);
      setResendTimer(30);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      setNotice(msg);
    } finally {
      setBusy(false);
    }
  };

  /* =========================
     OTP → VERIFY → ERP
     ========================= */
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleOtpChange = (val, idx) => {
    const char = (val || '').slice(-1).toUpperCase().replace(/[^A-Z0-9]/g, '');
    setOtp((prev) => {
      const n = [...prev];
      n[idx] = char;
      return n;
    });
    if (char && idx < otpRefs.current.length - 1) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowLeft' && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < otpRefs.current.length - 1) otpRefs.current[idx + 1]?.focus();
  };

  const onVerifyOtp = async () => {
    setNotice('');
    const code = otp.join('');
    if (code.length !== 6) { setNotice('Please enter the 6-character OTP.'); return; }
    if (!pendingTokenId) { setNotice('Missing verification token.'); return; }

    setBusy(true);
    try {
      const resp = await axios.post(URLS.VERIFY_OTP(pendingTokenId), { code }, { withCredentials: true });
      const access = resp?.data?.access_token || resp?.data?.token || '';
      if (access) saveToken(access);
      setStep('erp');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Invalid or expired code.';
      setNotice(msg);
    } finally {
      setBusy(false);
    }
  };

  const onResendOtp = async () => {
    setNotice('');
    setResendTimer(30);
    try {
      const access = getToken();
      await axios.put(
        URLS.REGENERATE_OTP,
        {},
        { headers: { Authorization: `Bearer ${access}` }, withCredentials: true }
      );
    } catch (e) {
      console.error('Resend OTP failed', e);
    }
  };

  /* =========================
     ERP → ZOHO → DASHBOARD
     ========================= */
  const handleConnectERP = async () => {
    if (selectedERP == null) { setConnectError('Please select an ERP first.'); return; }
    setConnectingERP(true);
    setConnectError('');

    try {
      const provider = String(
        ERPDATA?.[selectedERP]?.provider ||
        ERPDATA?.[selectedERP]?.id ||
        ERPDATA?.[selectedERP]?.name ||
        'ZOHO'
      ).toUpperCase();

      const tokenToUse = getToken() || token;
      if (!tokenToUse) throw new Error('Missing auth token.');

      const csrf = localStorage.getItem('X_CSRF_TOKEN') || '1';
      const qs = new URLSearchParams({ email }).toString();

      const resp = await fetch(`/api/erp-auth/${provider}/start${qs ? `?${qs}` : ''}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
          'X-CSRF-TOKEN': csrf,
        },
        credentials: 'include',
      });

      if (!resp.ok) {
        const errTxt = await resp.text().catch(() => '');
        throw new Error(errTxt || `Failed: ${resp.status}`);
      }

      const { startUrl, redirectAfter } = await resp.json();
      if (!startUrl) throw new Error('OAuth URL missing from server.');

      window.location.assign(startUrl);
      setTimeout(() => router.replace(redirectAfter || DASHBOARD_PATH), 2000);
    } catch (e) {
      setConnectError(e?.message || 'Failed to start ERP OAuth');
      setConnectingERP(false);
    }
  };

  /* ================
     RENDER
     ================ */
  return (
    <>
      <FormBanner />

      <div className="suppliervalidation absolute left-1/2 top-24 -translate-x-1/2 w-full">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full md:w-7/12 lg:w-6/12 mx-auto pb-7">
              <form className="bg-white rounded-xl py-6 px-8 shadow-md" onSubmit={(e) => e.preventDefault()}>
                {/* EMAIL ONLY */}
                {step === 'email' && (
                  <>
                    <h6 className="text-[28px] font-semibold text-[#2B2F32] pb-4 text-center">Become a supplier</h6>
                    <p className="text-[16px] font-semibold text-[#2B2F32] pb-5 text-center">Enter your email to continue</p>

                    <div className="mb-6 relative">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-2 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:text-[#B7B7B7]"
                        placeholder="you@example.com"
                        autoFocus
                      />
                      <label htmlFor="email" className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs">
                        Email *
                      </label>
                      {!emailValid && email.length > 0 && <p className="text-red-500 text-[12px] mt-1">Enter a valid email</p>}
                    </div>

                    <button
                      type="button"
                      onClick={onCheckEmail}
                      disabled={busy || !emailValid}
                      className="w-full rounded-xl bg-[#38CBFF] py-4 text-[20px] font-semibold text-[#2B2F32] hover:opacity-90 transition disabled:opacity-60"
                    >
                      {busy ? 'Checking…' : 'Continue'}
                    </button>

                    {(notice || reduxError) && (
                      <p className="text-red-500 text-sm mt-3 text-center">{notice || reduxError}</p>
                    )}
                  </>
                )}

                {/* PASSWORD (EXISTING USER) — ONLY PASSWORD FIELD */}
                {step === 'password' && (
                  <>
                    <h6 className="text-[26px] font-semibold text-[#2B2F32] pb-2 text-center">Welcome back</h6>
                    <p className="text-center text-sm text-[#555] mb-6">{email}</p>

                    <div className="mb-6">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-[#cccc] rounded-lg px-4 py-3 text-sm text-[#2B2F2
                        2] focus:outline-none"
                        placeholder="Password"
                        autoFocus
                      />
                    </div>

                    <button
                      type="button"
                      onClick={onExistingLogin}
                      disabled={busy || !password}
                      className="w-full rounded-xl bg-[#38CBFF] py-3 text-[18px] font-semibold text-[#2B2F32] hover:opacity-90 transition disabled:opacity-60"
                    >
                      {busy ? 'Signing in…' : 'Sign In'}
                    </button>

                    {(notice || reduxError) && (
                      <p className="text-red-500 text-sm mt-3 text-center">{notice || reduxError}</p>
                    )}

                    <div className="flex justify-between mt-4 text-sm">
                      <button type="button" className="text-[#2B2F32] underline" onClick={() => setStep('email')}>
                        Use another email
                      </button>
                      <button type="button" className="text-[#38CBFF] underline" onClick={() => setStep('signup')}>
                        I’m new — create account
                      </button>
                    </div>
                  </>
                )}

                {/* SIGNUP (NEW USER) */}
                {step === 'signup' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h6 className="text-[24px] font-semibold text-[#2B2F32]">Create your seller account</h6>
                      <button type="button" className="px-4 py-1 bg-[#F2F4F7] text-[#222] rounded-md" onClick={() => setStep('email')}>
                        Back
                      </button>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-semibold mb-1">Email</label>
                      <input type="email" value={email} disabled className="w-full border border-[#e1e1e1] bg-gray-100 rounded-lg px-4 py-3 text-sm" />
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-semibold mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full border border-[#cccc] rounded-lg px-4 py-3 text-sm focus:outline-none"
                        placeholder="Your business / company"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-1">Select Country *</label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full border border-[#cccc] rounded-lg px-4 py-3 text-sm bg-white"
                      >
                        <option value="">Choose a country…</option>
                        {countryList.map((c, i) => (
                          <option key={`${c.code}-${i}`} value={c.code}>
                            {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-[#666] mt-1">We’ll auto-update the required document fields for your country.</p>
                    </div>

                    {!!countryCode && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-[16px] font-semibold">Required Documents</h3>
                          <span className="text-xs text-[#777]">({docFields.length || 0} items)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {docFields.length === 0 && <div className="text-sm text-[#666]">No specific documents for this country.</div>}
                          {docFields.map((f) => (
                            <div key={f.id} className="border border-[#e6e6e6] rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">{f.name || f.fieldName}</span>
                                {f.isRequired ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFE8E8] text-[#B42318]">Required</span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#E7F6EC] text-[#067647]">Optional</span>
                                )}
                              </div>
                              <input
                                type="text"
                                className="mt-2 w-full border rounded px-3 py-2 text-sm"
                                placeholder={`Enter / upload ${f.name || f.fieldName}`}
                                disabled
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full border border-[#cccc] rounded-lg px-4 py-3 text-sm focus:outline-none"
                        placeholder="Password *"
                      />
                    </div>
                    <div className="mb-6">
                      <input
                        type="password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full border border-[#cccc] rounded-lg px-4 py-3 text-sm focus:outline-none"
                        placeholder="Confirm Password *"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={onRegisterNewUser}
                      disabled={busy}
                      className="w-full rounded-xl bg-[#38CBFF] py-3 text-[18px] font-semibold text-[#2B2F32] hover:opacity-90 transition disabled:opacity-60"
                    >
                      {busy ? 'Creating account…' : 'Create account & Verify'}
                    </button>

                    {(notice || reduxError) && (
                      <p className="text-red-500 text-sm mt-3 text-center">{notice || reduxError}</p>
                    )}
                  </>
                )}

                {/* OTP */}
                {step === 'otp' && (
                  <div className="py-[80px] px-[10px]">
                    <h6 className="text-[28px] font-semibold text-[#3B3B3B] pb-4 text-center">OTP Verification</h6>
                    <p className="text-[14px] font-medium text-[#2B2F32] pb-5 text-center">
                      Enter the 6-character code sent to <strong>{email}</strong>
                    </p>

                    <div className="flex flex-col items-center gap-6">
                      <div className="flex justify-between w-full max-w-xs">
                        {otp.map((d, i) => (
                          <input
                            key={i}
                            ref={(el) => (otpRefs.current[i] = el)}
                            type="text"
                            inputMode="text"
                            maxLength={1}
                            value={d}
                            onChange={(e) => handleOtpChange(e.target.value, i)}
                            onKeyDown={(e) => handleOtpKey(e, i)}
                            className="w-12 h-12 text-center text-xl border border-[#5570F1] rounded-lg focus:outline-none"
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={onVerifyOtp}
                        className="w-full rounded-xl bg-[#38CBFF] py-4 text-[20px] font-bold text-[#2B2F32] hover:opacity-90 transition"
                        disabled={busy}
                      >
                        {busy ? 'Verifying…' : 'Verify OTP'}
                      </button>

                      <div className="text-[14px] font-medium text-[#000000]">
                        Didn’t receive the code?{' '}
                        {resendTimer > 0 ? (
                          <span className="text-[#38CBFF] text-[14px] font-bold">Resend in {resendTimer}s</span>
                        ) : (
                          <button type="button" onClick={onResendOtp} className="text-[#38CBFF] text-[14px] font-bold underline">
                            Resend OTP
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        className="w-full rounded-xl bg-[#F2F4F7] py-3 text-[16px] font-semibold text-[#2B2F32] hover:opacity-90 transition"
                        onClick={() => setStep('signup')}
                      >
                        Back
                      </button>

                      {(notice || reduxError) && (
                        <p className="text-red-500 text-sm mt-2 text-center">{notice || reduxError}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ERP */}
                {step === 'erp' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h6 className="text-[24px] font-semibold text-[#2B2F32]">Choose your ERP</h6>
                      <button
                        type="button"
                        className="px-10 py-1 bg-[#FAD5DA] text-[#222222] text-[16px] font-semibold cursor-pointer rounded-md"
                        onClick={() => router.replace(DASHBOARD_PATH)}
                      >
                        Skip
                      </button>
                    </div>

                    <div className="flex items-stretch gap-2 mb-6">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Search your ERP system..."
                          className="w-full h-12 rounded-full border border-[#E6E6E6] pl-4 pr-28 focus:outline-none placeholder:text-[#767676] placeholder:text-[16px] placeholder:font-normal"
                        />
                        <div className="absolute top-1/2 right-1 -translate-y-1/2 flex items-center gap-2">
                          <button type="button" className="px-6 py-2 bg-[#38CBFF] text-[#222222] rounded-full text-[16px] font-semibold flex items-center gap-2 cursor-pointer">
                            <Image src="/assets/icon/Searchicon.png" width={20} height={20} alt="Search Icon" className="w-[20px] h-[20px]" />
                            <span className="font-semibold">Search</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6 overflow-y-auto max-h-[300px] scrollbar-hide">
                      {ERPDATA.map((item, ind) => (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => setSelectedERP(ind)}
                          className={`col-span-1 rounded-xl border-2 p-3 flex items-center justify-center cursor-pointer transition ${
                            selectedERP === ind ? 'border-[#5570F1]' : 'border-[#DDDDDD]'
                          }`}
                          aria-pressed={selectedERP === ind}
                        >
                          <Image src={item?.images} alt={item?.name || 'ERP'} width={110} height={66} className="object-contain w-[110px] h-[66px]" />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleConnectERP}
                      disabled={connectingERP || selectedERP === null}
                      className="w-full rounded-xl bg-[#38CBFF] py-3 text-[20px] font-semibold text-[#2B2F32] hover:opacity-90 transition cursor-pointer mb-3 disabled:opacity-60"
                    >
                      {connectingERP ? 'Connecting…' : `Connect ${ERPDATA[selectedERP]?.name || 'ERP'} with A2Z`}
                    </button>

                    {connectError && <p className="text-red-500 text-sm mt-2 text-center">{connectError}</p>}

                    <div className="text-center text-[14px] font-medium text-[#000000]">
                      I have custom ERP?{' '}
                      <Link className="text-[#38CBFF] text-[14px] font-semibold" href="#">
                        Connect Now!
                      </Link>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
