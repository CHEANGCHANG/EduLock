
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const EduLockAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'EduLock Intelligence Core online. Awaiting query for academic verification or data analysis.', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await gemini.getAiAssistance(input);
    const aiMsg: Message = { role: 'ai', content: response, timestamp: new Date().toISOString() };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="h-[70vh] flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hud-border glass-morphism animate-in fade-in zoom-in-95 duration-500">
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_#a855f7]"></div>
          <h3 className="text-xs font-black font-orbitron text-slate-100 uppercase tracking-widest">EduLock Intelligence Core</h3>
        </div>
        <span className="text-[9px] font-orbitron text-slate-500 uppercase">Status: Connected</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-xl border ${
              m.role === 'user' 
                ? 'bg-purple-600/10 border-purple-500/30 text-slate-200' 
                : 'bg-slate-950 border-slate-800 text-cyan-400 font-medium'
            }`}>
              <p className="text-xs md:text-sm leading-relaxed">{m.content}</p>
              <p className="text-[8px] mt-2 opacity-50 font-orbitron uppercase">{new Date(m.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-orbitron text-cyan-500 animate-pulse uppercase">Processing Node...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="TRANSMIT SECURE QUERY..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 pr-12 text-xs font-orbitron text-slate-200 outline-none focus:border-purple-500 transition-all placeholder:text-slate-700"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-500 hover:text-purple-400 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EduLockAI;
