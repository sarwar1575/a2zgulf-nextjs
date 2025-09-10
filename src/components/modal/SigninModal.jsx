"use client";
import { useEffect, useState } from "react";
import SigninForm from "../auth/SigninForm";

function SigninModal({ show, handleClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-200 ${
        show ? "opacity-100 bg-black/50" : "opacity-0 bg-black/0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg w-full max-w-lg p-10 relative transform transition-all duration-200 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-center text-gray-900">
          Welcome Back Seller
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-6 text-lg">Sign In</p>

        {/* Reuse the form */}
        <SigninForm onSuccess={handleClose} />

        <p className="text-center text-sm text-gray-700 mt-6">
          New to A2Z Gulf?{" "}
          <a href="/supplierform" className="text-blue-500 font-medium hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

export default SigninModal;
