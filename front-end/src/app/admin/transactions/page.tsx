"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, FileText, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const response = await fetch("http://localhost:8000/admin/get_all_activity.php");
        const data = await response.json();
        if (data.status === "success") setTransactions(data.transactions);
      } catch (e) { 
        console.error("Transactions fetch failed"); 
      }
    };
    fetchAllTransactions();
  }, []);

  // فلترة العمليات بناءً على نص البحث
  const filteredTransactions = transactions.filter((tx: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tx.sender_name?.toLowerCase().includes(searchLower) ||
      tx.sender_phone?.includes(searchTerm) ||
      tx.service_name?.toLowerCase().includes(searchLower) ||
      tx.id.toString().includes(searchTerm) ||
      tx.receiver_phone?.includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-sm font-bold text-purple-600 flex items-center gap-2 mb-6">
          <ArrowLeft size={16} /> Back to Admin Dashboard
        </Link>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-black">System Logs</h2>
            <p className="text-gray-500 font-medium">Monitoring all global transactions</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name, phone, or service..." 
                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl w-80 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-white p-3 rounded-2xl border border-gray-100 text-gray-500 hover:bg-gray-50 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Status/Type</th>
                <th className="px-8 py-6">Sender Details</th>
                <th className="px-8 py-6">Transaction Details</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tx.type === 'bill' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                        {tx.type === 'bill' ? <FileText size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      {/* عرض اسمك كأدمن أو اسم المستخدم بشكل صحيح */}
                      <span className="font-bold text-gray-900">{tx.sender_name}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{tx.sender_phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-sm text-gray-900">
                      {tx.type === 'bill' ? `To: ${tx.service_name}` : `To: ${tx.receiver_phone || 'N/A'}`}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{tx.account_reference || 'Standard Transfer'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-gray-900">{parseFloat(tx.amount).toLocaleString()} EGP</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-gray-400 text-xs font-bold">
                      {new Date(tx.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center text-gray-400 font-medium">
              {searchTerm ? "No results match your search." : "No system activity recorded yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}