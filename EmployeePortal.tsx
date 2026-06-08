
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  FileText, 
  Receipt, 
  CheckCircle2, 
  Download, 
  PenTool,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Compass,
  Sparkles,
  Zap,
  Loader2
} from 'lucide-react';
import { Policy, TrainingCourse } from '../types';
import { getTrainingRecommendationsAI } from '../services/geminiService';

const EmployeePortal: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(3);
  const onboardingSteps = ['Visa Processed', 'Medical Cleared', 'Emirates ID Applied', 'Bank Account Opening', 'Training Complete'];
  const [loadingTraining, setLoadingTraining] = useState(false);
  const [courses, setCourses] = useState<TrainingCourse[]>([
    { id: '1', title: 'UAE Corporate Law 101', provider: 'MOHRE Academy', relevance: 'Compliance' },
    { id: '2', title: 'DIFC Compliance 2024', provider: 'LinkedIn Learning', relevance: 'Regional Standards' },
  ]);

  const [policies] = useState<Policy[]>([
    { id: '1', title: 'UAE Labor Law Compliance 2024', description: 'Updated guidelines.', lastUpdated: '10/01/2024', isSigned: true },
    { id: '2', title: 'Remote Work Policy', description: 'Terms for hybrid arrangements.', lastUpdated: '15/03/2024', isSigned: false },
  ]);

  const fetchRecommendations = async () => {
    setLoadingTraining(true);
    const data = await getTrainingRecommendationsAI("Software Engineer", "Engineering");
    if (data.courses) setCourses(data.courses);
    setLoadingTraining(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm gap-6">
        <div className="flex items-center gap-6">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-20 h-20 rounded-[2rem] border-4 border-slate-50 shadow-xl" alt="Me" />
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marhaba, Sarah!</h1>
              <p className="text-slate-500 font-medium">Senior Engineer • Engineering</p>
           </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setIsCheckedIn(!isCheckedIn)}
             className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all shadow-xl ${
               isCheckedIn 
                 ? 'bg-rose-50 text-rose-600 border-2 border-rose-100 shadow-rose-100' 
                 : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5'
             }`}
           >
             <Clock className={`w-6 h-6 ${isCheckedIn ? 'animate-pulse' : ''}`} />
             {isCheckedIn ? 'End Shift' : 'Punch In'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <Compass className="text-indigo-600 w-5 h-5" /> Onboarding Path
                 </h3>
                 <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest">Stage {onboardingStep}/5</span>
              </div>
              <div className="flex items-center gap-4 px-2 relative z-10 overflow-x-auto pb-4">
                 {onboardingSteps.map((step, i) => (
                    <React.Fragment key={i}>
                       <div className="flex flex-col items-center min-w-[120px]">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                             i < onboardingStep ? 'bg-emerald-500 border-emerald-100 text-white' : 
                             i === onboardingStep ? 'bg-indigo-600 border-indigo-100 text-white animate-pulse' : 
                             'bg-slate-100 border-slate-50 text-slate-300'
                          }`}>
                             {i < onboardingStep ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-black">{i + 1}</span>}
                          </div>
                          <p className={`text-[9px] font-black uppercase tracking-widest mt-4 text-center leading-tight ${i <= onboardingStep ? 'text-slate-900' : 'text-slate-400'}`}>{step}</p>
                       </div>
                       {i < onboardingSteps.length - 1 && (
                          <div className={`w-16 h-1 rounded-full -mt-10 ${i < onboardingStep ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
                       )}
                    </React.Fragment>
                 ))}
              </div>
              <Zap className="absolute -right-8 -bottom-8 w-48 h-48 opacity-5 text-indigo-600" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">AI Upskilling Recommendations</h3>
                    <button onClick={fetchRecommendations} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                       <Sparkles className={`w-4 h-4 text-amber-500 ${loadingTraining ? 'animate-spin' : ''}`} />
                    </button>
                 </div>
                 <div className="space-y-4 relative z-10">
                    {courses.map((course, i) => (
                       <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center hover:bg-white hover:shadow-xl hover:border-indigo-500 transition-all cursor-pointer group/item">
                          <div>
                             <p className="font-black text-sm text-slate-900 group-hover/item:text-indigo-600">{course.title}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{course.provider}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-indigo-500 group-hover/item:translate-x-1 transition-all" />
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Peer Recognition</h3>
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner">
                       <Sparkles className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                       <p className="font-black text-lg">Rising Star 2024</p>
                       <p className="text-xs text-slate-400 leading-relaxed">Awarded by Engineering Lead for high-impact module delivery.</p>
                    </div>
                 </div>
                 <Activity className="absolute -right-8 -bottom-8 w-48 h-48 opacity-5 text-white" />
              </div>
           </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Verified Document</span>
              <h3 className="text-2xl font-black mt-2 mb-1">Salary Slip</h3>
              <p className="text-indigo-200 text-xs mb-8">Period: May 2024</p>
              <button className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
            <FileText className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Action Items</h3>
            <div className="space-y-4">
              {policies.filter(p => !p.isSigned).map(p => (
                <div key={p.id} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-rose-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500 text-white rounded-lg shadow-sm">
                      <PenTool className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest">{p.title}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between opacity-50 cursor-not-allowed">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-400 text-white rounded-lg shadow-sm">
                       <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visa Renewal Completed</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Activity = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
)

export default EmployeePortal;
