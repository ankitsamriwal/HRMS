
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { FileDown, Filter, Calendar as CalendarIcon, Download } from 'lucide-react';

const headcountData = [
  { month: 'Jan', count: 105 },
  { month: 'Feb', count: 108 },
  { month: 'Mar', count: 112 },
  { month: 'Apr', count: 115 },
  { month: 'May', count: 120 },
];

const turnoverData = [
  { month: 'Jan', rate: 1.2 },
  { month: 'Feb', rate: 0.8 },
  { month: 'Mar', rate: 1.5 },
  { month: 'Apr', rate: 0.5 },
  { month: 'May', rate: 0.9 },
];

const Reports: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Strategic Reports</h1>
          <p className="text-slate-500 font-medium">Advanced Workforce Analytics & Trends</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Headcount Growth</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+14% YoY</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={headcountData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Monthly Turnover Rate</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Goal: &lt; 2%</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                <Tooltip />
                <Line type="stepAfter" dataKey="rate" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Compliance Reports</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Emiratisation (NAFIS) Report', date: '01/05/2024', size: '2.4 MB' },
            { name: 'WPS Payroll Audit', date: '15/05/2024', size: '1.8 MB' },
            { name: 'Gratuity Provisioning', date: '10/05/2024', size: '3.1 MB' },
            { name: 'Visa Expiry Forecast', date: '20/05/2024', size: '0.9 MB' },
            { name: 'Training Compliance Score', date: '05/05/2024', size: '4.2 MB' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                  <FileDown className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{report.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{report.date} • {report.size}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
