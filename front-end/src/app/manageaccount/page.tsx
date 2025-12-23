"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  CreditCard,
  Settings,
  Wallet,
  ShieldCheck,
  Camera,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface UserData {
  id: string;
  full_name: string;
  phone: string;
  balance: string | number;
  avatar?: string;
}

export default function ManageAccountsPage() {
  const [activeTab, setActiveTab] = useState<"accounts" | "profile">("accounts");
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [newName, setNewName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  }, []);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost/instapay-backend/auth/get_user.php?id=${userId}`
      );
      const data = await response.json();

      if (data.status === "success" && data.user) {
        setUser(data.user);
        setNewName(data.user.full_name || "");
      } else {
        setError(data.message || "User not found");
      }
    } catch (err) {
      setError("Connection to server failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.id) fetchUserData(parsed.id);
        else throw new Error();
      } catch {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, [fetchUserData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("user_id", user.id);

    setUpdating(true);
    try {
      const response = await fetch(
        "http://localhost/instapay-backend/auth/upload_avatar.php",
        {
          method: "POST",
          body: formData, // لا نضع headers لـ FormData المتصفح يضعها تلقائياً
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        showToast("success", "Profile picture updated!");
        fetchUserData(user.id);
      } else {
        showToast("error", data.message);
      }
    } catch {
      showToast("error", "Upload failed - Server error");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName || newName === user?.full_name) return;
    setUpdating(true);
    try {
      const response = await fetch(
        "http://localhost/instapay-backend/auth/settings.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_name",
            name: newName,
            user_id: user?.id,
          }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        showToast("success", "Name updated successfully!");
        if (user) fetchUserData(user.id);
      } else showToast("error", data.message);
    } catch {
      showToast("error", "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword)
      return showToast("error", "All fields are required");
    
    setUpdating(true);
    try {
      const response = await fetch(
        "http://localhost/instapay-backend/auth/settings.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "change_password",
            oldPassword,
            newPassword,
            user_id: user?.id,
          }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        showToast("success", "Password updated!");
        setOldPassword("");
        setNewPassword("");
      } else showToast("error", data.message);
    } catch {
      showToast("error", "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <RefreshCw className="animate-spin text-purple-600 w-8 h-8" />
      </div>
    );

  if (error || !user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-red-100">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <p className="font-bold text-slate-800">{error || "Access Denied"}</p>
          <Link
            href="/login"
            className="text-purple-600 text-sm underline mt-2 inline-block"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans" dir="ltr">
      {statusMsg && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border bg-white animate-in slide-in-from-top-5 duration-300 ${
            statusMsg.type === "success"
              ? "border-emerald-100 text-emerald-600"
              : "border-red-100 text-red-600"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
          <span className="font-bold">{statusMsg.text}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-slate-400 hover:text-purple-600 font-bold mb-8 transition-all group w-fit"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">
            Settings & Security
          </h1>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            <button
              onClick={() => setActiveTab("accounts")}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === "accounts"
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-400"
              }`}
            >
              Wallet
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === "profile"
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-400"
              }`}
            >
              Security
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-32 h-32 bg-purple-100 rounded-[2rem] flex items-center justify-center text-purple-600 mb-6 overflow-hidden border-4 border-slate-50 transition-all group-hover:scale-105">
                  {user.avatar ? (
                    <img
                      src={`http://localhost/instapay-backend/uploads/avatars/${user.avatar}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      // منع التخزين المؤقت للصورة القديمة عند التحديث
                      key={user.avatar} 
                    />
                  ) : (
                    <User className="w-16 h-16" />
                  )}
                  {updating && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                       <RefreshCw className="animate-spin text-purple-600" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 right-0 bg-slate-900 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>

              <h3 className="font-black text-2xl text-slate-900 mb-2">
                {user.full_name}
              </h3>
              <p className="text-slate-400 text-sm font-bold mb-6 italic">
                Premium Member
              </p>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <Smartphone className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-black tracking-wider">
                    {user.phone}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <Wallet className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-black tracking-wider">
                    {Number(user.balance).toLocaleString()} EGP
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {activeTab === "accounts" ? (
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-white">
                <h2 className="text-xl font-black text-slate-800 mb-8">
                  Linked Payment Account
                </h2>
                <div className="bg-gradient-to-br from-slate-800 to-slate-950 aspect-[1.7/1] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <CreditCard className="w-12 h-12 opacity-50" />
                      <span className="font-mono tracking-widest opacity-60 italic">
                        INSTAPAY GOLD
                      </span>
                    </div>
                    <div className="text-2xl font-mono tracking-[0.3em]">
                      **** **** ****{" "}
                      {user.phone ? user.phone.slice(-4) : "0000"}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] opacity-40 uppercase mb-1">
                          Available Balance
                        </p>
                        <p className="text-4xl font-black tracking-tight">
                          {Number(user.balance).toLocaleString()}{" "}
                          <span className="text-sm font-medium">EGP</span>
                        </p>
                      </div>
                      <div className="w-14 h-10 bg-white/10 backdrop-blur-md rounded-lg border border-white/10"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-white">
                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-black text-slate-400 uppercase mb-4 tracking-widest">
                      Full Name
                    </h3>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl focus-within:bg-white transition-all flex items-center">
                        <User className="w-5 h-5 text-slate-300 mr-3" />
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="bg-transparent w-full outline-none font-bold text-slate-700"
                        />
                      </div>
                      <button
                        onClick={handleUpdateName}
                        disabled={updating}
                        className="bg-slate-900 text-white px-8 rounded-2xl font-bold hover:bg-purple-600 transition-all disabled:opacity-50"
                      >
                        {updating ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-black text-slate-400 uppercase mb-4 tracking-widest">
                      Security Update
                    </h3>
                    <div className="relative bg-slate-50 border border-slate-100 p-4 rounded-2xl focus-within:bg-white transition-all flex items-center">
                      <Lock className="w-5 h-5 text-slate-300 mr-3" />
                      <input
                        type={showOldPass ? "text" : "password"}
                        placeholder="Current Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="bg-transparent w-full outline-none font-bold text-slate-700 pr-10"
                      />
                      <button
                        onClick={() => setShowOldPass(!showOldPass)}
                        className="absolute right-4 text-slate-400"
                      >
                        {showOldPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="relative bg-slate-50 border border-slate-100 p-4 rounded-2xl focus-within:bg-white transition-all flex items-center">
                      <ShieldCheck className="w-5 h-5 text-slate-300 mr-3" />
                      <input
                        type={showNewPass ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-transparent w-full outline-none font-bold text-slate-700 pr-10"
                      />
                      <button
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-4 text-slate-400"
                      >
                        {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <button
                      onClick={handleChangePassword}
                      disabled={updating}
                      className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-purple-100 transition-all disabled:opacity-50"
                    >
                      {updating ? "Updating..." : "Update Password"}
                    </button>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}