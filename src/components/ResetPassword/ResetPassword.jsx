import React, { useState } from 'react'
import style from './ResetPassword.module.css'
import Logo from '../../assets/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FadeLoader } from 'react-spinners' 
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Lock, Key, Mail } from 'lucide-react' // 🌟 أضفنا أيقونة Key للكود

const override = {
  display: "inline-block",
  margin: "0 auto",
  transform: "scale(0.35)",
  height: "10px",
  width: "10px"
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // استلام الإيميل الممرر تلقائياً من الصفحة السابقة لراحة المستخدم
  const receivedEmail = location.state?.email || "";

  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  // الـ States الخاصة بالـ Inputs
  const [email, setEmail] = useState(receivedEmail) 
  const [verificationCode, setVerificationCode] = useState('') // 🌟 حقل الـ Code الجديد
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email.trim() || !verificationCode.trim() || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // تنظيف كامل لأي مسافات خفية في الكود مقتبسة من الإيميل
      const cleanCode = verificationCode.trim();

      console.log(`%c[Final Precision Request] Code being sent: ${cleanCode}`, "color: #6366F1; font-weight: bold;");

      // إجبار Axios يبعت الـ RAW Data بدون أي تلاعب بالرموز الخاصة
      const response = await axios({
        method: 'post',
        url: 'https://smartcareerpath.runasp.net/api/auth/reset-password',
        data: {
          email: email.trim(),
          code: cleanCode, // الـ كود الصافي بالملي
          newPassword: newPassword,
          confirmPassword: confirmPassword
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast.success(response.data?.message || "Password reset successfully! 🎉");
      setTimeout(() => navigate("/login"), 1500);

    } catch (error) {
      console.error("❌ API Core Rejected:", error.response?.data);

      // هنا اللقطة: السيرفر باعت إيه جوة الـ 400؟ هنظهره في التوست فوراً
      let serverMessage = "Invalid request constants.";
      
      if (error.response?.data) {
        const data = error.response.data;
        // لو الباك إند بيبعت مصفوفة أخطاء Identity (Errors Array)
        if (data.errors && Array.isArray(data.errors)) {
          serverMessage = data.errors[0].description || data.errors[0].message;
        } else if (typeof data === 'object') {
          serverMessage = data.message || data.title || JSON.stringify(data);
        } else {
          serverMessage = data;
        }
      }

      toast.error(`Error: ${serverMessage}`, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F5F5F8] flex flex-col items-center px-4 pt-10 mb-15 animate-fadeIn">

        {/* Logo */}
        <Link to="/">
          <img
            src={Logo}
            alt="Masar"
            className="w-[180px] mb-10"
          />
        </Link>

        {/* Card */}
        <div className="w-full max-w-[480px] bg-white border border-[#E5E7EB] rounded-[22px] px-8 py-10 mb-15 shadow-sm">

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-[68px] h-[68px] rounded-[18px] bg-[#F4F0FF] border border-[#E8E0FF] flex items-center justify-center">
              <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] flex items-center justify-center shadow-sm">
                <ShieldCheck
                  size={28}
                  className="text-white"
                  strokeWidth={2.2}
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-[24px] font-semibold text-[#1E1E2D] mb-3 text-center">
              Reset your password
            </h1>

            <p className="text-[14px] leading-6 text-[#5E6278] max-w-[320px] mx-auto font-semibold text-center">
              Enter the code you received along with your new strong password.
            </p>
          </div>

          {/* Email */}
          <div className="mb-5 text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
              Email Address
            </label>

            <div className="h-[52px] border border-[#D9DCE3] rounded-xl flex items-center px-4 bg-white focus-within:border-[#6366F1] focus-within:ring-1 focus-within:ring-[#6366F1]/20 transition-all">
              <Mail size={18} className="text-gray-400 shrink-0" />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ml-3 outline-none bg-transparent text-sm text-[#2B2B33] font-semibold placeholder-gray-400 text-left"
              />
            </div>
          </div>

          {/* 🌟 حقل إدخال الـ Verification Code الجديد والمطابق للـ Postman */}
          <div className="mb-5 text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
              Verification Code (OTP)
            </label>

            <div className="h-[52px] border border-[#D9DCE3] rounded-xl flex items-center px-4 bg-white focus-within:border-[#6366F1] focus-within:ring-1 focus-within:ring-[#6366F1]/20 transition-all">
              <Key size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Enter 6-digit code (e.g. 704492)"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full ml-3 outline-none bg-transparent text-sm text-[#2B2B33] font-semibold placeholder-gray-400 text-left tracking-wide"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5 text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
              New Password
            </label>

            <div className="h-[52px] border border-[#D9DCE3] rounded-xl flex items-center px-4 bg-white focus-within:border-[#6366F1] focus-within:ring-1 focus-within:ring-[#6366F1]/20 transition-all">
              <Lock size={18} className="text-gray-400 shrink-0" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Example: Masar@2026! (English only)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
                className="flex-1 ml-3 outline-none bg-transparent text-sm text-[#2B2B33] font-semibold placeholder-gray-400 text-left"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-400 hover:text-gray-600 transition outline-none shrink-0"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6 text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
              Confirm New Password
            </label>

            <div className="h-[52px] border border-[#D9DCE3] rounded-xl flex items-center px-4 bg-white focus-within:border-[#6366F1] focus-within:ring-1 focus-within:ring-[#6366F1]/20 transition-all">
              <Lock size={18} className="text-gray-400 shrink-0" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="flex-1 ml-3 outline-none bg-transparent text-sm text-[#2B2B33] font-semibold placeholder-gray-400 text-left"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-400 hover:text-gray-600 transition outline-none shrink-0"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3 mb-7 text-left">
            <div className="mt-[2px]">
              <Lock
                size={16}
                className="text-[#6366F1] shrink-0"
                strokeWidth={2.2}
              />
            </div>
            <p className="text-[12px] leading-relaxed text-gray-500 font-semibold text-left">
              Your password must be different from previously used passwords for security reasons.
            </p>
          </div>

          {/* Button */}
          <button 
            type="submit"
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] text-white font-semibold text-[16px] shadow-[0_10px_25px_rgba(99,102,241,0.28)] hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 overflow-hidden"
          >
            {loading ? (
              <div className="h-full flex items-center justify-center -mt-3.5">
                <FadeLoader color={'#ffffff'} cssOverride={override} />
              </div>
            ) : (
              "Reset My Password"
            )}
          </button>

          {/* Back */}
          <Link to="/forget-password" className="w-full flex items-center justify-center gap-2 text-[#2B2B33] text-[15px] mt-10 font-bold transition hover:text-[#6366F1]">
            <ArrowLeft size={17} />
            Back 
          </Link>

        </div>
      </div>
    </>
  )
}