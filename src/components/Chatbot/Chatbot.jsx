import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  MessageCircle,
  X,
} from "lucide-react";

import {
  askDeepSeek,
  createBotMessage,
  createUserMessage,
  convertMessagesToConversation,
  initialMessage,
  typingMessage,
  quickActions,
} from "../Common/deepseek";

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([initialMessage]);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  const [showEmoji, setShowEmoji] = useState(false);

  const [pendingFiles, setPendingFiles] = useState([]);

  const fileRef = useRef(null);

  const scrollRef = useRef(null);

useEffect(() => {
  scrollRef.current?.scrollTo({
    top: scrollRef.current.scrollHeight,
    behavior: "smooth",
  });
}, [messages]);

  function formatTimestamp(iso) {
    try {
      const d = new Date(iso);

    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    } catch {
      return "";
    }
  }

  function insertEmoji(em) {
    setText((prev) => prev + em);

    setShowEmoji(false);
  }

  function handleFileChange(e) {
    const file =
      e.target.files &&
      e.target.files[0];

    if (!file) return;

    const attachment = {
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    };

    setPendingFiles((prev) => [
      ...prev,
      attachment,
    ]);

    e.target.value = null;
  }

async function handleQuickAction(action) {
  if (loading) return;

  const prompt = quickActions[action];

  if (!prompt) return;

  const userMessage = createUserMessage(prompt.content);

  const updatedMessages = [...messages, userMessage];

  setMessages([
    ...updatedMessages,
    {
      ...typingMessage,
      id: Date.now() + 100,
      time: new Date().toISOString(),
    },
  ]);

  setLoading(true);

  try {
    const conversation =
      convertMessagesToConversation(updatedMessages);

    const reply = await askDeepSeek(conversation);

    const botMessage = createBotMessage(reply);

    setMessages([
      ...updatedMessages,
      botMessage,
    ]);
  } catch (error) {
    setMessages([
      ...updatedMessages,
      createBotMessage({
        content:
          "Sorry, something went wrong while contacting the AI assistant.",
      }),
    ]);
  }

  setLoading(false);
}

async function handleSend() {
  if (
    (!text.trim() && pendingFiles.length === 0) ||
    loading
  )
    return;

  const userMessage = createUserMessage(
    text.trim(),
    pendingFiles
  );

  const updatedMessages = [
    ...messages,
    userMessage,
  ];

  setMessages([
    ...updatedMessages,
    {
      ...typingMessage,
      id: Date.now() + 1,
      time: new Date().toISOString(),
    },
  ]);

  setText("");

  setPendingFiles([]);

  setShowEmoji(false);

  setLoading(true);

  try {
    const conversation =
      convertMessagesToConversation(updatedMessages);

    const reply = await askDeepSeek(conversation);

    const botMessage =
      createBotMessage(reply);

    setMessages([
      ...updatedMessages,
      botMessage,
    ]);
  } catch (error) {
    console.log(error);

    setMessages([
      ...updatedMessages,
      createBotMessage({
        content:
          "⚠️ Unable to connect to Masar AI Assistant. Please try again later.",
      }),
    ]);
  }

  setLoading(false);
}

function handleInputKeyDown(e) {
  if (e.key === "Enter") {
    e.preventDefault();

    handleSend();
  }
}

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white cursor-pointer p-4 rounded-full shadow-lg hover:opacity-90 transition z-50"
        aria-expanded={open}
        aria-label={
                    open
                      ? "Close Masar AI Assistant"
                      : "Open Masar AI Assistant"
                  }
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[420px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 pb-4 px-4">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-gray-800">Masar AI Assistant</h3>
              <p className="text-xs text-gray-500">
                Career guidance, roadmaps, mentors, assessments and technical learning.
              </p>
            </div>

            <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.sender === "user"
                    ? "flex justify-end"
                    : "flex"
                }
              >
                <div
                  className={
                    m.sender === "user"
                      ? "flex flex-col items-end max-w-[80%]"
                      : "flex flex-col items-start max-w-[80%]"
                  }
                >
                  <div
                    className={`${
                      m.sender === "user"
                        ? "bg-[#6366f1] text-white text-right"
                        : "bg-white text-gray-700 text-left"
                    } px-4 py-3 rounded-xl shadow text-sm break-words whitespace-pre-wrap leading-6`}
                  >
                    {m.text}

                    {m.text === "Typing..." && (
                      <div className="flex gap-1 mt-2">
                        <span className="animate-bounce">●</span>
                        <span
                          className="animate-bounce"
                          style={{
                            animationDelay: ".2s",
                          }}
                        >
                          ●
                        </span>

                        <span
                          className="animate-bounce"
                          style={{
                            animationDelay: ".4s",
                          }}
                        >
                          ●
                        </span>
                      </div>
                    )}

                    {m.attachments &&
                      m.attachments.length > 0 && (
                        <div className="mt-2 flex flex-col gap-2">
                          {m.attachments.map(
                            (a, index) => (
                              <div
                                key={index}
                                className="bg-gray-100 p-2 rounded flex items-center gap-3 text-xs text-gray-700"
                              >
                                {a.type?.startsWith(
                                  "image"
                                ) ? (
                                  <img
                                    src={a.url}
                                    alt={a.name}
                                    className="w-28 h-16 object-cover rounded"
                                  />
                                ) : (
                                  <div className="px-2 py-1 border rounded">
                                    {a.name}
                                  </div>
                                )}

                                <a
                                  href={a.url}
                                  download={a.name}
                                  className="text-indigo-600 hover:underline"
                                >
                                  Download
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>

                  <div
                    className={`${
                      m.sender === "user"
                        ? "text-xs text-gray-400 mt-1 text-right"
                        : "text-xs text-gray-400 mt-1 text-left"
                    }`}
                  >
                    {formatTimestamp(m.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <button
            disabled={loading}
            onClick={() =>
              handleQuickAction("roadmap")
            }
            className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            Check Roadmap
          </button>

          <button
            disabled={loading}
            onClick={() =>
              handleQuickAction("account")
            }
            className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            Account Help
          </button>

          <button
            disabled={loading}
            onClick={() =>
              handleQuickAction("assessment")
            }
            className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            Assessment Help
          </button>

{pendingFiles.length > 0 && (
  <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-gray-200">
    {pendingFiles.map((file, index) => (
      <div
        key={index}
        className="bg-gray-100 px-3 py-1 rounded-full text-xs flex items-center gap-2"
      >
        📎 {file.name}

        <button
          onClick={() =>
            setPendingFiles((prev) =>
              prev.filter((_, i) => i !== index)
            )
          }
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}
          {/* Input */}
          <div className="flex items-center gap-2 p-3">
            <input
              disabled={loading}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleInputKeyDown}
              type="text"
              placeholder={
                            loading
                              ? "Masar AI is typing..."
                              : "Ask about careers, roadmap, mentors..."
                          }
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none disabled:opacity-50"
            />

            <input ref={fileRef} type="file" onChange={handleFileChange} className="hidden" />
            <button disabled={loading} onClick={() => fileRef.current?.click()} aria-label="Attach file">
              <Paperclip size={18} className="text-gray-500 cursor-pointer" />
            </button>

            <div className="relative">
              <button disabled={loading} onClick={() => setShowEmoji((s) => !s) } aria-label="Emoji picker" >
                <Smile size={18} className="text-gray-500 cursor-pointer" />
              </button>

              {showEmoji && (
                <div className="absolute bottom-10 right-0 bg-white shadow rounded p-2 flex flex-row flex-wrap gap-2 w-44">
                  {['😀','😃','😂','😉','😍','🤔','👍','🎉','🔥','😅','🙌','🤖'].map((em) => (
                    <button key={em} onClick={() => insertEmoji(em)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">{em}</button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => {
                                    if (!loading) {
                                      handleSend();
                                    }
                                  }} disabled={
                                                    loading ||
                                                    (!text.trim() &&
                                                      pendingFiles.length === 0)
                                                  } className="bg-[#6366f1] disabled:opacity-50 text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-[#5b5ce8] transition disabled:cursor-not-allowed">
              {loading ? "Sending..." : "Send"} <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}