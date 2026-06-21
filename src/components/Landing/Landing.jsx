import { faArrowRight, faBullseye, faChartColumn, faGear, faLightbulb, faMap, faPlay, faUserGroup, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from "../Chatbot/Chatbot";

export default function Landing() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 🌟 فحص ذكي: جلب التوكن من الذاكرة الدائمة أو المؤقتة فوراً لحل مشكلة التوجيه
    const token = localStorage.getItem("accessToken") || 
                  localStorage.getItem("token") || 
                  sessionStorage.getItem("accessToken") || 
                  sessionStorage.getItem("token");
  
    // طالما التوكن متاح (سواء كان دائم أو مؤقت)، وجه اليوزر فوراً للـ Home ولا داعي لفحص حقل rememberMe هنا
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const steps = [
    {
      id: "01",
      title: "Discover Yourself",
      desc: "Uncover your hidden strengths and core values through our AI-driven personality assessments.",
    },
    {
      id: "02",
      title: "Explore Career Paths",
      desc: "Explore thousands of roles and paths with real-time market data that matches your potential.",
    },
    {
      id: "03",
      title: "Build a Clear Plan",
      desc: "Receive a customized learning roadmap with specific courses, skills, and projects.",
    },
    {
      id: "04",
      title: "Grow with Confidence",
      desc: "Connect with top industry mentors and track your progress toward your dream role.",
    },
  ];

  const features = [
    {
      icon: faGear,
      title: "AI-Powered Recommendations",
      desc: "Our proprietary algorithms analyze market trends and your profile to suggest the most viable career paths.",
    },
    {
      icon: faChartColumn,
      title: "Personalized Skill Analysis Test",
      desc: "Get deep insights into your strengths and weaknesses with detailed performance metrics.",
    },
    {
      icon: faMap,
      title: "Career Roadmap Guidance",
      desc: "Step-by-step navigational guides to help you transition from where you are to where you want to be.",
    },
    {
      icon: faUserGroup,
      title: "Connect With Expert Mentors",
      desc: "Connect with experienced mentors and build meaningful relationships that guide your career journey.",
    },
    {
      icon: faLightbulb,
      title: "Real-Time Mentor Chat",
      desc: "Get real-time support from mentors through live chat whenever you need guidance.",
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800 font-sans animate-fadeIn">
        <div className="max-w-6xl mx-auto px-4">

          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-16 py-20">
            {/* LEFT */}
            <div className="w-full lg:w-1/2 max-w-xl text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">
                How to find <br />
                <span className="text-[#6366F1]">your true path</span>
              </h1>

              <p className="text-gray-500 mt-6 text-lg sm:text-xl leading-relaxed font-medium">
                Navigate the complexities of modern careers with data-driven insights,
                expert mentorship, and a clear roadmap designed just for you.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-10">
                <Link to="/login" className="w-full sm:w-auto">
                  <button className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] hover:shadow-lg hover:opacity-95 transition-all text-white px-8 py-4 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 text-base">
                    Get Started
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </Link>
                <button className="flex items-center gap-2 font-bold cursor-pointer text-sm text-gray-600 hover:text-[#6366F1] transition">
                  <FontAwesomeIcon icon={faPlay} className="text-[#6366F1] p-4 bg-indigo-50/60 rounded-full w-4 h-4 flex items-center justify-center mr-1" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md md:max-w-lg">
                <div className="absolute inset-0 translate-x-4 translate-y-4 bg-indigo-600/10 rounded-2xl blur-2xl"></div>
                <div className="relative p-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786"
                    alt="Team collaboration at Masar"
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PROCESS STEP SECTION */}
          <section className="py-24">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Your Career Journey, Step by Step
              </h2>
              <p className="text-gray-500 mt-4 text-base sm:text-lg font-medium">
                We've simplified professional growth into four manageable phases.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)] hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between"
                >
                  <div className="flex justify-end mb-4">
                    <span className="text-xs bg-indigo-50/80 text-[#6366F1] px-3 py-1 rounded-full font-bold">
                      {step.id}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {step.title}
                    </h4>
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* STATS */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-24 mt-24 border-t border-gray-100 pt-16">
              <div className="text-center flex flex-col items-center">
                <div className="bg-indigo-50/60 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <FontAwesomeIcon icon={faUsers} className="text-[#6366F1] text-lg" />
                </div>
                <div className="text-4xl font-extrabold text-gray-900">1.2M+</div>
                <p className="text-gray-500 text-sm font-semibold mt-1.5">
                  Active platform users globally
                </p>
              </div>

              <div className="text-center flex flex-col items-center">
                <div className="bg-indigo-50/60 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <FontAwesomeIcon icon={faBullseye} className="text-[#6366F1] text-lg" />
                </div>
                <div className="text-4xl font-extrabold text-gray-900">94%</div>
                <p className="text-gray-500 text-sm font-semibold mt-1.5">
                  Successful career transitions
                </p>
              </div>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="bg-[#F8F9FD] rounded-3xl py-24 px-6 md:px-12 my-12">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Platform Features
            </h2>
            <p className="text-center text-gray-500 mt-4 text-base font-medium max-w-xl mx-auto mb-16">
              Powerful technology combined with premium industry data to reconstruct your roadmap.
            </p>

            <div className="max-w-6xl mx-auto">
              <div className="grid gap-6 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((item, i) => (
                  <div
                    key={i}
                    className="w-full sm:max-w-[360px] last:sm:col-span-2 last:sm:mx-auto last:lg:col-span-1 last:lg:mx-auto"
                  >
                    <FeatureCard item={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* CALL TO ACTION CARD */}
            <div className="max-w-3xl mx-auto mt-24 px-4">
              <div className="relative rounded-3xl py-14 px-8 text-center bg-white border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="absolute inset-0 -z-10 rounded-3xl bg-indigo-50/20 blur-3xl"></div>

                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Ready to take the first step?
                </h2>

                <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
                  Join thousands of professionals who have already redefined their careers.
                  Your future starts with a single click.
                </p>
                
                <Link to="/login" className="inline-block mt-8">
                  <button className="bg-[#6366F1] hover:bg-[#5B5CEB] hover:shadow-xl text-white px-10 py-4 rounded-xl font-bold text-base shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                    Start Your Journey →
                  </button>
                </Link>

                <p className="text-gray-400 text-xs font-semibold mt-5">
                  No credit card required. Start your assessment in seconds.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
      <Chatbot />
    </>
  );
}

function FeatureCard({ item }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)] hover:-translate-y-1 transition-all duration-300 h-full text-left flex flex-col justify-start">
      <div className="mb-6">
        <div className="bg-indigo-50/60 w-12 h-12 flex items-center justify-center rounded-xl">
          <FontAwesomeIcon
            icon={item.icon}
            className="text-[#6366F1] text-lg"
          />
        </div>
      </div>

      <h4 className="font-extrabold text-gray-900 text-lg">
        {item.title}
      </h4>

      <p className="text-gray-500 text-sm mt-3 leading-relaxed font-medium">
        {item.desc}
      </p>
    </div>
  );
}