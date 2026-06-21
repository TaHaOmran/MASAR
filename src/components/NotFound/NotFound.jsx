import React from "react";
import { Home, LifeBuoy } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#f5f6f8] flex items-center justify-center px-4 py-20 animate-fadeIn">
      
      {/* Card - تم الحفاظ على الأبعاد وتنعيم الـ Shadow والحواف لـ rounded-2xl */}
      <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-xl px-8 py-16 md:p-12 text-center border border-gray-100">
        
        {/* 404 - بلون مسار المعتمد القياسي */}
        <h1 className="text-7xl font-black text-[#6366F1] mb-4 tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-10 font-semibold max-w-[340px] mx-auto">
          The page you're looking for doesn’t exist or has been
          moved. Don't worry, you can always head back to safe
          ground.
        </p>

        {/* Buttons - تم توحيد الألوان والارتفاعات ومحاذاة النصوص بالملي */}
        <div className="flex flex-col sm:flex-row justify-center gap-3.5 max-w-[340px] mx-auto">
          
          {/* Primary Button */}
          <Link 
            to="/home" 
            className="flex-1 h-11 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={16} />
            Back to Home
          </Link>

          {/* Secondary Button */}
          <Link 
            to="/contact-us" 
            className="flex-1 h-11 rounded-xl text-sm font-bold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LifeBuoy size={16} className="text-gray-400" />
            Get Support
          </Link>
        </div>

      </div>
    </div>
  );
}