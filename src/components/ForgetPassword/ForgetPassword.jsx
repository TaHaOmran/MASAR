import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import style from './ForgetPassword.module.css'
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FadeLoader } from 'react-spinners' 

const override = {
  display: "inline-block",
  margin: "0 auto",
  transform: "scale(0.35)",
  height: "10px",
  width: "10px"
};

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("") 
  const [loading, setLoading] = useState(false) 

  // 1️⃣ ضرب الـ API المحددة فقط: لطلب كود استعادة كلمة المرور
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      
      // ضرب الـ API المعتمدة الصافية تماماً بالـ Request Body المطلوب
      await axios.post("https://smartcareerpath.runasp.net/api/auth/forgot-password", {
        email: email.trim()
      });
      
      toast.success("Verification code sent to your email! 📩");
      
      // 🌟 التحويل الفوري لصفحة الـ ResetPassword وتمرير الإيميل معها في الـ State
      navigate("/reset-password", { 
        state: { 
          email: email.trim() 
        } 
      });

    } catch (error) {
      console.error("❌ Forgot Password API Error:", error.response?.data);
      const serverMessage = error.response?.data?.message || "Something went wrong. Please check your email.";
      toast.error(`Error: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-[#f5f5f8] flex flex-col items-center px-4 pt-10 mb-15 animate-fadeIn">

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Masar"
            className="w-[180px] mb-10"
          />
        </Link>

        {/* Card */}
        <div className="w-full max-w-[480px] bg-white border border-[#E6E6EB] rounded-[22px] px-8 py-10 shadow-sm">

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-[54px] h-[54px] rounded-xl bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] flex items-center justify-center shadow-sm">
              <ShieldCheck
                size={32}
                className="text-white"
                strokeWidth={2.2}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-[24px] font-semibold text-[#1E1E2D] mb-3">
              Forgot password?
            </h1>

            <p className="text-[14px] leading-6 text-[#5E6278] max-w-[330px] mx-auto font-semibold text-center">
              Enter the email used for your account and we will send you a verification code to reset your password.
            </p>
          </div>

          {/* Input */}
          <div className="mb-6 text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
              Email Address
            </label>

            <div className="h-[52px] border border-[#D8D8E0] rounded-xl flex items-center px-4 bg-white focus-within:border-[#6366F1] focus-within:ring-1 focus-within:ring-[#6366F1]/20 transition-all">
              <Mail
                size={18}
                className="text-gray-400 shrink-0"
                strokeWidth={2}
              />

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full ml-3 outline-none bg-transparent text-sm text-[#2B2B33] font-semibold placeholder-gray-400 text-left"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSendCode}
            disabled={loading}
            className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] text-white font-semibold text-[16px] shadow-[0_8px_20px_rgba(99,102,241,0.28)] hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 overflow-hidden"
          >
            {loading ? (
              <div className="h-full flex items-center justify-center -mt-3.5">
                <FadeLoader color={'#ffffff'} cssOverride={override} />
              </div>
            ) : (
              "Send Code"
            )}
          </button>

          {/* Back */}
          <Link to="/login" className="flex items-center justify-center gap-2 text-[#2B2B33] text-[15px] mt-10 w-full font-bold transition hover:text-[#6366F1]">
            <ArrowLeft size={17} />
            Back to Login
          </Link>

        </div>
      </div>
    </>
  )
}