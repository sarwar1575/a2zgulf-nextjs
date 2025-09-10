"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/slice"; // Make sure path matches your slice

function SigninModal({ show, handleClose }) {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await dispatch(login(formData)).unwrap();
      // unwrap will throw rejectWithValue if login fails
      if (result?.success) {
        handleClose(); // close modal on success
      } else {
        setError(result?.message || "Login failed");
      }
    } catch (err) {
      // ensure we store a string for React to render
      setError(typeof err === "string" ? err : err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Welcome Back Seller
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-6 text-lg">Sign In</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@domain.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-red-400 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-xs text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-blue-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I hereby accept the{" "}
              <a href="#" className="text-blue-500 hover:underline">
                T&amp;C
              </a>{" "}
              of A2Z
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-400 text-white font-semibold py-3 rounded-lg hover:bg-sky-500 transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

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
