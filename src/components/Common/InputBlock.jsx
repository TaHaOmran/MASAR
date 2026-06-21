import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function InputBlock({
  label,
  icon: Icon,
  name,
  type = "text",
  placeholder,
  formik,
  children,
}) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="mb-5 text-left w-full">
      {/* Label */}
      <label className="text-sm font-semibold text-gray-700 pl-1">
        {label}
      </label>

      {/* Input container - تم تحديث تأثير التركيز للون البنفسجي الموحد لـ مسار */}
      <div
        className={`mt-2 flex items-center gap-3 rounded-xl px-4 h-[50px] bg-gray-50 border transition-all duration-200 ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-200 focus-within:border-[#6366F1] focus-within:ring-1 focus-within:ring-[#6366F1]/20 focus-within:bg-white"
        }`}
      >
        {Icon && <Icon size={18} className="text-gray-400 shrink-0" />}

        {/* Normal input OR custom select */}
        {children ? (
          children
        ) : (
          <>
            <input
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              name={name}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={placeholder}
              className="bg-transparent w-full outline-none text-sm font-semibold text-gray-900 placeholder-gray-400"
            />

            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition shrink-0 outline-none"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Error Block */}
      {formik.touched[name] && formik.errors[name] && (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/60 px-3.5 py-2">
          <AlertCircle size={15} className="text-red-500 shrink-0" />
          <p className="text-xs font-semibold text-red-600 leading-none">
            {formik.errors[name]}
          </p>
        </div>
      )}
    </div>
  );
}