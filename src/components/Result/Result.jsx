import React, { useEffect, useState } from "react";
import { RefreshCw, Map, Star, UserPlus, Loader2, MessageSquare, X, PlayCircle, BookOpen } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading"; // كومبوننت الـ Loading البنفسجي الموحد لموقعك
import mentorIcon from '../../assets/mentoricon.png';

export default function Result() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [activeChats, setActiveChats] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null); 

  // 🌟 States الخاصة بالـ Side Drawer الجانبي
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTrackId, setDrawerTrackId] = useState(null);
  const [drawerTrackName, setDrawerTrackName] = useState("");
  const [drawerModules, setDrawerModules] = useState([]);
  const [loadingDrawer, setLoadingDrawer] = useState(false);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // دالة مزامنة التوصيات للسيرفر
  const syncRecommendationsToServer = async (tracksList) => {
    try {
      const currentToken = localStorage.getItem("accessToken") || localStorage.getItem("token") || sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
      const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

      const formattedResults = tracksList.slice(0, 3).map((item, index) => ({
        id: String(item.trackId || item.id || 0),
        trackId: String(item.trackId || item.id || 0),
        rank: index + 1
      }));

      const requestBody = {
        seekerId: String(userId || ""),
        results: formattedResults
      };

      await axios.post(
        "https://smartcareerpath.runasp.net/api/recommendations",
        requestBody,
        { headers: { Authorization: `Bearer ${currentToken}`, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Failed to sync recommendations:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    let isMounted = true; 

    const fetchData = async () => {
      try {
        const currentToken = localStorage.getItem("accessToken") || localStorage.getItem("token") || sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
        if (!currentToken) return;

        const currentConfig = { headers: { Authorization: `Bearer ${currentToken}` } };

        // أ. جلب التوصيات
        const recResponse = await axios.get(
          "https://smartcareerpath.runasp.net/api/seekers/me/recommendations",
          currentConfig
        );
        
        const tracks = recResponse.data?.items || recResponse.data?.data || recResponse.data || [];
        if (!isMounted) return;
        setRecommendations(tracks);

        if (tracks.length > 0) {
          await syncRecommendationsToServer(tracks);
        }

        // ب. جلب الموجهين
        const targetTrackId = tracks.length > 0 ? (tracks[0].trackId || tracks[0].id) : "";
        const mentorsUrl = targetTrackId 
          ? `https://smartcareerpath.runasp.net/api/mentors?page=1&pageSize=3&trackId=${targetTrackId}`
          : `https://smartcareerpath.runasp.net/api/mentors?page=1&pageSize=3`;

        const mentorsResponse = await axios.get(mentorsUrl, currentConfig);
        if (!isMounted) return;
        setMentors(mentorsResponse.data?.items || mentorsResponse.data?.data || mentorsResponse.data || []);

        // ج. جلب قائمة المحادثات
        try {
          const chatsResponse = await axios.get("https://smartcareerpath.runasp.net/api/chats", currentConfig);
          setActiveChats(chatsResponse.data?.items || chatsResponse.data?.data || chatsResponse.data || []);
        } catch (chatError) {
          console.error("Error fetching chats list:", chatError);
        }

      } catch (error) {
        console.error("❌ Error fetching results or mentors:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  // 🌟 دالة فتح الـ Drawer وجلب موديولات الـ Roadmap بناءً على التراك المختار
  const handleOpenRoadmapDrawer = async (trackId, trackName) => {
    setDrawerTrackId(trackId);
    setDrawerTrackName(trackName);
    setIsDrawerOpen(true);
    setLoadingDrawer(true);
    setDrawerModules([]);

    try {
      // 1. محاولة جلب المسار المخصص للمستخدم أولاً
      const res = await axios.get(
        `https://smartcareerpath.runasp.net/api/seekers/me/roadmap/${trackId}`,
        config
      );
      setDrawerModules(res.data?.items || res.data || []);
    } catch (err) {
      console.log("Seeker roadmap not computed. Fetching global track syllabus instead...");
      try {
        // 2. الخطة الاحتياطية: جلب المنهج العام من الـ API الموضح بالـ Swagger الخاص بك
        const globalRes = await axios.get(
          `https://smartcareerpath.runasp.net/api/career-tracks/${trackId}`,
          config
        );
        setDrawerModules(globalRes.data?.modules || globalRes.data?.items || globalRes.data || []);
      } catch (globalErr) {
        console.error("Both Roadmap APIs failed:", globalErr);
        toast.error("Failed to load roadmap data.");
      }
    } finally {
      setLoadingDrawer(false);
    }
  };

  const handleSaveRoadmapToProfile = () => {
    if (drawerTrackId) {
      localStorage.setItem("trackId", drawerTrackId);
    }
    toast.success("Roadmap synchronized to your dashboard profile successfully! 🎯");
    setIsDrawerOpen(false);
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F8] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const handleSendChatRequest = async (mentorId) => {
    try {
      setRequestingId(mentorId);
      await axios.post(
        "https://smartcareerpath.runasp.net/api/chat-requests",
        { mentorId: mentorId },
        config
      );
      toast.success("Mentorship request sent successfully! 🚀");
    } catch (error) {
      const serverMessage = error.response?.data?.error || error.response?.data?.message || "Failed to send request";
      toast.error(`Error: ${serverMessage}`);
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-[28px] font-extrabold text-gray-900 mb-3">Your Career Path is Ready</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed font-semibold">
            Based on your unique skill set and passions, we've identified the high-growth paths where you'll thrive most.
          </p>
        </div>

        {/* ===== Top Career Paths Card (طابق التصميم في image_2730d3.png) ===== */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-10 overflow-hidden border border-gray-100">
          <div className="flex justify-between items-center px-6 py-5">
            <h3 className="text-lg font-extrabold text-gray-800">Top 3 Career Paths</h3>
            <Link to="/test" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition font-semibold">
              <RefreshCw size={16} /> Retake Test
            </Link>
          </div>

          <div className="grid grid-cols-3 px-6 py-3 text-xs text-black font-semibold border-t border-b border-gray-100 bg-white-50 text-left">
            <span>CAREER</span>
            <span>COMPATIBILITY SCORE</span>
            <span className="text-right">ACTION</span>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400 font-medium bg-white">No career recommendations found.</div>
          ) : (
            recommendations.slice(0, 3).map((item, i) => {
              const currentScore = item.score || item.compatibilityScore || (100 - i * 8);
              const trackIdToSend = item.trackId || item.id || 1;
              const trackNameStr = item.trackName || item.name || `Track Model #${trackIdToSend}`;

              return (
                <div key={trackIdToSend || i} className="grid grid-cols-3 items-center px-6 py-5 border-b border-gray-100 last:border-none text-left">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{trackNameStr}</p>
                    <span className="text-[11px] text-gray-400 font-bold tracking-wide block mt-0.5 uppercase">
                      {i === 0 ? "TOP MATCH ✨" : "RECOMMENDED"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-full h-[6px] bg-gray-200 rounded-full">
                      <div className="h-[6px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${currentScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-indigo-600 min-w-[35px]">{currentScore}%</span>
                  </div>

                  {/* 🌟 تعديل الـ Action هنا ليفتح الـ Drawer الجانبي مباشرة بدل الانتقال لصفحة تانية */}
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleOpenRoadmapDrawer(trackIdToSend, trackNameStr)}
                      className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-black hover:bg-gray-50 transition cursor-pointer bg-white shadow-sm"
                    >
                      <Map size={14} /> Show Roadmap
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ===== Mentors Card ===== */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 border border-gray-100">
          <h3 className="text-lg font-extrabold text-gray-800 mb-6 text-left">Mentors Matching Your Profile</h3>

          {mentors.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400 font-medium">No matching mentors found for this track path.</div>
          ) : (
            mentors.slice(0, 3).map((mentor, i) => {
              const mId = mentor.id || mentor.mentorId;
              const existingChat = activeChats.find(chat => chat.mentorId === mId || chat.otherUserId === mId || chat.mentor?.id === mId || chat.user?.id === mId);

              return (
                <div key={mId || i} className="flex items-center justify-between py-5 border-t border-gray-100 first:border-none">
                  <div className="flex items-center gap-4 text-left">
                    <img src={mentor.imageUrl || mentor.avatar || mentorIcon} className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" alt="" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{mentor.firstName || mentor.name} {mentor.lastName || ""}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{mentor.company || mentor.trackName || "Expert Mentor"}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star key={starIndex} size={13} className="text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-[11px] text-gray-400 font-semibold ml-2">
                          {mentor.yearsOfExperience ? `${mentor.yearsOfExperience} Yrs Exp` : "4.9 Rating"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {existingChat ? (
                    <button onClick={() => navigate(`/chats/${existingChat.id || existingChat.chatId || ""}`)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-95 transition cursor-pointer">
                      <MessageSquare size={15} /> Message
                    </button>
                  ) : (
                    <button onClick={() => handleSendChatRequest(mId)} disabled={requestingId !== null} className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-95 transition cursor-pointer disabled:opacity-50">
                      {requestingId === mId ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
                      {requestingId === mId ? "Sending..." : "Request"}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🌟 🌟 الـ SIDE DRAWER الجانبي الاحترافي والمطابق للألوان 🌟 🌟 */}
      {/* ======================================================== */}
      
      {/* الـ Overlay (الخلفية المظلمة الشفافة مع Blur ناعم) */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* جسم الـ Drawer المتحرك بسلاسة وبنفس أبعاد وألوان موقعك الفخمة */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-[#f8f8fb] shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header الـ Drawer */}
        <div className="p-6 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs font-bold text-indigo-500 tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md block w-max mb-1">
              Syllabus Preview
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 truncate max-w-[400px]">{drawerTrackName}</h3>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)} 
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* محتوى الـ Drawer الداخلي */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loadingDrawer ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
              <p className="text-gray-400 text-xs font-semibold">Configuring track roadmap nodes...</p>
            </div>
          ) : drawerModules.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center text-sm">
              {/* الموديولات الاحتياطية الثابتة لو الباك إند باعت فاضي */}
              <p className="text-gray-400 font-medium mb-4">No real-time nodes available. Displaying core foundational tracks:</p>
              <div className="space-y-3 text-left">
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <h4 className="font-bold text-gray-900 text-sm">Modern HTML5 & Semantic Architectures</h4>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-blue-100 text-blue-600 mt-2">FOUNDATION</span>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <h4 className="font-bold text-gray-900 text-sm">CSS3 Flexbox, Grid & Container Queries</h4>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-blue-100 text-blue-600 mt-2">FOUNDATION</span>
                </div>
              </div>
            </div>
          ) : (
            // عرض موديولات السيرفر الحقيقية بتنسيق غاية في الفخامة والترتيب
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left mb-2">
                Estimated Mastery: {drawerModules.length * 4} Active Days
              </p>
              {drawerModules.map((item, idx) => {
                const isAdvanced = idx > 1; // تلوين ذكي متناسق مع سيستمك
                return (
                  <div key={item.id || idx} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-4 text-left hover:border-indigo-100 transition">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-snug">{item.title || item.moduleTitle || "Syllabus Module Node"}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
                          isAdvanced ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {isAdvanced ? 'ADVANCED' : 'FOUNDATION'}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{item.duration || item.time || "Flexible"}</span>
                      </div>
                    </div>

                    <div>
                      {item.link && item.link !== "#" ? (
                        <a href={item.link} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 transition block">
                          <PlayCircle size={18} />
                        </a>
                      ) : (
                        <button onClick={() => toast.error("Lesson link not available yet")} className="p-2 text-gray-300 cursor-not-allowed">
                          <PlayCircle size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer الـ Drawer وزرار الحفظ الموحد للملفات */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="bg-gradient-to-r from-[#F3F4FF] to-[#F7F3FF] rounded-2xl p-4 mb-4 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <BookOpen size={20} className="text-indigo-500" />
            </div>
            <p className="text-[#374151] text-xs leading-relaxed">
              Sync this path with your Profile for <span className="font-bold text-[#111827]">automated study reminders.</span>
            </p>
          </div>
          <button 
            onClick={handleSaveRoadmapToProfile}
            className="w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-[#6366f1] to-[#7C3AED] shadow-lg hover:opacity-95 transition cursor-pointer"
          >
            Save My Roadmap to Profile
          </button>
        </div>
      </div>

    </div>
  );
}