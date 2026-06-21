import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { FadeLoader } from "react-spinners"; // 🌟 استيراد اللودر البنفسجي الموحد لموقعك

// استايل مخصص لتوسيط وتقزيم الـ FadeLoader جوه الزرار بالملي
const override = {
  display: "inline-block",
  margin: "0 auto",
  transform: "scale(0.35)",
  height: "10px",
  width: "10px"
};

export default function QuestionModal({ mode = "add", question = null, onClose = () => {} }) {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");
  
  const [options, setOptions] = useState(["", "", "", ""]); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && question) {
      setQuestionText(question.questionText || question.title || "");
      setQuestionType(question.questionType || "MCQ");
      
      if (question.options && question.options.length > 0) {
        setOptions(question.options);
      } else {
        setOptions([]);
      }
    } else {
      setQuestionText("");
      setQuestionType("MCQ");
      setOptions(["", "", "", ""]);
    }
  }, [mode, question]);

  // إضافة حقل خيار جديد
  const handleAddOptionField = async () => {
    if (options.length >= 6) {
      toast.error("Maximum of 6 options allowed");
      return;
    }

    if (mode === "edit" && question) {
      const text = prompt("Enter the new choice text:");
      if (!text || !text.trim()) return;

      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
        
        const body = { optionText: text.trim() };
        
        await axios.post(`https://smartcareerpath.runasp.net/api/admin/questions/${question.id}/options`, body, { headers });
        toast.success("Option added successfully 🎉");

        const refreshRes = await axios.get(`https://smartcareerpath.runasp.net/api/admin/questions/${question.id}`, { headers });
        const updatedQuestion = refreshRes.data?.data || refreshRes.data;
        
        if (updatedQuestion && updatedQuestion.options) {
          setOptions(updatedQuestion.options);
        }

      } catch (error) {
        console.error("Add Option Error:", error);
        toast.error("Failed to add the new option to the server");
      }
    } else {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  // حذف خيار محدد
  const handleDeleteOption = async (index, optionId) => {
    if (mode === "edit" && optionId) {
      if (options.length <= 2) {
        toast.error("Cannot delete option, question must have at least 2 options");
        return;
      }
      
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        await axios.delete(`https://smartcareerpath.runasp.net/api/admin/questions/options/${optionId}`, { headers });
        toast.success("Option deleted from server successfully 🗑️");
        setOptions(options.filter((_, i) => i !== index));
      } catch (error) {
        toast.error("Failed to delete the option from the server");
      }
    } else {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // حفظ وحفظ تعديل السؤال بالكامل
  const handleSaveQuestion = async (e) => {
    if (e) e.preventDefault();

    if (!questionText.trim()) {
      toast.error("Please enter the question text");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

      if (mode === "add") {
        const cleanedOptions = options.filter(opt => typeof opt === 'string' && opt.trim() !== "");
        if (cleanedOptions.length < 2) {
          toast.error("At least 2 options are required for the question");
          setIsSaving(false);
          return;
        }

        const body = {
          questionText: questionText.trim(),
          questionType: "MCQ", 
          options: cleanedOptions
        };

        await axios.post("https://smartcareerpath.runasp.net/api/admin/questions", body, { headers });
        toast.success("Question saved successfully 🎉");
      } else {
        const body = {
          id: Number(question.id),
          questionText: questionText.trim(),
          questionType: "MCQ"
        };

        await axios.put(`https://smartcareerpath.runasp.net/api/admin/questions/${question.id}`, body, { headers });
        toast.success("Question text updated successfully 🎉");
      }

      onClose(); 
    } catch (error) {
      toast.error("Failed to save the question to the server");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50 animate-fadeIn">
      {/* 🌟 تم تنعيم حواف المودال الكبيرة لتكون rounded-2xl متناسقة مع الداشبورد */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

        <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-gray-100">
          <h2 className="font-bold text-xl text-gray-900">
            {mode === "add" ? "Add Assessment Question" : "Edit Assessment Question"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 cursor-pointer text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-50">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6">
          <label className="block text-sm font-semibold text-gray-600 mb-2 text-left">Question Title</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="What process do plants use to convert sunlight into energy?"
            className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm mb-6 outline-none focus:border-[#6366F1] transition"
          />

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-600">Answer Choices</span>
            <div onClick={handleAddOptionField} className="border-gray-200 border rounded-xl h-9 flex items-center px-4 text-sm cursor-pointer hover:bg-indigo-50/50 hover:border-[#6366F1] transition">
              <button className="text-[#6366F1] text-xs font-bold flex items-center gap-2 cursor-pointer bg-transparent border-none outline-none">
                <Plus size={12} /> Add Choice
              </button>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1 json-scrollbar">
            {options.map((choice, index) => {
              const isObject = typeof choice === 'object' && choice !== null;
              const optionTextValue = isObject ? choice.optionText : choice;
              const optionId = isObject ? choice.id : null;

              return (
                <div key={index} className="border border-gray-200 rounded-xl h-12 flex items-center justify-between px-4 bg-white hover:border-gray-300 transition">
                  <div className="flex items-center flex-1 min-w-0">
                    <input
                      type="radio"
                      name="correctAnswer"
                      className="mr-4 accent-[#6366F1] w-4 h-4 cursor-pointer"
                    />
                    {mode === "add" ? (
                      <input
                        type="text"
                        value={optionTextValue}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Choice #${index + 1}`}
                        className="text-sm text-gray-700 bg-transparent border-none outline-none w-full font-medium"
                      />
                    ) : (
                      <span className="text-sm text-gray-700 font-medium truncate text-left">{optionTextValue}</span>
                    )}
                  </div>

                  <button 
                    onClick={() => handleDeleteOption(index, optionId)} 
                    className="text-gray-400 hover:text-red-500 p-1.5 cursor-pointer transition rounded-lg hover:bg-gray-50 shrink-0"
                    title="Delete Option"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-5 flex justify-end gap-3 bg-[#FAFAFB]">
          <button onClick={onClose} className="px-5 h-11 text-sm font-semibold rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
            Cancel
          </button>
          
          {/* 🌟 حقن الـ FadeLoader المصغر السحري جوه زرار الحفظ بشكل احترافي ومتناسق */}
          <button 
            onClick={handleSaveQuestion} 
            disabled={isSaving} 
            className="px-6 h-11 text-sm font-semibold rounded-xl bg-[#6366F1] text-white cursor-pointer hover:opacity-95 shadow-md transition overflow-hidden min-w-[130px]"
          >
            {isSaving ? (
              <div className="h-full flex items-center justify-center -mt-3.5">
                <FadeLoader color={'#ffffff'} cssOverride={override} />
              </div>
            ) : mode === "add" ? (
              "Save Question"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}