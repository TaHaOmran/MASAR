import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import { 
  Phone, Video, Paperclip, Smile, Send, 
  MessageSquare, UserCheck, Check, X, Clock, ArrowDownLeft, ArrowUpRight 
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Loading from "../Loading/Loading"; // 🌟 استيراد كومبوننت الـ Loading البنفسجي الموحد
import { FadeLoader } from "react-spinners"; // لودر مصغر للتبويبات الجانبية
import mentorIcon from '../../assets/mentoricon.png';


const override = {
  display: "block",
  margin: "0 auto",
  transform: "scale(0.5)",
};

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  
  const [sidebarTab, setSidebarTab] = useState("chats"); 
  
  const [chatInfo, setChatInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [requests, setRequests] = useState([]); 
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const connectionRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true); 

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role") || "Seeker"; 
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // 1️⃣ جلب قائمة المحادثات
  const fetchMyChats = async () => {
    try {
      const res = await axios.get("https://smartcareerpath.runasp.net/api/chats?page=1&pageSize=20", config);
      setChatList(res.data?.items || []);
    } catch (err) {
      console.error("[Chat] Error loading chat list:", err);
    }
  };

  // 2️⃣ جلب طلبات الشات
  const fetchChatRequests = async () => {
    try {
      setLoadingRequests(true);
      const apiUrl = userRole.toLowerCase() === "mentor"
        ? "https://smartcareerpath.runasp.net/api/chat-requests/incoming?status=Pending&page=1&pageSize=20"
        : "https://smartcareerpath.runasp.net/api/chat-requests/outgoing?page=1&pageSize=20";

      const res = await axios.get(apiUrl, config);
      setRequests(res.data?.items || res.data || []);
    } catch (err) {
      console.error("[Requests] Error loading requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  // 3️⃣ تاريخ الرسايل القديمة
  const fetchChatHistory = async (id) => {
    try {
      setLoadingHistory(true);
      const res = await axios.get(`https://smartcareerpath.runasp.net/api/chats/${id}/messages?page=1&pageSize=20`, config);
      setChatInfo(res.data?.chat || null);
      setMessages(res.data?.messages?.items || []);
    } catch (err) {
      console.error("[Chat] Failed to fetch history:", err);
      if (err.response?.status === 403) {
        toast.error("You are not a participant in this chat!");
        navigate("/chats");
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  // 4️⃣ ربط وتفعيل اتصال الـ SignalR
  const connectToSignalRHub = async (id) => {
    try {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl("https://smartcareerpath.runasp.net/hubs/chat", {
          accessTokenFactory: () => localStorage.getItem("accessToken") || localStorage.getItem("token")
        })
        .withAutomaticReconnect()
        .build();

      conn.on("ReceiveMessage", (incomingMessage) => {
        setMessages((prev) => [...prev, incomingMessage]);
      });

      await conn.start();
      await conn.invoke("JoinChat", Number(id));
      connectionRef.current = conn;
    } catch (err) {
      console.error("[SignalR Connection Failed]:", err);
    }
  };

  // 5️⃣ قبول الطلب
  const handleAcceptRequest = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const res = await axios.put(`https://smartcareerpath.runasp.net/api/chat-requests/${requestId}/accept`, {}, config);
      toast.success("Request accepted! Opening workspace...");
      
      const newChatId = res.data?.chatId || res.data?.id;
      if (newChatId) {
        setSidebarTab("chats");
        fetchMyChats();
        navigate(`/chats/${newChatId}`);
      }
    } catch (err) {
      console.error("[Requests] Accept error:", err);
      toast.error("Failed to accept request");
    } finally {
      setActionLoadingId(null);
    }
  };

  // 6️⃣ رفض الطلب
  const handleDeclineRequest = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      await axios.put(`https://smartcareerpath.runasp.net/api/chat-requests/${requestId}/decline`, {}, config);
      toast.success("Request declined");
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("[Requests] Decline error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!chatId) return;

    if (!connectionRef.current || connectionRef.current.state !== "Connected") {
      toast.error("Connection is offline. Reconnecting...");
      if (chatId) connectToSignalRHub(chatId);
      return;
    }

    try {
      await connectionRef.current.invoke("SendMessage", Number(chatId), trimmed);
      setText(""); 
    } catch (err) {
      console.error("❌ [SignalR Hub] SendMessage Failed:", err);
      toast.error("Failed to deliver message");
    }
  };

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchMyChats();
    fetchChatRequests();

    if (chatId) {
      fetchChatHistory(chatId);
      connectToSignalRHub(chatId);
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.invoke("LeaveChat", Number(chatId))
          .then(() => connectionRef.current.stop());
      }
    };
  }, [chatId]);

  useEffect(() => {
    if (loadingHistory) {
      isInitialLoad.current = true;
      return;
    }
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingHistory]);

  const emojis = ["😀","😁","😄","😅","😂","😊","😍","👍","🙏","🎉","🚀","❤️"];
  const insertEmoji = (emoji) => { setText((t) => t + emoji); setShowEmoji(false); };
  const getChatPartnerName = (chat) => {
    return userRole.toLowerCase() === "mentor" ? chat.seekerName : chat.mentorName;
  };

  return (
    <div className="h-screen bg-gray-50 p-6 flex flex-col min-h-0">
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Sidebar */}
        <div className="w-85 bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-gray-100 shrink-0 min-h-0">
          
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4 shrink-0">
            <button 
              onClick={() => setSidebarTab("chats")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                sidebarTab === "chats" ? "bg-white text-[#6366F1] shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <MessageSquare size={14} /> Chats ({chatList.length})
            </button>
            <button 
              onClick={() => setSidebarTab("requests")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                sidebarTab === "requests" ? "bg-white text-[#6366F1] shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <UserCheck size={14} /> Requests ({requests.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 json-scrollbar pr-0.5">
            {sidebarTab === "chats" && (
              <>
                {chatList.map((c) => {
                  const isSelected = Number(c.id) === Number(chatId);
                  return (
                    <div
                      key={c.id}
                      onClick={() => navigate(`/chats/${c.id}`)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition text-left ${
                        isSelected ? "bg-indigo-50/70 border-l-4 border-[#6366F1]" : "hover:bg-gray-50"
                      }`}
                    >
                      <img src={mentorIcon} className="w-10 h-10 rounded-full bg-gray-100" alt="" />
                      <div className="min-w-0 flex-1">
                        <p className={`font-bold text-sm truncate ${isSelected ? "text-[#6366F1]" : "text-gray-900"}`}>
                          {getChatPartnerName(c)}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">Click to load live workspace</p>
                      </div>
                    </div>
                  );
                })}
                {chatList.length === 0 && <p className="text-xs text-gray-400 text-center py-6 font-medium">No active conversations.</p>}
              </>
            )}

            {sidebarTab === "requests" && (
              <div className="space-y-2">
                {loadingRequests ? (
                  <div className="text-center py-8"><FadeLoader color={'#6366F1'} cssOverride={override} /></div>
                ) : requests.map((req) => {
                  const isPending = req.status === "Pending";
                  return (
                    <div key={req.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col gap-2.5 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-xs text-gray-800 truncate">
                          {userRole.toLowerCase() === "mentor" ? req.seekerName : req.mentorName || "Professional Mentor"}
                        </p>
                        {userRole.toLowerCase() === "seeker" && (
                          <span className="text-[10px] bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{req.status}</span>
                        )}
                      </div>
                      
                      {userRole.toLowerCase() === "mentor" && isPending && (
                        <div className="flex gap-2 mt-1">
                          <button 
                            onClick={() => handleDeclineRequest(req.id)}
                            disabled={actionLoadingId !== null}
                            className="flex-1 h-8 rounded-lg bg-white border border-gray-200 text-red-500 text-[11px] font-bold hover:bg-red-50 flex items-center justify-center cursor-pointer transition"
                          >
                            <X size={12} className="mr-1" /> Decline
                          </button>
                          <button 
                            onClick={() => handleAcceptRequest(req.id)}
                            disabled={actionLoadingId !== null}
                            className="flex-1 h-8 rounded-lg bg-[#6366F1] text-white text-[11px] font-bold hover:opacity-95 flex items-center justify-center cursor-pointer shadow-sm transition"
                          >
                            <Check size={12} className="mr-1" /> Accept
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {requests.length === 0 && <p className="text-xs text-gray-400 text-center py-6 font-medium">No pending requests found.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Chat Workspace Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden border border-gray-100 min-h-0">
          {chatId ? (
            loadingHistory ? (
              /* 🌟 حقن لودر مسار البنفسجي الموحد الشيك في نص لوحة الشات */
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/40">
                <Loading />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shrink-0 shadow-sm text-left">
                  <div className="flex items-center gap-3">
                    <img src={mentorIcon} className="w-10 h-10 rounded-full" alt="" />
                    <div>
                      <p className="font-bold text-gray-900 text-base">{chatInfo ? getChatPartnerName(chatInfo) : "Workspace Chat"}</p>
                      <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block mt-0.5 w-fit">
                        SignalR Connected Live
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50/40 json-scrollbar">
                  {messages.map((msg) => {
                    const isMe = String(msg.senderId) === String(currentUserId) || msg.senderRole?.toLowerCase() === localStorage.getItem("role")?.toLowerCase();
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`max-w-md p-4 rounded-2xl text-sm font-medium shadow-sm ${
                          isMe ? "bg-[#6366F1] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1 font-semibold">
                          {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Tray */}
                <div className="p-4 border-t bg-white border-gray-100 shrink-0">
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 h-[52px]">
                    
                    {/* Emoji Button */}
                    <button onClick={() => setShowEmoji(!showEmoji)} className="text-gray-400 hover:text-gray-600 relative cursor-pointer outline-none">
                      <Smile size={20} />
                      {showEmoji && (
                        <div className="absolute bottom-full mb-3 left-0 bg-white border border-gray-100 rounded-xl shadow-2xl p-2.5 flex gap-1.5 z-50 animate-fadeIn">
                          {emojis.map((em) => (
                            <button key={em} onClick={() => insertEmoji(em)} className="p-1 text-lg hover:bg-gray-100 rounded transition cursor-pointer border-none bg-transparent outline-none">{em}</button>
                          ))}
                        </div>
                      )}
                    </button>

                    <textarea
                      ref={textareaRef}
                      value={text} 
                      onChange={(e) => setText(e.target.value)} 
                      onKeyDown={(e) => { 
                        if (e.key === "Enter" && !e.shiftKey) { 
                          e.preventDefault(); 
                          handleSendMessage(); 
                        } 
                      }}
                      placeholder="Type your message here..."
                      className="flex-1 h-10 max-h-32 resize-none bg-transparent outline-none text-sm py-2 text-gray-700 font-medium"
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={!text.trim()} 
                      className="bg-[#6366F1] text-white px-5 h-9 rounded-xl text-sm font-bold shadow-md hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={14} /> Send
                    </button>
                  </div>
                </div>
              </>
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/20">
              <MessageSquare size={44} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 font-bold">Select a conversation or switch tabs to view live workspace</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}