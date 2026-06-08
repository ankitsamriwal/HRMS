
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, MapPin, Mic, MicOff, Info, Gift } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const HRAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "👋 Ahlan! I'm your Opus HR Buddy. I can check your leave, find offices, or lookup policies. Click the Mic to speak!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Logic for voice-to-text integration would go here
      // For now, we simulate detection
      setTimeout(() => {
        setInput("What are the public holidays in 2024?");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        You are the Opus HR Assistant (Buddy). You are friendly, efficient, and expert in UAE corporate culture.
        Rules:
        - Always format dates as DD/MM/YYYY.
        - Public Holidays (2024): Eid Al Adha (16/06), National Day (02/12).
        - Leave: 18.5 days annual, 12 days sick.
        - Be concise. Use clean Markdown.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: { systemInstruction, temperature: 0.7 },
      });

      setMessages(prev => [...prev, {
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that.",
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Error connecting to HR database.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Leave Balance', icon: <Sparkles className="w-3 h-3 text-amber-500"/> },
    { label: 'Holidays 2024', icon: <Gift className="w-3 h-3 text-rose-500"/> },
    { label: 'Office Locations', icon: <MapPin className="w-3 h-3 text-emerald-500"/> },
    { label: 'Benefits', icon: <Info className="w-3 h-3 text-indigo-500"/> },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-xl h-fit ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white shadow-sm border border-slate-100'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-indigo-600" />}
              </div>
              <div className={`p-6 rounded-[2rem] ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
              }`}>
                <div className="prose prose-sm max-w-none text-sm font-medium">
                  {msg.text.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
                </div>
                <p className={`text-[9px] font-black uppercase tracking-widest mt-2 opacity-60`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-4 items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Assistant Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-slate-100 space-y-4">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, i) => (
            <button 
              key={i}
              onClick={() => { setInput(action.label); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleVoiceToggle}
            className={`p-4 rounded-2xl transition-all shadow-lg ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-rose-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : "Ask me anything..."}
            className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all font-bold text-slate-900"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white px-6 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-xl shadow-indigo-100"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRAssistant;
