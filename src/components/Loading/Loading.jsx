import React from 'react'
import style from './Loading.module.css'
import { FadeLoader } from 'react-spinners';

const override = {
  display: "block",
  margin: "0 auto",
};

export default function Loading() {
  return (
    <>
      {/* تم تعديل الـ Classes لتكون شاشة كاملة متسنترة بخلفية موقعك الناعمة */}
      <div className="min-h-screen bg-[#F5F5F8] flex flex-col justify-center items-center gap-4">
        
        <FadeLoader
          color={'#6366F1'} // 🌟 اللون البنفسجي الاحترافي الموحد لموقعك بالملي
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        
        {/* كلمة تحت الأنيميشن عشان تدي انطباع احترافي لليوزر */}
        <p className="text-[#5E6278] text-[14px] font-bold tracking-wide mt-2 animate-pulse">
          Please wait...
        </p>

      </div>
    </>
  )
}