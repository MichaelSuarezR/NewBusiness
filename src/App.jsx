import { useState, useEffect, useRef } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [animatedText, setAnimatedText] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, animatedText]);

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
      }, 15);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error fetching AI response." }]);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col items-center justify-start p-6 font-sans">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <h1 className="text-5xl font-extrabold text-center text-blue-400 drop-shadow-sm">💼 AI Business Advisor</h1>

        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl flex flex-col gap-4 p-6 max-h-[70vh] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-line px-5 py-3 rounded-3xl text-sm max-w-[80%] shadow-md transition-all duration-300 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white self-end rounded-br-none"
                  : "bg-white text-gray-900 self-start rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="bg-white text-gray-900 px-5 py-3 rounded-3xl text-sm self-start max-w-[80%] rounded-bl-none shadow-md">
              {animatedText || <span className="text-gray-500">Thinking...</span>}
            </div>
          )}

          <div ref={chatRef} />
        </div>

        <div className="flex gap-3 mt-3">
          <input
            className="flex-1 bg-white text-gray-900 rounded-full px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ask a business question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
