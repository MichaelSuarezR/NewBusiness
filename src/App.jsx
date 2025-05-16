import { useState, useEffect } from 'react';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const res = await fetch('https://business-backend-nsht.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const fullReply = data.response;

    let i = 0;
    setTypingMessage('');
    const interval = setInterval(() => {
      setTypingMessage((prev) => prev + fullReply[i]);
      i++;
      if (i >= fullReply.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { role: 'assistant', content: fullReply }]);
        setTypingMessage('');
        setLoading(false);
      }
    }, 20);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-6 py-10">
        <h1 className="text-4xl font-bold text-center flex items-center justify-center gap-2">
          <span>💼</span> AI Business Advisor
        </h1>

        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] px-4 py-2 rounded-xl whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-blue-600 self-end ml-auto text-right' : 'bg-zinc-700 text-left'
              }`}
            >
              {msg.content}
            </div>
          ))}

          {typingMessage && (
            <div className="max-w-[75%] px-4 py-2 rounded-xl bg-zinc-700 text-left animate-pulse">
              {typingMessage}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <input
            className="flex-1 px-4 py-2 rounded-xl text-black"
            placeholder="Ask a business question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
