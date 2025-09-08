'use client';

import { useRef, useState } from "react";
import Image from "next/image";
import FormBanner from "./FormBanner";
import ERPDATA from "../../data/ERPCO.json";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/features/slice';

export default function Form() {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(1);
  const regRef = useRef(null);
  const vatRef = useRef(null);
  const addrRef = useRef(null);

  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  // ✅ सिर्फ mandatory fields API के लिए
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // ✅ Submit API call
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData))
      .unwrap()
      .then((res) => {
        console.log("✅ Registration successful:", res);
        setStep(2); // Step 2 (OTP page) पर ले जाएँ
      })
      .catch((err) => {
        console.error("❌ Registration failed:", err);
      });
  };

  function goBack(e) {
    e.preventDefault();
    setStep(1);
  }

  return (
    <>
      <FormBanner />
      <div className="suppliervalidation absolute left-1/2 top-30 -translate-x-1/2 w-full">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full md:w-5/2 lg:w-6/12 mx-auto pb-7">
              <form
                className="bg-[#ffffff] rounded-xl py-6 px-8 shadow-md"
                onSubmit={handleSubmit}
              >
                {/* STEP 1 (Registration) */}
                {step === 1 && (
                  <>
                    <h6 className="text-[28px] font-semibold text-[#2B2F32] pb-4 text-center">
                      Become a supplier
                    </h6>
                    <p className="text-[20px] font-semibold text-[#2B2F32] text-center pb-3">
                      Create a New Account
                    </p>
                    <div className="flex flex-wrap -mx-2">
                      {/* ✅ Mandatory Fields */}
                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1"
                          placeholder="Enter"
                          required
                        />
                        <label htmlFor="name" className="absolute left-6 top-2 text-[14px] font-semibold">
                          Name *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1"
                          placeholder="Enter"
                          required
                        />
                        <label htmlFor="email" className="absolute left-6 top-2 text-[14px] font-semibold">
                          Email *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="password"
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1"
                          placeholder="Enter"
                          required
                        />
                        <label htmlFor="password" className="absolute left-6 top-2 text-[14px] font-semibold">
                          Password *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="password"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1"
                          placeholder="Enter"
                          required
                        />
                        <label htmlFor="confirmPassword" className="absolute left-6 top-2 text-[14px] font-semibold">
                          Confirm Password *
                        </label>
                      </div>

                      {/* ✅ बाकी optional fields (Company, VAT, Phone etc.) */}
                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="text"
                          id="companyName"
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1"
                          placeholder="Optional"
                        />
                        <label htmlFor="companyName" className="absolute left-6 top-2 text-[14px] font-semibold">
                          Company Name
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="text"
                          id="vatNo"
                          className="peer w-full border border-[#cccc] rounded-lg px-4 pt-8 pb-1"
                          placeholder="Optional"
                        />
                        <label htmlFor="vatNo" className="absolute left-6 top-2 text-[14px] font-semibold">
                          VAT No
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-[#38CBFF] py-4 text-[24px] font-semibold text-[#2B2F32]"
                    >
                      {loading ? "Registering..." : "Sign Up"}
                    </button>

                    {error && (
                      <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                    )}
                  </>
                )}

                {/* STEP 2 (OTP Verification) */}
                {step === 2 && (
                  <div className="py-[130px]">
                    <h6 className="text-[28px] font-semibold text-[#3B3B3B] pb-5 text-center">
                      OTP Verification
                    </h6>
                    <p className="text-[16px] font-semibold text-[#2B2F32] pb-4 text-center">
                      Please check your email for OTP
                    </p>
                    <button
                      onClick={goBack}
                      className="w-full mt-4 rounded-xl bg-[#F2F4F7] py-4 text-[18px] font-semibold text-[#2B2F32]"
                    >
                      Back
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
