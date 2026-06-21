import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  BookOpen,
  LogOut,
  Camera,
  SquareCheck,
  Square,
  ExternalLink,
  Briefcase,
  Link as LinkIcon,
  CircleCheck,
  Loader2,
  Edit2,
  Check,
  Award,
  FileText,
  Layers,
  User,
  Phone 
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Iconuser from '../../assets/usericon.png';
import mentorIcon from '../../assets/mentoricon.png';

// 🌟 مصفوفة الوظائف الاحترافية الثابتة 
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

// 🌟 مصفوفة المسارات الاحترافية الثابتة المطلوبة
const tracks = [
  { id: 12, name: "Artificial Intelligence" },
  { id: 13, name: "Data Science" },
  { id: 14, name: "Development" },
  { id: 15, name: "Security" },
  { id: 16, name: "Software Development and Engineering" },
  { id: 17, name: "User Experience (UX) and UI Design" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("seeker"); 
  const [active, setActive] = useState("roadmap");
  const [profileData, setProfileData] = useState(null);
  const [roadmapItems, setRoadmapItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(Iconuser); // الصورة الافتراضية للمستخدم العادي ملهاش لازمه ممكن امسحها
  const [imageError, setImageError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState({
    firstName: "",
    lastName: "",
    linkedIn: "",
    phone: "", 
    company: "",
    description: "",
    yearsOfExperience: 0,
    currentJobId: 1,
    trackId: 12 
  });
  const [isSaving, setIsSaving] = useState(false);

  async function getProfileAndData() {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
      const localRole = (localStorage.getItem("role") || sessionStorage.getItem("role"))?.toLowerCase(); 

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      if (localRole === "admin" || localRole === "administrator") {
        toast.success("Welcome to the Admin Dashboard 🛠️");
        navigate("/admin"); 
        return;
      }

      let fetchedData = null;
      let role = "seeker";

      try {
        const seekerRes = await axios.get(
          "https://smartcareerpath.runasp.net/api/seekers/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchedData = seekerRes.data;
        role = "seeker";
        setActive("roadmap"); 
      } catch (err) {
        console.log("Not a Seeker account, trying Mentor API...");
        
        try {
          const mentorRes = await axios.get(
            "https://smartcareerpath.runasp.net/api/mentors/me",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchedData = mentorRes.data;
          role = "mentor";
          setActive("settings"); 
        } catch (mentorErr) {
          if (localRole === "admin" || mentorErr.response?.status === 403) {
            toast.success("Transferring to the Admin Dashboard...");
            navigate("/admin"); 
            return;
          }
          throw mentorErr; 
        }
      }

      setUserRole(role);
      setProfileData(fetchedData);
      
      setEditState({
        firstName: fetchedData?.firstName || "",
        lastName: fetchedData?.lastName || "",
        linkedIn: fetchedData?.linkedIn || "",
        phone: fetchedData?.phone || "", 
        company: fetchedData?.company || "",
        description: fetchedData?.description || "",
        yearsOfExperience: Number(fetchedData?.yearsOfExperience) || 0,
        currentJobId: Number(fetchedData?.currentJobId) || 1,
        trackId: Number(fetchedData?.trackId) || 12
      });

      if (role === "seeker") {
        try {
          const currentTrackId = Number(localStorage.getItem("trackId")) || Number(sessionStorage.getItem("trackId")) || 12;
          console.log(`🎯 Fetching active roadmap for Track ID: ${currentTrackId}`);

          const roadmapRes = await axios.get(
            `https://smartcareerpath.runasp.net/api/seekers/me/roadmap/${currentTrackId}`, 
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setRoadmapItems(roadmapRes.data?.items || roadmapRes.data || []);
        } catch (err) {
          console.log("No active roadmap found for this user yet.", err);
        }
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to load personal account data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfileAndData();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
      
      const apiUrl = userRole === "mentor" 
        ? "https://smartcareerpath.runasp.net/api/mentors/me"
        : "https://smartcareerpath.runasp.net/api/seekers/me";

      let updatedBody = {};

      if (userRole === "mentor") {
        updatedBody = {
          firstName: editState.firstName.trim(),
          lastName: editState.lastName.trim(),
          yearsOfExperience: Number(editState.yearsOfExperience) || 0,
          description: editState.description.trim() || "Mentor Profile",
          company: editState.company.trim() || "Independent",
          linkedIn: editState.linkedIn.trim() || "https://linkedin.com",
          phone: editState.phone.trim() || "0000000000",
          currentJobId: Number(editState.currentJobId), 
          trackId: Number(editState.trackId)
        };
      } else {
        updatedBody = {
          firstName: editState.firstName.trim(),
          lastName: editState.lastName.trim(),
          linkedIn: editState.linkedIn.trim() || "https://linkedin.com", 
          phone: editState.phone.trim() || "0000000000",
          currentJobId: Number(editState.currentJobId) 
        };
      }

      await axios.put(apiUrl, updatedBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setProfileData((prev) => ({
        ...prev,
        ...editState,
        yearsOfExperience: Number(editState.yearsOfExperience),
        currentJobId: Number(editState.currentJobId),
        trackId: Number(editState.trackId)
      }));

      toast.success("Data updated successfully 🎉");
      setIsEditing(false);
    } catch (error) {
      console.error("PUT Error Full Response:", error.response?.data);
      const serverMessage = error.response?.data?.message || error.response?.data?.error || "Failed to save changes";
      toast.error(`Sorry: ${serverMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleItemStatus = async (itemId, currentStatus) => {
  try {
    const token = localStorage.getItem("accessToken") ||
                  localStorage.getItem("token") ||
                  sessionStorage.getItem("accessToken") ||
                  sessionStorage.getItem("token");

    if (!token) {
      toast.error("Invalid session, please login again");
      navigate("/login");
      return;
    }

    // هندلة الحالة الحالية بدقة (سواء كانت Boolean أو String)
    const isCurrentCompleted = currentStatus === true || currentStatus === "Completed" || currentStatus === "true";
    const nextStatus = !isCurrentCompleted; // ينتج true أو false

    const requestBody = {
      status: nextStatus
    };

    await axios.put(
      `https://smartcareerpath.runasp.net/api/seekers/me/roadmap/items/${itemId}/status`,
      requestBody,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    // 🌟 تحديث الـ State بالحقلين (status و done) عشان نضمن التوافق الكامل مع الـ JSX
    setRoadmapItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: nextStatus, done: nextStatus } : item))
    );
     
    toast.success("Status updated successfully 🎉");
  } catch (error) {
    console.error("❌ Error toggling status:", error.response || error);
    if (error.response && error.response.status === 401) {
      toast.error("Your session has expired, redirecting to login...");
      localStorage.clear();
      sessionStorage.clear();
      setTimeout(() => navigate("/login"), 2000);
    } else {
      toast.error(error.response|| "Failed to update status on the server");
    }
  }
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setImageError("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { setImageError("Maximum size is 5MB"); return; }
    setImageError("");
    setProfileImage(URL.createObjectURL(file));
    toast.success("Profile image changed successfully");
  };

  const handleLogout = () => {
    localStorage.clear(); 
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login"); 
  };

  const progressPercentage = roadmapItems.length > 0 
    ? Math.round((roadmapItems.filter((item) => item.status === "Completed" || item.done === true).length / roadmapItems.length) * 100)
    : 0;

  const matchedJob = jobs.find(j => j.id === Number(profileData?.currentJobId));
  const matchedTrack = tracks.find(t => t.id === Number(profileData?.trackId));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-20">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden pb-20">
        
        {/* Header */}
        <div className="bg-gray-300 p-6 pb-16 relative">
          <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-2 mx-4">User Profile Settings</h2>
          <p className="text-md text-gray-600 mx-4 font-medium">
            Manage your professional identity and workspace preferences.
          </p>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4 px-6 -mt-10 pb-4 border-b border-gray-200">
          <div className="relative">
            <img src={userRole === "mentor" ? mentorIcon : Iconuser} className="w-30 h-30 rounded-full border-4 border-white shadow-md object-cover" alt="Profile" />
            <label htmlFor="profileImageInput" className="absolute bottom-1 right-1 bg-indigo-500 p-1.5 rounded-full text-white cursor-pointer hover:bg-indigo-600 shadow">
              <Camera size={14} />
            </label>
            <input id="profileImageInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div>
            <h3 className="font-extrabold text-xl text-gray-900 mt-5">
              {profileData?.firstName} {profileData?.lastName}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 font-medium mt-1 uppercase tracking-wider">
              <Briefcase size={16} /> {userRole === "mentor" ? "Official Mentor Account" : "Job Seeker Track Account"}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex p-6 gap-6">
          {/* Sidebar */}
          <div className="w-72 bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200 flex-shrink-0">
            <div className="space-y-2">
              {userRole === "seeker" && (
                <button
                  onClick={() => setActive("roadmap")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    active === "roadmap" ? "bg-indigo-500 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen size={16} /> My Roadmaps
                </button>
              )}
              <button
                onClick={() => setActive("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  active === "settings" ? "bg-indigo-500 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Settings size={16} /> System Preferences
              </button>

              <div className="border-t border-gray-200 my-3"></div>

              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 text-sm font-medium hover:bg-red-50 rounded-lg transition">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            {/* ================= MY ROADMAPS ================= */}
            {active === "roadmap" && userRole === "seeker" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="bg-gray-100 rounded-full p-2"><CircleCheck className="text-indigo-500" /></div>
                      <h3 className="font-extrabold text-gray-800">Progress Dashboard</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-500">{progressPercentage}%</p>
                    <p className="text-xs text-gray-700 font-semibold tracking-widest">OVERALL PROGRESS</p>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-gray-100 rounded-full mb-8">
                  <div className="h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>

                <div className="bg-gray-100 rounded-xl border overflow-hidden border-gray-200">
                  <div className="grid grid-cols-[50px_minmax(0,1fr)_120px_56px] gap-x-6 px-4 py-3 text-xs text-black font-medium border-b border-gray-200">
                    <span>STATUS</span><span>Module Title</span><span>Duration</span><span className="text-right">Link</span>
                  </div>
                  {roadmapItems.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500 bg-white">No courses added yet.</div>
                  ) : (
                    roadmapItems.map((item, i) => {
                      // 🌟 الفحص الشامل والذكي: بيشوف لو القيمة true أو "Completed" عشان يعلم أو يشيل العلامة فوراً
                      const isItemChecked = item.status === true || item.status === "Completed" || item.done === true;

                      return (
                        <div key={item.id || i} className="grid grid-cols-[50px_minmax(0,1fr)_120px_56px] gap-x-6 px-4 py-4 border-t border-gray-200 bg-white items-center text-sm">
                          
                          {/* المربع (Checkbox) */}
                          <div className="cursor-pointer" onClick={() => toggleItemStatus(item.id, isItemChecked)}>
                            {isItemChecked ? (
                              <SquareCheck className="text-white bg-indigo-500 rounded" size={19} />
                            ) : (
                              <Square className="text-gray-400" size={19} />
                            )}
                          </div>
                          
                          {/* عنوان الموديول (Text) */}
                          <p className={`${isItemChecked ? "line-through text-gray-400" : "text-gray-800 font-medium"}`}>
                            {item.title || item.moduleTitle}
                          </p>
                          
                          <span className="text-gray-500 text-xs">{item.duration || "Flexible"}</span>
                          
                          <div className="flex justify-end">
                            <a href={item.link || item.url} target="_blank" rel="noreferrer" className="border border-gray-300 rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                              <ExternalLink size={14} />
                            </a>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ================= SYSTEM PREFERENCES ================= */}
            {active === "settings" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-2xl mb-1">System Preferences</h3>
                    <p className="text-sm text-gray-500">Adjust your account details and professional identity.</p>
                  </div>
                  
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 border border-indigo-200 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition cursor-pointer">
                      <Edit2 size={14} /> Edit Profile
                    </button>
                  ) : (
                    <button onClick={() => { setIsEditing(false); getProfileAndData(); }} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6">
                  <p className="text-xs text-gray-400 mb-4">IDENTITY & PROFESSIONAL CONTEXT</p>
                  
                  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-none">
                    <div className="flex items-center gap-3"><User size={18} className="text-indigo-500" /><span className="text-sm text-gray-600">First Name</span></div>
                    {isEditing ? <input type="text" value={editState.firstName} onChange={(e) => setEditState({ ...editState, firstName: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-800 w-64 outline-none bg-white" /> : <span className="text-sm text-gray-800 font-medium">{profileData?.firstName}</span>}
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-none">
                    <div className="flex items-center gap-3"><User size={18} className="text-indigo-500" /><span className="text-sm text-gray-600">Last Name</span></div>
                    {isEditing ? <input type="text" value={editState.lastName} onChange={(e) => setEditState({ ...editState, lastName: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-800 w-64 outline-none bg-white" /> : <span className="text-sm text-gray-800 font-medium">{profileData?.lastName}</span>}
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-none">
                    <div className="flex items-center gap-3"><LinkIcon size={18} className="text-indigo-500" /><span className="text-sm text-gray-600">LinkedIn Profile</span></div>
                    {isEditing ? <input type="text" value={editState.linkedIn} onChange={(e) => setEditState({ ...editState, linkedIn: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-800 w-64 outline-none bg-white" /> : <span className="text-sm text-gray-800 font-medium max-w-xs truncate">{profileData?.linkedIn || "No Link Added"}</span>}
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-none">
                    <div className="flex items-center gap-3"><Phone size={18} className="text-indigo-500" /><span className="text-sm text-gray-600">Phone Number</span></div>
                    {isEditing ? (
                      <input type="text" value={editState.phone} onChange={(e) => setEditState({ ...editState, phone: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-800 w-64 outline-none bg-white" placeholder="Enter phone number..." />
                    ) : (
                      <span className="text-sm text-gray-800 font-medium">{profileData?.phone || "No Phone Registered"}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-none">
                    <div className="flex items-center gap-3">
                      <Briefcase size={18} className="text-indigo-500" />
                      <span className="text-sm text-gray-600">Current Job</span>
                    </div>
                    {isEditing ? (
                      <select 
                        value={editState.currentJobId} 
                        onChange={(e) => setEditState({ ...editState, currentJobId: Number(e.target.value) })}
                        className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-800 w-64 outline-none bg-white cursor-pointer shadow-sm"
                      >
                        {jobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-800 font-semibold px-3 py-1 rounded-lg">
                        {matchedJob ? matchedJob.name : "Student"}
                      </span>
                    )}
                  </div>

                  {userRole === "mentor" && (
                    <>
                      <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-none">
                        <div className="flex items-center gap-3"><Briefcase size={18} className="text-indigo-500" /><span className="text-sm text-gray-600">Company</span></div>
                        {isEditing ? <input type="text" value={editState.company} onChange={(e) => setEditState({ ...editState, company: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-800 w-64 outline-none bg-white" /> : <span className="text-sm text-gray-800 font-medium">{profileData?.company || "Not Specified"}</span>}
                      </div>

                      <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-none">
                        <div className="flex items-center gap-3"><Award size={18} className="text-indigo-500" /><span className="text-sm text-gray-600">Years of Experience</span></div>
                        {isEditing ? <input type="number" value={editState.yearsOfExperience} onChange={(e) => setEditState({ ...editState, yearsOfExperience: e.target.value })} className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-800 w-64 outline-none bg-white" /> : <span className="text-sm text-gray-800 font-medium">{profileData?.yearsOfExperience || 0} Yrs</span>}
                      </div>

                      <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-none">
                        <div className="flex items-center gap-3">
                          <Layers size={18} className="text-indigo-500" />
                          <span className="text-sm text-gray-600">Track</span>
                        </div>
                        {isEditing ? (
                          <select 
                            value={editState.trackId} 
                            onChange={(e) => setEditState({ ...editState, trackId: Number(e.target.value) })}
                            className="border border-gray-300 rounded-xl px-3 py-1.5 text-sm text-gray-800 w-64 outline-none bg-white cursor-pointer shadow-sm"
                          >
                            {tracks.map((track) => (
                              <option key={track.id} value={track.id}>
                                {track.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm text-gray-800 font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-lg">
                            {matchedTrack ? matchedTrack.name : "Artificial Intelligence"}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 py-4 last:border-none text-left">
                        <div className="flex items-center gap-3"><FileText size={18} className="text-indigo-500" /><span className="text-sm text-gray-600">Professional Description</span></div>
                        {isEditing ? (
                          <textarea rows={3} value={editState.description} onChange={(e) => setEditState({ ...editState, description: e.target.value })} className="border border-gray-300 rounded-xl p-3 text-sm text-gray-800 w-full outline-none mt-1 resize-none bg-white" placeholder="Write a short bio about your expertise..." />
                        ) : (
                          <p className="text-sm text-gray-700 bg-gray-100 rounded-xl p-3 mt-1 font-medium italic">{profileData?.description || "No professional description added yet."}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {isEditing && (
                  <div className="mb-6 flex justify-end">
                    <button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md cursor-pointer transition disabled:opacity-50">
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Save Profile Updates
                    </button>
                  </div>
                )}

                <div className="border border-red-200 bg-red-50 rounded-xl p-5 flex justify-between items-center py-6">
                  <div>
                    <p className="text-red-600 font-bold">Danger Zone</p>
                    <p className="text-sm text-gray-500 mt-1">Permanently deactivate your account and wipe all personal data.</p>
                  </div>
                  <button className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer shadow-sm">Deactivate Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}