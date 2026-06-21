import axios from "axios";
import systemPrompt from "./systemPrompt";

// =========================
// DeepSeek API Configuration
// =========================

const API_KEY = "sk-ac29f7566b8f414d9e0dab00d94eafbc";

const API_URL = "https://api.deepseek.com/chat/completions";

const MODEL = "deepseek-chat";

// =========================
// Send Chat Message
// =========================

export const askDeepSeek = async (conversation = []) => {
try {
const messages = [
systemPrompt,
...conversation.filter((msg) => msg.role !== "system"),
];
const response = await axios.post(
  API_URL,
  {
    model: MODEL,

    messages: messages,

    temperature: 0.7,

    max_tokens: 1000,

    stream: false,
  },
  {
    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${API_KEY}`,
    },
  }
);

return response.data.choices[0].message;
} catch (error) {
console.error("DeepSeek Error:", error);
if (error.response) {
  console.log(error.response.data);
}

return {
  role: "assistant",
  content:
    "Sorry, I couldn't process your request right now. Please try again in a moment.",
};
}
};

// =========================
// Quick Action Prompts
// =========================

export const quickActions = {
roadmap: {
role: "user",
content:
"Help me understand my learning roadmap and explain how to complete it step by step.",
},

account: {
role: "user",
content:
"Help me with account settings, profile management, password changing, and general account questions.",
},

assessment: {
role: "user",
content:
"Explain how the career assessment works and how career recommendations are generated.",
},

mentors: {
role: "user",
content:
"Explain how mentors can help me and how I should choose a mentor that matches my career path.",
},

dashboard: {
role: "user",
content:
"Explain the dashboard features and how I can benefit from the available tools.",
},
};

// =========================
// Initial Welcome Message
// =========================

export const initialMessage = {
id: 1,

sender: "bot",

role: "assistant",

text:
"👋 Hello! I'm Masar AI Assistant.\n\nI can help you with:\n\n• Career guidance\n• Learning roadmaps\n• Technical questions\n• Assessment results\n• Mentor guidance\n• Account help\n\nHow can I help you today?",

time: new Date().toISOString(),

attachments: [],
};

// =========================
// Convert UI Messages
// to DeepSeek Format
// =========================

export const convertMessagesToConversation = (messages) => {
return messages
.filter(
(msg) =>
msg.sender === "user" ||
msg.sender === "bot" ||
msg.role === "assistant"
)
.map((msg) => ({
role:
msg.sender === "user"
? "user"
: msg.role === "assistant"
? "assistant"
: "assistant",
  content: msg.text,
}));

};

// =========================
// Convert DeepSeek Reply
// to UI Message
// =========================

export const createBotMessage = (reply) => {
  return {
    id: Date.now(),
    sender: "bot",

    role: "assistant",

    text: reply.content,

    time: new Date().toISOString(),

    attachments: [],
  };
};

// =========================
// Create User Message
// =========================

export const createUserMessage = (text, attachments = []) => {
return {
id: Date.now(),
sender: "user",

role: "user",

text: text,

time: new Date().toISOString(),

attachments: attachments,

};
};

// =========================
// Typing Placeholder
// =========================

export const typingMessage = {
id: -1,

sender: "bot",

role: "assistant",

text: "Typing...",

time: new Date().toISOString(),

attachments: [],
};
