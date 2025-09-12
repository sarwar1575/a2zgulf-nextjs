'use client';

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import FormBanner from "./FormBanner";
import ERPDATA from "../../data/ERPCO.json";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/features/slice";

export default function Form() {
  // ----- UI State -----
  const [selected, setSelected] = useState(null); // index of selected ERP
  const [step, setStep] = useState(1); // 1: Register, 2: OTP, 3: ERP
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");

  // File upload refs (currently hidden UI, kept for future use)
  const regRef = useRef(null);
  const vatRef = useRef(null);
  const addrRef = useRef(null);

  const uploadCards = [
    { key: "reg", title: "Company Registration No", ref: regRef },
    { key: "vat", title: "VAT No", ref: vatRef },
    { key: "addr", title: "National Address *", ref: addrRef },
  ];

  // Redux
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth || {});

  // ----- Form State -----
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "email") {
      setEmailError(validateEmail(value) ? "" : "Please enter a valid email ID");
    }
    if (id === "confirmPassword" || id === "password") {
      // live feedback for mismatch (optional)
      if (id === "confirmPassword" && value !== formData.password) {
        setFormError("Password and Confirm Password do not match!");
      } else if (id === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
        setFormError("Password and Confirm Password do not match!");
      } else {
        setFormError("");
      }
    }
  };

  // ----- Submit -----
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email ID");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Password and Confirm Password do not match!");
      return;
    }

    setFormError("");

    dispatch(register(formData))
      .unwrap()
      .then((res) => {
        // Registration success — proceed to OTP
        // Optionally you can trigger API to send OTP here if needed
        setStep(2);
        // console.log("✅ Registration successful:", res);
      })
      .catch((err) => {
        // console.error("❌ Registration failed:", err);
        if (err?.message?.includes("User already exists")) {
          setFormError("User with this email already exists");
        } else {
          setFormError(err?.message || "Registration failed. Please try again.");
        }
      });
  };

  const goBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  // ----- OTP -----
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  const [resendTimer, setResendTimer] = useState(30);
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleOtpChange = (value, index) => {
    // accept only letters/numbers, uppercase single char
    const char = (value || "").slice(-1).toUpperCase().replace(/[^A-Z0-9]/g, "");
    const next = [...otp];
    next[index] = char;
    setOtp(next);

    if (char && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    // TODO: Verify with API if needed
    // console.log("Entered OTP:", enteredOtp);
    if (enteredOtp.length === 6) {
      setStep(3);
    }
  };

  const handleResendOtp = () => {
    // TODO: Call resend OTP API
    setResendTimer(30);
  };



// ----- ERP Connect (Step 3) -----
const [connecting, setConnecting] = useState(false);
const [connectError, setConnectError] = useState("");

// 🟢 Token ko Redux se le (register ke baad yahi set hota hai)
//   fallback: localStorage (agar page reload ke baad ho)
const { token: registerToken } = useSelector((s) => s.auth || {});

const handleConnectERP = async () => {
  if (selected === null) {
    setConnectError("Please select an ERP first.");
    return;
  }

  setConnecting(true);
  setConnectError("");

  try {
    // Selected card se provider nikalo (e.g. ZOHO)
    const provider = String(
      ERPDATA?.[selected]?.provider ||
      ERPDATA?.[selected]?.id ||
      ERPDATA?.[selected]?.name ||
      "ZOHO"
    ).toUpperCase();

    // ✅ Token register se (Redux) → fallback localStorage
    const token = registerToken || localStorage.getItem("ACCESS_TOKEN") || "";
    if (!token) throw new Error("Missing auth token from registration.");

    // ✅ CSRF header (app boot/login pe set kiya tha)
    const csrf = localStorage.getItem("X_CSRF_TOKEN") || "";

    // ⚠️ Backend ke curl ke mutabik email/password bhejne hain (GET body nahi hota)
    const email = (formData.email || "").trim();
    const password = formData.password || "";

    const qs = new URLSearchParams({
      ...(email ? { email } : {}),
      ...(password ? { password } : {}),
    }).toString();

    // ⛳️ Next API proxy ko call karo (ye headers backend tak forward karega)
    const resp = await fetch(
      `/api/erp-auth/${provider}/start${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
        },
        credentials: "include",
      }
    );

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(txt || `Failed: ${resp.status}`);
    }

    const { startUrl } = await resp.json();
    if (!startUrl) throw new Error("OAuth URL missing from server.");

    // 🔁 Zoho authorize page par le jao
    window.location.href = startUrl;
  } catch (e) {
    setConnectError(e?.message || "Failed to start ERP OAuth");
  } finally {
    setConnecting(false);
  }
};


  return (
    <>
      <FormBanner />

      <div className="suppliervalidation absolute left-1/2 top-24 -translate-x-1/2 w-full">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full md:w-7/12 lg:w-6/12 mx-auto pb-7">
              <form
                className="bg-white rounded-xl py-6 px-8 shadow-md"
                onSubmit={handleSubmit}
              >
                {/* STEP 1: Registration */}
                {step === 1 && (
                  <>
                    <h6 className="text-[28px] font-semibold text-[#2B2F32] pb-4 text-center">
                      Become a supplier
                    </h6>
                    <p className="text-[20px] font-semibold text-[#2B2F32] text-center pb-3">
                      Create a New Account
                    </p>

                    <div className="flex flex-wrap -mx-2">
                      <div className="w-full md:w-1/2 px-2 mb-6 relative">
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-normal placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="name"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Company Name *
                        </label>
                      </div>

                      <div className="w-full md:w-1/2 px-2 mb-6 relative">
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-normal placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Email *
                        </label>
                        {emailError && (
                          <p className="text-red-500 text-[12px] mt-1">
                            {emailError}
                          </p>
                        )}
                      </div>

                      <div className="w-full md:w-1/2 px-2 mb-6 relative">
                        <input
                          type="password"
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-normal placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="password"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Password *
                        </label>
                      </div>

                      <div className="w-full md:w-1/2 px-2 mb-6 relative">
                        <input
                          type="password"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-normal placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="confirmPassword"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Confirm Password *
                        </label>
                        {formError && (
                          <p className="text-red-500 text-[12px] mt-1">
                            {formError}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Terms + Submit */}
                    <div className="">
                      <div className="flex items-center gap-2 pb-10">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 accent-[#38CBFF] rounded-md"
                        />
                        <p className="text-[14px] font-normal text-[#2B2F32]">
                          I agree to the Terms of Services and Privacy Policy
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#38CBFF] py-4 text-[24px] font-semibold text-[#2B2F32] hover:opacity-90 transition mb-5 cursor-pointer disabled:opacity-60"
                      >
                        {loading ? "Registering..." : "Sign Up"}
                      </button>

                      {error && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                          {error}
                        </p>
                      )}

                      <div className="mt-3 text-center">
                        <span className="text-[15px] text-[#000000] font-medium">
                          Already have an account?{" "}
                          <Link
                            href="/signin"
                            className="text-[14px] font-bold text-[#38CBFF]"
                          >
                            Sign in
                          </Link>
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2: OTP Verification */}
                {step === 2 && (
                  <div className="py-[130px] px-[10px]">
                    <h6 className="text-[28px] font-semibold text-[#3B3B3B] pb-5 text-center">
                      OTP Verification
                    </h6>
                    <p className="text-[16px] font-semibold text-[#2B2F32] pb-4 text-center">
                      Enter the 6-character code sent to {formData.email}{" "}
                      <button
                        type="button"
                        className="text-[#5570F1] ml-1 text-[16px] font-semibold underline"
                        onClick={goBack}
                      >
                        Edit
                      </button>
                    </p>

                    <div className="flex flex-col items-center gap-6">
                      <div className="flex justify-between w-full max-w-xs">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            id={`otp-${i}`}
                            ref={(el) => (otpRefs.current[i] = el)}
                            type="text"
                            inputMode="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className="w-12 h-12 text-center text-xl border border-[#5570F1] rounded-lg focus:outline-none"
                          />
                        ))}
                      </div>

                      <button
                        onClick={handleVerifyOtp}
                        type="button"
                        className="w-full rounded-xl bg-[#38CBFF] py-4 text-[24px] font-bold text-[#2B2F32] hover:opacity-90 transition cursor-pointer"
                      >
                        Verify OTP
                      </button>

                      <div className="text-[14px] font-medium text-[#000000]">
                        Didn’t receive the code?{" "}
                        {resendTimer > 0 ? (
                          <span className="text-[#38CBFF] text-[14px] font-bold">
                            Resend in {resendTimer}s
                          </span>
                        ) : (
                          <button
                            onClick={handleResendOtp}
                            type="button"
                            className="text-[#38CBFF] text-[14px] font-bold underline"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        className="w-full rounded-xl bg-[#F2F4F7] py-4 text-[18px] font-semibold text-[#2B2F32] hover:opacity-90 transition cursor-pointer"
                        onClick={goBack}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: ERP Selection */}
                {step === 3 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h6 className="text-[24px] font-semibold text-[#2B2F32]">
                        Choose your ERP
                      </h6>
                      <button
                        type="button"
                        className="px-10 py-1 bg-[#FAD5DA] text-[#222222] text-[16px] font-semibold cursor-pointer rounded-md"
                      >
                        Skip
                      </button>
                    </div>

                    {/* Search (visual only right now) */}
                    <div className="flex items-stretch gap-2 mb-6">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Search your ERP system..."
                          className="w-full h-12 rounded-full border border-[#E6E6E6] pl-4 pr-28 focus:outline-none placeholder:text-[#767676] placeholder:text-[16px] placeholder:font-normal"
                        />
                        <div className="absolute top-1/2 right-1 -translate-y-1/2 flex items-center gap-2">
                          <button
                            type="button"
                            className="px-6 py-2 bg-[#38CBFF] text-[#222222] rounded-full text-[16px] font-semibold flex items-center gap-2 cursor-pointer"
                          >
                            <Image
                              src="/assets/icon/Searchicon.png"
                              width={20}
                              height={20}
                              alt="Search Icon"
                              className="w-[20px] h-[20px]"
                            />
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
                          onClick={() => setSelected(ind)}
                          className={`col-span-1 rounded-xl border-2 p-3 flex items-center justify-center cursor-pointer transition ${
                            selected === ind
                              ? "border-[#5570F1]"
                              : "border-[#DDDDDD]"
                          }`}
                          aria-pressed={selected === ind}
                        >
                          <Image
                            src={item?.images}
                            alt={item?.name || "ERP"}
                            width={110}
                            height={66}
                            className="object-contain w-[110px] h-[66px]"
                          />
                        </button>
                      ))}
                    </div>

                   <button
  type="button"
  onClick={handleConnectERP}
  disabled={connecting || selected === null}
  className="w-full rounded-xl bg-[#38CBFF] py-3 text-[24px] font-semibold text-[#2B2F32] hover:opacity-90 transition cursor-pointer mb-8 disabled:opacity-60"
>
  {connecting ? "Connecting…" : `Connect ${ERPDATA[selected]?.name || "ERP"} with A2Z`}
</button>


{connectError && (
  <p className="text-red-500 text-sm mt-2 text-center">{connectError}</p>
)}


                    <div className="text-center text-[14px] font-medium text-[#000000]">
                      I have custom ERP?{" "}
                      <Link
                        className="text-[#38CBFF] text-[14px] font-semibold"
                        href="#"
                      >
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
