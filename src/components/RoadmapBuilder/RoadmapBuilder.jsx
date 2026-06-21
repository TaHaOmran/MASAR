import React, { useState, useEffect } from "react";
import { Layers3, Plus, Pencil, Trash2, Map, Link as LinkIcon, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading"; // 🌟 استيراد كومبوننت الـ Loading البنفسجي الموحد المرن

export default function RoadmapBuilder({ selectedCareerPath, onClose, openDeleteModal, selectedRoadmap, setSelectedRoadmap, roadmapItems, setRoadmapItems, isLoadingItems, setIsLoadingItems }) {
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(false);

  const fetchRoadmaps = async () => {
    setIsLoadingRoadmaps(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`https://smartcareerpath.runasp.net/api/admin/career-tracks/${selectedCareerPath.id}/roadmaps`, { headers });
      setRoadmaps(res.data?.data || res.data || []);
    } catch (error) {
      console.log("Using fallback mode for roadmaps.");
    } finally { // 🌟 دبل ll جاهزة ومصححة للـ Build
      setIsLoadingRoadmaps(false);
    }
  };

  useEffect(() => {
    if (selectedCareerPath) {
      fetchRoadmaps();
    }
  }, [selectedCareerPath]);

  const handleMakeRoadmapActive = async (roadmap) => {
    setSelectedRoadmap(roadmap);
    setRoadmapItems([]);
    setIsLoadingItems(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`https://smartcareerpath.runasp.net/api/admin/roadmaps/${roadmap.id}/items`, { headers });
      setRoadmapItems(res.data?.data || res.data || []);
    } catch (error) {
      console.log("Using fallback mode for roadmap items.");
    } finally { // 🌟 دبل ll جاهزة ومصححة للـ Build
      setIsLoadingItems(false);
    }
  };

  const handleAddRoadmap = async () => {
    const title = prompt("Enter Roadmap Phase Title:");
    if (!title || !title.trim()) return;
    const desc = prompt("Enter Roadmap Phase Description:");

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const body = { title: title.trim(), description: desc?.trim() || "" };
      await axios.post(`https://smartcareerpath.runasp.net/api/admin/career-tracks/${selectedCareerPath.id}/roadmaps`, body, { headers });
      toast.success("added successfully 🎉");
      fetchRoadmaps();
    } catch (error) {
      const mockNewPhase = { id: Date.now(), title: title.trim(), description: desc?.trim() || "" };
      setRoadmaps([...roadmaps, mockNewPhase]);
      toast.success("added locally to the screen successfully 🎉");
    }
  };

  const handleEditRoadmap = async (roadmap) => {
    const title = prompt("Edit Phase Title:", roadmap.title);
    if (!title || !title.trim()) return;
    const desc = prompt("Edit Phase Description:", roadmap.description);

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const body = { title: title.trim(), description: desc?.trim() || "" };
      await axios.put(`https://smartcareerpath.runasp.net/api/admin/roadmaps/${roadmap.id}`, body, { headers });
      toast.success("updated successfully ✨");
      fetchRoadmaps();
    } catch (error) {
      setRoadmaps(roadmaps.map(r => r.id === roadmap.id ? { ...r, title: title.trim(), description: desc?.trim() || "" } : r));
      toast.success("updated locally to the screen successfully ✨");
    }
  };

  const handleAddRoadmapItem = async () => {
    if (!selectedRoadmap) {
      toast.error("Please select a phase first to add steps within it");
      return;
    }
    const title = prompt("Enter Step Title:");
    if (!title || !title.trim()) return;
    const desc = prompt("Enter Step Description:");
    const link = prompt("Enter Resource URL / Link (Optional):");
    const order = prompt("Enter Order Index (Number):", "0");

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const body = { title: title.trim(), description: desc?.trim() || "", link: link?.trim() || "", orderIndex: Number(order) || 0 };
      await axios.post(`https://smartcareerpath.runasp.net/api/admin/roadmaps/${selectedRoadmap.id}/items`, body, { headers });
      toast.success("Step added successfully 🚀");
      handleMakeRoadmapActive(selectedRoadmap);
    } catch (error) {
      const mockNewItem = { id: Date.now(), title: title.trim(), description: desc?.trim() || "", link: link?.trim() || "", orderIndex: Number(order) || 0 };
      setRoadmapItems([...roadmapItems, mockNewItem]);
      toast.success("Step added locally to the screen successfully 🚀");
    }
  };

  const handleEditRoadmapItem = async (item) => {
    const title = prompt("Edit Step Title:", item.title);
    if (!title || !title.trim()) return;
    const desc = prompt("Edit Step Description:", item.description);
    const link = prompt("Edit Resource URL / Link:", item.link);
    const order = prompt("Edit Order Index:", item.orderIndex);

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const body = { title: title.trim(), description: desc?.trim() || "", link: link?.trim() || "", orderIndex: Number(order) || 0 };
      await axios.put(`https://smartcareerpath.runasp.net/api/admin/roadmap-items/${item.id}`, body, { headers });
      toast.success("Step updated successfully ✨");
      handleMakeRoadmapActive(selectedRoadmap);
    } catch (error) {
      setRoadmapItems(roadmapItems.map(i => i.id === item.id ? { ...i, title: title.trim(), description: desc?.trim() || "", link: link?.trim() || "", orderIndex: Number(order) || 0 } : i));
      toast.success("Step updated locally to the screen successfully ✨");
    }
  };

  return (
    <div className="mt-6 animate-fadeIn">
      <div className="flex items-center gap-4 mb-3">
        <button onClick={onClose} className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer transition">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Roadmap Builder</h1>
          <p className="text-gray-500 mt-1 text-lg">Configuring curriculum structure for: <span className="text-[#6366F1] font-semibold">{selectedCareerPath.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mt-8">
        {/* Phases column */}
        <div className="col-span-5 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2"><Layers3 size={18} className="text-[#6366F1]" /> 1. Roadmap Phases</h3>
            <button onClick={handleAddRoadmap} className="h-9 px-4 rounded-xl bg-[#6366F1] text-white text-sm font-medium flex items-center gap-1.5 hover:bg-indigo-600 transition cursor-pointer shadow-sm"><Plus size={14} /> Add Phase</button>
          </div>

          {/* 🌟 حقن لودر مسار النظيف الجديد جوه عمود المراحل */}
          {isLoadingRoadmaps ? (
            <div className="flex justify-center py-10">
              <Loading />
            </div>
          ) : roadmaps.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No roadmap phases created yet.</p>
          ) : (
            <div className="space-y-3">
              {roadmaps.map((r) => {
                const isCurrent = selectedRoadmap?.id === r.id;
                return (
                  <div key={r.id} onClick={() => handleMakeRoadmapActive(r)} className={`p-4 rounded-xl border transition cursor-pointer text-left flex justify-between items-start ${isCurrent ? "border-[#6366F1] bg-indigo-50/50 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"}`}>
                    <div className="flex-1 pr-3">
                      <h4 className={`font-semibold ${isCurrent ? "text-[#6366F1]" : "text-gray-800"}`}>{r.title}</h4>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{r.description || "No description provided."}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={(e) => { e.stopPropagation(); handleEditRoadmap(r); }} className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:text-indigo-600 transition border border-transparent hover:border-gray-100"><Pencil size={14} /></button>
                      <button onClick={(e) => { e.stopPropagation(); openDeleteModal("roadmap", r.id, () => { setRoadmaps(roadmaps.filter(p => p.id !== r.id)); if(selectedRoadmap?.id === r.id) setSelectedRoadmap(null); }); }} className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:text-red-500 transition border border-transparent hover:border-gray-100"><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Steps column */}
        <div className="col-span-7 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2"><Map size={18} className="text-[#6366F1]" /> 2. Phase Steps & Lessons</h3>
              {selectedRoadmap && <p className="text-xs text-gray-400 mt-0.5">Inside phase: <span className="font-semibold text-gray-600">{selectedRoadmap.title}</span></p>}
            </div>
            <button onClick={handleAddRoadmapItem} disabled={!selectedRoadmap} className={`h-9 px-4 rounded-xl text-sm font-medium flex items-center gap-1.5 transition shadow-sm ${selectedRoadmap ? "bg-[#6366F1] text-white hover:bg-indigo-600 cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}><Plus size={14} /> Add Step</button>
          </div>

          {!selectedRoadmap ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <Layers3 size={32} className="mb-2 text-gray-300" />
              <p className="text-sm font-medium">Select a roadmap phase from the left panel to manage its content steps.</p>
            </div>
          ) : isLoadingItems ? (
            /* 🌟 حقن لودر مسار النظيف الجديد جوه عمود الخطوات والدروس */
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : roadmapItems.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">This phase is currently empty.</p>
          ) : (
            <div className="space-y-3">
              {roadmapItems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)).map((item, idx) => (
                <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition flex justify-between items-start">
                  <div className="flex items-start gap-3.5 flex-1 text-left">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center font-bold text-xs text-[#6366F1] border border-gray-100 mt-0.5">#{item.orderIndex || idx + 1}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        {item.title}
                        {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#6366F1]"><LinkIcon size={12} /></a>}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-4">
                    <button onClick={() => handleEditRoadmapItem(item)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-indigo-600 transition"><Pencil size={14} /></button>
                    <button onClick={() => openDeleteModal("roadmapItem", item.id, () => { setRoadmapItems(roadmapItems.filter(i => i.id !== item.id)); })} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-red-500 transition"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}