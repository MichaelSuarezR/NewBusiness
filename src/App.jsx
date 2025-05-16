import { useState, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://business-backend-nsht.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch (e) {
      console.error("Error:", e);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-red-800 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">🧠 AI Business Advisor</h1>
      <div className="w-full max-w-2xl bg-zinc-900 rounded-xl shadow-xl p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user" ? "bg-blue-600 ml-auto text-right" : "bg-gray-700 mr-auto text-left"}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">Typing...</div>}
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded border bg-zinc-800 border-zinc-600 text-white"
            placeholder="Ask a business question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
