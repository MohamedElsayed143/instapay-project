"use client";
import React, { useEffect, useState } from "react";
import { Search, Edit2, Trash2, ArrowLeft, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/admin/get_all_users.php"
      );
      const data = await response.json();
      if (data.status === "success") setUsers(data.users);
    } catch (e) {
      Swal.fire("Error", "Could not fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user: any) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${userName}. This cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          "http://localhost:8000/admin/delete_user.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          Swal.fire("Deleted!", "User has been removed.", "success");
          fetchUsers();
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Server connection failed", "error");
      }
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/admin/update_user_full.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: editingUser.id,
            new_phone: editingUser.phone,
            new_balance: parseFloat(editingUser.balance),
            new_name: editingUser.full_name,
          }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Server connection failed", "error");
    }
  };

  const filteredUsers = users.filter(
    (u: any) =>
      (u.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone || "").includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              href="/admin"
              className="text-sm font-bold text-purple-600 flex items-center gap-2 mb-2"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-[1000] tracking-tight text-black">
              User Management
            </h2>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl w-80 outline-none shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchUsers}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-purple-600 shadow-sm transition-all"
            >
              <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[11px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">User</th>
                <th className="px-8 py-6">Phone & Role</th>
                <th className="px-8 py-6">Balance</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u: any) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-6 font-bold text-gray-900">
                    {u.full_name}
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-gray-600 font-bold">{u.phone}</p>
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-black uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">
                    {parseFloat(u.balance).toLocaleString()} EGP
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openEditModal(u)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      
                      {/* حماية حساب الأدمن: زر الحذف يظهر فقط للمستخدمين العاديين */}
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.full_name)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 text-black">
                <h3 className="text-2xl font-black">Edit User</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X />
                </button>
              </div>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-gray-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editingUser.full_name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        full_name: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-gray-400">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-gray-400">
                    Balance (EGP)
                  </label>
                  <input
                    type="number"
                    value={editingUser.balance}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        balance: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 font-bold text-green-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all mt-4 shadow-lg shadow-purple-100"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}