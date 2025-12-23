"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  CreditCard,
  Activity,
  DollarSign,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalTransactions: 0,
    totalBills: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. فحص الصلاحية من الـ Local Storage
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user && user.role === "admin") {
      setIsAuthorized(true);
      fetchStats();
      fetchRecentTransactions();
    } else {
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  // 2. دالة جلب الإحصائيات
  const fetchStats = async () => {
    try {
      const response = await fetch(
        "http://localhost/instapay-backend/admin/get_stats.php"
      );
      const data = await response.json();
      if (data.status === "success") {
        setStats(data.stats);
      }
    } catch (e) {
      console.error("Stats fetch failed");
    }
  };

  // 3. دالة جلب آخر العمليات
  const fetchRecentTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost/instapay-backend/admin/get_recent_transactions.php"
      );
      const data = await response.json();
      if (data.status === "success") {
        setRecentTransactions(data.transactions);
      }
    } catch (e) {
      console.error("Transactions fetch failed");
    }
  };

  if (!isAuthorized) return null;

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Platform Balance",
      value: `${Number(stats.totalBalance).toLocaleString()} EGP`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Transactions",
      value: stats.totalTransactions,
      icon: Activity,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Bills Paid",
      value: stats.totalBills,
      icon: CreditCard,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-bold text-purple-600 flex items-center gap-2 mb-2 hover:underline"
            >
              <ArrowLeft size={16} /> Back to App
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Admin Control Panel
            </h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/users"
              className="bg-white border border-gray-200 px-6 py-3 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/transactions"
              className="bg-purple-600 px-6 py-3 rounded-2xl font-bold text-white shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all"
            >
              All Activity
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}
              >
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  {card.label}
                </p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">
                  {card.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Global Activity Table */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900">
              System-wide Transactions Summary
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">
              Latest 5 Operations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase font-black tracking-widest px-4">
                  <th className="px-6 pb-4">Transaction Party</th>
                  <th className="px-6 pb-4">Type</th>
                  <th className="px-6 pb-4">Amount</th>
                  <th className="px-6 pb-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx: any) => (
                    <tr
                      key={tx.id}
                      className="bg-white hover:bg-gray-50/50 transition-colors border-y border-gray-50"
                    >
                      <td className="px-6 py-4 rounded-l-2xl">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              tx.sender_name
                                ? "bg-red-50 text-red-500"
                                : "bg-green-50 text-green-500"
                            }`}
                          >
                            {tx.sender_name ? (
                              <ArrowUpRight size={16} />
                            ) : (
                              <ArrowDownLeft size={16} />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900">
                              {tx.sender_name || "External/System"}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                              TO:{" "}
                              {tx.type === "bill"
                                ? tx.service_name || "Utility Bill"
                                : tx.receiver_name || "Recipient"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-gray-200">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className={`font-black text-sm ${
                            tx.sender_name ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {tx.sender_name ? "-" : "+"}
                          {Number(tx.amount).toLocaleString()} EGP
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right rounded-r-2xl">
                        <p className="text-xs text-gray-400 font-bold">
                          {new Date(tx.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-[10px] text-gray-300 font-medium">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-medium"
                    >
                      No recent transactions found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
