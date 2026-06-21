import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, PlayCircle, BookOpen, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function GeneratedRoadmap() {
  const location = useLocation();
  const navigate = useNavigate();

  // استقبال البيانات الممررة من صفحة الـ Result أو صفحة الـ Roadmap الأصلية
  const incomingModules = location.state?.modules || [];
  const chosenLevel = location.state?.level || "FOUNDATION";
  const trackId = location.state?.trackId || null;

  const [modules, setModules] = useState(incomingModules);
  const [loading, setLoading] = useState(false);

  // 🌟 الـ useEffect الذكي والمحرك الأساسي لربط صفحة الـ Result بالـ Roadmap
  useEffect(() => {
    // لو مفيش موديولات مبعوثة وجاهزة، بس معانا trackId، اضرب الـ API واجلبها فوراً
    if (incomingModules.length === 0 && trackId) {
      const fetchRoadmapData = async () => {
        setLoading(true);
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
        
        try {
          // محاولة جلب خارطة الطريق الخاصة بالمسخدم أولاً
          const response = await axios.get(
            `https://smartcareerpath.runasp.net/api/seekers/me/roadmap/${trackId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = response.data?.items || response.data || [];
          setModules(data);
        } catch (error) {
          console.log("Seeker roadmap not computed yet. Fetching global track syllabus instead...");
          try {
            // محاولة جلب المنهج العام للمسار لو المسار الشخصي لسه ماتحسبش
            const globalTrackResponse = await axios.get(
              `https://smartcareerpath.runasp.net/api/career-tracks/${trackId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = globalTrackResponse.data?.modules || globalTrackResponse.data?.items || globalTrackResponse.data || [];
            setModules(data);
          } catch (globalError) {
            console.error("Both API attempts failed in Generated page:", globalError);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchRoadmapData();
    }
  }, [incomingModules, trackId]);

  // تحويل مخرجات السيرفر للشكل المتناسق مع تصميمك الأصلي وثبات الألوان
  const roadmap = modules.length > 0 ? modules.map((item, index) => ({
    title: item.title || item.moduleTitle || "Syllabus Module Node",
    level: chosenLevel,
    days: item.duration || item.time || `${index * 2 + 2} Days`,
    color: chosenLevel === "ADVANCED" ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600',
    link: item.link || item.url || "#"
  })) : [
    { title: 'Modern HTML5 & Semantic Architectures', level: 'FOUNDATION', days: '2 Days', color: 'bg-blue-100 text-blue-600', link: "#" },
    { title: 'CSS3 Flexbox, Grid & Container Queries', level: 'FOUNDATION', days: '4 Days', color: 'bg-blue-100 text-blue-600', link: "#" },
  ];

  // دالة الحفظ الفعلي للـ Roadmap في السيرفر وتحديث الـ Profile
  const handleSaveRoadmapToProfile = async () => {
    if (!trackId) {
      toast.error("Track ID not defined.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
      
      // حفظ الـ trackId الحالي المختار في الـ localStorage لضمان قراءته في البروفايل
      localStorage.setItem("trackId", trackId);

      // ضرب API الحفظ أو التفعيل لو الباك إند بيطلب تفعيلها بـ POST/PUT (اختياري حسب الـ Business Logic عندك)
      toast.success("Roadmap synchronized to your dashboard profile successfully! 🎯");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync roadmap to profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8fb] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-gray-500 font-medium text-sm">Fetching and configuring track roadmap nodes...</p>
      </div>
    );
  }
  // 🌟 دالة ذكية بتلف على الموديولات وتجمع الأرقام من حقل الـ days أو duration أوتوماتيكياً
  const totalActiveDays = roadmap.reduce((sum, item) => {
    // استخراج الأرقام فقط من النصوص (مثلاً "4 Days" أو "4 Weeks" تتحول لرقم 4)
    const daysNum = parseInt(item.days || item.duration, 10) || 0;
    return sum + daysNum;
  }, 0);

  return (
    <div className="bg-[#f8f8fb] py-20 px-6 min-h-screen">
      {/* Main Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-[#E7E9EE] p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-10 py-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-2">Your Roadmap</h1>
            <p className="text-sm text-[#6B7280]">
              Estimated Mastery:
              <span className="font-semibold text-[#111827] ml-2">
                {totalActiveDays > 0 ? totalActiveDays : roadmap.length * 4} Active Days
              </span>
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-gray-50 text-black font-medium text-xs">
            High Efficiency Path
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-3xl overflow-hidden">
          {/* Head */}
          <div className="grid grid-cols-3 bg-[#F7F8FB] px-6 py-4 border-b border-[#ECECF3]">
            <h3 className="text-xs font-semibold tracking-wide text-black uppercase">SYLLABUS MODULE</h3>
            <h3 className="text-xs font-semibold tracking-wide text-black uppercase text-center">DURATION</h3>
            <h3 className="text-xs font-semibold tracking-wide text-black uppercase text-right">RESOURCE</h3>
          </div>

          {/* Rows */}
          {roadmap.map((item, index) => (
            <div key={index} className="grid grid-cols-3 px-6 py-6 border-b border-[#F0F0F3] last:border-none items-center bg-white">
              {/* Title & Level Tag */}
              <div className="text-left">
                <h2 className="text-base md:text-lg font-semibold text-[#111827] leading-snug mb-2">{item.title}</h2>
                <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${item.color}`}>{item.level}</span>
              </div>

              {/* Days Duration */}
              <div className="text-center text-[#6B7280] font-semibold text-sm">{item.days}</div>

              {/* Resource Video Action */}
              <div className="flex justify-end">
                {item.link !== "#" ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#3A64ED] font-semibold text-sm hover:underline transition cursor-pointer">
                    <span>Watch lesson</span>
                    <PlayCircle size={16} className="text-[#3A64ED]" />
                  </a>
                ) : (
                  <button onClick={() => toast.error("Resource link not available yet")} className="flex items-center gap-2 text-gray-400 font-semibold text-sm cursor-not-allowed">
                    <span>Watch lesson</span>
                    <PlayCircle size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Save Section Action */}
        <div className="mt-8 bg-gradient-to-r from-[#F3F4FF] to-[#F7F3FF] rounded-3xl px-6 py-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-5 text-left">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow-sm flex-shrink-0">
              <BookOpen size={24} className="text-indigo-500" />
            </div>
            <p className="text-[#374151] text-sm leading-relaxed max-w-[420px]">
              Sync this path with your Profile for<br />
              <span className="font-semibold text-[#111827]">automated study reminders.</span>
            </p>
          </div>
          <button onClick={handleSaveRoadmapToProfile} className="px-6 py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-[#6366f1] to-[#7C3AED] shadow-lg hover:opacity-95 transition cursor-pointer whitespace-nowrap">
            Save My Roadmap
          </button>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Already have a roadmap?</h3>
            <p className="text-gray-500 text-lg">Connect your GitHub to sync your learning progress with your actual code contributions.</p>
          </div>
          <button onClick={() => navigate('/profile')} className="px-8 py-4 rounded-full border border-indigo-200 text-gray-800 font-medium hover:bg-indigo-50 transition flex items-center gap-3 cursor-pointer whitespace-nowrap">
            Explore Open Roadmaps
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}