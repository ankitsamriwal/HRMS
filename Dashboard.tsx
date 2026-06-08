
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, Cell as ReCell
} from 'recharts';
import { Users, Scale, FileCheck, AlertTriangle, TrendingDown, Brain, Activity, UserCheck } from 'lucide-react';

const data = [
  { name: 'Eng', capacity: 92, load: 88 },
  { name: 'HR', capacity: 85, load: 70 },
  { name: 'Fin', capacity: 95, load: 60 },
  { name: 'Mkt', capacity: 80, load: 75 },
  { name: 'Ops', capacity: 70, load: 95 },
];

const riskData = [
  { name: 'Stable', value: 78, color: '#10b981' },
  { name: 'At Risk', value: 15, color: '#f59e0b' },
  { name: 'High Critical', value: 7, color: '#ef4444' },
];

const engagementTrend = [
  { day: 'Mon', score: 85 },
  { day: 'Tue', score: 88 },
  { day: 'Wed', score: 84 },
  { day: 'Thu', score: 91 },
  { day: 'Fri', score: 89 },
];

const DashboardCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; trend?: string }> = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-start justify-between group hover:border-indigo-100 transition-all">
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black mt-2 text-slate-900">{value}</h3>
      {trend && <p className="text-emerald-600 text-[10px] font-black mt-3 flex items-center gap-1">
        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
        {trend}
      </p>}
    </div>
    <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Control</h1>
          <p className="text-slate-500 font-medium">Predictive Compliance & Workforce Intelligence</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 text-center">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global Engagement</p>
              <p className="text-xl font-black text-indigo-600">8.4/10</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <DashboardCard 
          title="Total Workforce" 
          value="120" 
          icon={<Users className="text-indigo-600 w-6 h-6" />} 
          color="bg-indigo-50"
          trend="+4 This Quarter"
        />
        <DashboardCard 
          title="NAFIS Compliance" 
          value="10.2%" 
          icon={<Scale className="text-emerald-600 w-6 h-6" />} 
          color="bg-emerald-50"
          trend="STATUS: OPTIMIZED"
        />
        <DashboardCard 
          title="Attrition Score" 
          value="Low" 
          icon={<TrendingDown className="text-rose-600 w-6 h-6" />} 
          color="bg-rose-50"
          trend="AI Prediction: Stable"
        />
        <DashboardCard 
          title="WPS Compliance" 
          value="100%" 
          icon={<FileCheck className="text-sky-600 w-6 h-6" />} 
          color="bg-sky-50"
          trend="Cycle Verified"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" /> Capacity Forecasting vs Fatigue
            </h3>
            <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-500 rounded"></div> Capacity</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-400 rounded"></div> Workload</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                />
                <Bar dataKey="capacity" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="load" fill="#fb7185" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8">Attrition Heatmap (AI)</h3>
          <div className="h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: 700, fontSize: '11px'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <Activity className="w-8 h-8 text-indigo-600 mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiring Success</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">94%</h4>
            <p className="text-[10px] text-emerald-600 font-bold mt-2">AI VALIDATED</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <UserCheck className="w-8 h-8 text-emerald-600 mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emiratisation Path</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">+2.4%</h4>
            <p className="text-[10px] text-emerald-600 font-bold mt-2">AHEAD OF QUOTA</p>
         </div>
         <div className="col-span-2 bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Health</p>
               <h4 className="text-2xl font-black mt-1">SAML 2.0 Active</h4>
               <p className="text-xs text-indigo-400 mt-2 font-mono">TLS 1.3 | AES-256 Enabled</p>
            </div>
            <div className="bg-indigo-600/20 p-4 rounded-3xl border border-indigo-500/30">
               <Activity className="w-8 h-8 text-indigo-400" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
