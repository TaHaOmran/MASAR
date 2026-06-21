import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Map, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { FadeLoader } from "react-spinners"; // 🌟 استيراد اللودر البنفسجي الموحد لأزرار الإرسال
import Loading from "../Loading/Loading"; // 🌟 استيراد كومبوننت اللودينج الموحد الأساسي لموقعك

// استايل مخصص لتوسيط وتقزيم الـ FadeLoader جوه زرار الإنهاء بالملي
const override = {
  display: "inline-block",
  margin: "0 auto",
  transform: "scale(0.35)",
  height: "10px",
  width: "10px"
};

export default function Test() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // الـ State الخاصة بنظام الـ Toast 
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        console.log("TOKEN:", token);

        const response = await fetch(
          "https://smartcareerpath.runasp.net/api/questions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("STATUS:", response.status);
        const data = await response.json();
        console.log("DATA:", data);

        setQuestions(data);
        setAnswers(Array(data.length).fill(""));
      } catch (error) {
        console.error("Error fetching questions:", error);
        showToast("Failed to fetch questions", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmitAnswers = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      const mcqAnswers = [];
      const openTextAnswers = [];

      questions.forEach((question, index) => {
        const userAnswer = answers[index];

        if (question.questionType === "OpenText") {
          openTextAnswers.push({
            questionId: question.id,
            answerText: userAnswer ? String(userAnswer).trim() : ""
          });
        } else {
          const selectedOption = question.options[userAnswer];
          mcqAnswers.push({
            questionId: question.id,
            optionId: selectedOption ? selectedOption.id : 0
          });
        }
      });

      const requestBody = { mcqAnswers, openTextAnswers };
      console.log("SENDING BODY:", requestBody);

      const response = await fetch("https://smartcareerpath.runasp.net/api/questions/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        console.log("SUBMIT SUCCESS");
        showToast("Answers submitted successfully! 🎉", "success");
        setSubmitted(true);
      } else {
        const errData = await response.text();
        console.error("Submit failed:", response.status, errData);
        showToast("An error occurred while saving the answers. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      showToast("There was a problem connecting to the server. Please check your network connection.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // 🌟 حقن لودر مسار الموحد الجديد هنا ليعطي انطباع احترافي قبل فرش الأسئلة
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f8] flex flex-col items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f8] flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-400">No questions available at the moment.</p>
      </div>
    );
  }

  const currentQuestion = questions[current];
  const isCurrentQuestionAnswered = 
    answers[current] !== null && 
    answers[current] !== undefined && 
    String(answers[current]).trim() !== "";

  return (
    <div className="min-h-screen bg-[#f5f5f8] flex items-center justify-center px-4 py-10 relative animate-fadeIn">
      
      {/* 🔔 نظام الـ Toast العائم */}
      {toast.show && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl transition-all duration-300 border animate-bounce ${
          toast.type === "success" 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-red-600" />}
          <span className="text-sm font-semibold" dir="rtl">{toast.message}</span>
          <button onClick={() => setToast((prev) => ({ ...prev, show: false }))} className="p-0.5 rounded-lg hover:bg-black/5 transition">
            <X size={14} className={toast.type === "success" ? "text-green-600" : "text-red-600"} />
          </button>
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-gray-50 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold tracking-widest text-[#6366F1]">ASSESSMENT</span>
            <span className="text-sm text-gray-400 font-semibold">Question {current + 1} of {questions.length}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-[#6366F1] rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {!submitted ? (
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-snug">{currentQuestion.questionText}</h2>
              {currentQuestion.hint && <p className="text-gray-400 text-sm font-semibold mb-6">{currentQuestion.hint}</p>}

              {currentQuestion.questionType === "OpenText" ? (
                <div className="mt-4 relative rounded-xl shadow-sm">
                  <textarea
                    rows={5}
                    dir="rtl"
                    className="w-full p-5 text-base text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none transition-all duration-300 hover:border-gray-300 focus:border-[#6366F1] focus:bg-white focus:ring-4 focus:ring-indigo-50 font-medium"
                    placeholder="Write your answer here in detail, you can talk about your studies or previous experience..."
                    value={answers[current] || ""}
                    onChange={(e) => setAnswers((prev) => {
                      const copy = [...prev];
                      copy[current] = e.target.value;
                      return copy;
                    })}
                  />
                  <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl transition-all duration-300 ${
                    (answers[current] || "").trim() !== "" ? "bg-[#6366F1]" : "bg-transparent"
                  }`} />
                </div>
              ) : (
                <div className="space-y-4">
                  {currentQuestion.options?.map((option, index) => (
                    <label
                      key={option.id || index}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition text-left ${
                        answers[current] === index
                          ? "border-[#6366F1] bg-indigo-50/40 shadow-sm"
                          : "border-gray-200 hover:bg-gray-50/80"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`option-${current}`}
                        checked={answers[current] === index}
                        onChange={() => setAnswers((prev) => {
                          const copy = [...prev];
                          copy[current] = index;
                          return copy;
                        })}
                        className="w-5 h-5 accent-[#6366F1] cursor-pointer"
                      />
                      <span className="text-gray-700 text-sm font-semibold">
                        {option.optionText}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* الواجهة المحسنة بعد الإرسال الناجح */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <CheckCircle2 size={32} className="text-green-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">🎉 Answers submitted successfully!</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 font-semibold leading-relaxed">Your evaluation has been recorded successfully in the system. You can now view your recommended career path.</p>
              
              <div className="flex justify-center items-center gap-4">
                <button 
                  onClick={() => {
                    setAnswers(Array(questions.length).fill(""));
                    setSubmitted(false);
                    setCurrent(0);
                  }} 
                  className="px-5 h-11 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-bold cursor-pointer rounded-xl transition-all"
                >
                  Retake Test
                </button>
                
                <Link
                  to="/results"
                  aria-label="Show your career path"
                  className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] hover:shadow-lg text-white font-bold text-sm transform hover:-translate-y-0.5 transition-all duration-150 shadow-md"
                >
                  <Map size={16} />
                  <span>View Your Career Path</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-8 py-5 bg-gray-50 border-t border-gray-100">
          {!submitted && (
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0 || submitting}
              className={`text-sm flex items-center gap-2 font-bold transition-colors ${current === 0 || submitting ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 cursor-pointer'}`}
            >
              ← Previous
            </button>
          )}

          {!submitted ? (
            <div>
              {current < questions.length - 1 ? (
                <button
                  onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                  disabled={!isCurrentQuestionAnswered}
                  className={`px-6 py-2.5 rounded-xl text-sm cursor-pointer font-bold transition-all ${isCurrentQuestionAnswered ? 'bg-[#6366F1] text-white shadow-md hover:shadow-lg' : 'bg-indigo-200 text-white cursor-not-allowed'}`}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmitAnswers}
                  disabled={!isCurrentQuestionAnswered || submitting}
                  className={`px-6 py-2.5 rounded-xl text-sm cursor-pointer font-bold transition-all inline-flex items-center justify-center gap-2 min-w-[100px] overflow-hidden ${
                    isCurrentQuestionAnswered && !submitting 
                      ? 'bg-[#6366F1] text-white shadow-md hover:shadow-lg' 
                      : 'bg-indigo-200 text-white cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <div className="h-full flex items-center justify-center -mt-3.5">
                      <FadeLoader color={'#ffffff'} cssOverride={override} />
                    </div>
                  ) : (
                    "Finish"
                  )}
                </button>
              )}
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}