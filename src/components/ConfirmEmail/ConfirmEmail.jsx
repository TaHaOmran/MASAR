import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Loading from "../Loading/Loading"; // 🌟 اللودر الموحد بتاعنا

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  // سحب الـ email والـ token من الرابط فوق تلقائياً
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmailAddress = async () => {
      if (!email || !token) {
        setStatus("error");
        setMessage("Invalid verification link. Missing email or token.");
        return;
      }

      try {
        // 🌟 ضرب الـ API المعتمدة بأسلوب الـ Query Parameters (GET) كما يطلبها السيرفر
        await axios.get(
          `https://smartcareerpath.runasp.net/api/auth/confirm-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
        );

        setStatus("success");
        setMessage("Your email has been verified successfully! 🎉");
        
        // تحويل تلقائي لصفحة اللوجن بعد 3 ثوانٍ من النجاح
        setTimeout(() => {
          navigate("/login");
        }, 3500);

      } catch (error) {
        console.error("Verification Error:", error.response?.data);
        const serverMessage = error.response?.data?.message || "The verification link is invalid or has expired.";
        setStatus("error");
        setMessage(serverMessage);
      }
    };

    verifyEmailAddress();
  }, [email, token, navigate]);

  return (
    <div className="min-h-screen bg-[#f5f5f8] flex flex-col items-center justify-center px-4 animate-fadeIn">
      <div className="w-full max-w-[460px] bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-sm text-center">
        
        {/* حالة التحميل وانتظار رد السيرفر */}
        {status === "loading" && (
          <div className="py-6 flex flex-col items-center justify-center">
            <Loading />
            <p className="text-gray-500 text-sm font-semibold mt-4">Verifying your email with the server...</p>
          </div>
        )}

        {/* حالة النجاح والتفعيل الصحيح */}
        {status === "success" && (
          <div className="animate-fadeIn">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-100">
              <CheckCircle2 size={32} className="text-green-600 animate-pulse" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Account Activated!</h1>
            <p className="text-gray-500 text-sm font-semibold mt-3 leading-relaxed">
              {message}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-1">Redirecting you to login page...</p>
            
            <Link to="/login" className="inline-flex items-center gap-2 mt-8 px-6 h-11 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all">
              Go to Login <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* حالة الخطأ أو انتهاء صلاحية اللينك */}
        {status === "error" && (
          <div className="animate-fadeIn">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Activation Failed</h1>
            <p className="text-red-600 text-sm font-semibold mt-3 bg-red-50/50 p-3 rounded-xl border border-red-100/40 leading-relaxed">
              {message}
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login" className="h-11 px-5 rounded-xl text-sm font-bold text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center justify-center cursor-pointer">
                Back to Login
              </Link>
              {/* زرار ذكي يعتمد على الـ API التانية resend-confirmation لو حب يعيد الإرسال */}
              <Link to="/forget-password" className="h-11 px-5 rounded-xl text-sm font-bold text-white bg-[#6366F1] hover:opacity-95 transition-all flex items-center justify-center cursor-pointer shadow-sm">
                Resend Activation
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}