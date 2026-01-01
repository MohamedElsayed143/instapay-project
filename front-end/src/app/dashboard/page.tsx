"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import {
  Bell,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  FileText,
  Building2,
  Wallet,
  LogOut,
  Clock,
  ChevronRight,
  ShieldCheck, // أضفنا أيقونة الحماية للأدمن
} from "lucide-react";
import { API_BASE_URL } from "@/lib/utils";

// ... الواجهات (Interfaces) تظل كما هي ...
interface Transaction {
  id: number;
  amount: string | number;
  type: string;
  display_name: string;
  account_reference: string;
  created_at: string;
  direction: "sent" | "received" | "bill";
}

interface User {
  id: string;
  name: string;
  full_name?: string; // أضفنا هذا لدعم البيانات القادمة من PHP
  role?: string; // هذا هو الحقل الأهم للتحقق
  balance?: string | number;
}

export default function InstapayDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/get_user.php?id=${userId}`
      );
      const data = await response.json();

      if (data.status === "success") {
        const updatedUser = {
          ...data.user,
          // التأكد من دمج الاسم والـ role القادمين من قاعدة البيانات
          name: data.user.full_name || data.user.name,
          role: data.user.role, // هذا السطر هو اللي هيظهر الزرار
        };

        setUser(updatedUser);
        // تحديث الـ Local Storage بالبيانات الكاملة
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ... الدوال الأخرى تظل كما هي (fetchRecentTransactions, fetchUnreadCount) ...
  const fetchRecentTransactions = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notification/get_recent_transactions.php?user_id=${userId}`
      );
      const data = await response.json();
      if (data.status === "success" && data.transactions) {
        setRecentTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, []);

  const fetchUnreadCount = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notification/get_unread_count.php?user_id=${userId}`
      );
      const data = await response.json();
      if (data.status === "success") setUnreadCount(data.unread_count);
    } catch (error) {
      console.error("Error fetching unread count");
    }
  }, []);

  const { t, isRtl } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchUserData(parsedUser.id);
      fetchUnreadCount(parsedUser.id);
      fetchRecentTransactions(parsedUser.id);
    } else {
      window.location.href = "/login";
    }
  }, [fetchUserData, fetchRecentTransactions, fetchUnreadCount]);

  if (!mounted) return null;

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-purple-600 font-medium">
        <div className="animate-pulse">{t("dash.updating")}</div>
      </div>
    );
  }

  if (!user) return null;

  const services = [
    {
      icon: ArrowUpRight,
      label: t("dash.send"),
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      description: t("dash.sendDesc"),
      path: "/sendmoney",
    },
    {
      icon: CheckCircle,
      label: t("dash.collect"),
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      description: t("dash.collectDesc"),
      path: "/collectmoney",
    },
    {
      icon: Building2,
      label: t("dash.accounts"),
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      description: t("dash.accountsDesc"),
      path: "/manageaccount",
    },
    {
      icon: FileText,
      label: t("dash.bill"),
      color: "bg-red-50",
      iconColor: "text-red-600",
      description: t("dash.billDesc"),
      path: "/billpay",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-[#F8FAFC] w-full pb-10 font-sans text-gray-900 ${
        isRtl ? "rtl" : ""
      }`}
    >
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-100">
            IP
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">
            InstaPay
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          {/* التعديل الجديد: زر الأدمن يظهر فقط إذا كان المستخدم أدمن */}
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-2 bg-purple-600 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl hover:bg-purple-700 transition-all shadow-md shadow-purple-100"
            >
              <ShieldCheck size={18} />{" "}
              <span className="hidden sm:inline">{t("dash.admin")}</span>
            </Link>
          )}

          <Link
            href="/notification"
            className="bg-gray-50 p-2.5 rounded-xl relative hover:bg-purple-50 transition-colors group"
          >
            <Bell
              size={20}
              className="text-gray-500 group-hover:text-purple-600"
            />
            {unreadCount > 0 && (
              <span
                className={`absolute -top-1 ${
                  isRtl ? "-left-1" : "-right-1"
                } flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white font-bold`}
              >
                {unreadCount > 9 ? "+9" : unreadCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
          >
            <LogOut size={18} className={isRtl ? "rotate-180" : ""} />{" "}
            {t("dash.logout")}
          </button>
        </div>
      </nav>

      {/* باقي محتوى الصفحة يظل كما هو دون تغيير */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-orange-500 pt-12 pb-36 px-8 text-white">
        <div className="max-w-6xl mx-auto">
          <p className="opacity-70 text-sm font-medium mb-1">
            {t("dash.welcome")}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {user.name}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-24">
        <div className="bg-white rounded-[2.2rem] p-8 shadow-xl shadow-gray-200/40 mb-10 flex justify-between items-center border border-white">
          <div className={isRtl ? "text-right" : ""}>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              {t("dash.balance")}
            </p>
            <div
              className={`flex items-baseline gap-2 ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                {user.balance !== undefined
                  ? parseFloat(user.balance.toString()).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 }
                    )
                  : "0.00"}
              </h2>
              <span className="text-xl text-gray-400 font-bold">EGP</span>
            </div>
          </div>
          <div className="bg-purple-50 p-5 rounded-2xl text-purple-600">
            <Wallet size={32} />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((s, i) => (
            <Link key={i} href={s.path} className="group no-underline">
              <div className="bg-white p-6 rounded-[2rem] border border-transparent hover:border-purple-100 hover:shadow-2xl hover:shadow-purple-100/30 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-[1.03] flex flex-col items-center text-center gap-4">
                <div
                  className={`p-5 rounded-2xl transition-all duration-500 ${
                    isRtl ? "group-hover:-rotate-6" : "group-hover:rotate-6"
                  } ${s.color} ${s.iconColor}`}
                >
                  <s.icon size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-bold text-base block text-gray-800">
                    {s.label}
                  </span>
                  <span className="text-gray-400 text-xs font-medium mt-1 block">
                    {s.description}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50">
          <div
            className={`flex justify-between items-center mb-8 ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <h3
              className={`text-lg font-bold flex items-center gap-3 text-gray-800 ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              <div className="bg-purple-50 p-2 rounded-lg">
                <Clock size={18} className="text-purple-600" />
              </div>
              {t("dash.activity")}
            </h3>
            <Link
              href="/notification"
              className={`text-purple-600 text-sm font-bold hover:gap-2 flex items-center gap-1 transition-all group ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              {t("dash.viewAll")}{" "}
              <ChevronRight
                size={16}
                className={`${
                  isRtl
                    ? "rotate-180 group-hover:-translate-x-1"
                    : "group-hover:translate-x-1"
                } transition-transform`}
              />
            </Link>
          </div>

          <div className="space-y-2">
            {recentTransactions.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm font-medium">
                {t("dash.noTrans")}
              </p>
            ) : (
              recentTransactions.map((tx) => {
                const isSent = tx.direction === "sent";
                const isReceived = tx.direction === "received";
                const isBill = tx.direction === "bill";

                return (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-2xl transition-all group ${
                      isRtl ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center gap-4 ${
                        isRtl ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`p-3.5 rounded-xl transition-transform group-hover:scale-110 ${
                          isReceived
                            ? "bg-green-50 text-green-500"
                            : isSent
                            ? "bg-orange-50 text-orange-500"
                            : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        {isReceived ? (
                          <ArrowDownLeft size={20} />
                        ) : isSent ? (
                          <ArrowUpRight size={20} />
                        ) : (
                          <FileText size={20} />
                        )}
                      </div>
                      <div className={isRtl ? "text-right" : ""}>
                        <p className="font-bold text-sm text-gray-900 capitalize">
                          {(() => {
                            const lowerName = tx.display_name.toLowerCase();
                            const billKey = `bill.${lowerName}`;
                            const translatedName =
                              t(billKey) !== billKey
                                ? t(billKey)
                                : tx.display_name;

                            if (isSent)
                              return `${t("dash.to")} ${translatedName}`;
                            if (isReceived)
                              return `${t("dash.from")} ${translatedName}`;
                            return translatedName;
                          })()}
                        </p>
                        <p className="text-[11px] text-gray-400 font-semibold">
                          {tx.account_reference || t("dash.transfer")} •{" "}
                          {new Date(tx.created_at).toLocaleDateString(
                            isRtl ? "ar-EG" : "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className={isRtl ? "text-left" : "text-right"}>
                      <p
                        className={`font-black text-lg ${
                          isReceived
                            ? "text-green-600"
                            : isSent || isBill
                            ? "text-red-600"
                            : "text-gray-900"
                        } ${
                          isRtl
                            ? "flex flex-row-reverse gap-1 items-baseline"
                            : ""
                        }`}
                      >
                        {isReceived ? "+" : "-"}
                        {parseFloat(tx.amount.toString()).toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 }
                        )}
                        <span className="text-[10px] text-gray-400 ml-1 uppercase font-bold tracking-tighter">
                          EGP
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
