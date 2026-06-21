import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // أول ما مسار الصفحة يتغير، اطلع لـ أول بكسل فوق في الشاشة فوراً وبسلاسة
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // أو "smooth" لو عاوز حركة الأنميشن تظهر، بس الأفضل instant عشان تفتح كأنها صفحة جديدة تماماً
    });
  }, [pathname]);

  return null; // المكون ده مش بيرندر أي حاجة في الـ UI، هو شغال في الخلفية بس
}