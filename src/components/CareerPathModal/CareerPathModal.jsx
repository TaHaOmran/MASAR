import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { FadeLoader } from "react-spinners"; 

const override = {
  display: "inline-block",
  margin: "0 auto",
  transform: "scale(0.35)",
  height: "10px",
  width: "10px"
};

export default function CareerPathModal({ mode = "add", careerPath = null, onClose = () => {} }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && careerPath) {
      setName(careerPath.name || "");
      setDescription(careerPath.description || "");
    }
  }, [mode, careerPath]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for the career path");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description for the career path");
      return;
    }

    setIsSaving(true);
    try {
      // 🌟 التحديث الذكي: قراءة التوكن من الذاكرة الدائمة أو المؤقتة فوراً لمنع التضارب أثناء الحفظ أو التعديل
      const token = localStorage.getItem("accessToken") || 
                    localStorage.getItem("token") || 
                    sessionStorage.getItem("accessToken") || 
                    sessionStorage.getItem("token");

      const headers = { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const body = {
        name: name.trim(),
        description: description.trim()
      };

      if (mode === "add") {
        await axios.post("https://smartcareerpath.runasp.net/api/admin/career-tracks", body, { headers });
        toast.success("Career path added successfully 🎉");
      } else {
        await axios.put(`https://smartcareerpath.runasp.net/api/admin/career-tracks/${careerPath.id}`, body, { headers });
        toast.success("Career path updated successfully 🎉");
      }

      onClose(); 
    } catch (error) {
      console.error("Full Server Error Response:", error.response);
      
      const serverMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null) ||
                            "Failed to save data to the server";
                            
      toast.error(`Sorry, ${serverMessage}`, { duration: 4000 });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "add" ? "Add Career Path" : "Edit Career Path"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 cursor-pointer text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-50">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 text-left">
            <label className="block text-sm font-semibold text-gray-600 mb-2 pl-1">Career Path Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none focus:border-[#6366F1] transition text-sm font-medium"
            />
          </div>

          <div className="mb-2 text-left">
            <label className="block text-sm font-semibold text-gray-600 mb-2 pl-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief overview of this career journey..."
              className="w-full p-4 rounded-xl border border-gray-200 outline-none resize-none focus:border-[#6366F1] transition text-sm font-medium leading-relaxed"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 bg-[#FAFAFB] px-6 py-5 flex justify-end gap-3">
          <button onClick={onClose} disabled={isSaving} className="px-5 h-11 text-sm font-semibold rounded-xl border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 transition">
            Cancel
          </button>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="px-6 h-11 text-sm font-semibold rounded-xl bg-[#6366F1] text-white cursor-pointer hover:opacity-95 shadow-md transition overflow-hidden min-w-[120px]"
          >
            {isSaving ? (
              <div className="h-full flex items-center justify-center -mt-3.5">
                <FadeLoader color={'#ffffff'} cssOverride={override} />
              </div>
            ) : mode === "add" ? (
              "Save Path"
            ) : (
              "Update Path"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}