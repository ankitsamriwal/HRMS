
import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Briefcase,
  TrendingUp,
  Brain,
  Zap,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { RequestStatus } from '../types';

const SupervisorPortal: React.FC = () => {
  const [requests, setRequests] = useState([
    { id: '1', name: 'Zaid Al-Habib', type: 'Annual Leave', duration: '5 days', date: '20/05/2024', status: RequestStatus.PENDING, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zaid', aiRisk: 'Low' },
    { id: '2', name: 'Sarah Jones', type: 'Travel Expense', duration: 'AED 1,200', date: '18/05/2024', status: RequestStatus.PENDING, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', aiRisk: 'Medium' },
  ]);

  const [activeTab, setActiveTab] = useState<'Approvals' | 'Insights'>('Approvals');

  const handleAction = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manager Hub</h1>
          <p className="text-slate-500 font-medium">Team Performance & AI Capacity Monitoring</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
           <button 
             onClick={() => setActiveTab('Approvals')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'Approvals' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}
           >
             Review Queue
           </button>
           <button 
             onClick={() => setActiveTab('Insights')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'Insights' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}
           >
             Workload AI
           </button>
        </div>
      </header>

      {activeTab === 'Approvals' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Pending Decisions</h3>
              <span className="bg-indigo-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg">Predictive Actions Enabled</span>
            </div>
            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
              {requests.length > 0 ? requests.map((req) => (
                <div key={req.id} className="p-8 hover:bg-slate-50/80 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <img src={req.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:rotate-3 transition-transform" />
                    <div>
                      <p className="font-black text-slate-900 text-lg leading-tight">{req.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {req.type}</span>
                        <span className="text-slate-200">|</span>
                        <span className="text-xs font-black text-indigo-600">{req.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                         <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${req.aiRisk === 'Low' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            AI Risk: {req.aiRisk}
                         </span>
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SUBMITTED {req.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleAction(req.id)} className="p-3 text-rose-400 hover:bg-rose-50 rounded-2xl transition-all"><XCircle className="w-8 h-8" /></button>
                    <button onClick={() => handleAction(req.id)} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all"><CheckCircle2 className="w-8 h-8" /></button>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                  <CheckCircle2 className="w-12 h-12 text-slate-200 mb-4" />
                  <h4 className="font-black text-slate-400 uppercase tracking-widest">Team Clear</h4>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <Brain className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:scale-125 transition-transform duration-700" />
                <h4 className="text-lg font-black uppercase tracking-widest mb-4">Review Assistant</h4>
                <p className="text-indigo-100 text-sm mb-8 leading-relaxed">Sarah Al-Zahra is due for a check-in. AI suggests focusing on "Leadership Growth" based on recent project success.</p>
                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                  Draft AI Review
                </button>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Engagement Score</h4>
                <div className="flex items-center gap-6 mb-8">
                   <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center border-2 border-emerald-100">
                      <Zap className="w-8 h-8 text-emerald-500" />
                   </div>
                   <div>
                      <p className="text-2xl font-black text-slate-900">8.9/10</p>
                      <p className="text-xs text-emerald-600 font-bold uppercase mt-0.5">PEAK PERFORMANCE</p>
                   </div>
                </div>
                <button className="w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                   View Team Feedback
                </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm col-span-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                 <TrendingUp className="text-indigo-600" /> Capacity Forecasting
              </h3>
              <div className="space-y-8">
                 {[
                   { member: 'John Doe', load: 85, status: 'Peak' },
                   { member: 'Ahmed Hassan', load: 45, status: 'Stable' },
                   { member: 'Fatima Al-Zahra', load: 95, status: 'Critical' },
                 ].map((mem, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-black text-slate-800">{mem.member}</span>
                         <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                           mem.status === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                         }`}>{mem.load}% Load</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-1000 ${
                           mem.status === 'Critical' ? 'bg-rose-500' : 'bg-indigo-600'
                         }`} style={{ width: `${mem.load}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <AlertTriangle className="text-amber-500 w-10 h-10 mb-6" />
              <h4 className="text-xl font-black mb-4">Fatigue Alert</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">2 team members in Engineering have logged over 48 hours this week. AI suggests redistributing tasks or approving upcoming leave requests.</p>
              <div className="space-y-4">
                 <button className="w-full py-4 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Redistribute Tasks</button>
                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Ignore Notification</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorPortal;
