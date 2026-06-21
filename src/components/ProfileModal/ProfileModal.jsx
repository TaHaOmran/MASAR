import React from "react";
import {
  X,
  Mail,
  Phone,
  Clock3,
  Link as LinkIcon,
  Briefcase,
} from "lucide-react";
import Iconuser from '../../assets/usericon.png';
import mentorIcon from '../../assets/mentoricon.png';

export default function ProfileModal({ user, onClose = () => {} }) {
  // لو مفيش مستخدم مبعوت لسه، ميعرضش حاجة منعاً لضرب الأكواد
  if (!user) return null;

  // دمج الاسم الأول والأخير بشكل نظيف
  const fullName = user.firstName 
    ? `${user.firstName} ${user.lastName || ""}` 
    : user.name || "User Profile";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white">
          <h2 className="font-bold text-[22px] text-gray-900">
            User Details
          </h2>

          <button onClick={onClose} aria-label="Close" className="p-1.5 cursor-pointer text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-50">
            <X size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-6">

          <div className="flex gap-6">
            <img
              src={user.role === "Mentor" 
                ? mentorIcon // لو المستخدم هو Mentor، نستخدم أيقونة المينتور
                : Iconuser   // لو المستخدم هو Mentee أو أي دور تاني، نستخدم أيقونة المستخدم العادية
              }
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border border-gray-100 shadow-sm shrink-0"
            />

            <div className="flex-1 min-w-0">

              <h3 className="text-2xl font-bold text-gray-900 truncate text-left">
                {fullName}
              </h3>

              <p className="text-[#6366F1] font-bold text-sm mt-1 text-left">
                {user.role}
              </p>

              {/* 🌟 كروت الداتا الصغيرة تم تحديث ألوانها لتطابق هوية مسار البنفسجية */}
              <div className="grid grid-cols-2 gap-3 mt-5">

                {/* الـ Email */}
                <div className="bg-indigo-50/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-gray-700 font-semibold border border-indigo-50/20 text-left">
                  <Mail size={14} className="text-[#6366F1] shrink-0" />
                  <span className="truncate">{user.email?.replace("Company: ", "") || "No Email Provided"}</span>
                </div>

                {/* الـ Phone */}
                <div className="bg-indigo-50/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-gray-700 font-semibold border border-indigo-50/20 text-left">
                  <Phone size={14} className="text-[#6366F1] shrink-0" />
                  <span className="truncate">{user.phone || "No Phone Registered"}</span>
                </div>

                {/* يعرض الشركة والخبرة فقط لو كان الحساب لـ Mentor */}
                {user.role === "Mentor" && (
                  <>
                    <div className="bg-indigo-50/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-gray-700 font-semibold border border-indigo-50/20 text-left">
                      <Briefcase size={14} className="text-[#6366F1] shrink-0" />
                      <span className="truncate">Works at: {user.company || "Freelancer"}</span>
                    </div>

                    <div className="bg-indigo-50/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-gray-700 font-semibold border border-indigo-50/20 text-left">
                      <Clock3 size={14} className="text-[#6366F1] shrink-0" />
                      <span className="truncate">{user.yearsOfExperience ? `${user.yearsOfExperience} Years Exp` : "Expert Role"}</span>
                    </div>
                  </>
                )}

                {/* رابط LinkedIn */}
                {user.linkedIn ? (
                  <a 
                    href={user.linkedIn} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="bg-indigo-50/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-[#6366F1] font-bold border border-indigo-100/40 hover:bg-indigo-50 transition text-left"
                  >
                    <LinkIcon size={14} className="text-[#6366F1] shrink-0" />
                    <span className="truncate">Open LinkedIn Profile</span>
                  </a>
                ) : (
                  <div className="bg-gray-50 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-gray-400 font-semibold border border-gray-100 text-left">
                    <LinkIcon size={14} className="text-gray-300 shrink-0" />
                    <span className="truncate">No LinkedIn Linked</span>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 text-left">

            <div className="text-[11px] tracking-[2px] font-bold text-gray-400 mb-3 uppercase">
              Track Assignment & Metrics
            </div>

            <div className="border border-gray-100 rounded-xl p-5 text-sm text-gray-600 leading-7 bg-gray-50/50 font-medium">
              {user.role === "Mentor" ? (
                <>
                  This mentor is specialized in <span className="text-[#6366F1] font-bold">{user.trackName || "Technical Leadership"}</span>. 
                  Currently managing academic tracking, portfolio optimization review, and technical engineering consultation sessions inside the ecosystem node.
                </>
              ) : (
                <>
                  Active career seeker node on track platform. Enrolled in standard evaluation matrix assessments. 
                  Profile records are linked directly with predictive modeling variables to split metrics and sync milestone recommendations.
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}