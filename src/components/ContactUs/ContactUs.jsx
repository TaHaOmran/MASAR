import React, { useState } from "react";
import { Send } from 'lucide-react';
import { FadeLoader } from "react-spinners"; // 🌟 استيراد اللودر البنفسجي الموحد لو حبيت تربطه بـ API لاحقاً

const override = {
  display: "inline-block",
  margin: "0 auto",
  transform: "scale(0.35)",
  height: "10px",
  width: "10px"
};

export default function ContactUs() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // اللوجيك الخاص بك هنا عند الربط بالـ API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] px-4 py-12 animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
        
        {/* Top Badge */}
        <div className="flex justify-center mb-4">
          <span className="text-xs bg-indigo-50/80 text-[#6366F1] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider">
            Contact Support
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 tracking-tight">
          HAVE SOME QUESTIONS?
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-8 text-sm font-semibold">
          Drop us a line and we'll help you get started with the platform.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Full Name */}
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm font-semibold outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Email */}
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="alex@company.com"
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm font-semibold outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Problem Type */}
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
              Problem Type
            </label>
            <div className="relative">
              <select className="w-full h-12 appearance-none rounded-xl border border-gray-200 px-4 text-sm font-semibold outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 transition-all bg-gray-50/50 focus:bg-white cursor-pointer pr-10">
                <option>Technical Issue</option>
                <option>Billing Issue</option>
                <option>General Inquiry</option>
              </select>
              <span className="absolute right-4 top-3.5 text-gray-400 pointer-events-none text-xs">
                ▼
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
              Your Message
            </label>
            <textarea
              rows="4"
              placeholder="Describe your issue or question in detail..."
              className="w-full p-4 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/20 transition-all bg-gray-50/50 focus:bg-white resize-none leading-relaxed"
            ></textarea>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 text-xs text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 font-medium leading-relaxed text-left">
            <span className="text-[#6366F1] shrink-0 font-bold">ℹ️</span>
            <p>
              By sending this message, you agree to our privacy policy regarding
              the processing of your contact data.
            </p>
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-16 h-12 rounded-xl text-white font-bold text-base bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 overflow-hidden"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center -mt-3.5">
                  <FadeLoader color={'#ffffff'} cssOverride={override} />
                </div>
              ) : (
                <>
                  Send Message <Send size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}