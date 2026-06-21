import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { ArrowRight, Compass, Clock3, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FadeLoader } from 'react-spinners'; // 🌟 استيراد الـ FadeLoader البنفسجي الصغير للتحميل الجزئي

const override = {
  display: "block",
  margin: "0 auto",
};

export default function Roadmap() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]); 
  const [selectedTrack, setSelectedTrack] = useState(""); 
  const [selectedLevel, setSelectedLevel] = useState("FOUNDATION"); 
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

        const response = await axios.get(
          "https://smartcareerpath.runasp.net/api/career-tracks",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setTracks(response.data || []);
        if (response.data && response.data.length > 0) {
          const firstTrackId = response.data[0].id;
          setSelectedTrack(firstTrackId); 
          
          if (!localStorage.getItem("trackId")) {
            localStorage.setItem("trackId", firstTrackId);
          }
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        toast.error("Failed to load career tracks. Please try again.");
      } finally { // 🌟 مكتوبة صح بالملي من غير أخطاء
        setLoadingTracks(false);
      }
    };
    fetchTracks();
  }, []);

  const handleGenerateRoadmap = async () => {
    if (!selectedTrack) {
      toast.error("Please select a track first");
      return;
    }

    setGenerating(true);
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    let roadmapData = [];

    try {
      const response = await axios.get(
        `https://smartcareerpath.runasp.net/api/seekers/me/roadmap/${selectedTrack}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      roadmapData = response.data?.items || response.data || [];
      
    } catch (error) {
      console.log("Seeker roadmap not computed yet. Fetching global track syllabus instead...");
      
      try {
        const globalTrackResponse = await axios.get(
          `https://smartcareerpath.runasp.net/api/career-tracks/${selectedTrack}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        roadmapData = globalTrackResponse.data?.modules || globalTrackResponse.data?.items || globalTrackResponse.data || [];
        console.log("Global track syllabus data:", roadmapData);
      } catch (globalError) {
        console.error("Both API attempts failed:", globalError);
      }
    } finally { // 🌟 متصححة وجاهزة للـ Build فوراً
      setGenerating(false);

      navigate("/generated-roadmap", {
        state: { 
          modules: roadmapData, 
          level: selectedLevel,
          trackId: selectedTrack
        },
      });
    }
  };

  return (
    <div className="bg-[#f8f8fb] min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-28 border-b border-gray-200">
        <div className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-6">
          ✨ AI-Powered Career Architect
        </div>

        <h1 className="text-6xl font-bold text-gray-900 leading-tight">
          Build Your Personalized<br />
          <span className="text-indigo-500">Learning Roadmap</span>
        </h1>

        <p className="text-gray-500 text-xl mt-8 max-w-3xl leading-relaxed">
          Stop guessing what to learn. Our AI generates the most efficient, step-by-step educational path tailored to your specific career goals and time commitment.
        </p>

        <div className="flex items-center gap-6 mt-12">
          <button onClick={() => navigate('/test')} className="px-10 py-4 rounded-2xl text-white font-extrabold bg-[#6366f1] shadow-lg hover:opacity-90 transition flex items-center gap-4 mx-6 cursor-pointer">
            Start Assessment
            <ArrowRight size={18} />
          </button>

          <button className="font-semibold text-gray-800 hover:text-indigo-500 transition cursor-pointer flex items-center gap-3">
            <FontAwesomeIcon icon={faPlay} className="text-[#3A64ED] p-4" />
            Watch Demo
          </button>
        </div>
      </section>

      {/* Specialization Section */}
      <section className="py-24 border-b border-gray-200 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
            <Compass size={24} className="text-indigo-500" />
          </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-4">Specialization Architect</h2>
          <p className="text-gray-500 text-lg mb-14">Choose your specialization to generate your personalized roadmap.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Track Select */}
            <div className="text-left">
              <label className="text-sm text-gray-500 mb-2 block">Track Selection</label>
              <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-1 h-[62px]">
                <Compass size={18} className="text-indigo-500 mr-2 flex-shrink-0" />
                
                {/* 🌟 حقن لودر مسار الناعم المصغر هنا بالملي بدل النص القديم الممل */}
                {loadingTracks ? (
                  <div className="flex items-center justify-center w-full pl-8 scale-50">
                    <FadeLoader color={'#6366F1'} cssOverride={override} />
                  </div>
                ) : (
                  <select 
                    value={selectedTrack} 
                    onChange={(e) => {
                      const trackId = e.target.value;
                      setSelectedTrack(trackId);
                      localStorage.setItem("trackId", trackId);
                    }}
                    className="w-full bg-transparent py-4 text-gray-700 outline-none cursor-pointer appearance-none pr-8 text-sm font-semibold"
                  >
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>{t.name || t.trackName || "Unnamed Track"}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Level Select */}
            <div className="text-left">
              <label className="text-sm text-gray-500 mb-2 block">Level</label>
              <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-1 h-[62px]">
                <Clock3 size={18} className="text-indigo-500 mr-2 flex-shrink-0" />
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-transparent py-4 text-gray-700 outline-none cursor-pointer appearance-none pr-8 text-sm font-semibold"
                >
                  <option value="FOUNDATION">Foundation</option>
                  <option value="MID-LEVEL">Mid-Level</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button 
            onClick={handleGenerateRoadmap} 
            disabled={generating || loadingTracks}
            className="w-full py-5 rounded-2xl text-white font-semibold text-lg bg-[#6366f1] shadow-lg hover:opacity-90 transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating Path...
              </>
            ) : (
              <>
                Generate Roadmap
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Already have a roadmap?</h3>
            <p className="text-gray-500 text-lg">Connect your GitHub to sync your learning progress with your actual code contributions.</p>
          </div>
          <button 
            onClick={() => navigate('/results')} 
            className="px-8 py-4 rounded-full border border-indigo-200 text-gray-800 font-medium hover:bg-indigo-50 transition flex items-center gap-3 cursor-pointer whitespace-nowrap"
          >
            Explore Open Roadmaps
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}