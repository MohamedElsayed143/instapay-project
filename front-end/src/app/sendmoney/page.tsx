"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import {
  Smartphone,
  CheckCircle,
  Send,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

interface User {
  id: string | number;
  name: string;
  balance: number | string;
}

const SendMoneyPage: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [amount, setAmount] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const quickAmounts: number[] = [50, 100, 200, 500, 1000];
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) {
      // لو مش مسجل دخول، اطرده فوراً
      router.push("/login");
    } else {
      // التعديل هنا: لازم تخزن البيانات في الـ user state عشان تظهر في الصفحة وتتبعت للسيرفر
      const parsedUser = JSON.parse(userRaw);
      setUser(parsedUser);
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

  const handleSendMoney = async (): Promise<void> => {
    setErrorMessage("");
    setShowSuccess(false);

    // التحقق من المدخلات
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMessage(t("send.error.phone"));
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage(t("send.error.amount"));
      return;
    }

    if (user && parseFloat(user.balance.toString()) < parseFloat(amount)) {
      setErrorMessage(t("send.error.balance"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "${API_BASE_URL}/transaction/send-money.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender_id: user?.id,
            receiver_phone: mobileNumber,
            amount: parseFloat(amount),
          }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setShowSuccess(true);

        // تحديث الرصيد الجديد في LocalStorage و الـ State
        const updatedUser = { ...user, balance: result.new_balance };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser as User);

        // تفريغ الحقول
        setAmount("");
        setMobileNumber("");

        // إخفاء رسالة النجاح بعد 5 ثواني
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setErrorMessage(
          result.message || (isRtl ? "فشلت العملية" : "Operation failed")
        );
      }
    } catch (error) {
      setErrorMessage(
        isRtl
          ? "خطأ في الاتصال بالسيرفر، تأكد من تشغيل XAMPP"
          : "Server connection error, make sure XAMPP is running"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 ${
        isRtl ? "text-right" : "text-left"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
              IP
            </div>
            <span className="text-xl font-bold text-gray-800">InstaPay</span>
          </div>
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 text-purple-600 font-medium transition-all ${
              isRtl ? "hover:gap-3 flex-row-reverse" : "hover:gap-3"
            }`}
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            <span>{t("send.back")}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {t("send.title")}
            </h1>
            <p className="text-lg text-gray-600">{t("send.desc")}</p>

            <div className="bg-purple-600 p-6 rounded-2xl text-white shadow-lg inline-block w-full md:w-auto">
              <p className="text-purple-100 text-sm">{t("dash.balance")}</p>
              <p className="text-2xl font-bold">
                {user?.balance
                  ? parseFloat(user.balance.toString()).toLocaleString()
                  : "0.00"}{" "}
                EGP
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              {t("send.details")}
            </h2>

            {errorMessage && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {showSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-700 animate-bounce">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{t("send.success")}</span>
              </div>
            )}

            <div className="mb-6">
              <label
                className={`text-sm font-semibold text-gray-700 mb-2 block ${
                  isRtl ? "text-right" : "text-left"
                }`}
              >
                {t("send.mobile")}
              </label>
              <div
                className={`flex items-center border-2 border-gray-100 rounded-2xl px-4 py-4 focus-within:border-purple-600 bg-gray-50 transition ${
                  isRtl ? "flex-row-reverse" : ""
                }`}
              >
                <Smartphone
                  className={`text-gray-300 w-5 h-5 ${isRtl ? "ml-3" : "mr-3"}`}
                />
                <span
                  className={`text-gray-400 font-bold ${
                    isRtl ? "ml-2" : "mr-2"
                  }`}
                >
                  {isRtl ? "20+" : "+20"}
                </span>
                <input
                  type="tel"
                  placeholder="1xxxxxxxxx"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-lg tracking-wider"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className={`text-sm font-semibold text-gray-700 mb-2 block ${
                  isRtl ? "text-right" : "text-left"
                }`}
              >
                {t("send.amount")}
              </label>
              <div className="flex items-center border-2 border-gray-100 rounded-2xl px-4 py-4 focus-within:border-purple-600 bg-gray-50 transition">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`text-3xl text-gray-800 outline-none w-full font-bold bg-transparent ${
                    isRtl ? "text-right" : ""
                  }`}
                />
              </div>
            </div>

            <div
              className={`mb-8 flex gap-2 flex-wrap ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="px-5 py-2 bg-gray-50 hover:bg-purple-600 hover:text-white text-gray-600 font-bold rounded-xl transition-all border border-gray-100"
                >
                  {amt} EGP
                </button>
              ))}
            </div>

            <button
              onClick={handleSendMoney}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold py-5 rounded-2xl hover:shadow-xl transition flex items-center justify-center gap-3 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? t("login.processing") : t("send.confirm")}
              <Send className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoneyPage;
