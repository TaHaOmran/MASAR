import React, { useState, useEffect } from "react";
import { X, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners"; // 🌟 استيراد اللودر البنفسجي الموحد لموقعك

// استايل مخصص لتوسيط وتقزيم الـ FadeLoader جوه علبة الإشعارات بالملي
const override = {
  display: "block",
  margin: "0 auto",
  transform: "scale(0.7)",
};

export default function Notification({ onClose, setBadgeCount, refreshCount }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };

  // 1. 🔄 تحميل الإشعارات وطباعة الـ Response الحقيقي في الـ Console
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://smartcareerpath.runasp.net/api/notifications?page=1&pageSize=10", config);
      if (res.ok) {
        const data = await res.json();
        
        console.log("=== SERVER NOTIFICATIONS RESPONSE ===", data);

        const dataList = data.items || data.data || data || [];
        setNotifications(dataList);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 2. 🌟 إدارة التفاعل والضغط على الإشعار وتوجيهه حسب الـ Type
  const handleNotificationClick = async (notif) => {
    try {
      await fetch(`https://smartcareerpath.runasp.net/api/notifications/${notif.id}/read`, {
        method: "PUT",
        headers: config.headers
      });

      if (setBadgeCount) setBadgeCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));

      if (onClose) onClose();

      // التوجيه الديناميكي المعتمد
      if (notif.type === "ChatRequestAccepted") {
        navigate(`/chats/${notif.relatedEntityId}`);
      } else if (notif.type === "ChatRequestDeclined") {
        navigate("/chat-requests/outgoing");
      } else if (notif.type === "NewChatRequest") {
        navigate("/chat-requests/incoming");
      }
      
      if (refreshCount) refreshCount();
    } catch (e) {
      console.error("Error handling notification flow:", e);
    }
  };

  // 3. 🧹 قراءة الكل دفعة واحدة وتصفير العداد
  const handleMarkAllRead = async () => {
    try {
      await fetch("https://smartcareerpath.runasp.net/api/notifications/read-all", {
        method: "PUT",
        headers: config.headers
      });
      if (setBadgeCount) setBadgeCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      if (refreshCount) refreshCount();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 bg-white shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleMarkAllRead} 
              className="text-gray-400 hover:text-indigo-600 transition p-1 rounded-lg cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck size={18} />
            </button>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-700 cursor-pointer transition p-1 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="overflow-y-auto flex-1 json-scrollbar">
          {/* 🌟 حقن الـ FadeLoader البنفسجي الموحد بحجم متناسق جوه علبة الإشعارات */}
          {loading ? (
            <div className="py-24 flex flex-col justify-center items-center gap-4 bg-white">
              <FadeLoader color={'#6366F1'} cssOverride={override} />
              <span className="text-[#5E6278] text-[12px] font-semibold tracking-wide animate-pulse mt-1">
                Loading updates...
              </span>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex gap-3 px-4 py-3.5 hover:bg-gray-50/60 transition text-left cursor-pointer relative ${
                    !notif.isRead ? "bg-indigo-50/10" : ""
                  }`}
                >
                  {!notif.isRead && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#3A64ED] rounded-full"></span>
                  )}
                  <img
                    src="https://randomuser.me/api/portraits/lego/1.jpg"
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className={`text-[14px] text-gray-900 truncate ${!notif.isRead ? "font-bold" : "font-semibold"}`}>
                        {notif.title || notif.notificationTitle || notif.header || "Notification Update"}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-xs leading-5 mt-1">
                      {notif.message || notif.notificationMessage || notif.content || notif.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center bg-white">
              <p className="text-sm text-gray-400 font-medium">No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}