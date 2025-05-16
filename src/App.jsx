// src/App.jsx
import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;
    const res = await fetch("https://business-backend-nsht.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setResponse(data.response);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-10 tracking-tight text-center">
        <span role="img" aria-label="brain">🧠</span> AI Business Advisor
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-2xl shadow-lg bg-neutral-900 rounded-full overflow-hidden"
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
      {response && (
        <div className="mt-10 max-w-2xl text-xl text-gray-300 leading-relaxed border-t border-neutral-800 pt-6">
          {response}
        </div>
      )}
    </div>
  );
}
