"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SigninModal from "../modal/SigninModal";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/features/slice";

function Header() {
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Ensures redux state updates
      setDropdownOpen(false); // close dropdown
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <section className="navbar">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-[10px]">
          <div className="lg:col-span-6 pb-0">
            <div className="logo">
              <Link href="/">
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
              {/* Deliver to */}
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

              {/* Language */}
              <div className="languageFilter">
                <div className="lagn__us flex items-center gap-1">
                  <Image
                    src="/assets/icon/language.png"
                    alt="Language"
                    width={19}
                    height={19}
                    className="w-[19px] h-[19px]"
                  />
                  <p className="text-sm font-normal text-[#222222]">English-Riyal</p>
                </div>
              </div>

              {/* Cart */}
              <div className="cart">
                <Link href="">
                  <Image
                    src="/assets/icon/cart.png"
                    alt="Cart"
                    width={20}
                    height={19}
                    className="w-[20px] h-[19px]"
                  />
                </Link>
              </div>

              {/* User Dropdown / Sign In */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm font-normal text-[#222222] border border-gray-300 px-4 py-2 rounded-full"
                  >
                    {user.name.split(" ").map((n) => n[0]).join("")}
                    <span className="ml-1">▼</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Normal User Sign In */}
                  <div className="sign__in cursor-pointer" onClick={handleOpen}>
                    <div className="flex items-center gap-1">
                      <Image src="/assets/icon/signIng.png" alt="Sign in" width={17} height={20} />
                      <p className="text-sm font-normal text-[#222222]">Sign in</p>
                    </div>
                  </div>
                  <div className="sign__in">
                    <button className="text-sm font-semibold text-[#222222] bg-[#F3C0C8] px-[30px] py-[8px] rounded-full">
                      Create account
                    </button>
                  </div>

                  {/* 🔹 Admin Sign In Button */}
                  <div className="sign__in">
                    <Link
                      href="/admin/signin"
                      className="text-sm font-semibold text-white bg-[#222222] px-[20px] py-[8px] rounded-full"
                    >
                      Admin Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* bottom nav */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 pb-3">
            <div className="flex items-center gap-6">
              <div>
                <Link href="">
                  <Image
                    src="/assets/icon/nav.png"
                    alt="Nav"
                    width={10}
                    height={8}
                    className="w-[10px] h-[8px]"
                  />
                </Link>
              </div>
              <div>
                <p className="text-sm font-normal text-[#222222]">All categories</p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#222222]">Featured selections</p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#222222]">Order protections</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 pb-3">
            <div className="flex items-center gap-6 float-right">
              <div>
                <p className="text-sm font-normal text-[#222222]">AI sourcing agent</p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#222222]">Buyer Central</p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#222222]">Help Center</p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#222222]">App & extension</p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#222222]">Become a supplier</p>
              </div>
              {!user && (
                <Link
                  href="/supplierform"
                  className="text-sm font-semibold text-[#222222] bg-[#38CBFF] px-[30px] py-[5px] rounded-full"
                >
                  Become a supplier
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <SigninModal show={showModal} handleClose={handleClose} />
    </section>
  );
}

export default Header;
