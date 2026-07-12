"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const bottomRef = useRef(null);
  const { user } = useUser();

  // THEMES
  const themes = {
    orange: {
      primary: "from-orange-300 to-yellow-200",
      button: "bg-orange-400 hover:bg-orange-300",
      glow: "bg-orange-500/10",
      text: "text-orange-300",
    },

    blue: {
      primary: "from-blue-300 to-cyan-200",
      button: "bg-blue-400 hover:bg-blue-300",
      glow: "bg-blue-500/10",
      text: "text-blue-300",
    },

    green: {
      primary: "from-green-300 to-emerald-200",
      button: "bg-green-400 hover:bg-green-300",
      glow: "bg-green-500/10",
      text: "text-green-300",
    },

    pink: {
      primary: "from-pink-300 to-rose-200",
      button: "bg-pink-400 hover:bg-pink-300",
      glow: "bg-pink-500/10",
      text: "text-pink-300",
    },

    purple: {
      primary: "from-purple-300 to-violet-200",
      button: "bg-purple-400 hover:bg-purple-300",
      glow: "bg-purple-500/10",
      text: "text-purple-300",
    },

    red: {
      primary: "from-red-300 to-rose-200",
      button: "bg-red-400 hover:bg-red-300",
      glow: "bg-red-500/10",
      text: "text-red-300",
    },
  };

  // DEFAULT THEME
  const [theme, setTheme] = useState("pink");
  const [userData, setUserData] =
  useState(null);

  // CHANGE THEME
  const changeTheme = () => {
    const themeKeys = Object.keys(themes);

    const currentIndex = themeKeys.indexOf(theme);

    const nextIndex =
      (currentIndex + 1) % themeKeys.length;

    setTheme(themeKeys[nextIndex]);
  };

  // AUTO SCROLL
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user-data");

      const data = await res.json();

      console.log("USER DATA:", data);

      setUserData(data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchUser();
}, []);

  // QUICK PROMPT
  const handleQuickPrompt = async (text) => {
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        text,
      },
    ];

    setMessages(updatedMessages);

    setLoading(true);

    let chatId = currentChatId;

    if (!chatId) {
      chatId = Date.now();

      setCurrentChatId(chatId);

      setChatHistory((prev) => [
        {
          id: chatId,
          title: text,
          messages: [],
        },
        ...prev,
      ]);
    }

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

      body: JSON.stringify({
  input: text,
  industry: userData?.industry,
}),
      });

      const data = await res.json();

      const finalMessages = [
        ...updatedMessages,
        {
          role: "ai",
          text: data.answer,
        },
      ];

      setMessages(finalMessages);

      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: finalMessages,
              }
            : chat
        )
      );
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        text: userText,
      },
    ];

    setMessages(updatedMessages);

    setInput("");

    setLoading(true);

    let chatId = currentChatId;

    if (!chatId) {
      chatId = Date.now();

      setCurrentChatId(chatId);

      setChatHistory((prev) => [
        {
          id: chatId,
          title: userText,
          messages: [],
        },
        ...prev,
      ]);
    }

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

    body: JSON.stringify({
  input: userText,
  industry: userData?.industry,
}),
      });

      const data = await res.json();

      const finalMessages = [
        ...updatedMessages,
        {
          role: "ai",
          text: data.answer,
        },
      ];

      setMessages(finalMessages);

      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: finalMessages,
              }
            : chat
        )
      );
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

 return (
  <div className="h-screen bg-[#030712] text-white flex overflow-hidden">

    {/* SIDEBAR */}
    <div className="w-[250px] bg-[#071019] border-r border-white/10 flex flex-col p-5">

      <div>
        <h1 className={`text-4xl font-black bg-gradient-to-r ${themes[theme].primary} bg-clip-text text-transparent`}>
          SENSAI
        </h1>

        <p className="text-xs text-gray-500 mt-2">
          AI Career Guidance System
        </p>
      </div>

      <button
        onClick={() => {
          setMessages([]);
          setCurrentChatId(null);
        }}
        className={`mt-8 py-3 rounded-2xl text-black text-sm font-bold ${themes[theme].button}`}
      >
        + New Chat
      </button>

      <div className="mt-8 flex-1 overflow-y-auto">
        <p className="text-[10px] tracking-[4px] text-gray-600 mb-4">
          CHAT HISTORY
        </p>

        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setCurrentChatId(chat.id);
                setMessages(chat.messages);
              }}
              className="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05]"
            >
              <p className="truncate text-xs text-gray-300">
                {chat.title}
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>

    {/* MAIN AREA */}
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

      {/* HEADER */}
      <div className="h-[65px] min-h-[65px] border-b border-white/10 px-6 flex items-center justify-between z-10">

        <div>
          <h2 className="text-lg font-bold">AI Career Assistant</h2>
          <p className="text-xs text-gray-500">Personalized AI guidance</p>
        </div>

        <button
          onClick={changeTheme}
          className={`px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs ${themes[theme].text}`}
        >
          Change Theme
        </button>

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* HERO */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">

            <h1 className={`text-5xl font-black bg-gradient-to-r ${themes[theme].primary} bg-clip-text text-transparent`}>
              SENSAI AI
            </h1>

            <p className="mt-5 max-w-xl text-gray-400">
              Intelligent AI career guidance assistant
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10 w-full max-w-3xl">

              {[
                "Generate career roadmap",
                "Analyze my skills",
                "Suggest AI careers",
                "Interview preparation tips",
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(item)}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10"
                >
                  {item}
                </button>
              ))}

            </div>

          </div>
        )}

        {/* MESSAGES */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap
              ${msg.role === "user"
                ? `${themes[theme].button} text-black`
                : "bg-[#111827] border border-white/10"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Thinking...</div>
        )}

        <div ref={bottomRef}></div>

      </div>

      {/* INPUT FIXED */}
      <div className="p-4 border-t border-white/10 bg-[#030712]">

        <div className="max-w-4xl mx-auto flex gap-3 items-center bg-[#111827] p-3 rounded-xl border border-white/10">

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything about your career..."
            className="flex-1 bg-transparent outline-none text-sm"
          />

          <button
            onClick={sendMessage}
            className={`px-5 py-2 rounded-lg text-black text-sm font-semibold ${themes[theme].button}`}
          >
            Send
          </button>

        </div>

      </div>

    </div>

  </div>
);
}