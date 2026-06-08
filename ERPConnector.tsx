
import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Settings2, 
  BrainCircuit, 
  Code2, 
  ArrowRightLeft,
  Link2
} from 'lucide-react';
import { GLMapping, ReimbursementType } from '../types';
import { suggestGLCodeAI } from '../services/geminiService';

const ERPConnector: React.FC = () => {
  const [activeERP, setActiveERP] = useState<'SAP' | 'Oracle' | 'Odoo'>('SAP');
  const [mappings, setMappings] = useState<GLMapping[]>([
    { expenseType: 'Fuel/Salik', glCode: '610203', costCenter: 'CC-OPS-DXB' },
    { expenseType: 'Travel Ticket', glCode: '710500', costCenter: 'CC-HR-GLOBAL' },
  ]);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAISuggest = async (type: ReimbursementType) => {
    setLoading(type);
    const suggestion = await suggestGLCodeAI(type);
    setMappings(prev => prev.map(m => m.expenseType === type ? { ...m, glCode: suggestion.glCode, costCenter: suggestion.costCenter } : m));
    setLoading(null);
  };

  const erpOptions = [
    { id: 'SAP', name: 'SAP S/4HANA', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'Oracle', name: 'Oracle Cloud ERP', color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'Odoo', name: 'Odoo Finance', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">ERP Integration Hub</h1>
            <p className="text-slate-500 font-medium">Automatic Journal Entry Generation & Posting</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Gateway Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {erpOptions.map((erp) => (
            <button
              key={erp.id}
              onClick={() => setActiveERP(erp.id as any)}
              className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${
                activeERP === erp.id 
                  ? 'border-indigo-600 bg-indigo-50/30' 
                  : 'border-slate-100 hover:border-indigo-200'
              }`}
            >
              <div className={`p-4 rounded-2xl ${erp.bg}`}>
                <Database className={`w-8 h-8 ${erp.color}`} />
              </div>
              <p className="font-black text-slate-800 text-sm">{erp.name}</p>
              {activeERP === erp.id && (
                <span className="text-[9px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase">Connected</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-3">
            <Code2 className="text-indigo-600" />
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">GL Account Mapping</h3>
          </div>
          <button className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase hover:underline">
            <RefreshCw className="w-3 h-3" /> Sync Master Data
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expense Category</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">GL Account Code</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost Center</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Suggestion</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mappings.map((mapping, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-800">{mapping.expenseType}</td>
                  <td className="px-8 py-5">
                    <input 
                      type="text" 
                      value={mapping.glCode} 
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:border-indigo-500 outline-none w-32"
                    />
                  </td>
                  <td className="px-8 py-5">
                    <input 
                      type="text" 
                      value={mapping.costCenter} 
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:border-indigo-500 outline-none w-40"
                    />
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => handleAISuggest(mapping.expenseType)}
                      disabled={loading === mapping.expenseType}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all disabled:opacity-50"
                    >
                      {loading === mapping.expenseType ? <RefreshCw className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                      Smart Auto-Fill
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Settings2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
          <h4 className="text-xl font-black mb-6 flex items-center gap-2">
            <ArrowRightLeft className="text-indigo-400" /> Journal Entry Payload Preview
          </h4>
          <div className="bg-slate-800 p-6 rounded-2xl font-mono text-xs text-indigo-200 leading-relaxed overflow-x-auto">
            <pre>{`{
  "Header": {
    "CompanyCode": "OPUS_UAE",
    "DocDate": "2024-05-22",
    "Currency": "AED"
  },
  "Items": [
    {
      "GLAccount": "${mappings[0].glCode}",
      "Amount": 350.00,
      "CostCenter": "${mappings[0].costCenter}",
      "Text": "Reimbursement: CLM-001"
    }
  ]
}`}</pre>
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center">
          <div className="p-4 bg-white/10 rounded-full mb-6">
            <Link2 className="w-12 h-12" />
          </div>
          <h4 className="text-2xl font-black mb-2">Automated Pushing</h4>
          <p className="text-indigo-100 text-sm mb-8 max-w-xs">Enable real-time pushing of approved and paid expenses directly to {activeERP}.</p>
          <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
            Activate Live Bridge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ERPConnector;
