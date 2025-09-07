"use client";

import Image from "next/image";
import Link from "next/link";

function Navbar() {
  return (
    <>
        <section className="navbar">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-[10px]">
            <div className="lg:col-span-6 pb-0">
              <div className="logo">
                <Link href="">
                  <Image
                    src="/assets/img/weblogo.png"
                    width={170}
                    height={170}
                    alt=""
                  />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 pb-0">
              <div className="flex items-center gap-6 float-right">
                <div>
                  <span className="text-xs font-normal text-[#222222]">Deliver to:</span>
                  <div className="countryLists flex items-center gap-1">
                    <Image
                      src="/assets/img/saudiflag.png"
                      alt="Saudi Flag"
                      width={21}
                      height={14}
                      className="w-[21px] h-[14px]"
                    />
                    <p className="text-sm font-semibold text-[#222222]">SA</p>
                  </div>
                </div>
                <div className="languageFilter">
                       <div className="lagn__us flex items-center gap-1">
                    <Image
                      src="/assets/icon/language.png"
                      alt="Saudi Flag"
                      width={19}
                      height={19}
                      className="w-[19px] h-[19px]"
                    />
                    <p className="text-sm font-normal text-[#222222]">English-Riyal</p>
                  </div>
                </div>
                <div className="cart">
                  <Link href="">
                      <Image
                      src="/assets/icon/cart.png"
                      alt="Saudi Flag"
                      width={20}
                      height={19}
                      className="w-[20px] h-[19px]"
                    />
                  </Link>
                </div>
                <div className="sign__in">
                    <div className="flex items-center gap-1">
                        <Image
                      src="/assets/icon/signIng.png"
                      alt="Saudi Flag"
                      width={17}
                      height={20}
                      className="w-[17px] h-[20px]"
                    />
                    <p className="text-sm font-normal text-[#222222]">Sign in</p>
                    </div>
                </div>
                  <div className="sign__in">
                    <button className="text-sm font-semibold text-[#222222] bg-[#F3C0C8] px-[30px] py-[8px] rounded-full">Create account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Navbar;
