"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

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
    setMessage({ text: "", isError: false });

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

      // التعديل الجوهري: نعتمد على status القادمة من الباك إند (PHP)
      if (data.status === "success") {
        if (isLoginMode) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setMessage({
            text: data.message || "Success! Accessing Secure Vault...",
            isError: false,
          });
          setTimeout(() => {
            router.push(data.user.role === "admin" ? "/dashboard" : "/dashboard");
          }, 1000);
        } else {
          setMessage({ 
            text: data.message || "Account Created Successfully!", 
            isError: false 
          });
          setTimeout(() => setIsLoginMode(true), 2500);
        }
      } else {
        // في حال أرسل الباك إند status = error
        setMessage({
          text: data.message || "Identification failed",
          isError: true,
        });
      }
    } catch (err) {
      setMessage({ text: "Network Error. Please try again.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030014]">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="w-full max-w-[440px] relative z-10 px-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
              <span className="text-white font-black text-2xl tracking-tighter">IP</span>
              <Sparkles className="absolute -top-1 -right-1 text-yellow-300" size={14} />
            </div>
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight mb-2 uppercase">
            Insta<span className="text-purple-500">Pay</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> MILITARY-GRADE SECURITY
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Switcher */}
          <div className="flex p-1 bg-black/40 rounded-2xl mb-8 border border-white/5">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                isLoginMode ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg" : "text-slate-500"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                !isLoginMode ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg" : "text-slate-500"
              }`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            {!isLoginMode && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
            )}

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400" size={18} />
              <input
                type="text"
                placeholder="Mobile Number"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50 transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 outline-none focus:border-purple-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full relative h-14 mt-4 overflow-hidden rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Processing..." : isLoginMode ? "Login" : "Create Account"}
                {!loading && <ArrowRight size={16} />}
              </span>
            </button>

            {/* تم حل مشكلة الألوان هنا باستخدام Inline Style لضمان القوة والأولوية */}
            {message.text && (
              <div
                style={{
                  backgroundColor: message.isError
                    ? "rgba(239, 68, 68, 0.15)" // أحمر شفاف للخطأ
                    : "rgba(16, 185, 129, 0.2)", // أخضر شفاف للنجاح
                  borderColor: message.isError
                    ? "rgba(239, 68, 68, 0.4)" 
                    : "rgba(16, 185, 129, 0.5)",
                  color: message.isError ? "#f87171" : "#34d399",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 animate-in fade-in zoom-in"
              >
                {message.isError ? (
                  <AlertCircle size={14} />
                ) : (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                )}
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-8">
          &copy; 2025 InstaPay Egypt • Secure Session
        </p>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap");
        body {
          font-family: "Plus Jakarta Sans", sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Login;