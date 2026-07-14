"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // ON MOBILE, THE SIDEBAR IS HIDDEN BY DEFAULT.
  // WE TOGGLE THIS TO SHOW/HIDE IT. ON DESKTOP IT IS ALWAYS VISIBLE
  // (WE HANDLE THAT WITH THE "md:flex" CLASS BELOW, NOT WITH THIS STATE).
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [userData, setUserData] = useState(null);

  // CHANGE THEME
  const changeTheme = () => {
    const themeKeys = Object.keys(themes);

    const currentIndex = themeKeys.indexOf(theme);

    const nextIndex = (currentIndex + 1) % themeKeys.length;

    setTheme(themeKeys[nextIndex]);
  };

  // LOAD USER DATA ONCE WHEN THE PAGE OPENS
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

  // EVERY TIME A NEW MESSAGE ARRIVES, SCROLL DOWN SO THE LATEST ONE IS VISIBLE
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
            : chat,
        ),
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
            : chat,
        ),
      );
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    // ======================================================================
    // OUTER WRAPPER
    // "flex-col" on mobile = sidebar and chat stack on TOP of each other
    // "md:flex-row" on desktop (768px+) = sidebar and chat sit SIDE BY SIDE
    // "h-dvh" = full screen height that works correctly on mobile browsers
    // ======================================================================
    <div className="flex flex-col md:flex-row h-dvh bg-[#030712] text-white overflow-hidden">
      {/* ==================================================================
          SIDEBAR
          On mobile: only shown when sidebarOpen is true (normal block,
          pushes the chat down, never floats on top of it).
          On desktop: "md:flex" forces it to always show, side by side.
      ================================================================== */}
      <div
        className={`
          ${sidebarOpen ? "flex" : "hidden"} md:flex
          flex-col w-full md:w-[250px] md:shrink-0
          max-h-[50vh] md:max-h-none overflow-y-auto
          bg-[#071019] border-b md:border-b-0 md:border-r border-white/10 p-5
        `}
      >
        <div className="flex items-center justify-between">
          <h1
            className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${themes[theme].primary} bg-clip-text text-transparent`}
          >
            SENSAI
          </h1>

          {/* CLOSE BUTTON - ONLY NEEDED ON MOBILE */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white text-xl px-2"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">AI Career Guidance System</p>

        <button
          onClick={() => {
            setMessages([]);
            setCurrentChatId(null);
            setSidebarOpen(false);
          }}
          className={`mt-6 py-3 rounded-2xl text-black text-sm font-bold ${themes[theme].button}`}
        >
          + New Chat
        </button>

        <div className="mt-6">
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
                  setSidebarOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05]"
              >
                <p className="truncate text-xs text-gray-300">{chat.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================================
          MAIN CHAT AREA
          "flex-1" = takes up all remaining space next to (or below) sidebar
          "min-h-0" = REQUIRED so the messages list can scroll on its own
          instead of growing forever and pushing the input box off screen
      ================================================================== */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* HEADER */}
        <div className="shrink-0 h-16 border-b border-white/10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* HAMBURGER BUTTON - ONLY SHOWS ON MOBILE, OPENS THE SIDEBAR ABOVE */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-2xl leading-none px-1"
            >
              ☰
            </button>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold truncate">
                AI Career Assistant
              </h2>
              <p className="text-xs text-gray-500 truncate hidden sm:block">
                Personalized AI guidance
              </p>
            </div>
          </div>

          <button
            onClick={changeTheme}
            className={`px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs whitespace-nowrap ${themes[theme].text}`}
          >
            Change Theme
          </button>
        </div>

        {/* MESSAGES LIST - THIS IS THE ONLY PART THAT SCROLLS */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-4">
          {/* HERO - SHOWN ONLY WHEN THERE ARE NO MESSAGES YET */}
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-2">
              <h1
                className={`text-3xl sm:text-5xl font-black bg-gradient-to-r ${themes[theme].primary} bg-clip-text text-transparent`}
              >
                SENSAI AI
              </h1>

              <p className="mt-4 max-w-xl text-sm sm:text-base text-gray-400">
                Intelligent AI career guidance assistant
              </p>

              {/* ONE COLUMN ON MOBILE, TWO COLUMNS ON LARGER SCREENS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-3xl">
                {[
                  "Generate career roadmap",
                  "Analyze my skills",
                  "Suggest AI careers",
                  "Interview preparation tips",
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(item)}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-left"
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
                className={`max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap break-words
                ${
                  msg.role === "user"
                    ? `${themes[theme].button} text-black`
                    : "bg-[#111827] border border-white/10"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && <div className="text-gray-400 text-sm">Thinking...</div>}

          {/* EMPTY DIV USED AS A SCROLL TARGET - KEEPS LATEST MESSAGE IN VIEW */}
          <div ref={bottomRef}></div>
        </div>

        {/* INPUT BAR - "shrink-0" KEEPS IT PINNED AT THE BOTTOM, ALWAYS VISIBLE */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-white/10 bg-[#0a0f1a]">
          <div
            className={`
              max-w-4xl mx-auto flex gap-2 items-center
              bg-[#111827] p-2 sm:p-2.5 rounded-2xl
              border border-white/10
              shadow-lg shadow-black/30
              focus-within:border-white/25 focus-within:ring-2 focus-within:ring-white/10
              transition-colors
            `}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything about your career..."
              className="flex-1 min-w-0 bg-transparent outline-none text-sm px-2 py-2 placeholder:text-gray-500"
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`
                px-4 sm:px-5 py-2.5 rounded-xl text-black text-sm font-semibold shrink-0
                shadow-md transition-transform active:scale-95
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