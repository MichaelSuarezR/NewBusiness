import { useState, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [animatedText, setAnimatedText] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setAnimatedText("");

    try {
      const res = await fetch("https://business-backend-nsht.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const response = data.response || "No response received.";

      let i = 0;
      const interval = setInterval(() => {
        if (i <= response.length) {
          setAnimatedText(response.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
          setMessages((prev) => [...prev, { role: "assistant", content: response }]);
          setAnimatedText("");
          setLoading(false);
        }
      }, 20);

    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error fetching AI response." }]);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-center text-blue-400">AI Business Advisor</h1>

        <div className="flex-1 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-line p-4 rounded-xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white text-right ml-auto max-w-[75%]"
                  : "bg-gray-700 text-left mr-auto max-w-[75%]"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="bg-gray-700 text-left mr-auto max-w-[75%] p-4 rounded-xl text-sm leading-relaxed">
              {animatedText || <span className="text-gray-400">Thinking...</span>}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <input
            className="flex-1 rounded-xl px-4 py-2 text-black placeholder-gray-500 focus:outline-none"
            placeholder="Ask a business question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
