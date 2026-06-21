import React, { useEffect, useState } from "react";
import Logo from '../../assets/logo.png';
import Iconuser from '../../assets/usericon.png';
import mentorIcon from '../../assets/mentoricon.png';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import toast from "react-hot-toast";
import { Bell } from "lucide-react";
import Notification from "../Notification/Notification"; 
import axios from "axios"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0); 
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // 🌟 التحديث السحري: لقط التوكن من الذاكرة الدائمة أو المؤقتة فوراً لضمان مزامنة حالة الـ Remember Me
  const token = localStorage.getItem("accessToken") || 
                localStorage.getItem("token") || 
                sessionStorage.getItem("accessToken") || 
                sessionStorage.getItem("token");

  // 1️⃣ جلب عداد الإشعارات غير المقروءة باستخدام التوكن المتاح
  const loadUnreadCount = async () => {
    try {
      if (!token) return;
      const res = await fetch("https://smartcareerpath.runasp.net/api/notifications/unread-count", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBadgeCount(data.count || 0); 
      }
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  useEffect(() => {
    loadUnreadCount();
  }, [location.pathname, token]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) return;

        const seekerRes = await axios.get(
          "https://smartcareerpath.runasp.net/api/seekers/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser({ ...seekerRes.data, role: "Seeker" });
      } catch (seekerError) {
        try {
          const mentorRes = await axios.get(
            "https://smartcareerpath.runasp.net/api/mentors/me",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setUser({ ...mentorRes.data, role: "Mentor" });
        } catch (mentorError) {
          setUser(null);
        }
      }
    };

    loadUser();
  }, [token]);

  // 2️⃣ دالة تسجيل الخروج الاحترافية وتصفير كافّة مخازن المتصفح أمنياً
  const handleLogout = () => {
    
    // سحب التوكنز والريفرش الحاليين قبل تدمير الكاش
    const currentToken = localStorage.getItem("accessToken") || 
                         localStorage.getItem("token") || 
                         sessionStorage.getItem("accessToken") || 
                         sessionStorage.getItem("token");
                         
    const storedRefreshToken = localStorage.getItem("refreshToken");

    // 🌟 تنظيف دائم شامل للـ Local والـ Session لعدم ترك أي أثر للتوكنز
    localStorage.clear(); 
    sessionStorage.clear();

    toast.success("Logged out successfully");
    navigate("/login"); 

    // إعلام السيرفر في الخلفية لإلغاء صلاحية التوكنز تماماً
    if (currentToken) {
      axios.post("https://smartcareerpath.runasp.net/api/auth/logout", {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      }).catch(() => console.log("Background logout notice skipped"));

      if (storedRefreshToken) {
        axios.post("https://smartcareerpath.runasp.net/net/api/auth/revoke-token", 
          { refreshToken: storedRefreshToken },
          { headers: { Authorization: `Bearer ${currentToken}` } }
        ).catch(() => console.log("Background revoke token skipped"));
      }
    }
  };

  return (
    <nav className="w-full bg-white py-4 sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LOGO AREA */}
        <div className="flex items-center gap-2 h-12">
          <Link to={token ? "/home" : "/login"}>
            <img
              src={Logo}
              alt="Masar"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* DESKTOP NAV LINKS */}
        {token && (
          <div className="hidden md:flex items-center gap-8 text-[15px] text-gray-500 font-semibold">
            <NavLink 
              to="/test" 
              className={({ isActive }) => `relative group py-1.5 ${isActive ? "text-[#6366F1]" : "hover:text-[#6366F1] transition"}`}
            >
              <span>Test</span>
              <span className="absolute left-0 bottom-0 h-[2px] bg-[#6366F1] transition-all duration-300 group-hover:w-full w-0 nav-active-line rounded-full"></span>
            </NavLink>

            <NavLink 
              to="/results" 
              className={({ isActive }) => `relative group py-1.5 ${isActive ? "text-[#6366F1]" : "hover:text-[#6366F1] transition"}`}
            >
              <span>Results</span>
              <span className="absolute left-0 bottom-0 h-[2px] bg-[#6366F1] transition-all duration-300 group-hover:w-full w-0 nav-active-line rounded-full"></span>
            </NavLink>

            <NavLink 
              to="/roadmap" 
              end 
              className={({ isActive }) => {
                const role = (localStorage.getItem("role") || sessionStorage.getItem("role"))?.toLowerCase();
                if (role === "admin") return "relative group text-gray-500 py-1.5"; 
                return `relative group py-1.5 ${isActive ? "text-[#6366F1]" : "hover:text-[#6366F1] transition"}`;
              }}
            >
              <span>Roadmaps</span>
              <span className="absolute left-0 bottom-0 h-[2px] bg-[#6366F1] transition-all duration-300 group-hover:w-full w-0 nav-active-line rounded-full"></span>
            </NavLink>

            <NavLink 
              to="/chats" 
              className={({ isActive }) => `relative group py-1.5 ${isActive ? "text-[#6366F1]" : "hover:text-[#6366F1] transition"}`}
            >
              <span>Chats</span>
              <span className="absolute left-0 bottom-0 h-[2px] bg-[#6366F1] transition-all duration-300 group-hover:w-full w-0 nav-active-line rounded-full"></span>
            </NavLink>
          </div>
        )}

        {/* DESKTOP ACTIONS */}
        {!token ? (
          <Link to="/login" className="hidden md:block">
            <button className="px-6 h-[42px] rounded-xl text-white font-bold bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
              Get Started
            </button>
          </Link>
        ) : (
          <div className="hidden md:flex items-center gap-6">
            
            {/* 🔔 زر الجرس المطور بالعداد الحقيقي لسطح المكتب */}
            <div className="relative inline-block">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-400 hover:text-[#6366F1] transition cursor-pointer flex items-center p-1.5 rounded-lg hover:bg-gray-50"
              >
                <Bell size={20} />
                {badgeCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 border border-white">
                    {badgeCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-12 right-0 z-50 animate-fadeIn">
                  <Notification 
                    onClose={() => setShowNotifications(false)} 
                    setBadgeCount={setBadgeCount}
                    refreshCount={loadUnreadCount}
                  />
                </div>
              )}
            </div>

            <Link to="/profile" className="flex items-center">
              <img
                src={user?.role === "Mentor" 
                                ? mentorIcon // لو المستخدم هو Mentor، نستخدم أيقونة المينتور
                                : Iconuser   // لو المستخدم هو Mentee أو أي دور تاني، نستخدم أيقونة المستخدم العادية
                              }
                alt="profile"
                className="w-[38px] h-[38px] rounded-full object-cover border-2 border-transparent hover:border-[#6366F1] transition shadow-sm"
              />
            </Link>
          </div>
        )}

        {/* HAMBURGER TRIGGER BUTTON */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-800 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* RESPONSIVE PANEL (وضع الموبايل والتابلت) */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px] mt-2" : "max-h-0"}`}>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-4 space-y-4 mx-4 relative text-left">
          {token ? (
            <>
              <NavLink to="/test" onClick={() => setIsOpen(false)} className={({ isActive }) => `block font-semibold transition ${isActive ? "text-[#6366F1]" : "text-gray-500"}`}>Test</NavLink>
              <NavLink to="/results" onClick={() => setIsOpen(false)} className={({ isActive }) => `block font-semibold transition ${isActive ? "text-[#6366F1]" : "text-gray-500"}`}>Results</NavLink>
              <NavLink to="/roadmap" onClick={() => setIsOpen(false)} className={({ isActive }) => `block font-semibold transition ${isActive ? "text-[#6366F1]" : "text-gray-500"}`}>Roadmaps</NavLink>
              <NavLink to="/chats" onClick={() => setIsOpen(false)} className={({ isActive }) => `block font-semibold transition ${isActive ? "text-[#6366F1]" : "text-gray-500"}`}>Chats</NavLink>

              {/* 🔔 الجرس المدمج لوضع التابلت والموبايل */}
              <div className="border-t border-gray-100 pt-3">
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center justify-between text-gray-500 font-semibold transition cursor-pointer w-full text-left"
                  >
                    <span>Notifications</span>
                    {badgeCount > 0 && (
                      <span className="min-w-[20px] h-5 bg-red-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center px-1.5">
                        {badgeCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="w-full mt-3 z-50 relative animate-fadeIn">
                      <Notification 
                        onClose={() => { setShowNotifications(false); setIsOpen(false); }} 
                        setBadgeCount={setBadgeCount}
                        refreshCount={loadUnreadCount}
                      />
                    </div>
                  )}
                </div>
              </div>

              <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center border-t border-gray-100 pt-3">
                <div className="flex-1">
                  <p className="block text-gray-500 hover:text-[#6366F1] font-semibold transition">View Profile</p>
                </div>
              </Link>
              
              <button onClick={handleLogout} className="w-full text-left block text-red-500 font-bold pt-2 text-sm cursor-pointer">
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] text-white py-3 rounded-xl font-bold shadow-md">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}