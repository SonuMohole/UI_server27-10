"use client";

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Send, X, MessageSquare } from "lucide-react";

interface Message {
  from: "bot" | "user";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "👋 Hello, I’m QStellar Sentinel. How can I assist you today?" },
  ]);
  const [input, setInput] = useState<string>("");

  const handleSend = (): void => {
    if (!input.trim()) return;

    const userMsg: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulated AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "🔍 Analyzing your request... Integration pending backend link." },
      ]);
    }, 900);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0E2762] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 focus:outline-none"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 bg-background/95 backdrop-blur-lg border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-[#0E2762] text-white p-3 flex justify-between items-center">
            <span className="font-semibold text-sm">QStellar Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message Body */}
          <div className="h-64 p-3 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.from === "bot"
                    ? "bg-muted/40 text-muted-foreground w-3/4"
                    : "bg-[#0E2762]/20 text-[#0E2762] ml-auto w-3/4 text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="border-t border-border p-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-[#0E2762]"
            />
            <button
              onClick={handleSend}
              className="bg-[#0E2762] text-white px-3 py-2 rounded-lg hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
