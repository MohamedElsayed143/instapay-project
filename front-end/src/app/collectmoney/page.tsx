"use client";

import { useEffect, useState } from "react";
import {
  Smartphone,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";

function CollectMoneyContent() {
  const { t, isRtl } = useLanguage();
  const [amount, setAmount] = useState<number | "">("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      // لو مش مسجل دخول، اطرده فوراً لصفحة اللوجين
      router.push("/login");
    } else {
      // لو موجود، وقف التحميل واعرض الصفحة
      setIsCheckingAuth(false);
    }
  }, [router]);

  // لو لسه بيتحقق، اعرض شاشة تحميل بسيطة أو صفحة فاضية
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleGenerateRequest = async () => {
    setError("");

    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      setError("Session expired. Please login again.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    const savedUser = JSON.parse(userRaw);

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!mobileNumber || mobileNumber.length < 11) {
      setError("Please enter a valid mobile number");
      return;
    }

    if (mobileNumber === savedUser.phone) {
      setError("You cannot request money from your own number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "${API_BASE_URL}/transaction/send_request.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requester_id: savedUser.id,
            payer_phone: mobileNumber,
            amount: amount,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setShowSuccess(true);
        setAmount("");
        setMobileNumber("");
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to send request");
      }
    } catch (e) {
      setError("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[#f8fafc] bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] font-sans relative overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Decorative Blur Orbs - Lighter versions */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[120px]"></div>

      {/* Header */}
      <nav className="relative z-50 border-b border-gray-200 backdrop-blur-md bg-white/50 px-6 py-4">
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between ${
            isRtl ? "flex-row-reverse" : ""
          }`}
        >
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowLeft
              className={`w-5 h-5 transition-transform ${
                isRtl
                  ? "rotate-180 group-hover:translate-x-1"
                  : "group-hover:-translate-x-1"
              }`}
            />
            <span className="font-bold text-sm">
              {t("dash.admin").includes("Admin") ? "Dashboard" : "لوحة التحكم"}
            </span>
          </Link>
          <div
            className={`flex items-center gap-2 ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md shadow-purple-200">
              IP
            </div>
            <span className="font-black text-gray-900 tracking-tight uppercase">
              InstaPay
            </span>
          </div>
          <HelpCircle className="w-6 h-6 text-gray-300 cursor-pointer hover:text-gray-500 transition-colors" />
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div
          className={`w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center ${
            isRtl ? "text-right" : "text-left"
          }`}
        >
          {/* Info Side */}
          <div className="space-y-8">
            <h1 className="text-5xl font-black text-gray-900 leading-tight">
              {t("collect.title")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
                {t("collect.instantly")}
              </span>
            </h1>
            <p
              className={`text-gray-500 text-lg font-medium leading-relaxed max-w-md ${
                isRtl ? "mr-0 ml-auto" : ""
              }`}
            >
              {t("collect.desc")}
            </p>
            <div className="space-y-4">
              {[
                { step: "01", text: t("collect.step1") },
                { step: "02", text: t("collect.step2") },
                { step: "03", text: t("collect.step3") },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all ${
                    isRtl ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-black text-sm">
                    {item.step}
                  </span>
                  <span className="text-gray-700 font-bold text-sm">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white border border-gray-200 p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div
              className={`flex items-center gap-3 mb-10 ${
                isRtl ? "flex-row-reverse text-right" : "text-left"
              }`}
            >
              <div className="p-3 bg-purple-50 rounded-2xl">
                <CircleDollarSign className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {t("collect.newReq")}
              </h2>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-[13px] font-bold text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`}>
              <div className="relative border-b border-gray-100 group focus-within:border-purple-500 transition-all">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">
                  {t("collect.payerPhone")}
                </label>
                <div
                  className={`flex items-center pb-4 ${
                    isRtl ? "flex-row-reverse" : ""
                  }`}
                >
                  <Smartphone
                    className={`w-5 h-5 text-gray-300 group-focus-within:text-purple-600 transition-colors ${
                      isRtl ? "ml-3" : "mr-3"
                    }`}
                  />
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-gray-900 font-bold placeholder:text-gray-200 ${
                      isRtl ? "text-right" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="relative border-b border-gray-100 group focus-within:border-orange-500 transition-all">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">
                  {t("send.amount")}
                </label>
                <div
                  className={`flex items-center pb-4 ${
                    isRtl ? "flex-row-reverse" : ""
                  }`}
                >
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value ? Number(e.target.value) : "")
                    }
                    className={`text-4xl bg-transparent outline-none text-gray-900 font-black w-full placeholder:text-gray-100 ${
                      isRtl ? "text-right" : ""
                    }`}
                  />
                  <span className="text-gray-300 font-black text-lg">EGP</span>
                </div>
              </div>

              {showSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-center gap-3 animate-bounce">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-emerald-600 text-[11px] font-black uppercase tracking-widest">
                    {t("collect.success")}
                  </span>
                </div>
              )}

              <button
                onClick={handleGenerateRequest}
                disabled={loading}
                className={`w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-black py-5 rounded-[1.5rem] hover:shadow-lg hover:shadow-purple-200 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group mt-4 ${
                  isRtl ? "flex-row-reverse" : ""
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{t("collect.generate")}</span>
                    <ArrowRight
                      size={20}
                      className={`transition-transform ${
                        isRtl
                          ? "rotate-180 group-hover:-translate-x-1"
                          : "group-hover:translate-x-1"
                      }`}
                    />
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
