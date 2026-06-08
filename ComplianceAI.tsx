
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Info, FileText, Download, Sparkles, Scale, PenTool, ShieldCheck } from 'lucide-react';
import { askLegalAssistant, generateOfferLetterAI } from '../services/geminiService';
import { ChatMessage } from '../types';

const ComplianceAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I am your UAE HR Compliance Assistant. I can help you with MOHRE labor law, draft offer letters, or provide NDA templates. All documents comply with UAE Federal Decree Law No. 33 of 2021.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'Chat' | 'Templates' | 'Security'>('Chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await askLegalAssistant(input);
    setMessages(prev => [...prev, {
      role: 'model',
      text: response || "Error processing query.",
      timestamp: new Date()
    }]);
    setLoading(false);
  };

  const handleGenerateTemplate = async (type: string) => {
    setLoading(true);
    const doc = await generateOfferLetterAI({ name: "[CANDIDATE NAME]", position: type, salary: 15000 });
    setMessages(prev => [...prev, {
      role: 'model',
      text: `### Generated Template: ${type}\n\n${doc}\n\n--- \n*Note: This document is a draft compliant with UAE Labor Law. Please finalize details with legal counsel before issuance.*`,
      timestamp: new Date()
    }]);
    setActiveTab('Chat');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in zoom-in-95">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
            <Scale className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">AI Compliance Hub</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">MOHRE & UAE PDPL Standards</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['Chat', 'Templates', 'Security'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab === 'Chat' ? 'Assistant' : tab === 'Templates' ? 'Library' : 'Audit Logs'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'Chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-slate-50/20">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-2 rounded-xl h-fit ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white shadow-sm border border-slate-100'}`}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <div className={`p-6 rounded-[2rem] ${
                      msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                    }`}>
                      <div className="prose prose-sm max-w-none text-sm font-medium">
                        {msg.text.split('\n').map((line, i) => (
                          <p key={i} className="mb-2 last:mb-0 leading-relaxed">
                            {line.startsWith('###') ? <span className="text-lg font-black block mt-4 mb-2">{line.replace('###', '')}</span> : line}
                          </p>
                        ))}
                      </div>
                      <p className={`text-[10px] mt-4 font-black uppercase opacity-40 ${msg.role === 'user' ? 'text-white' : 'text-slate-400'}`}>
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
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Semantic Law Analysis...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about limited term contracts, notice periods, or gratuity..."
                  className="flex-1 px-6 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 bg-slate-50 font-bold text-slate-800 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-indigo-600 text-white px-8 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Templates' && (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Standard Offer Letter', desc: 'Compliant with Decree Law 33.', category: 'Hiring' },
                { title: 'Limited Term Contract', desc: 'MOHRE standard Unified Contract.', category: 'Legal' },
                { title: 'Mutual Termination', desc: 'Article 42 settlement agreement.', category: 'Offboarding' },
                { title: 'Internal Policy Handbook', desc: 'Disciplinary & grievance procedures.', category: 'Ops' },
                { title: 'Confidentiality (NDA)', desc: 'Protects IP in the UAE market.', category: 'Legal' },
                { title: 'Gratuity Final Settlement', desc: 'EOSB breakdown template.', category: 'Finance' },
              ].map((tpl, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="text-indigo-600 w-8 h-8" />
                    <span className="text-[10px] font-black text-indigo-400 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-widest">{tpl.category}</span>
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">{tpl.title}</h4>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">{tpl.desc}</p>
                  <button 
                    onClick={() => handleGenerateTemplate(tpl.title)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" /> AI Generate Draft
                  </button>
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <PenTool className="w-4 h-4 text-indigo-600/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Security' && (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50/20">
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                   <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="text-indigo-400" /> Immutable Audit Logs
                   </h3>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Retention: 7 Years</span>
                </div>
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Action</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">User</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">IP Source</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Timestamp</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {[
                        { action: 'Salary Batch Approval', user: 'Sarah Al-Maktoum', ip: '194.21.0.4', time: '12:04:12 PM', status: 'Verified' },
                        { action: 'SAML 2.0 Auth', user: 'Ahmed Hassan', ip: '192.168.1.1', time: '11:58:04 AM', status: 'Success' },
                        { action: 'PII Access (Bank Info)', user: 'Fatima Al-Zahra', ip: '194.21.0.4', time: '10:15:33 AM', status: 'Logged' },
                        { action: 'MFA Success', user: 'John Doe', ip: '84.112.9.22', time: '09:44:01 AM', status: 'Success' },
                      ].map((log, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 text-xs font-bold text-slate-800">{log.action}</td>
                           <td className="px-6 py-4 text-xs font-medium text-slate-600">{log.user}</td>
                           <td className="px-6 py-4 text-xs font-mono text-slate-400">{log.ip}</td>
                           <td className="px-6 py-4 text-xs text-slate-400">{log.time}</td>
                           <td className="px-6 py-4">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 uppercase">
                                 {log.status}
                              </span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-indigo-600 p-8 rounded-3xl text-white">
                   <h4 className="text-xl font-black mb-2">PDPL Privacy Shield</h4>
                   <p className="text-indigo-100 text-sm mb-6 leading-relaxed">System-wide personal data protection compliant with UAE Privacy Laws. RBAC & ABAC enabled.</p>
                   <button className="bg-white/10 hover:bg-white/20 py-3 px-6 rounded-xl text-[10px] font-black uppercase transition-all">Verify Encryption Keys</button>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200">
                   <h4 className="text-xl font-black text-slate-900 mb-2">Infrastructure</h4>
                   <div className="space-y-3 mt-4">
                      <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Encryption</span> <span className="text-xs font-mono text-indigo-600">AES-256-GCM</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Transit</span> <span className="text-xs font-mono text-indigo-600">TLS 1.3</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Residence</span> <span className="text-xs font-mono text-indigo-600">GCP Me-Central (Doha)</span></div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceAI;
