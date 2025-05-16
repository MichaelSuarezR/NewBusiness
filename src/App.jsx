import { useState, useEffect } from 'react';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTyping, setCurrentTyping] = useState("");

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
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      typeResponse(data.response);
    } catch (err) {
      typeResponse("Sorry, something went wrong.");
    }
  };

  const typeResponse = (text) => {
    let index = 0;
    setCurrentTyping("");

    const interval = setInterval(() => {
      if (index < text.length) {
        setCurrentTyping((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setMessages((prev) => [...prev, { role: "assistant", content: text }]);
        setCurrentTyping("");
        setLoading(false);
      }
    }, 20);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 flex items-center">
        <span className="text-5xl mr-3">💼</span> AI Business Advisor
      </h1>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 text-black flex flex-col space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-xl whitespace-pre-wrap text-sm ${
              msg.role === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-100 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-gray-100 px-4 py-2 rounded-xl text-sm text-black">
            {currentTyping}
            <span className="animate-pulse">█</span>
          </div>
        )}

        <div className="flex mt-4">
          <input
            className="flex-1 border border-gray-300 rounded-l-xl p-3 text-sm outline-none"
            placeholder="Ask a business question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="bg-black text-white px-4 rounded-r-xl hover:bg-gray-800"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
