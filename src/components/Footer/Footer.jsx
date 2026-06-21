import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedinIn, faTwitter } from "@fortawesome/free-brands-svg-icons";
import Logo from '../../assets/logo.png';

export default function Footer() {
  // قراءة التوكن الموحد للأمان الشامل
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  const socials = [
    {
      icon: faLinkedinIn,
      link: "https://www.linkedin.com/in/YOUR_USERNAME",
    },
    {
      icon: faGithub,
      link: "https://github.com/YOUR_USERNAME",
    },
    {
      icon: faTwitter,
      link: "https://twitter.com/YOUR_USERNAME",
    },
    {
      icon: faEnvelope,
      link: "mailto:your@email.com",
    },
  ];

  const platformLinks = [
    { name: "Test", path: "/test" },
    { name: "Results", path: "/results" },
    { name: "Roadmaps", path: "/roadmap" }, // تم تحديثها للمسار القياسي المعتمد
  ];

  return (
    <footer className="bg-[#F8F9FD] border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">

          {/* Logo + Description */}
          <div>
            <div className="flex items-start justify-start gap-2 h-12 -ml-2 md:-ml-0">
              <Link to={token ? "/home" : "/login"}>
                <img
                  src={Logo}
                  alt="Masar"
                  className="h-8 md:h-10 w-auto object-contain -ml-2"
                />
              </Link>
            </div>
            
            <p className="text-gray-500 mt-4 text-sm leading-relaxed max-w-[320px] font-semibold">
              Empowering professionals to navigate their career paths with clarity and confidence.
            </p>

            {/* 🌟 زرار Contact Us بلون الفوكس البنفسجي الموحد الجديد */}
            <Link
              to="/contact-us"
              className="
                inline-flex items-center justify-center
                mt-6
                px-5 h-[42px]
                rounded-xl text-sm font-bold
                bg-white border border-gray-200 text-gray-700
                shadow-sm
                hover:bg-[#6366F1] hover:text-white hover:border-[#6366F1]
                hover:-translate-y-[1px]
                transition-all duration-200
              "
            >
              Contact Us
            </Link>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-gray-900 font-extrabold mb-4 text-base">Platform</h3>

            <ul className="space-y-3 text-sm text-gray-500 font-semibold">
              {platformLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    to={token ? item.path : "/login"}
                    className="relative group inline-block"
                  >
                    {/* 🌟 الـ Hover Underline تحول للبنفسجي الموحد الساحر */}
                    <span className="group-hover:text-[#6366F1] transition duration-200">
                      {item.name}
                    </span>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#6366F1] transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-gray-900 font-extrabold mb-4 text-base">Connect</h3>

            <div className="flex gap-4">
              {socials.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-10 h-10
                    flex items-center justify-center
                    rounded-xl
                    bg-white
                    border border-gray-200
                    shadow-sm
                    hover:bg-[#6366F1]
                    hover:text-white
                    hover:-translate-y-[2px]
                    hover:shadow-[0_8px_20px_rgba(99,102,241,0.25)]
                    transition-all duration-200
                    text-gray-500
                  "
                >
                  <FontAwesomeIcon icon={item.icon} className="text-[16px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400 font-bold">
          © 2026 Masar. Built for the future of work.
        </div>
      </div>
    </footer>
  );
}