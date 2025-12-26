"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import {
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  X,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { t, isRtl } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // حساب عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter((n) => Number(n.is_read) === 0).length;

  const fetchNotifications = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!savedUser.id) return;

    try {
      const response = await fetch(
        `http://localhost/instapay-backend/notification/get_notifications.php?user_id=${savedUser.id}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (
    notifId: number,
    requestId: number,
    status: "accepted" | "rejected"
  ) => {
    if (!requestId) {
      alert(t('notif.error.requestId'));
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setProcessingId(notifId);

    try {
      const response = await fetch(
        "http://localhost/instapay-backend/transaction/respond_to_request.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notification_id: notifId,
            request_id: requestId,
            status: status,
            user_id: savedUser.id,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        await fetchNotifications();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert(t('notif.error.server'));
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const translateText = (text: string) => {
    if (!text) return text;
    
    // Titles
    if (text === "Money Sent") return t('notif.title.moneySent');
    if (text === "Payment Request") return t('notif.title.paymentRequest');
    if (text === "Money Received") return t('notif.title.moneyReceived');
    if (text === "Payment Received") return t('notif.title.paymentReceived');
    
    // Descriptions
    if (text.startsWith("Sent to ")) {
      const name = text.replace("Sent to ", "");
      return t('notif.desc.sentTo').replace("{name}", name);
    }
    if (text === "New money request received") return t('notif.desc.newReq');
    if (text.startsWith("Received from ")) {
      const name = text.replace("Received from ", "");
      return t('notif.desc.recvFrom').replace("{name}", name);
    }
    if (text === "You received a payment") return t('notif.desc.youRecv');
    
    return text;
  };

  const getTransactionDetails = (type: string) => {
    switch (type) {
      case "payment_request":
        return { 
          icon: <Clock size={20} />, 
          color: "bg-blue-50 text-blue-600",
          amountColor: "text-gray-900",
          sign: "" 
        };
      case "sent_funds":
      case "payment_rejected":
        return {
          icon: <ArrowUpRight size={20} />,
          color: "bg-red-50 text-red-600",
          amountColor: "text-red-600",
          sign: "-"
        };
      case "received_funds":
        return {
          icon: <ArrowDownLeft size={20} />,
          color: "bg-green-50 text-green-600",
          amountColor: "text-green-600",
          sign: "+"
        };
      default:
        return {
          icon: <ArrowDownLeft size={20} />,
          color: "bg-gray-50 text-gray-600",
          amountColor: "text-gray-600",
          sign: ""
        };
    }
  };

    return (
      <div className={`min-h-screen bg-[#F8F9FA] ${isRtl ? "rtl" : ""}`} dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white p-6 shadow-lg sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative bg-white/20 p-2 rounded-full">
                <Bell className="w-6 h-6 text-white" />
                {/* عرض دائرة التنبيه فقط إذا كان هناك إشعارات غير مقروءة */}
                {unreadCount > 0 && (
                  <span className={`absolute -top-1 ${isRtl ? "-left-1" : "-right-1"} bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-purple-700 animate-pulse`}>
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold">{t('notif.title')}</h1>
                <p className="text-xs text-purple-100">
                  {unreadCount > 0 ? t('notif.newAlerts').replace('{count}', unreadCount.toString()) : t('notif.noAlerts')}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm bg-white text-purple-700 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-sm"
            >
              <ArrowLeft size={18} className={isRtl ? "rotate-180" : ""} /> {t('notif.dash')}
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-20 text-gray-400 font-medium">{t('notif.loading')}</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <Bell className="w-12 h-12 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">{t('notif.empty')}</p>
            </div>
          ) : (
            notifications.map((n) => {
              const details = getTransactionDetails(n.type);
              const isPending = Number(n.is_read) === 0;

              return (
                <div
                  key={n.id}
                  className={`bg-white rounded-3xl p-5 border transition-all duration-300 ${
                    isPending
                      ? "border-purple-200 shadow-md ring-1 ring-purple-50" // الإشعار غير المقروء يظهر بحدود ملونة
                      : "border-gray-100 opacity-75" // الإشعار المقروء يظهر باهت قليلاً
                  }`}
                >
                  <div className={`flex justify-between items-center ${isRtl ? "flex-row-reverse" : ""}`}>
                    <div className={`flex gap-4 items-center ${isRtl ? "flex-row-reverse" : ""}`}>
                      <div className={`relative p-3 rounded-2xl shrink-0 ${details.color}`}>
                        {details.icon}
                        {/* نقطة صغيرة تدل على أن هذا الإشعار تحديداً لم يقرأ بعد */}
                        {isPending && (
                          <span className={`absolute top-0 ${isRtl ? "left-0" : "right-0"} w-3 h-3 bg-red-500 border-2 border-white rounded-full`}></span>
                        )}
                      </div>
                        <div className={isRtl ? "text-right" : ""}>
                          <h3 className={`font-bold text-gray-800 text-base ${isPending ? "text-purple-900" : ""}`}>
                            {translateText(n.title)}
                          </h3>
                          <p className="text-gray-500 text-sm">{translateText(n.description)}</p>
                        </div>
                    </div>

                    <div className={`${isRtl ? "text-left" : "text-right"} shrink-0`}>
                      <div className={`font-black text-lg ${details.amountColor} ${isRtl ? "flex flex-row-reverse gap-1 items-baseline justify-end" : ""}`}>
                        {details.sign} {parseFloat(n.amount).toLocaleString()}
                        <span className="text-xs ml-1 font-medium">EGP</span>
                      </div>
                      <div className={`text-[10px] text-gray-400 mt-1 font-bold flex items-center gap-1 ${isRtl ? "justify-start" : "justify-end"}`}>
                        <Clock size={10} />
                        {n.created_at || n.time}
                      </div>
                    </div>
                  </div>

                  {/* الأزرار تظهر فقط للطلبات المعلقة */}
                  {n.type === "payment_request" && isPending ? (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                      <button
                        disabled={processingId === n.id}
                        onClick={() => handleResponse(n.id, n.request_id, "accepted")}
                        className="flex-1 bg-green-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Check size={18} />
                        {processingId === n.id ? t('notif.processing') : t('notif.acceptPay')}
                      </button>
                      <button
                        disabled={processingId === n.id}
                        onClick={() => handleResponse(n.id, n.request_id, "rejected")}
                        className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <X size={18} /> {t('notif.reject')}
                      </button>
                    </div>
                  ) : (
                    n.type === "payment_request" && !isPending && (
                      <div className={`mt-3 flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full uppercase ${isRtl ? "flex-row-reverse ml-auto" : ""}`}>
                        <Check size={12} /> {t('notif.completed')}
                      </div>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
}