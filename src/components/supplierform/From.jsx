"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import FormBanner from "./FormBanner";
import ERPDATA from "../../data/ERPCO.json";
import Link from "next/link";

export default function From() {

  const [step, setStep] = useState(1);
  const regRef = useRef(null);
  const vatRef = useRef(null);
  const addrRef = useRef(null);

  const uploadCards = [
    { key: "reg", title: "Company Registration No", ref: regRef },
    { key: "vat", title: "VAT No", ref: vatRef },
    { key: "addr", title: "National Address *", ref: addrRef },
  ];

  function goNext(e) {
    e.preventDefault();
    setStep(2);
  }

  function goBack(e) {
    e.preventDefault();
    setStep(1);
  }

  function gotoERP(e) {
    e.preventDefault();
    setStep(3);
  }

  function finalSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <FormBanner />
      <div className="suppliervalidation absolute left-1/2 top-30 -translate-x-1/2 w-full">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full md:w-1/2 lg:w-5/12 mx-auto pb-7">
              <form
                className="bg-[#ffffff] rounded-xl py-6 px-8 shadow-md"
                onSubmit={(e) => {
                  if (step === 1) return goNext(e);
                  if (step === 2) return gotoERP(e);
                  return finalSubmit(e);
                }}
              >
                {/* STEP 1 (all original fields + uploads) */}
                {step === 1 && (
                  <>
                    <h6 className="text-[28px] font-semibold text-[#2B2F32] pb-4">
                      Become a supplier
                    </h6>
                    <p className="text-[20px] font-semibold text-[#2B2F32]">
                      Create a New Account
                    </p>
                    <div className="flex flex-wrap -mx-2">
                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="text"
                          id="companyName"
                          className="peer w-full border border-[#cccc] rounded-lg px-5 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-medium placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="companyName"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Company Name *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="text"
                          id="companyReg"
                          className="peer w-full border border-[#cccc] rounded-lg px-5 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-medium placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="companyReg"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Company Registration No *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="text"
                          id="vatNo"
                          className="peer w-full border border-[#cccc] rounded-lg px-5 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-medium placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="vatNo"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          VAT No *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="text"
                          id="nationalAddress"
                          className="peer w-full border border-[#cccc] rounded-lg px-5 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-medium placeholder:text-[#B7B7B7]"
                          placeholder="Enter Name"
                        />
                        <label
                          htmlFor="nationalAddress"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          National Address *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="tel"
                          id="phone"
                          className="peer w-full border border-[#cccc] rounded-lg px-5 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-medium placeholder:text-[#B7B7B7]"
                          placeholder="7100918890"
                        />
                        <label
                          htmlFor="phone"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Phone Number *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="email"
                          id="email"
                          className="peer w-full border border-[#cccc] rounded-lg px-5 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-medium placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Email *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="password"
                          id="password"
                          className="peer w-full border border-[#cccc] rounded-lg px-5 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-medium placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="password"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Password *
                        </label>
                      </div>

                      <div className="w-1/2 px-2 mb-6 relative">
                        <input
                          type="password"
                          id="confirmPassword"
                          className="peer w-full border border-[#cccc] rounded-lg px-5 pt-8 pb-1 text-sm text-[#2B2F32] focus:outline-none placeholder:text-[16px] placeholder:font-medium placeholder:text-[#B7B7B7]"
                          placeholder="Enter"
                        />
                        <label
                          htmlFor="confirmPassword"
                          className="absolute left-6 top-2 text-[#313131] text-[14px] font-semibold transition-all peer-focus:top-1 peer-focus:text-xs"
                        >
                          Confirm Password *
                        </label>
                      </div>
                    </div>

                    <div className="mt-2 border-[#CFE7FF] pb-15">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {uploadCards.map((item, index) => (
                          <label
                            key={index}
                            className="block cursor-pointer rounded-xl border border-[#E6E6E6] bg-white py-4 px-3"
                          >
                            <div className=" mb-0">
                              <p className="text-[14px] font-semibold text-[#313131] pb-4">
                                {item.title}
                              </p>
                            </div>

                            {/* Cloud Icon */}
                            <div className="mx-auto mb-0 flex justify-center pb-2">
                              <Image
                                src="/assets/icon/cloud-add.png"
                                width={22}
                                height={22}
                                alt="Upload"
                                className="w-[22px] h-[22px]"
                                onClick={() => item.ref.current?.click()}
                              />
                            </div>

                            <p className="text-[12px] font-normal text-[#292D32] text-center pb-2">
                              Choose a file or drag &amp; drop
                            </p>
                            <p className="text-[9px] font-medium text-[#A9ACB4] text-center pb-4">
                              JPEG, PNG, PDF, up to 50MB
                            </p>

                            <div className="flex justify-center">
                              <span
                                onClick={(e) => {
                                  e.preventDefault();
                                  item.ref.current?.click();
                                }}
                                className="inline-block rounded-md bg-[#F3C0C8] px-4 py-1 text-[10px] font-normal text-[#54575C]"
                              >
                                Browse File
                              </span>
                            </div>

                            <input
                              ref={item.ref}
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              className="hidden"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

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
                        className="w-full rounded-xl bg-[#38CBFF] py-4 text-[24px] font-semibold text-[#2B2F32] hover:opacity-90 transition mb-5 cursor-pointer"
                      >
                        Sign Up
                      </button>

                      {/* Sign in link */}
                      <div className="mt-3 text-center">
                        <span className="text-[15px] text-[#000000] font-medium">
                          Already hav an account?{" "}
                          <a
                            href="#"
                            className="text-[14px] font-bold text-[#38CBFF]"
                          >
                            Sign in
                          </a>
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2 (OTP DESIGN ONLY) */}
                {step === 2 && (
                  <>
                    <div className="py-[130px] px-[10px]">
                      <h6 className="text-[28px] font-semibold text-[#3B3B3B] pb-5 text-center">
                        OTP Verification
                      </h6>
                      <p className="text-[16px] font-semibold text-[#2B2F32] pb-4">
                        Enter the 6‑character code sent to +966 78…98{" "}
                        <a className="text-[#5570F1] cursor-pointer text-[16px] font-semibold">
                          Edit
                        </a>
                      </p>
                      <div className="flex flex-col items-center gap-6">
                        <div className="flex justify-between w-full">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <input
                              key={i}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              className="w-18 h-12 text-center text-xl border border-[#5570F1] rounded-lg focus:outline-none"
                            />
                          ))}
                        </div>

                        <button
                          className="w-full rounded-xl bg-[#38CBFF] py-4 text-[24px] font-bold text-[#2B2F32] hover:opacity-90 transition cursor-pointer"
                          type="submit"
                        >
                          Verify OTP
                        </button>

                        <div className="text-[14px] font-medium text-[#000000]">
                          Didn’t receive the code?{" "}
                          <span className="text-[#38CBFF] text-[14px] font-bold">
                            Resend in 26s
                          </span>
                        </div>

                        <button
                          className="w-full rounded-xl bg-[#F2F4F7] py-4 text-[18px] font-semibold text-[#2B2F32] hover:opacity-90 transition cursor-pointer"
                          onClick={goBack}
                          type="button"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 3 (OTP DESIGN ONLY) */}
                {step === 3 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h6 className="text-[24px] font-semibold text-[#2B2F32]">
                        Choose your ERP
                      </h6>
                      <button
                        type="button"
                        className="px-10 py-1 bg-[#FAD5DA] text-[#222222] text-[16px] font-semibold cursor-pointer"
                      >
                        Skip
                      </button>
                    </div>
                    <div className="flex items-stretch gap-2 mb-6">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Search your ERP system..."
                          className="w-full h-12 rounded-full border border-[#E6E6E6] pl-4 pr-28 focus:outline-none  placeholder:text-[#767676] placeholder:text-[16px] placeholder:font-normal"
                        />
                        <div className="absolute top-1/2 right-1 -translate-y-1/2 flex items-center gap-2">
                          <button className="px-6 py-2 bg-[#38CBFF] text-[#222222] rounded-full text-[16px] font-semibold flex items-center gap-2 cursor-pointer">
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
                    <div className="ERPCONN grid grid-cols-4 gap-4 mb-6 overflow-y-scroll max-h-[300px] scrollbar-hide">
                      {ERPDATA.map((items, ind) => (
                        <div
                          className="col-span-1 rounded-xl border-2 border-[#38CBFF] p-3 flex items-center justify-center "
                          key={ind}
                        >
                          <div className="">
                            <Image
                              src={items.images}
                              alt="Zoho"
                              width={110}
                              height={66}
                              className="object-cover w-[110px] h-[66px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/dashboard"
                      className="w-full rounded-xl bg-[#38CBFF] py-3 text-[24px] font-semibold text-[#2B2F32] hover:opacity-90 transition cursor-pointer mb-8 inline-block text-center"
                    >
                      Connect ERP with A2Z
                    </Link>

                    <div className="text-center text-[14px] font-medium text-[#000000]">
                      I have custom ERP?{" "}
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
