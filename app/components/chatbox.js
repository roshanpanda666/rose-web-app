"use client";
import React, { useRef, useState, useEffect } from "react";

const PERSONALITY_STYLES = {
  rose: { bubbleUser: "bg-purple-500", bubbleAI: "bg-purple-700" },
  chill: { bubbleUser: "bg-cyan-400", bubbleAI: "bg-cyan-600" },
  serious: { bubbleUser: "bg-blue-500", bubbleAI: "bg-blue-700" },
};

const Chatbox = () => {
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [personality, setPersonality] = useState("rose");

  const handleClick = async () => {
    const value = inputRef.current.value.trim();
    if (!value) return;

    const newUserMessage = { sender: "user", content: value };
    setMessages((prev) => [...prev, newUserMessage]);
    inputRef.current.value = "";

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: value, personality }),
    });

    const data = await res.json();
    const aiMessage = { sender: "ai", content: data.reply || "No response 😶‍🌫️" };
    setMessages((prev) => [...prev, aiMessage]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const style = PERSONALITY_STYLES[personality];

  return (
    <div className="flex justify-center items-center">
            <div className="flex flex-col h-screen w-[90%] bg-neutral-900 text-white p-4">
      {/* Personality Buttons */}
      <div className="flex gap-3 mb-3 justify-center">
        {["rose", "chill", "serious"].map((p) => (
          <button
            key={p}
            onClick={() => setPersonality(p)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              personality === p
                ? "bg-white text-black shadow-lg"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-3 rounded-lg bg-neutral-800 shadow-inner">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl max-w-[70%] break-words shadow-md ${
              msg.sender === "user"
                ? `${style.bubbleUser} text-black self-end`
                : `${style.bubbleAI} text-white self-start`
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4 max-w-md mx-auto w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-2xl bg-neutral-700 border border-gray-600 text-white outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
        />
        <button
          onClick={handleClick}
          className="px-5 py-3 rounded-2xl bg-blue-500 text-black font-semibold hover:bg-blue-600 transition-shadow"
        >
          Send
        </button>
      </div>
    </div>
    </div>
    
  );
};

export default Chatbox;
