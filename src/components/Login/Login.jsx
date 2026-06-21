import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import axios from "axios";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import InputBlock from "../Common/InputBlock";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const remember = localStorage.getItem("rememberMe");

  if (token && remember === "true") {
    navigate("/home");
  }
}, [navigate]);

  function validateForm(values) {
    let errors = {};

    // Email
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Please enter a valid email (e.g., name@example.com)";
    }

    // Password
    if (!values.password) {
      errors.password = "Password is required";
    } else {
      // 🌟 لو كتب بالعربي: بنبهه وبنديله مثال للحروف الإنجليزية الشغالة
      if (/[\u0600-\u06FF]/.test(values.password)) {
        errors.password = "Password must be in English characters";
      } 
      // 🌟 لو الطول أقل من 8 حروف
      else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      }
    }

    return errors;
  }

  function showErrors(errors) {
    Object.values(errors).forEach((msg) => {
      toast.error(msg);
    });
  }

  async function login(values) {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://smartcareerpath.runasp.net/api/auth/login",
        values
      );

      const data = response.data;
      // لقط الـ accessToken من الداتا حسب الدستور بالملي 🌟
      const token = data.accessToken || data.token; 
      const refreshToken = data.refreshToken;

      if (token) {
        // 🌟 تخزين كل مفاتيح الأمان بالأسماء الموحدة عشان الـ Interceptor والـ Navbar يشتغلوا طلقة
        localStorage.setItem("token", token); // للأكواد القديمة
        localStorage.setItem("accessToken", token); // للـ SignalR والـ Interceptor
        
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken); // 👈 السطر ده اللي هيقفل إيرور الـ 401 للأبد!
        } else {
          console.warn("[Auth Warning] Server did not return a refreshToken!");
        }

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        // تثبيت الهيدر الافتراضي للـ Axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      toast.success("Welcome to Masar", { duration: 2000 });
      navigate("/home");
    } catch (error) {
      console.error("%c[Auth Error] Login Failed:", "color: #ef4444; font-weight: bold;", error.response?.data || error.message);
      
      // إظهار رسالة الخطأ الحقيقية القادمة من الباك إند لو وجدت
      const serverError = error.response?.data?.error || error.response?.data?.message || "Invalid email or password";
      toast.error(serverError, { duration: 2000 });
    } finally {
      setLoading(false);
    }
  }
  
const formik = useFormik({
  initialValues: {
    email: "",
    password: "",
  },
  validate: validateForm,
  validateOnMount: true,
  onSubmit: async (values) => {
    await login(values);
  },
});

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6f8] to-[#eef1f7] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Masar" className="w-[160px] mb-10" />
      </Link>

      {/* Card */}
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl px-8 py-10"
      >

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5D5CEE] to-[#3A64ED] flex items-center justify-center text-white">
            <ShieldCheck size={30} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome back
        </h2>

        <p className="text-center text-sm text-gray-500 mb-8">
          Sign in to your account
        </p>

        {/* Email */}
        <InputBlock
          label="Email"
          icon={Mail}
          name="email"
          placeholder="Enter email"
          formik={formik}
        />

        {/* PASSWORD */}
        <InputBlock
          label="Password"
          icon={Lock}
          name="password"
          type="password"
          placeholder="Enter password"
          formik={formik}
        />

        {/* Options */}
        <div className="flex justify-between text-sm mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#5D5CEE]"
            />
            Remember me
          </label>

          <Link to="/forget-password" className="text-[#5D5CEE]">
            Forgot password?
          </Link>
        </div>

<button
  type="submit"
  disabled={
    loading ||
    !formik.values.email ||
    !formik.values.password ||
    Object.keys(formik.errors).length > 0
  }
  className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
    loading ||
    !formik.values.email ||
    !formik.values.password ||
    Object.keys(formik.errors).length > 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-[#5D5CEE] to-[#3A64ED] cursor-pointer"
  }`}
>
  {loading ? (
    "Signing in..."
  ) : (
    <span className="flex items-center justify-center gap-2">
      Sign in <ArrowRight size={18} />
    </span>
  )}
</button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?
          <Link to="/signup" className="text-[#5D5CEE] ml-1 font-semibold">
            Sign up
          </Link>
        </p>

      </form>
    </div>
  );
}