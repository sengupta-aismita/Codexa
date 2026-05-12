import React, { useState } from "react";
import { registerUser } from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, User, Sparkles } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);
    const loadingToast = toast.loading("Creating your account...");
    try {
      const data = await registerUser({
        email,
        username: username.toLowerCase(),
        password,
      });

      toast.dismiss(loadingToast);
      toast.success("Account created successfully!");
      setLoading(false);

      navigate("/chat", { replace: true });
    } catch (err) {
      setLoading(false);
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Signup failed");
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
            Create Account
          </h1>

          <p className="text-zinc-400 mt-3 text-sm sm:text-base">
            Join Codexa and start learning smarter
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* USERNAME */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Username</label>

            <div
              className={`flex items-center gap-3 bg-[#0F172A]/80 border rounded-2xl px-4 py-4 transition-all duration-200 ${
                errors.username
                  ? "border-red-500"
                  : "border-[#1E293B] focus-within:border-indigo-500"
              }`}
            >
              <User size={20} className="text-zinc-500" />

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);

                  if (errors.username) {
                    setErrors((prev) => ({
                      ...prev,
                      username: "",
                    }));
                  }
                }}
                className="bg-transparent outline-none text-white placeholder:text-zinc-500 w-full"
              />
            </div>

            {errors.username && (
              <p className="text-red-400 text-sm mt-2 ml-1">
                {errors.username}
              </p>
            )}
          </div>

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
            className={`w-full mt-2 rounded-2xl py-4 text-white font-semibold shadow-lg transition-all duration-300 ${
              loading
                ? "bg-zinc-700 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 hover:scale-[1.01]"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-zinc-400 text-sm mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
