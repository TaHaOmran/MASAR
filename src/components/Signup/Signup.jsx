import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import SearchableSelect from "../Common/SearchableSelect";
import { FadeLoader } from "react-spinners"; // 🌟 استيراد اللودر البنفسجي الموحد لموقعك

import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Building2,
  FileText,
  Phone,
} from "lucide-react";

import logo from "../../assets/logo.png";
import InputBlock from "../Common/InputBlock";

// استايل مخصص لتوسيط وتقزيم الـ FadeLoader جوه زرار التسجيل بالملي
const override = {
  display: "inline-block",
  margin: "0 auto",
  transform: "scale(0.35)",
  height: "10px",
  width: "10px"
};

export default function Signup() {
  const [role, setRole] = useState("seeker");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    formik.resetForm();
  };

  const tracks = [
    { id: 12, name: "Artificial Intelligence" },
    { id: 13, name: "Data Science" },
    { id: 14, name: "Development" },
    { id: 15, name: "Security" },
    { id: 16, name: "Software Development and Engineering" },
    { id: 17, name: "User Experience (UX) and UI Design" },
  ];

  const jobs = [
    { id: 1, name: "Student" },
    { id: 2, name: "Fresh Graduate" },
    { id: 3, name: "Junior Developer" },
    { id: 4, name: "Mid-Level Developer" },
    { id: 5, name: "Senior Developer" },
    { id: 6, name: "Data Analyst" },
    { id: 7, name: "UX Designer" },
    { id: 8, name: "Product Manager" },
    { id: 9, name: "DevOps Engineer" },
    { id: 10, name: "Cybersecurity Analyst" },
  ];

  function validateForm(values) {
    let errors = {};

    if (!values.firstName || values.firstName.trim().length < 3)
      errors.firstName = "First name must be at least 3 characters";

    if (!values.lastName || values.lastName.trim().length < 3)
      errors.lastName = "Last name must be at least 3 characters";

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Please enter a valid email (e.g., name@example.com)";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else {
      if (/[\u0600-\u06FF]/.test(values.password)) {
        errors.password = "Password must be in English characters";
      } 
      else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      } 
      else if (!/[A-Z]/.test(values.password)) {
        errors.password = "Must contain at least one uppercase letter (Ex: A, B, C...)";
      } 
      else if (!/[a-z]/.test(values.password)) {
        errors.password = "Must contain at least one lowercase letter (Ex: a, b, c...)";
      } 
      else if (!/[0-9]/.test(values.password)) {
        errors.password = "Must contain at least one number (Ex: 1, 2, 3...)";
      } 
      else if (!/[^a-zA-Z0-9]/.test(values.password)) {
        errors.password = "Must contain at least one special character (Ex: @, #, $, %, !...)";
      }
    }

    if (!values.linkedIn)
      errors.linkedIn = "LinkedIn is required";

    if (!values.phone) {
      errors.phone = "Phone number is required";
    } else if (values.phone.trim().length > 11) {
      errors.phone = "Phone number must not exceed 11 digits";
    }

    if (!values.currentJobId)
      errors.currentJobId = "Select job";

    if (role === "mentor") {
      if (!values.yearsOfExperience)
        errors.yearsOfExperience = "Required";

      if (!values.company)
        errors.company = "Required";

      if (!values.description)
        errors.description = "Required";

      if (!values.trackId)
        errors.trackId = "Select track";
    }

    return errors;
  }

  async function registerUser(values) {
    const endpoint =
      role === "mentor"
        ? "https://smartcareerpath.runasp.net/api/auth/register/mentor"
        : "https://smartcareerpath.runasp.net/api/auth/register/seeker";

    const payload =
      role === "mentor"
        ? {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            password: values.password,
            yearsOfExperience: Number(values.yearsOfExperience),
            company: values.company,
            phone: values.phone.trim(),
            description: values.description,
            linkedIn: values.linkedIn,
            currentJobId: Number(values.currentJobId),
            trackId: Number(values.trackId),
          }
        : {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            password: values.password,
            linkedIn: values.linkedIn,
            currentJobId: values.currentJobId ? Number(values.currentJobId) : null,
            phone: values.phone.trim(),
          };

    return await axios.post(endpoint, payload);
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      linkedIn: "",
      phone: "",
      currentJobId: "",
      yearsOfExperience: "",
      company: "",
      description: "",
      trackId: "",
    },
    validate: validateForm,
    validateOnMount: true,

    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await registerUser(values);
        const data = response.data;
        const token = data.accessToken || data.token;

        if (token) {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("token", token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("role", data.role);
        }

        toast.success("Welcome to Masar 🎉", { duration: 2000 });
        formik.resetForm();
        navigate("/home");

      } catch (error) {
        console.error("❌ SERVER 500 ERROR DETAILS:", error.response?.data);
        const serverMessage = error.response?.data?.message || error.response?.data?.error || "Internal Server Error (500)";
        toast.error(`سيرفر: ${serverMessage}`);
      } finally { // 🌟 دبل ll محكمة وسليمة
        setLoading(false);
      }
    },
  });

  const isDisabled =
    loading ||
    !formik.values.firstName ||
    !formik.values.lastName ||
    !formik.values.email ||
    !formik.values.password ||
    !formik.values.linkedIn ||
    !formik.values.phone ||
    !formik.values.currentJobId ||
    (role === "mentor" &&
      (
        !formik.values.yearsOfExperience ||
        !formik.values.company ||
        !formik.values.description ||
        !formik.values.trackId
      ));

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col items-center justify-center">

      <Link to="/">
        <img src={logo} className="w-[170px] mb-8 mt-8" />
      </Link>

      <div className="bg-white w-[500px] rounded-3xl shadow-xl p-8 mb-12">
        <form onSubmit={formik.handleSubmit}>
          <h1 className="text-center text-2xl font-bold mb-6">
            Create Your Account
          </h1>
          <p className="text-center text-sm text-gray-500 mt-2 mb-6">
            Join the Masar ecosystem and unlock tailored
            career guidance from industry leaders.
          </p>
          
          {/* ROLE */}
          <div className="flex mb-5 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleChange("seeker")}
              className={`flex-1 p-2 rounded-lg text-sm font-semibold transition ${
                role === "seeker" ? "bg-[#5D5CEE] text-white shadow-sm" : "text-gray-600"
              }`}
            >
              Career Seeker
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("mentor")}
              className={`flex-1 p-2 rounded-lg text-sm font-semibold transition ${
                role === "mentor" ? "bg-[#5D5CEE] text-white shadow-sm" : "text-gray-600"
              }`}
            >
              Mentor
            </button>
          </div>

          {/* NAME */}
          <div className="flex gap-3">
            <InputBlock
              label="First Name"
              icon={User}
              name="firstName"
              placeholder="Enter first name"
              formik={formik}
            />

            <InputBlock
              label="Last Name"
              icon={User}
              name="lastName"
              placeholder="Enter last name"
              formik={formik}
            />
          </div>

          {/* EMAIL */}
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

          {/* LINKEDIN */}
          <InputBlock
            label="LinkedIn"
            icon={Mail} 
            name="linkedIn"
            placeholder="LinkedIn profile"
            formik={formik}
          />

          {/* PHONE NUMBER */}
          <InputBlock
            label="Phone Number"
            icon={Phone}
            name="phone"
            placeholder="Enter your phone number"
            formik={formik}
            maxLength={11}
          />
          
          {/* CURRENT JOB */}
          <SearchableSelect
            label="Current Job"
            icon={GraduationCap}
            name="currentJobId"
            options={jobs}
            formik={formik}
            placeholder="Search your current job..."
          />

          {/* MENTOR FIELDS */}
          {role === "mentor" && (
            <>
              <InputBlock
                label="Years of Experience"
                name="yearsOfExperience"
                icon={GraduationCap}
                placeholder="Enter your years of experience"
                formik={formik}
              />

              <InputBlock
                label="Company"
                name="company"
                icon={Building2}
                placeholder="Enter your company name"
                formik={formik}
              />

              <InputBlock
                label="Description"
                name="description"
                icon={FileText}
                placeholder="Tell us about your experience and expertise"
                formik={formik}
              />

              {/* TRACK */}
              <SearchableSelect
                label="Track"
                icon={GraduationCap}
                name="trackId"
                options={tracks}
                formik={formik}
                placeholder="Search track..."
              />
            </>
          )}
          
          {/* 🌟 حقن الـ FadeLoader الموحد السحري جوه زرار الإرسال بشكل متناسق */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full h-12 rounded-xl text-white font-semibold transition-all mt-6 flex items-center justify-center overflow-hidden ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-[#5D5CEE] to-[#3A64ED] hover:shadow-lg cursor-pointer"
            }`}
          >
            {loading ? (
              <div className="h-full flex items-center justify-center -mt-3.5">
                <FadeLoader color={'#ffffff'} cssOverride={override} />
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6 font-semibold">
          Already have an account ? {" "}
          <Link to="/login">
            <span className="text-indigo-500 cursor-pointer font-bold ml-2">
              Log in
            </span>
          </Link>
        </p>
      </div>  
    </div>
  );
}






// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useFormik } from "formik";
// import toast from "react-hot-toast";
// import SearchableSelect from "../Common/SearchableSelect";
// import { FadeLoader } from "react-spinners"; 

// import {
//   User,
//   Mail,
//   Lock,
//   GraduationCap,
//   Building2,
//   FileText,
//   Phone,
// } from "lucide-react";

// import logo from "../../assets/logo.png";
// import InputBlock from "../Common/InputBlock";

// const override = {
//   display: "inline-block",
//   margin: "0 auto",
//   transform: "scale(0.35)",
//   height: "10px",
//   width: "10px"
// };

// export default function Signup() {
//   const [role, setRole] = useState("seeker");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleRoleChange = (newRole) => {
//     setRole(newRole);
//     formik.resetForm();
//   };

//   const tracks = [
//     { id: 12, name: "Artificial Intelligence" },
//     { id: 13, name: "Data Science" },
//     { id: 14, name: "Development" },
//     { id: 15, name: "Security" },
//     { id: 16, name: "Software Development and Engineering" },
//     { id: 17, name: "User Experience (UX) and UI Design" },
//   ];

//   const jobs = [
//     { id: 1, name: "Student" },
//     { id: 2, name: "Fresh Graduate" },
//     { id: 3, name: "Junior Developer" },
//     { id: 4, name: "Mid-Level Developer" },
//     { id: 5, name: "Senior Developer" },
//     { id: 6, name: "Data Analyst" },
//     { id: 7, name: "UX Designer" },
//     { id: 8, name: "Product Manager" },
//     { id: 9, name: "DevOps Engineer" },
//     { id: 10, name: "Cybersecurity Analyst" },
//   ];

//   function validateForm(values) {
//     let errors = {};

//     if (!values.firstName || values.firstName.trim().length < 3)
//       errors.firstName = "First name must be at least 3 characters";

//     if (!values.lastName || values.lastName.trim().length < 3)
//       errors.lastName = "Last name must be at least 3 characters";

//     if (!values.email) {
//       errors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
//       errors.email = "Please enter a valid email (e.g., name@example.com)";
//     }

//     if (!values.password) {
//       errors.password = "Password is required";
//     } else {
//       if (/[\u0600-\u06FF]/.test(values.password)) {
//         errors.password = "Password must be in English characters";
//       } 
//       else if (values.password.length < 8) {
//         errors.password = "Password must be at least 8 characters long";
//       } 
//       else if (!/[A-Z]/.test(values.password)) {
//         errors.password = "Must contain at least one uppercase letter (Ex: A, B, C...)";
//       } 
//       else if (!/[a-z]/.test(values.password)) {
//         errors.password = "Must contain at least one lowercase letter (Ex: a, b, c...)";
//       } 
//       else if (!/[0-9]/.test(values.password)) {
//         errors.password = "Must contain at least one number (Ex: 1, 2, 3...)";
//       } 
//       else if (!/[^a-zA-Z0-9]/.test(values.password)) {
//         errors.password = "Must contain at least one special character (Ex: @, #, $, %, !...)";
//       }
//     }

//     if (!values.linkedIn)
//       errors.linkedIn = "LinkedIn is required";

//     if (!values.phone) {
//       errors.phone = "Phone number is required";
//     } else if (values.phone.trim().length > 11) {
//       errors.phone = "Phone number must not exceed 11 digits";
//     }

//     if (!values.currentJobId)
//       errors.currentJobId = "Select job";

//     if (role === "mentor") {
//       if (!values.yearsOfExperience)
//         errors.yearsOfExperience = "Required";

//       if (!values.company)
//         errors.company = "Required";

//       if (!values.description)
//         errors.description = "Required";

//       if (!values.trackId)
//         errors.trackId = "Select track";
//     }

//     return errors;
//   }

//   async function registerUser(values) {
//     const endpoint =
//       role === "mentor"
//         ? "https://smartcareerpath.runasp.net/api/auth/register/mentor"
//         : "https://smartcareerpath.runasp.net/api/auth/register/seeker";

//     const payload =
//       role === "mentor"
//         ? {
//             firstName: values.firstName.trim(),
//             lastName: values.lastName.trim(),
//             email: values.email.trim(),
//             password: values.password,
//             yearsOfExperience: Number(values.yearsOfExperience),
//             company: values.company,
//             phone: values.phone.trim(),
//             description: values.description,
//             linkedIn: values.linkedIn,
//             currentJobId: Number(values.currentJobId),
//             trackId: Number(values.trackId),
//           }
//         : {
//             firstName: values.firstName.trim(),
//             lastName: values.lastName.trim(),
//             email: values.email.trim(),
//             password: values.password,
//             linkedIn: values.linkedIn,
//             currentJobId: values.currentJobId ? Number(values.currentJobId) : null,
//             phone: values.phone.trim(),
//           };

//     return await axios.post(endpoint, payload);
//   }

//   const formik = useFormik({
//     initialValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       linkedIn: "",
//       phone: "",
//       currentJobId: "",
//       yearsOfExperience: "",
//       company: "",
//       description: "",
//       trackId: "",
//     },
//     validate: validateForm,
//     validateOnMount: true,

//     onSubmit: async (values) => {
//       try {
//         setLoading(true);
//         const response = await registerUser(values);
//         console.log("API RESPONSE:", response.data);

//         // 🌟 تعديل الـ Flow: السيرفر بيبعت رسالة نجاح متبوعة بإيميل تفعيل، مش توكن حقيقي جاهز
//         // لذلك هننبه اليوزر يفتح الإيميل أولاً، ونوجهه لصفحة الـ Login لينتظر وصول التفعيل والضغط عليه
//         toast.success("Registration successful! Please check your email to activate your account 📩", { 
//           duration: 5000,
//           position: "top-center"
//         });
        
//         formik.resetForm();
//         navigate("/login");

//       } catch (error) {
//         console.error("❌ SERVER ERROR DETAILS:", error.response?.data);
//         const serverMessage = error.response?.data?.message || error.response?.data?.error || "Registration failed. Try again.";
//         toast.error(`سيرفر: ${serverMessage}`);
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   const isDisabled =
//     loading ||
//     !formik.values.firstName ||
//     !formik.values.lastName ||
//     !formik.values.email ||
//     !formik.values.password ||
//     !formik.values.linkedIn ||
//     !formik.values.phone ||
//     !formik.values.currentJobId ||
//     (role === "mentor" &&
//       (
//         !formik.values.yearsOfExperience ||
//         !formik.values.company ||
//         !formik.values.description ||
//         !formik.values.trackId
//       ));

//   return (
//     <div className="min-h-screen bg-[#f5f6f8] flex flex-col items-center justify-center py-12">

//       <Link to="/">
//         <img src={logo} className="w-[170px] mb-8" alt="Masar" />
//       </Link>

//       <div className="bg-white w-[500px] rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 animate-fadeIn">
//         <form onSubmit={formik.handleSubmit}>
//           <h1 className="text-center text-2xl font-extrabold text-gray-900 tracking-tight">
//             Create Your Account
//           </h1>
//           <p className="text-center text-sm text-gray-500 mt-2 mb-6 font-semibold">
//             Join the Masar ecosystem and unlock tailored career guidance from industry leaders.
//           </p>
          
//           {/* ROLE SWITCH BUTTONS - تم التحديث للبنفسجي الموحد الاحترافي لـ مسار */}
//           <div className="flex mb-6 bg-gray-100 p-1 rounded-xl">
//             <button
//               type="button"
//               onClick={() => handleRoleChange("seeker")}
//               className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
//                 role === "seeker" ? "bg-[#6366F1] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
//               }`}
//             >
//               Career Seeker
//             </button>

//             <button
//               type="button"
//               onClick={() => handleRoleChange("mentor")}
//               className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
//                 role === "mentor" ? "bg-[#6366F1] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
//               }`}
//             >
//               Mentor
//             </button>
//           </div>

//           {/* NAME */}
//           <div className="flex gap-3">
//             <InputBlock
//               label="First Name"
//               icon={User}
//               name="firstName"
//               placeholder="Enter first name"
//               formik={formik}
//             />

//             <InputBlock
//               label="Last Name"
//               icon={User}
//               name="lastName"
//               placeholder="Enter last name"
//               formik={formik}
//             />
//           </div>

//           {/* EMAIL */}
//           <InputBlock
//             label="Email"
//             icon={Mail}
//             name="email"
//             placeholder="Enter email"
//             formik={formik}
//           />

//           {/* PASSWORD */}
//           <InputBlock
//             label="Password"
//             icon={Lock}
//             name="password"
//             type="password"
//             placeholder="Enter password"
//             formik={formik}
//           />

//           {/* LINKEDIN */}
//           <InputBlock
//             label="LinkedIn Profile"
//             icon={User} 
//             name="linkedIn"
//             placeholder="e.g. https://linkedin.com/in/username"
//             formik={formik}
//           />

//           {/* PHONE NUMBER */}
//           <InputBlock
//             label="Phone Number"
//             icon={Phone}
//             name="phone"
//             placeholder="Enter your phone number"
//             formik={formik}
//             maxLength={11}
//           />
          
//           {/* CURRENT JOB */}
//           <SearchableSelect
//             label="Current Job Status"
//             icon={GraduationCap}
//             name="currentJobId"
//             options={jobs}
//             formik={formik}
//             placeholder="Search your current job..."
//           />

//           {/* MENTOR FIELDS */}
//           {role === "mentor" && (
//             <div className="animate-fadeIn space-y-1">
//               <InputBlock
//                 label="Years of Experience"
//                 name="yearsOfExperience"
//                 icon={GraduationCap}
//                 placeholder="Enter your years of experience"
//                 formik={formik}
//               />

//               <InputBlock
//                 label="Company / Organization"
//                 name="company"
//                 icon={Building2}
//                 placeholder="Enter your company name"
//                 formik={formik}
//               />

//               <InputBlock
//                 label="Professional Description"
//                 name="description"
//                 icon={FileText}
//                 placeholder="Tell us about your experience and expertise"
//                 formik={formik}
//               />

//               <SearchableSelect
//                 label="Professional Track Expertise"
//                 icon={GraduationCap}
//                 name="trackId"
//                 options={tracks}
//                 formik={formik}
//                 placeholder="Search track..."
//               />
//             </div>
//           )}
          
//           {/* SUBMIT BUTTON - تم التحديث للـ Gradient البنفسجي الموحد الجديد */}
//           <button
//             type="submit"
//             disabled={isDisabled}
//             className={`w-full h-12 rounded-xl text-white font-bold text-base transition-all mt-6 flex items-center justify-center overflow-hidden shadow-sm ${
//               isDisabled
//                 ? "bg-gray-300 cursor-not-allowed opacity-60"
//                 : "bg-gradient-to-r from-[#6366F1] to-[#5B5CEB] hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
//             }`}
//           >
//             {loading ? (
//               <div className="h-full flex items-center justify-center -mt-3.5">
//                 <FadeLoader color={'#ffffff'} cssOverride={override} />
//               </div>
//             ) : (
//               "Create Account"
//             )}
//           </button>
//         </form>

//         {/* Footer Link */}
//         <p className="text-center text-sm text-gray-500 mt-6 font-semibold">
//           Already have an account?{" "}
//           <Link to="/login">
//             <span className="text-[#6366F1] cursor-pointer font-bold ml-1 hover:underline">
//               Log in
//             </span>
//           </Link>
//         </p>
//       </div>  
//     </div>
//   );
// }