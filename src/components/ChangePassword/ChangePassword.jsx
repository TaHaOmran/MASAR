import React, { useState } from 'react'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  TriangleAlert,
} from 'lucide-react'
import logo from '../../assets/logo.png'
import style from './ChangePassword.module.css'
import { Link } from 'react-router-dom'
import ForgetPassword from '../ForgetPassword/ForgetPassword'

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center pt-10 px-4 mb-15">

      {/* Logo */}
      <Link to="/home">
        <img
          src={logo}
          alt="Masar"
          className="w-[180px] mb-10"
        />
      </Link>

      {/* Card */}
      <div className="w-full max-w-[480px] bg-[#f7f7f9] border border-[#e5e5ea] rounded-[24px] shadow-sm px-8 py-8">

        {/* Header Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] flex items-center justify-center">
            <ShieldCheck
              size={26}
              className="text-white"
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-[24px] font-bold text-[#111827] mb-2">
            Change Password
          </h2>

          <p className="text-[15px] text-[#6b7280] leading-relaxed font-semibold whitespace-nowrap">
            Maintain your account security by updating your credentials.
          </p>
        </div>

        {/* Warning Box */}
        <div className="border border-[#dedee3] rounded-[20px] bg-[#f8f8fa] px-5 py-4 flex gap-3 mb-6">
          <TriangleAlert
            size={20}
            className="text-[#2f2f37] mt-[2px] shrink-0"
          />

          <p className="text-[15px] leading-7 text-[#3f3f46] font-medium">
            Changing your password will log you out from all devices.
            Make sure to remember and use a strong and secure password.
          </p>
        </div>

        {/* Current Password */}
        <div className="mb-5">
          <label className="block text-[15px] font-medium text-[#222] mb-3 mx-3">
            Current Password
          </label>

          <div className="h-[48px] rounded-[18px] border border-[#d8d8de] bg-[#f7f7f9] px-4 flex items-center">
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Enter current password"
              className="
                flex-1 bg-transparent outline-none
                text-[15px] text-[#111]
                placeholder:text-[#7b7b86]
              "
            />

            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="text-[#2f2f37]"
            >
              {showCurrent ? (
                <EyeOff size={20} strokeWidth={2} />
              ) : (
                <Eye size={20} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-5">
          <label className="block text-[15px] font-medium text-[#222] mb-3 mx-3">
            New Password
          </label>

          <div className="h-[48px] rounded-[18px] border border-[#d8d8de] bg-[#f7f7f9] px-4 flex items-center">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              className="
                flex-1 bg-transparent outline-none
                text-[15px] text-[#111]
                placeholder:text-[#7b7b86]
              "
            />

            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-[#2f2f37]"
            >
              {showNew ? (
                <EyeOff size={20} strokeWidth={2} />
              ) : (
                <Eye size={20} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-8">
          <label className="block text-[15px] font-medium text-[#222] mb-3 mx-3">
            Confirm New Password
          </label>

          <div className="h-[48px] rounded-[18px] border border-[#d8d8de] bg-[#f7f7f9] px-4 flex items-center">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat new password"
              className="
                flex-1 bg-transparent outline-none
                text-[15px] text-[#111]
                placeholder:text-[#7b7b86]
              "
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-[#2f2f37]"
            >
              {showConfirm ? (
                <EyeOff size={20} strokeWidth={2} />
              ) : (
                <Eye size={20} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          className="
            w-full h-[50px]
            rounded-[16px]
            bg-[#6366f1]
            hover:bg-[#5b5ee9]
            transition-all duration-200
            text-white font-semibold text-[16px]
            shadow-[0_10px_20px_rgba(99,102,241,0.28)]
            cursor-pointer
          "
        >
          Set New Password
        </button>

        {/* Footer */}
        <Link
          to="/forget-password"
          aria-label="Forgot your current password"
          className="mt-8 block w-full text-center text-[15px] text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
        >
          Forgot your current password?
        </Link>
      </div>
    </div>
  )
}