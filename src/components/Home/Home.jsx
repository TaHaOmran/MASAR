import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  LayoutGrid,
  Map,
  Cpu,
  ChartColumn,
  Lightbulb,
  Target,
} from "lucide-react";
import Chatbot from '../Chatbot/Chatbot';

// استيراد الصورة من الـ assets مباشرة
import heroImage from "../../assets/home.png"; 

// 🌟 كومبوننت مخصص ومثالي لمراقبة وعمل أنيميشن الظهور ناعم عند السكرول
function ScrollReveal({ children, delay = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.05 }); // خليناها 5% عشان يلقط على طول ومن غير تأخير بصري

    observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      // 🌟 هنا ضفنا cubic-bezier مخصص للحركة مع تغيير الـ scale ناعم جداً
      className={`transition-all duration-[1200ms] [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] transform ${delay} ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-16 scale-[0.97]"
      }`}
    >
      {children}
    </div>
  );
}


export default function Home() {
  const actions = [
    {
      icon: ClipboardCheck,
      title: "Take Path Assessment",
      desc: "Evaluate your current technical and soft skills through our AI-driven tests.",
      button: "Start Now",
    },
    {
      icon: LayoutGrid,
      title: "Go to Test Results",
      desc: "Track your progress and manage your personal learning journey.",
      button: "Open Dashboard",
    },
    {
      icon: Map,
      title: "Make Roadmap",
      desc: "Access top-rated courses and materials to bridge your skill gaps.",
      button: "Generate One",
    },
  ];

  const actionDestinations = ['/test', '/results', '/roadmap'];

  const features = [
    {
      icon: Cpu,
      title: "AI-Powered Recommendations",
      desc: "Our proprietary algorithms analyze market trends and your profile to suggest the most viable career paths.",
    },
    {
      icon: ChartColumn,
      title: "Personalized Skill Analysis Test",
      desc: "Get deep insights into your strengths and weaknesses with detailed performance metrics.",
    },
    {
      icon: Map,
      title: "Career Roadmap Guidance",
      desc: "Step-by-step navigational guides to help you transition from where you are to where you want to be.",
    },
    {
      icon: Target,
      title: "Connect With Expert Mentors",
      desc: "Connect with experienced mentors and build meaningful relationships that guide your career journey",
    },
    {
      icon: Lightbulb,
      title: "Real-Time Mentor Chat",
      desc: "Get real-time support from mentors through live chat whenever you need guidance.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#111827] text-left overflow-x-hidden">

      {/* HERO SECTION - يظهر مباشرة أول ما الصفحة تفتح بطبيعة الحال */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24 duration-1000 animate-fadeIn">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="animate-fadeIn">
            <h1 className="text-[44px] leading-[1.15] font-extrabold tracking-tight max-w-[560px] text-gray-900">
              Welcome to Your
              <br />
              <span className="text-[#6366F1]">
                Personalized Career
                <br />
                Guidance Platform
              </span>
            </h1>

            <p className="text-gray-500 text-[18px] leading-relaxed mt-6 max-w-[620px] font-medium">
              Discover the best career path based on your skills, interests, and academic performance using AI-powered recommendations.
            </p>

            {/* BUTTONS */}
            <div className="flex items-center gap-5 mt-10">
              <Link to="/test">
                <button
                  className="
                    h-[52px]
                    px-8
                    rounded-xl
                    bg-[#6366F1]
                    text-white
                    font-bold
                    shadow-[0_8px_20px_rgba(99,102,241,0.25)]
                    hover:opacity-95
                    hover:shadow-lg
                    transition-all
                    cursor-pointer
                  "
                >
                  Start Assessment
                </button>
              </Link>

              <Link to="/roadmap">
                <button
                  className="
                    h-[52px]
                    px-8
                    rounded-xl
                    border border-gray-200
                    bg-white
                    text-gray-700
                    font-bold
                    hover:bg-gray-50
                    transition-all
                    cursor-pointer
                  "
                >
                  Build Roadmap
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center lg:justify-end items-center">
            <div className="w-full max-w-[520px] h-[380px] overflow-hidden rounded-2xl flex items-center justify-center">
              <img 
                src={heroImage} 
                alt="Masar Career Guidance Graphic" 
                className="w-full h-full object-cover rounded-2xl select-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ACTIONS SECTION - 🌟 يبدأ مخفي ويظهر بـ Slide Up ناعم لما تنزل له */}
      <section className="bg-[#F8F9FD] py-24 border-t border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-center text-4xl font-extrabold mb-16 tracking-tight text-gray-900">
              What would you like to do?
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {actions.map((item, index) => {
              const Icon = item.icon;
              // عمل تأثير تتابع زمني (Staggered Delay) لتظهر الكروت ورا بعضها
              const delays = ["delay-[0ms]", "delay-[150ms]", "delay-[300ms]"];

              return (
                <ScrollReveal key={index} delay={delays[index]}>
                  <div
                    className="
                      bg-white
                      rounded-2xl
                      border border-gray-100
                      p-6
                      shadow-[0_8px_30px_rgba(0,0,0,0.03)]
                      hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)]
                      hover:-translate-y-1
                      transition-all duration-300
                      flex flex-col justify-between h-full
                    "
                  >
                    <div>
                      {/* ICON */}
                      <div className="w-12 h-12 rounded-xl bg-indigo-50/60 flex items-center justify-center mb-5">
                        <Icon size={20} className="text-[#6366F1]" />
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mt-1 mb-6 font-medium">
                        {item.desc}
                      </p>
                    </div>

                    <Link to={actionDestinations[index]} className="w-full h-11 rounded-xl bg-[#6366F1] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center cursor-pointer">
                      {item.button}
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - 🌟 السكشن الأخير يفتح تدريجياً بكروته بشكل مبهر بـ ScrollReveal */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-center text-3xl md:text-4xl font-extrabold mb-16 tracking-tight text-gray-900">
              Platform Features
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {features.slice(0, 3).map((item, index) => {
              const Icon = item.icon;
              const delays = ["delay-[0ms]", "delay-[100ms]", "delay-[200ms]"];

              return (
                <ScrollReveal key={index} delay={delays[index]}>
                  <FeatureCard
                    Icon={Icon}
                    title={item.title}
                    desc={item.desc}
                  />
                </ScrollReveal>
              );
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8 justify-items-center">
            {(() => {
              const rest = features.slice(3);

              return (
                <>
                  {rest.map((item, index) => {
                    const delays = ["delay-[0ms]", "delay-[150ms]"];
                    return (
                      <ScrollReveal key={index} delay={delays[index]}>
                        <FeatureCard
                          Icon={item.icon}
                          title={item.title}
                          desc={item.desc}
                        />
                      </ScrollReveal>
                    );
                  })}

                  {/* invisible placeholders to keep column widths consistent */}
                  {Array.from({ length: (3 - (rest.length % 3)) % 3 }).map((_, i) => (
                    <div key={`placeholder-${i}`} className="invisible md:block hidden w-full max-w-[360px]">
                      <div className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[240px] flex flex-col justify-between" />
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      </section>
      <Chatbot />
    </div>
  );
}

function FeatureCard({ Icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)] hover:-translate-y-1 transition-all duration-300 min-h-[240px] flex flex-col gap-4 w-full max-w-[360px] text-left">
      <div className="flex flex-col items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-50/60 flex items-center justify-center">
          <Icon size={20} className="text-[#6366F1]" />
        </div>

        <div className="mt-2">
          <h3 className="text-lg font-bold text-gray-900 mb-1.5">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
        </div>
      </div>
    </div>
  );
}