"use client";

import { useState } from "react";
import { 
  Smartphone, 
  CheckCircle, 
  HelpCircle, 
  ArrowLeft,
  ArrowRight,
  CircleDollarSign
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CollectMoneyContent() {
  const [amount, setAmount] = useState<number | "">("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerateRequest = async () => {
    setError("");
    
    // 1. استخراج بيانات المستخدم من التخزين المحلي
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      setError("Session expired. Please login again.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    const savedUser = JSON.parse(userRaw);

    // 2. التحقق من المدخلات
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!mobileNumber || mobileNumber.length < 11) {
      setError("Please enter a valid mobile number");
      return;
    }

    // التحقق من أن المستخدم لا يطلب مالاً من نفسه
    if (mobileNumber === savedUser.phone) {
      setError("You cannot request money from your own number");
      return;
    }

    setLoading(true);
    try {
      // 3. إرسال الطلب للباك إند
      const response = await fetch("http://localhost/instapay-backend/transaction/send_request.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester_id: savedUser.id, // ID الشخص اللي بيطلب (أنت)
          payer_phone: mobileNumber,  // رقم الشخص اللي هيدفع
          amount: amount
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setShowSuccess(true);
        setAmount("");
        setMobileNumber("");
        // إخفاء رسالة النجاح بعد 3 ثواني
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // إظهار رسالة الخطأ القادمة من السيرفر (مثل: الهاتف غير مسجل)
        setError(data.message || "Failed to send request");
      }
    } catch (e) {
      setError("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] font-sans relative overflow-hidden text-left">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]"></div>

      {/* Header */}
      <nav className="relative z-50 border-b border-white/10 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-left">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-purple-900/40">IP</div>
            <span className="font-black text-white tracking-tight uppercase">InstaPay</span>
          </div>
          <HelpCircle className="w-6 h-6 text-white/20 cursor-pointer" />
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center text-left">
          
          {/* Info Side */}
          <div className="space-y-8">
            <h1 className="text-5xl font-black text-white leading-tight">
              Collect Money <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">Instantly.</span>
            </h1>
            <p className="text-white/40 text-lg font-medium leading-relaxed max-w-md">
              Request payments securely from any user using only their mobile number.
            </p>
            <div className="space-y-4">
              {[
                { step: "01", text: "Enter payer's phone number" },
                { step: "02", text: "Set the amount you need" },
                { step: "03", text: "Recipient receives notification" }
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/[0.06] transition-all">
                  <span className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white font-black text-sm">{item.step}</span>
                  <span className="text-white/70 font-bold text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-10 text-left">
                <div className="p-3 bg-purple-500/20 rounded-2xl">
                    <CircleDollarSign className="text-purple-400" size={24} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">New Request</h2>
            </div>
            
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[13px] font-bold text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
            
            <div className="space-y-8 text-left">
              <div className="relative border-b border-white/10 group focus-within:border-purple-500/50 transition-all">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2 block">Payer Mobile Number</label>
                <div className="flex items-center pb-4">
                  <Smartphone className="w-5 h-5 text-white/20 group-focus-within:text-purple-500 transition-colors mr-3" />
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-white font-bold placeholder:text-white/5"
                  />
                </div>
              </div>

              <div className="relative border-b border-white/10 group focus-within:border-orange-500/50 transition-all">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-2 block">Amount (EGP)</label>
                <div className="flex items-center pb-4">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                    className="text-4xl bg-transparent outline-none text-white font-black w-full placeholder:text-white/5"
                  />
                  <span className="text-white/20 font-black text-lg">EGP</span>
                </div>
              </div>

              {showSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-center gap-3 animate-bounce">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Request Sent!</span>
                </div>
              )}

              <button
                onClick={handleGenerateRequest}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-black py-5 rounded-[1.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-900/40 disabled:opacity-50 flex items-center justify-center gap-3 group mt-4"
              >
                {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        <span>Generate Request</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <CollectMoneyContent />;
}