"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Phone, Lock, User, ArrowRight, Sparkles } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  useEffect(() => {
    setPhone("");
    setPassword("");
    setFullName("");
    setShowPassword(false);
    setMessage({ text: "", isError: false });
  }, [isLoginMode]);

  const API_BASE_URL = "http://localhost/instapay-backend/auth";

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\D/g, ""));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const endpoint = isLoginMode ? "/login.php" : "/signup.php";
    const payload = isLoginMode
      ? { phone, password }
      : { fullName, phone, password };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        if (isLoginMode) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => router.push("/dashboard"), 1000);
        } else {
          setIsLoginMode(true);
        }
      } else {
        setMessage({ text: data.message || "Error", isError: true });
      }
    } catch {
      setMessage({ text: "Server error", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="w-full max-w-[460px] relative z-10 px-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-orange-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-500 to-orange-500 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl transform group-hover:scale-105 transition-transform">
              IP
              <Sparkles className="absolute -top-2 -right-2 text-orange-400" size={16} />
            </div>
          </div>
          <h1 className="text-white text-4xl font-black mt-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            InstaPay
          </h1>
          <p className="text-purple-300/60 text-sm mt-2 font-medium">Fast. Secure. Instant.</p>
        </div>

        {/* Main Card */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-orange-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          
          <div className="relative bg-white/[0.07] backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2 bg-clip-text">
                {isLoginMode ? "Welcome Back" : "Get Started"}
              </h2>
              <p className="text-white/50 text-sm font-medium">
                {isLoginMode
                  ? "Sign in to continue your journey"
                  : "Create your account in seconds"}
              </p>
            </div>

            {/* Modern Toggle Tabs */}
            <div className="relative flex h-14 mb-8 bg-black/30 backdrop-blur-sm rounded-2xl p-1.5 border border-white/5">
              <button
                onClick={() => setIsLoginMode(true)}
                className={`w-1/2 z-10 text-sm font-bold rounded-xl transition-colors ${
                  isLoginMode ? "text-white" : "text-gray-500 hover:text-gray-400"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLoginMode(false)}
                className={`w-1/2 z-10 text-sm font-bold rounded-xl transition-colors ${
                  !isLoginMode ? "text-white" : "text-gray-500 hover:text-gray-400"
                }`}
              >
                Sign Up
              </button>

              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 shadow-lg transition-all duration-500 ease-out ${
                  isLoginMode ? "left-1.5" : "left-[calc(50%+3px)]"
                }`}
              />
            </div>

            <div className="space-y-6">
              {/* Full Name Field */}
              {!isLoginMode && (
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              )}

              {/* Phone Field */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors">
                  <Phone size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="relative w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">
                  {loading
                    ? "Processing..."
                    : isLoginMode
                    ? "Sign In Now"
                    : "Create Account"}
                </span>
                <ArrowRight className="relative z-10" size={20} />
              </button>

              {/* Message Display */}
              {message.text && (
                <div className={`text-center text-sm font-medium mt-4 ${message.isError ? "text-red-400" : "text-green-400"}`}>
                  {message.text}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/30 text-xs">
                Protected by InstaPay Security
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-white/40 text-xs mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Login;