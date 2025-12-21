"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Zap,
  CreditCard,
  Calendar,
  CheckCircle,
  Phone,
  Lightbulb,
  Droplet,
  Wifi,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Coins,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

export default function BillPaymentPage() {
  const [selectedService, setSelectedService] = useState("electricity");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [recentBills, setRecentBills] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState<{
    show: boolean;
    billId: number | null;
  }>({ show: false, billId: null });

  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  const getUserId = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser).id : null;
  };

  const services = [
    {
      id: "electricity",
      icon: Lightbulb,
      label: "Electricity",
      color: "text-yellow-500",
    },
    { id: "water", icon: Droplet, label: "Water", color: "text-blue-500" },
    { id: "mobile", icon: Phone, label: "Mobile", color: "text-green-500" },
    { id: "internet", icon: Wifi, label: "Internet", color: "text-purple-500" },
  ];

  const quickAmounts = [50, 100, 150, 200, 300];

  const fetchBalance = useCallback(async () => {
    const id = getUserId();
    if (!id) return;
    try {
      const res = await fetch(
        `http://localhost/instapay-backend/auth/get_user.php?id=${id}`
      );
      const data = await res.json();
      if (data.status === "success") setUserBalance(Number(data.user.balance));
    } catch (err) {
      console.error("Failed to fetch balance");
    }
  }, []);

  const fetchRecentBills = useCallback(async () => {
    const id = getUserId();
    if (!id) return;
    try {
      const res = await fetch(
        `http://localhost/instapay-backend/auth/get_bills.php?user_id=${id}`
      );
      const data = await res.json();
      if (data.status === "success") {
        setRecentBills(data.bills);
      }
    } catch (err) {
      console.error("Failed to fetch bills");
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchRecentBills();
  }, [fetchBalance, fetchRecentBills]);

  const executeDelete = async () => {
    const billId = showConfirm.billId;
    if (!billId) return;
    try {
      const res = await fetch(
        "http://localhost/instapay-backend/auth/delete_bill.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bill_id: billId }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setStatusMsg({ type: "success", text: "Record removed from history" });
        fetchRecentBills(); // تحديث القائمة فوراً
      } else {
        setStatusMsg({ type: "error", text: data.message });
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "Connection error" });
    } finally {
      setShowConfirm({ show: false, billId: null });
    }
  };

  const handlePayNow = async () => {
    const userId = getUserId();
    if (!accountNumber || !amount) {
      setStatusMsg({ type: "error", text: "Please fill all fields" });
      return;
    }
    if (Number(amount) > userBalance) {
      setStatusMsg({ type: "error", text: "Insufficient balance!" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost/instapay-backend/auth/pay_bill.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            amount: amount,
            service: selectedService,
            meter: accountNumber,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setStatusMsg({ type: "success", text: "Bill paid successfully!" });
        setAccountNumber("");
        setAmount("");
        fetchBalance();
        fetchRecentBills();
      } else {
        setStatusMsg({ type: "error", text: data.message });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "Payment failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 font-sans text-left">
      {/* Toast Messages */}
      {statusMsg && (
        <div
          className={`fixed top-10 right-10 z-[100] p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500 border-l-4 ${
            statusMsg.type === "success"
              ? "bg-white border-green-500"
              : "bg-white border-red-500"
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              statusMsg.type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div>
            <p className="font-black text-gray-800 text-[10px] uppercase tracking-widest">
              {statusMsg.type === "success" ? "Success" : "Attention"}
            </p>
            <p className="text-sm text-gray-500 font-bold">{statusMsg.text}</p>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="ml-2 text-gray-300 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-purple-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowConfirm({ show: false, billId: null })}
          ></div>
          <div className="bg-white rounded-[2rem] p-8 shadow-2xl max-w-sm w-full relative z-[120] animate-in zoom-in-95 duration-200 text-center border border-purple-100">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2 italic">
              Remove Activity
            </h3>
            <p className="text-gray-500 font-medium mb-8">
              Delete this bill record from your history?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirm({ show: false, billId: null })}
                className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="py-3 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold mb-8 transition-all group w-fit"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <header>
              <h1 className="text-4xl font-black text-gray-900 mb-2 italic tracking-tight">
                Pay Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 uppercase">
                  Bills
                </span>
              </h1>
              <p className="text-gray-500 font-medium">
                Fast, secure and instant utility payments.
              </p>
            </header>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-purple-600 to-orange-500 rounded-[2.5rem] p-8 text-white shadow-2xl transition-all hover:shadow-purple-200">
              <p className="text-white/70 font-bold uppercase text-[10px] tracking-[0.2em] mb-2">
                Available Balance
              </p>
              <h3 className="text-4xl font-black">
                {userBalance.toLocaleString()}{" "}
                <span className="text-lg font-medium opacity-70 italic">
                  EGP
                </span>
              </h3>
              <div className="mt-6 flex items-center gap-2 bg-white/20 backdrop-blur-md w-fit px-4 py-2 rounded-xl border border-white/30">
                <CheckCircle className="w-4 h-4 text-white" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  InstaPay Secure Wallet
                </span>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-purple-50">
              <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3 italic">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
                Payment Details
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                      selectedService === service.id
                        ? "border-purple-600 bg-purple-50 shadow-md scale-105"
                        : "border-gray-50 hover:border-purple-200 bg-gray-50/50"
                    }`}
                  >
                    <service.icon
                      className={`w-7 h-7 ${
                        selectedService === service.id
                          ? service.color
                          : "text-gray-300"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        selectedService === service.id
                          ? "text-purple-700"
                          : "text-gray-500"
                      }`}
                    >
                      {service.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1 italic">
                    Meter / Account Number
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus-within:bg-white focus-within:border-purple-400 transition-all">
                    <CreditCard className="w-5 h-5 text-gray-300 mr-4" />
                    <input
                      type="text"
                      placeholder="e.g. 1000293847"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="bg-transparent flex-1 outline-none text-gray-700 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1 italic">
                    Amount
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus-within:bg-white focus-within:border-orange-400 transition-all">
                    <Coins className="w-5 h-5 text-gray-300 mr-4" />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent flex-1 outline-none text-2xl font-black text-gray-800 tracking-tighter"
                    />
                    <span className="font-black text-purple-600 italic">
                      EGP
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      className="px-5 py-2.5 bg-white border border-gray-100 hover:border-purple-600 hover:text-purple-600 text-gray-500 text-[10px] font-black rounded-xl shadow-sm transition-all"
                    >
                      {amt} EGP
                    </button>
                  ))}
                </div>

                <button
                  onClick={handlePayNow}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white font-black py-5 rounded-[1.5rem] hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-purple-50">
              <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 italic">
                <Calendar className="w-5 h-5 text-purple-600" /> Bill History
              </h3>
              <div className="space-y-4">
                {recentBills.length > 0 ? (
                  recentBills.map((bill) => (
                    <div
                      key={bill.id}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() =>
                            setShowConfirm({ show: true, billId: bill.id })
                          }
                          className="p-2 bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </div>
                        <div>
                          {/* تعديل: التأكد من قراءة service_name و تنسيق التاريخ الصحيح */}
                          <p className="text-[12px] font-black text-gray-700 capitalize italic tracking-tight">
                            {bill.service_name || "Utility Bill"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            {bill.payment_date
                              ? new Date(bill.payment_date).toLocaleDateString()
                              : "No Date"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-purple-600 italic">
                        -{bill.amount} EGP
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-gray-400 text-[10px] font-black uppercase italic">
                      No bills yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-[2rem] p-6 text-white shadow-lg">
              <h3 className="font-black mb-2 flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                <Zap className="w-3 h-3 text-orange-400" /> Security Tip
              </h3>
              <p className="text-[11px] text-purple-100 leading-relaxed font-bold tracking-tight opacity-90">
                Always verify the meter number before payment. Transactions
                cannot be reversed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
