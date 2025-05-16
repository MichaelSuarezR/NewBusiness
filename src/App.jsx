// src/App.jsx
import { useState, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [typedText, setTypedText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setTyping(true);
    setTypedText("");

    const res = await fetch("https://business-backend-nsht.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();

    // Animate typing
    const fullText = data.response;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { role: "ai", text: fullText }]);
        setTypedText("");
        setTyping(false);
      }
    }, 20);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-center">
        🧠 AI Business Advisor
      </h1>

      <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow-md p-6 space-y-4 overflow-y-auto max-h-[60vh]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-lg max-w-xs ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-800 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-lg bg-neutral-800 text-gray-300 max-w-xs">
              {typedText}
              <span className="animate-pulse">|</span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex mt-6 w-full max-w-2xl shadow-lg bg-neutral-800 rounded-full overflow-hidden"
      >
        <input
          className="flex-grow px-6 py-4 bg-transparent text-white placeholder-gray-400 outline-none"
          type="text"
          placeholder="Ask a business question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 transition-colors">
          Send
        </button>
      </form>
    </div>
  );
}
