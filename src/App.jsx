import { useState } from "react";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const aiResponse = {
        role: "assistant",
        content: data.response || "No response received."
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error fetching AI response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-4 flex-1 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">AI Business Advisor</h1>
        <div className="space-y-2 mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`p-2 rounded-lg ${msg.role === "user" ? "bg-blue-100 text-right" : "bg-green-100 text-left"}`}>
              {msg.content}
            </div>
          ))}
          {loading && <div className="text-gray-500">Thinking...</div>}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2"
            placeholder="Ask a business question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
