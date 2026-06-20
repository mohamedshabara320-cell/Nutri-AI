"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.text }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: data.reply || "Sorry, I couldn't respond." },
    ]);

    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen px-4 py-4 space-y-3">

      {/* messages */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              m.role === "user"
                ? "ml-auto bg-green-600 text-white"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-400">AI is thinking...</div>
        )}
      </div>

      {/* input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI coach..."
          className="flex-1 rounded-xl border p-2"
        />

        <button
          onClick={sendMessage}
          className="btn-primary flex items-center gap-2"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}