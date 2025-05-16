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
        body: JSON.stringify({ message: input }),
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching AI response." },
      ]);
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex flex-col items-center justify-between px-4 py-6 font-sans">
    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 drop-shadow-sm mb-6">
      💼 AI Business Advisorr
    </h1>

    <div className="flex flex-col w-full max-w-2xl flex-grow bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-line px-5 py-3 rounded-2xl text-sm shadow-md max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-600 text-white ml-auto text-right"
                : "bg-white text-gray-900 mr-auto text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="bg-white text-gray-900 px-5 py-3 rounded-2xl text-sm max-w-[80%] mr-auto text-left shadow-md">
            {animatedText || <span className="text-gray-500">Thinking...</span>}
          </div>
        )}
        <div ref={chatRef} />
      </div>

      <div className="flex items-center gap-3 p-4 border-t border-gray-700 bg-gray-900">
        <input
          className="flex-grow bg-white text-gray-900 rounded-full px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
