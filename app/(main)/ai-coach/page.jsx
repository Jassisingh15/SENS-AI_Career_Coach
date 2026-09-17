"use client";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // ON MOBILE, THE SIDEBAR IS HIDDEN BY DEFAULT.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bottomRef = useRef(null);

  // THEMES
  const themes = {
    orange: {
      primary: "from-orange-400 to-amber-300",
      button: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600",
      glow: "bg-orange-500/10",
      text: "text-orange-300",
    },

    blue: {
      primary: "from-cyan-400 to-blue-400",
      button: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
      glow: "bg-blue-500/10",
      text: "text-blue-300",
    },

    green: {
      primary: "from-emerald-400 to-teal-300",
      button: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
      glow: "bg-green-500/10",
      text: "text-green-300",
    },

    pink: {
      primary: "from-pink-400 to-rose-300",
      button: "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
      glow: "bg-pink-500/10",
      text: "text-pink-300",
    },

    purple: {
      primary: "from-violet-400 to-indigo-300",
      button: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700",
      glow: "bg-purple-500/10",
      text: "text-purple-300",
    },

    red: {
      primary: "from-rose-400 to-amber-300",
      button: "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700",
      glow: "bg-red-500/10",
      text: "text-red-300",
    },
  };

  // DEFAULT THEME
  const [theme, setTheme] = useState("purple");
  const [userData, setUserData] = useState(null);

  // CHANGE THEME
  const changeTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  // Load the user's profile once so each AI request includes their industry.
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch("/api/user-data");
        const user = await response.json();
        setUserData(user);
      } catch (error) {
        console.log(error);
      }
    };

    loadUserData();
  }, []);

  // SCROLL DOWN
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Add a new chat to the history
  const getChatId = (messageText) => {
    if (currentChatId) {
      return currentChatId;
    }

    const newChatId = Date.now();
    setCurrentChatId(newChatId);
    setChatHistory((previousChats) => [
      { id: newChatId, title: messageText, messages: [] },
      ...previousChats,
    ]);

    return newChatId;
  };

  // Send text to AI
  const sendChatMessage = async (messageText) => {
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        text: messageText,
      },
    ];

    setMessages(updatedMessages);
    setLoading(true);

    const chatId = getChatId(messageText);

    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: messageText,
          industry: userData?.industry,
        }),
      });

      const data = await response.json();

      const finalMessages = [
        ...updatedMessages,
        {
          role: "ai",
          text: data.answer,
        },
      ];

      setMessages(finalMessages);

      setChatHistory((previousChats) =>
        previousChats.map((chat) => {
          if (chat.id !== chatId) {
            return chat;
          }

          return { ...chat, messages: finalMessages };
        }),
      );
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleQuickPrompt = async (text) => {
    await sendChatMessage(text);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageText = input;
    setInput("");
    await sendChatMessage(messageText);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-slate-950 text-slate-100 md:flex-row">
      {/* SIDEBAR */}
      <div
        className={`
          ${sidebarOpen ? "flex" : "hidden"} md:flex
          flex-col w-full md:w-[260px] md:shrink-0
          max-h-[50vh] md:max-h-none overflow-y-auto
          border-b border-white/10 bg-slate-900/90 backdrop-blur-xl p-5 md:border-b-0 md:border-r
        `}
      >
        <div className="flex items-center justify-between">
          <h1
            className={`text-3xl font-black bg-gradient-to-r ${themes[theme].primary} bg-clip-text text-transparent`}
          >
            SENSAI
          </h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="px-2 text-xl text-slate-400 hover:text-white md:hidden cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="mt-1 text-xs text-slate-400 font-medium">AI Career Guidance System</p>

        <button
          onClick={() => {
            setMessages([]);
            setCurrentChatId(null);
            setSidebarOpen(false);
          }}
          className={`mt-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${themes[theme].button}`}
        >
          + New Chat
        </button>

        <div className="mt-6">
          <p className="text-[10px] font-bold tracking-[3px] text-slate-400 mb-3 uppercase">
            Chat History
          </p>

          <div className="space-y-1.5">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setCurrentChatId(chat.id);
                  setMessages(chat.messages);
                  setSidebarOpen(false);
                }}
                className="w-full rounded-xl border border-white/5 bg-slate-950/40 p-2.5 text-left transition-colors hover:border-white/15 hover:bg-white/5 cursor-pointer"
              >
                <p className="truncate text-xs text-slate-300 font-medium">{chat.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-950/60">
        {/* HEADER */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-slate-900/80 backdrop-blur-xl px-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-2xl leading-none px-1 text-slate-300 hover:text-white cursor-pointer"
            >
              ☰
            </button>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                AI Career Assistant
              </h2>
              <p className="hidden truncate text-xs text-slate-400 sm:block">
                Context-aware coaching for your industry
              </p>
            </div>
          </div>

          <button
            onClick={changeTheme}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white transition-all cursor-pointer font-medium"
          >
            Switch Accent
          </button>
        </div>

        {/* MESSAGES LIST */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-4">
          {/* EMPTY STATE */}
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
              <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-violet-600/10 blur-3xl -z-10" />
              <h1
                className={`text-3xl sm:text-5xl font-black bg-gradient-to-r ${themes[theme].primary} bg-clip-text text-transparent`}
              >
                SENSAI AI COACH
              </h1>

              <p className="mt-3 max-w-lg text-sm sm:text-base text-slate-300">
                Ask questions about your career trajectory, skill development, mock interview strategy, or role transition.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
                {[
                  "Generate a 3-month career roadmap",
                  "Analyze my technical skills for Staff Engineer",
                  "How to negotiate salary in tech?",
                  "Mock behavioral interview prep tips",
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(item)}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left text-sm text-slate-200 shadow-xl backdrop-blur-md transition hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-slate-900/90 cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CHAT BUBBLES */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap break-words leading-relaxed shadow-lg
                ${
                  msg.role === "user"
                    ? `${themes[theme].button} text-white font-medium`
                    : "border border-white/10 bg-slate-900/80 text-slate-100 backdrop-blur-xl"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-indigo-400 font-medium animate-pulse">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              SENSAI is thinking...
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT BAR */}
        <div className="shrink-0 border-t border-white/10 bg-slate-900/80 backdrop-blur-xl p-3 sm:p-4">
          <div
            className="max-w-4xl mx-auto flex gap-2 items-center bg-slate-950/60 p-2 rounded-2xl border border-slate-800 shadow-inner focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything about your career, interview prep, or skills..."
              className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`
                px-5 py-2 rounded-xl text-white text-sm font-semibold shrink-0
                shadow-lg transition-transform active:scale-95 cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                ${themes[theme].button}
              `}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
