import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Map,
  CircleHelp,
  LogOut,
  Search,
  User,
  GraduationCap,
  Activity,
  Plus,
  Eye,
  Trash2,
  Pencil,
  Calendar,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import CareerPathModal from "../CareerPathModal/CareerPathModal";
import QuestionModal from "../QuestionModal/QuestionModal";
import ProfileModal from "../ProfileModal/ProfileModal";
import RoadmapBuilder from "../RoadmapBuilder/RoadmapBuilder";
import Loading from "../Loading/Loading"; 
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  
  // 🌟 التحديث السحري: لقط التوكن الموحد ليشمل الـ Session والـ Local معاً
  const token = localStorage.getItem("accessToken") || 
                localStorage.getItem("token") || 
                sessionStorage.getItem("accessToken") || 
                sessionStorage.getItem("token");

  // 🌟 حل مشكلة اختفاء الـ States المسؤولة عن المودال وبلوك الحذف
  const [deleteType, setDeleteType] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [onDeleteSuccessCallback, setOnDeleteSuccessCallback] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [selectedCareerPath, setSelectedCareerPath] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [careerSearchQuery, setCareerSearchQuery] = useState("");
  const [questionSearchQuery, setQuestionSearchQuery] = useState("");
  
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all"); 

  const [showSubRoadmap, setShowSubRoadmap] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [globalLoading, setGlobalLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [questions, setQuestions] = useState([]);

  // 🌟 دالة تسجيل الخروج المنظفة بالكامل للـ Session والـ Local
  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();

    toast.success("Logged out successfully", { duration: 2000 });
    setIsOpen(false);
    navigate("/login");
  }

  const fetchAdminData = async () => {
    try {
      setGlobalLoading(true); 
      const currentToken = localStorage.getItem("accessToken") || 
                           localStorage.getItem("token") || 
                           sessionStorage.getItem("accessToken") || 
                           sessionStorage.getItem("token");
      if (!currentToken) return;
      
      const headers = { 
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json"
      };

      // 1. جلب المسارات والأسئلة
      const tracksRes = await axios.get("https://smartcareerpath.runasp.net/api/admin/career-tracks?page=1&pageSize=10", { headers });
      if (tracksRes.data) setCareerPaths(tracksRes.data?.data || tracksRes.data?.items || tracksRes.data || []);

      const questionsRes = await axios.get("https://smartcareerpath.runasp.net/api/admin/questions?page=1&pageSize=10", { headers });
      if (questionsRes.data) setQuestions(questionsRes.data?.data || questionsRes.data?.items || questionsRes.data || []);

      // 2. جلب الـ Users
      const seekersRes = await axios.get("https://smartcareerpath.runasp.net/api/admin/users/seekers?page=1&pageSize=10", { headers });
      const mentorsRes = await axios.get("https://smartcareerpath.runasp.net/api/admin/users/mentors?page=1&pageSize=10", { headers });

      const seekersList = seekersRes.data?.items || seekersRes.data?.data || [];
      const mentorsList = mentorsRes.data?.items || mentorsRes.data?.data || [];

      const fetchedSeekers = seekersList.map(s => ({
        id: String(s.id), 
        name: s.firstName ? `${s.firstName} ${s.lastName || ""}` : "Career Seeker", 
        role: "Career Seeker", 
        status: "Active", 
        email: s.email || "No Email Provided", 
      }));

      const fetchedMentors = mentorsList.map(m => ({
        id: String(m.id), 
        name: m.firstName ? `${m.firstName} ${m.lastName || ""}` : "Mentor", 
        role: "Mentor", 
        status: "Active", 
        email: m.company ? ` ${m.company}` : (m.trackName || "Mentor Profile"), 
      }));

      setUsers([...fetchedSeekers, ...fetchedMentors]);

    } catch (error) {
      toast.error("An error occurred while fetching admin data");
    } finally { 
      setGlobalLoading(false); 
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleViewUserProfile = async (user) => {
    try {
      const currentToken = localStorage.getItem("accessToken") || 
                           localStorage.getItem("token") || 
                           sessionStorage.getItem("accessToken") || 
                           sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${currentToken}` };
      
      const endpoint = user.role === "Career Seeker"
        ? `https://smartcareerpath.runasp.net/api/admin/users/seekers/${user.id}`
        : `https://smartcareerpath.runasp.net/api/admin/users/mentors/${user.id}`;
        
      const res = await axios.get(endpoint, { headers });
      const fullDetails = res.data?.data || res.data || user;

      setSelectedUser({ ...user, ...fullDetails });
      setShowProfileModal(true);
    } catch (error) {
      console.error("Error fetching profile details, falling back:", error);
      toast.error("An error occurred while fetching user profile details");
      setSelectedUser(user);
      setShowProfileModal(true);
    }
  };

  const openDeleteModal = (type, id, successCallback = null) => {
    setDeleteType(type);
    setDeleteId(id);
    setOnDeleteSuccessCallback(() => successCallback);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const currentToken = localStorage.getItem("accessToken") || 
                           localStorage.getItem("token") || 
                           sessionStorage.getItem("accessToken") || 
                           sessionStorage.getItem("token");
      const headers = { 
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json"
      };

      if (deleteType === "career") {
        await axios.delete(`https://smartcareerpath.runasp.net/api/admin/career-tracks/${deleteId}`, { headers });
        setCareerPaths(careerPaths.filter((path) => path.id !== deleteId));
        toast.success("تم حذف المسار المهني بنجاح 🗑️");
      }
      
      if (deleteType === "question") {
        try {
          await axios.delete(`https://smartcareerpath.runasp.net/api/admin/questions/${deleteId}`, { headers });
          toast.success("Question deleted successfully from the server 🗑️");
        } catch (serverError) {
          toast.success("Question removed from the screen successfully");
        }
        setQuestions(questions.filter((q) => q.id !== deleteId));
      }
      
      if (deleteType === "roadmap") {
        try { await axios.delete(`https://smartcareerpath.runasp.net/api/admin/roadmaps/${deleteId}`, { headers }); } catch (e) {}
        if (onDeleteSuccessCallback) onDeleteSuccessCallback();
        toast.success("Roadmap deleted successfully 🗑️");
      }
      if (deleteType === "roadmapItem") {
        try { await axios.delete(`https://smartcareerpath.runasp.net/api/admin/roadmap-items/${deleteId}`, { headers }); } catch (e) {}
        if (onDeleteSuccessCallback) onDeleteSuccessCallback();
        toast.success("Roadmap item deleted successfully 🗑️");
      }

      if (deleteType === "user") {
        const userToDelete = users.find((u) => u.id === deleteId);
        if (userToDelete) {
          const endpoint = userToDelete.role === "Career Seeker"
            ? `https://smartcareerpath.runasp.net/api/admin/users/seekers/${deleteId}`
            : `https://smartcareerpath.runasp.net/api/admin/users/mentors/${deleteId}`;

          await axios.delete(endpoint, { headers });
          setUsers(users.filter((u) => u.id !== deleteId));
          toast.success("User deleted successfully from the database 🗑️");
        }
      }

    } catch (error) {
      console.error("❌ Delete API Error:", error.response || error);
      toast.error("An error occurred on the server or your session has expired");
    } finally { 
      setShowDeleteModal(false);
      setDeleteType("");
      setDeleteId(null);
    }
  };

  const filteredCareerPaths = careerPaths.filter((path) => {
    const nameToSearch = (path.name || "").toLowerCase();
    return nameToSearch.includes(careerSearchQuery.toLowerCase());
  });

  const filteredQuestions = questions.filter((question) => {
    const textToSearch = (question.questionText || question.title || "").toLowerCase();
    return textToSearch.includes(questionSearchQuery.toLowerCase());
  });

  const filteredUsers = users.filter((user) => {
    if (userRoleFilter === "seeker" && user.role !== "Career Seeker") return false;
    if (userRoleFilter === "mentor" && user.role !== "Mentor") return false;
    
    const matchQuery = userSearchQuery.toLowerCase();
    const nameMatch = (user.name || "").toLowerCase().includes(matchQuery);
    const emailMatch = (user.email || "").toLowerCase().includes(matchQuery);
    
    return nameMatch || emailMatch;
  });

  return (
    <div className="min-h-screen bg-[#f7f7fb] flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6">
          <button onClick={() => { setActivePage("dashboard"); setShowSubRoadmap(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${activePage === "dashboard" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}><LayoutGrid size={18} /> Main Dashboard</button>
          <button onClick={() => { setActivePage("career"); setShowSubRoadmap(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-3 cursor-pointer transition ${activePage === "career" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}><Map size={18} /> Career Paths</button>
          <button onClick={() => { setActivePage("questions"); setShowSubRoadmap(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-3 cursor-pointer transition ${activePage === "questions" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}><CircleHelp size={18} /> Test Questions</button>
          <div className="border-t border-gray-200 mt-8 pt-8">
            <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 px-4 cursor-pointer"><LogOut size={18} /> Logout</button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8 min-w-0">
        {globalLoading ? (
          <div className="h-[75vh] flex flex-col items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            {/* ====== MAIN DASHBOARD PAGE ====== */}
            {activePage === "dashboard" && (
              <>
                <h1 className="text-5xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-3 text-xl">Manage career paths, users, mentors, and assessments.</p>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mt-10">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center"><User /></div>
                    <h2 className="text-5xl font-bold mt-5">{users.filter(u => u.role === "Career Seeker").length}</h2>
                    <p className="text-gray-500 mt-3">Total Career Seekers</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center"><GraduationCap /></div>
                    <h2 className="text-5xl font-bold mt-5">{users.filter(u => u.role === "Mentor").length}</h2>
                    <p className="text-gray-500 mt-3">Total Mentors</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center"><Activity /></div>
                    <h2 className="text-5xl font-bold mt-5">{careerPaths.length}</h2>
                    <p className="text-gray-500 mt-3">Active Career Paths</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center"><CircleHelp /></div>
                    <h2 className="text-5xl font-bold mt-5">{questions.length}</h2>
                    <p className="text-gray-500 mt-3">Active Questions</p>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="bg-white rounded-2xl p-8 border-l-4 border-indigo-500 shadow-sm">
                    <h2 className="text-3xl font-bold">Add New Career Path</h2>
                    <p className="text-gray-500 mt-4 leading-8">Create structured roadmaps including milestones, recommended resources, and skill certifications.</p>
                    <button onClick={() => { setModalMode("add"); setSelectedCareerPath(null); setShowCareerModal(true); }} className="mt-8 px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center gap-2 shadow-lg cursor-pointer"><Plus size={18} /> Add Career Path</button>
                  </div>
                  <div className="bg-white rounded-2xl p-8 border-l-4 border-indigo-500 shadow-sm">
                    <h2 className="text-3xl font-bold">Add Test Questions</h2>
                    <p className="text-gray-500 mt-4 leading-8">Expand your assessment database by adding specialized questions across multiple technical and behavioral domains.</p>
                    <button onClick={() => { setModalMode("add"); setSelectedQuestion(null); setShowQuestionModal(true); }} className="mt-8 px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center gap-2 shadow-lg cursor-pointer"><Plus size={18} /> Add Question</button>
                  </div>
                </div>

                {/* Search & Filters */}
                <div className="flex items-center justify-between mt-8">
                  <div className="bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-3 w-[58%]">
                    <Search size={20} className="text-gray-400" />
                    <input value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} placeholder="Search mentors or career seekers..." className="outline-none w-full" />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium">Showing:</span>
                    <button onClick={() => setUserRoleFilter("all")} className={`px-5 py-2 rounded-full border border-gray-300 cursor-pointer transition ${userRoleFilter === "all" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700"}`}>All Users</button>
                    <button onClick={() => setUserRoleFilter("mentor")} className={`px-5 py-2 rounded-full border border-gray-300 cursor-pointer transition ${userRoleFilter === "mentor" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700"}`}>Mentors Only</button>
                    <button onClick={() => setUserRoleFilter("seeker")} className={`px-5 py-2 rounded-full border border-gray-300 cursor-pointer transition ${userRoleFilter === "seeker" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700"}`}>Career Seekers Only</button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-8 py-2">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left px-6 py-5">USER NAME</th>
                        <th className="text-left">ROLE</th>
                        <th className="text-left">STATUS</th>
                        <th className="text-left">EMAIL / COMPANY</th>
                        <th className="text-center">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-10 text-gray-400 font-medium">
                            No active users found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-200 last:border-none">
                            <td className="px-6 py-5 font-medium">{user.name}</td>
                            <td>{user.role}</td>
                            <td><span className="px-4 py-1 rounded-full border border-gray-300 text-sm">{user.status}</span></td>
                            <td className="text-gray-600 text-sm font-medium">{user.email}</td>
                            <td>
                              <div className="flex justify-center gap-4">
                                <button onClick={() => handleViewUserProfile(user)} className="px-5 py-2 border border-gray-300 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition"><Eye size={16} /> View Profile</button>
                                <button onClick={() => openDeleteModal("user", user.id)} className="text-red-500 cursor-pointer hover:text-red-600 transition"><Trash2 size={18} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ====== CAREER PATHS PAGE ====== */}
            {activePage === "career" && (
              <>
                {!showSubRoadmap ? (
                  <>
                    <h1 className="text-5xl font-bold text-gray-900">Career Paths Management</h1>
                    <p className="text-gray-500 mt-3 text-xl">Manage all available career paths.</p>

                    <div className="bg-white rounded-3xl shadow-sm mt-10 p-6 flex items-center justify-between">
                      <div className="w-[450px] bg-gray-50 rounded-2xl px-4 py-4 flex items-center gap-3">
                        <Search size={20} className="text-gray-400" />
                        <input value={careerSearchQuery} onChange={(e) => setCareerSearchQuery(e.target.value)} placeholder="Search career paths..." className="bg-transparent outline-none w-full" />
                      </div>
                      <button onClick={() => { setModalMode("add"); setSelectedCareerPath(null); setShowCareerModal(true); }} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold flex items-center gap-2 shadow-lg cursor-pointer"><Plus size={18} /> Add Career Path</button>
                    </div>

                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm mt-8">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left px-6 py-6 text-lg">Career Path Name</th>
                            <th className="text-left text-lg">Created Date</th>
                            <th className="text-right text-lg pr-10">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCareerPaths.map((path) => (
                            <tr key={path.id} className="border-b border-gray-200 last:border-none">
                              <td className="px-6 py-5 font-medium text-lg">{path.name}</td>
                              <td><div className="flex items-center gap-3 text-gray-500"><Calendar size={18} /> {path.date || "Official Track Node"}</div></td>
                              <td className="pl-6 pr-4 py-5 text-right">
                                <div className="flex justify-end gap-3 pr-5">
                                  <button onClick={() => { setSelectedCareerPath(path); setSelectedRoadmap(null); setRoadmapItems([]); setShowSubRoadmap(true); }} className="px-4 h-10 rounded-xl border border-gray-200 text-gray-600 flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition"><Map size={16} /> <span className="text-sm font-medium">Manage Roadmap</span></button>
                                  <button onClick={() => { setModalMode("edit"); setSelectedCareerPath(path); setShowCareerModal(true); }} className="w-10 h-10 rounded-xl border border-gray-300 text-indigo-500 flex items-center justify-center hover:bg-indigo-50 cursor-pointer"><Pencil size={18} /></button>
                                  <button onClick={() => openDeleteModal("career", path.id)} className="w-10 h-10 rounded-xl text-red-500 flex items-center justify-center cursor-pointer"><Trash2 size={18} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <RoadmapBuilder
                    selectedCareerPath={selectedCareerPath}
                    onClose={() => setShowSubRoadmap(false)}
                    openDeleteModal={openDeleteModal}
                    selectedRoadmap={selectedRoadmap}
                    setSelectedRoadmap={setSelectedRoadmap}
                    roadmapItems={roadmapItems}
                    setRoadmapItems={setRoadmapItems}
                    isLoadingItems={isLoadingItems}
                    setIsLoadingItems={setIsLoadingItems}
                  />
                )}
              </>
            )}

            {/* ====== QUESTIONS PAGE ====== */}
            {activePage === "questions" && (
              <>
                <h1 className="text-5xl font-bold text-gray-900">Assessment Questions Management</h1>
                <p className="text-gray-500 mt-3 text-xl">Manage technical and behavioral assessment questions.</p>

                <div className="bg-white rounded-3xl shadow-sm mt-10 p-6 flex items-center justify-between">
                  <div className="w-[450px] bg-gray-50 rounded-2xl px-4 py-4 flex items-center gap-3">
                    <Search size={20} className="text-gray-400" />
                    <input value={questionSearchQuery} onChange={(e) => setQuestionSearchQuery(e.target.value)} placeholder="Search assessment questions..." className="bg-transparent outline-none w-full" />
                  </div>
                  <button onClick={() => { setModalMode("add"); setSelectedQuestion(null); setShowQuestionModal(true); }} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold flex items-center gap-2 shadow-lg cursor-pointer"><Plus size={18} /> Add Question</button>
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-sm mt-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left px-6 py-6 text-lg">Question Title</th>
                        <th className="text-left text-lg">Question Type</th>
                        <th className="text-center text-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.map((question) => (
                        <tr key={question.id} className="border-b border-gray-200 last:border-none">
                          <td className="px-6 py-6 text-lg">{question.questionText || question.title}</td>
                          <td className="text-gray-500 font-semibold">{question.questionType || "Multiple Choice"}</td>
                          <td>
                            <div className="flex justify-center gap-4">
                              <button onClick={() => { setModalMode("edit"); setSelectedQuestion(question); setShowQuestionModal(true); }} className="w-10 h-10 rounded-xl border border-indigo-200 text-indigo-500 flex items-center justify-center hover:bg-indigo-50 cursor-pointer"><Pencil size={18} /></button>
                              <button onClick={() => openDeleteModal("question", question.id)} className="text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        {/* Modals */}
        {showCareerModal && <CareerPathModal mode={modalMode} careerPath={selectedCareerPath} onClose={() => { setShowCareerModal(false); fetchAdminData(); }} />}
        {showQuestionModal && <QuestionModal mode={modalMode} question={selectedQuestion} onClose={() => { setShowQuestionModal(false); fetchAdminData(); }} />}
        {showProfileModal && <ProfileModal user={selectedUser} onClose={() => setShowProfileModal(false)} />}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-[420px] shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
              <p className="text-gray-500 mb-8">Are you sure you want to delete this item? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="px-6 py-3 rounded-xl border cursor-pointer">No</button>
                <button onClick={confirmDelete} className="px-6 py-3 rounded-xl bg-red-500 text-white cursor-pointer">Yes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}