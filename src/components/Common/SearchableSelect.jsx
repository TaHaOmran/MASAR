import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function SearchableSelect({
  label,
  icon: Icon,
  name,
  options = [],
  formik,
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // الحصول على الكائن الحالي لو المستخدم اختار ID رقمي مخزن في فورميك
  const selectedOption = options.find(
    (opt) => Number(opt.id) === Number(formik.values[name])
  );

  // 🌟 جعل الـ SearchTerm يبدأ بالقيمة الحقيقية للفورميك (الاسم لو كان مختار، أو النص الحر لو كاتب بإيده)
  const [searchTerm, setSearchTerm] = useState(() => {
    const currentValue = formik.values[name];
    if (selectedOption) return selectedOption.name;
    if (currentValue && isNaN(currentValue)) return currentValue;
    return "";
  });

  // إغلاق القائمة لو ضغطت في أي مكان برة الكومبوننت
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // لتحديث النص الظاهر لو قيمة الفورميك تغيرت من برة أو عند الاختيار الأول
  useEffect(() => {
    const currentValue = formik.values[name];
    if (!currentValue) {
      setSearchTerm("");
    } else if (selectedOption) {
      setSearchTerm(selectedOption.name);
    } else if (isNaN(currentValue)) {
      setSearchTerm(currentValue); // الحفاظ على القيمة الحرة لو بيكتبها
    }
  }, [formik.values[name], selectedOption]);

  // فلترة الخيارات بناءً على كلام السيرش اللحظي
  const filteredOptions = options.filter((option) =>
    (option.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  // 🌟 دالة معالجة الكتابة الحرة المستقرة
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      formik.setFieldValue(name, null);
    } else {
      formik.setFieldValue(name, value);
    }
    formik.setFieldTouched(name, true, false);
  };

  const handleSelect = (option) => {
    formik.setFieldValue(name, option.id);
    formik.setFieldTouched(name, true, false); 
    setSearchTerm(option.name); 
    setIsOpen(false);
  };

  return (
    <div className="mb-5 text-left" ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
          {label}
        </label>
      )}

      <div className="relative">
        {/* البلوك الرئيسي الموحد */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 bg-gray-50 border ${
            formik.touched[name] && formik.errors[name]
              ? "border-red-500 ring-1 ring-red-100"
              : isOpen
              ? "border-[#6366F1] ring-1 ring-[#6366F1]/20 bg-white"
              : "border-gray-200"
          } rounded-xl px-4 py-3 cursor-pointer hover:border-gray-300 transition-all select-none h-[50px]`}
        >
          {Icon && <Icon className="w-5 h-5 text-gray-400 shrink-0" />}
          
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onClick={(e) => {
              e.stopPropagation(); 
              setIsOpen(true);
            }}
            placeholder={placeholder || "Select or type option..."}
            className="w-full text-sm outline-none bg-transparent text-gray-900 font-semibold placeholder-gray-400 cursor-text"
          />

          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* القائمة المنسدلة الذكية */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-150 rounded-xl shadow-2xl overflow-hidden max-h-60 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
            
            <div className="overflow-y-auto flex-1 json-scrollbar py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = Number(option.id) === Number(formik.values[name]);
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors text-left font-medium ${
                        isSelected
                          ? "bg-indigo-50 text-[#6366F1] font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.name}
                    </div>
                  );
                })
              ) : (
                /* زرار التأكيد الذكي للكتابة الحرة */
                <div 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3.5 text-sm text-[#6366F1] font-bold text-center bg-white hover:bg-indigo-50/50 cursor-pointer transition-colors border-t border-gray-50"
                >
                  Use custom value: "{searchTerm}" ✨
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* عرض الخطأ إن وجد */}
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-xs mt-1 font-semibold pl-2">
          {formik.errors[name]}
        </p>
      )}
    </div>
  );
}