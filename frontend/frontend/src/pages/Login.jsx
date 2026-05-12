import React, { useState } from "react";
import { loginUser } from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    const loadingToast = toast.loading("Logging you in...");

    try {
      const data = await loginUser({
        email,
        password,
      });

      setLoading(false);

      toast.dismiss(loadingToast);

      toast.success(`Welcome back, ${data.data.user.username}!`);

      navigate("/chat", { replace: true });
    } catch (err) {
      setLoading(false);
      toast.dismiss(loadingToast);

      if (err.response?.status === 404) {
        toast.error("No account found. Please sign up.");
        navigate("/register");
      } else if (err.response?.status === 401) {
        toast.error("Wrong password");
      } else {
        toast.error(err.response?.data?.message || "Login failed. Try again.");
      }
    }
  };

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-black via-[#070B14] to-[#0F172A] flex items-center justify-center px-4">
      {/* BACKGROUND GLOW */}
      <div className="absolute w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full top-10 left-[-80px]" />
      <div className="absolute w-72 h-72 bg-violet-500/20 blur-3xl rounded-full bottom-10 right-[-80px]" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-5 sm:p-7">
        {/* LOGO */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
            <img src="/codexa.svg" alt="Codexa Logo" className="w-14 h-14" />
          </div>
        </div>

        {/* HEADING */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-zinc-400 mt-3 text-sm sm:text-base">
            Login to continue using Codexa
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Email</label>

            <div
              className={`flex items-center gap-3 bg-[#0F172A]/80 border rounded-2xl px-4 py-4 transition-all duration-200 ${
                errors.email
                  ? "border-red-500"
                  : "border-[#1E293B] focus-within:border-indigo-500"
              }`}
            >
              <Mail size={20} className="text-zinc-500" />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (errors.email) {
                    setErrors((prev) => ({
                      ...prev,
                      email: "",
                    }));
                  }
                }}
                className="bg-transparent outline-none text-white placeholder:text-zinc-500 w-full"
              />
            </div>

            {errors.email && (
              <p className="text-red-400 text-sm mt-2 ml-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Password</label>

            <div
              className={`flex items-center gap-3 bg-[#0F172A]/80 border rounded-2xl px-4 py-4 transition-all duration-200 ${
                errors.password
                  ? "border-red-500"
                  : "border-[#1E293B] focus-within:border-indigo-500"
              }`}
            >
              <Lock size={20} className="text-zinc-500" />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  if (errors.password) {
                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                    }));
                  }
                }}
                className="bg-transparent outline-none text-white placeholder:text-zinc-500 w-full"
              />
            </div>

            {errors.password && (
              <p className="text-red-400 text-sm mt-2 ml-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 transition-all duration-300 rounded-2xl py-4 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:scale-[1.01]"
          >
            Login
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-zinc-400 text-sm mt-8">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
