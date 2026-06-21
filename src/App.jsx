import React, { lazy, Suspense } from 'react' 
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import axios from 'axios';
import toast from 'react-hot-toast';

// 1️⃣ استيراد الـ Layout والـ Loading وحارس الأمان بشكل طبيعي وثابت 🌟
import Layout from './components/Layout/Layout'
import Loading from './components/Loading/Loading' 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute' // 👈 استيراد حارس الأمان لحماية المسارات الحساسة

// 2️⃣ استيراد بقية الصفحات ديناميكياً باستخدام lazy
const Landing = lazy(() => import('./components/Landing/Landing'));
const Login = lazy(() => import('./components/Login/Login'));
const Signup = lazy(() => import('./components/Signup/Signup'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));
const ContactUs = lazy(() => import('./components/ContactUs/ContactUs'));
const Chat = lazy(() => import('./components/Chat/Chat'));
const Test = lazy(() => import('./components/Test/Test'));
const Result = lazy(() => import('./components/Result/Result'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const Roadmap = lazy(() => import('./components/Roadmap/Roadmap'));
const GeneratedRoadmap = lazy(() => import('./components/GeneratedRoadmap/GeneratedRoadmap'));
const ForgetPassword = lazy(() => import('./components/ForgetPassword/ForgetPassword'));
const ChangePassword = lazy(() => import('./components/ChangePassword/ChangePassword'));
const ResetPassword = lazy(() => import('./components/ResetPassword/ResetPassword'));
const Home = lazy(() => import('./components/Home/Home'));
const Admin = lazy(() => import('./components/Admin/Admin'));
const Notification = lazy(() => import('./components/Notification/Notification'));
const ConfirmEmail = lazy(() => import('./components/ConfirmEmail/ConfirmEmail'));

function App() {

  React.useEffect(() => {
    // 🌟 Axios Interceptor لحماية الموقع بأكمله وتجديد التوكن تلقائياً
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          console.log("%c[Security Interceptor] Access Token expired! Attempting refresh...", "color: #eab308; font-weight: bold;");

          try {
            const storedRefreshToken = localStorage.getItem("refreshToken");

            if (!storedRefreshToken) {
              console.warn("[Security Interceptor] No refresh token found. Redirecting to login...");
              return Promise.reject(error);
            }

            const res = await axios.post("https://smartcareerpath.runasp.net/api/auth/refresh-token", {
              refreshToken: storedRefreshToken
            });

            console.log("%c[Security Interceptor] Token refreshed successfully! 🎉", "color: #10b981; font-weight: bold;", res.data);

            const newAccessToken = res.data?.accessToken || res.data?.token;
            const newRefreshToken = res.data?.refreshToken;

            // 🌟 التحديث الذكي لتحديث الـ Token في مكان حفظه الأصلي (Local أو Session) دون تعارض
            if (newAccessToken) {
              if (sessionStorage.getItem("token") || sessionStorage.getItem("accessToken")) {
                // إذا كان المستخدم يشتغل على جلسة مؤقتة (Unchecked Remember Me)
                sessionStorage.setItem("accessToken", newAccessToken);
                sessionStorage.setItem("token", newAccessToken);
              } else {
                // إذا كان المستخدم يشتغل على جلسة دائمة (Checked Remember Me)
                localStorage.setItem("accessToken", newAccessToken);
                localStorage.setItem("token", newAccessToken);
                if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
              }

              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            }

          } catch (refreshError) {
            console.error("%c[Security Interceptor] Refresh token is invalid or expired. Session killed.", "color: #ef4444; font-weight: bold;");
            
            // تنظيف كامل للذاكرتين لضمان حماية الحساب
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("userId");
            
            toast.error("Session expired. Please login again.");
            window.location.href = "/login"; 
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // 3️⃣ شجرة المسارات المحدثة والمحمية بالكامل بالـ ProtectedRoute 🌟
  let routers = createHashRouter([
    {
      path: '', 
      element: (
        <Suspense fallback={<Loading />}>
          <Layout />
        </Suspense>
      ),
      children: [
        // المسارات العامة (متاحة للجميع بدون تسجيل دخول)
        { index: true, element: <Landing /> },
        { path: 'login', element: <Login /> },
        { path: 'signup', element: <Signup /> },
        { path: 'contact-us', element: <ContactUs /> },
        { path: 'forget-password', element: <ForgetPassword /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'confirm-email', element: <ConfirmEmail /> }, // 👈 تم إعادة التفعيل لربط تفعيل البريد الإلكتروني
        { path: '*', element: <NotFound /> },

        // المسارات المحمية الحساسة (تتطلب وجود توكن وصلاحية تسجيل دخول) 🔒
        { path: 'home', element: <ProtectedRoute> <Home /> </ProtectedRoute> },
        { path: 'profile', element: <ProtectedRoute> <Profile /> </ProtectedRoute> },
        { path: 'test', element: <ProtectedRoute> <Test /> </ProtectedRoute> },
        { path: 'results', element: <ProtectedRoute> <Result /> </ProtectedRoute> },
        { path: 'roadmap', element: <ProtectedRoute> <Roadmap /> </ProtectedRoute> },
        { path: 'generated-roadmap', element: <ProtectedRoute> <GeneratedRoadmap /> </ProtectedRoute> },
        { path: 'chats/:chatId?', element: <ProtectedRoute> <Chat /> </ProtectedRoute> },
        { path: 'notifications', element: <ProtectedRoute> <Notification /> </ProtectedRoute> },
        { path: 'change-password', element: <ProtectedRoute> <ChangePassword /> </ProtectedRoute> },
        { path: 'admin', element: <ProtectedRoute> <Admin /> </ProtectedRoute> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routers}></RouterProvider>
      <Toaster />
    </>
  )
}

export default App;