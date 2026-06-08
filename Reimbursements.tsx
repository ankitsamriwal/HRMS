
import React, { useState, useRef, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Plane, 
  Fuel, 
  Coffee, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Camera, 
  Loader2,
  FileText,
  History,
  AlertCircle,
  ShieldCheck,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { ReimbursementRequest, ReimbursementType, RequestStatus, Role } from '../types';
import { scanReceiptAI, checkPolicyComplianceAI } from '../services/geminiService';

interface Props {
  role: Role;
}

const Reimbursements: React.FC<Props> = ({ role }) => {
  const [requests, setRequests] = useState<ReimbursementRequest[]>([
    { id: 'CLM-001', employeeId: 'EMP-01', employeeName: 'Ahmed Hassan', type: 'Fuel/Salik', amount: 350, date: '12/05/2024', description: 'Weekly site visits', status: RequestStatus.PAID, isPushedToERP: true, complianceRisk: 'Low' },
    { id: 'CLM-002', employeeId: 'EMP-02', employeeName: 'Fatima Al-Zahra', type: 'Travel Ticket', amount: 2400, date: '10/05/2024', description: 'Annual flight repatriation', status: RequestStatus.APPROVED, complianceRisk: 'Low' },
    { id: 'CLM-003', employeeId: 'EMP-03', employeeName: 'John Doe', type: 'Food', amount: 1500, date: '20/05/2024', description: 'Client dinner at Burj Al Arab', status: RequestStatus.PENDING, complianceRisk: 'High', complianceReason: 'Exceeds standard food allowance for grade.' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [pushingERP, setPushingERP] = useState<string | null>(null);
  const [newClaim, setNewClaim] = useState<Partial<ReimbursementRequest>>({
    type: 'Petty Cash',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const data = await scanReceiptAI(base64);
      if (data) {
        setNewClaim(prev => ({
          ...prev,
          amount: data.amount || prev.amount,
          date: data.date ? data.date.split('/').reverse().join('-') : prev.date,
          description: `Extracted from ${data.merchant || 'receipt'}`
        }));
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    const compliance = await checkPolicyComplianceAI(newClaim.type || 'Petty Cash', newClaim.amount || 0, newClaim.description || '');
    
    const claim: ReimbursementRequest = {
      ...newClaim as ReimbursementRequest,
      id: `CLM-${Math.floor(Math.random() * 1000)}`,
      employeeId: 'EMP-ME',
      employeeName: 'Current User',
      status: RequestStatus.PENDING,
      date: newClaim.date?.split('-').reverse().join('/') || '',
      complianceRisk: compliance.risk as any,
      complianceReason: compliance.reason
    };
    setRequests([claim, ...requests]);
    setIsModalOpen(false);
  };

  const updateStatus = (id: string, status: RequestStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
  };

  const pushToERP = (id: string) => {
    setPushingERP(id);
    setTimeout(() => {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, isPushedToERP: true } : r));
      setPushingERP(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Financial Claims</h1>
          <p className="text-slate-500 font-medium">UAE Expense Reimbursements & ERP Connectivity</p>
        </div>
        {role === 'Employee' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            <Plus className="w-5 h-5" /> New Claim
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all">
          <Plane className="w-8 h-8 text-sky-500 mb-4" />
          <h4 className="font-bold text-slate-800">Travel Tickets</h4>
          <p className="text-xs text-slate-400 mt-1">Repatriation allowance</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all">
          <ShieldCheck className="w-8 h-8 text-emerald-500 mb-4" />
          <h4 className="font-bold text-slate-800">AI Shield</h4>
          <p className="text-xs text-slate-400 mt-1">Fraud & Outlier Protection</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all">
          <Database className="w-8 h-8 text-amber-500 mb-4" />
          <h4 className="font-bold text-slate-800">ERP Status</h4>
          <p className="text-xs text-slate-400 mt-1">Live Financial Linking</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all">
          <History className="w-8 h-8 text-indigo-500 mb-4" />
          <h4 className="font-bold text-slate-800">Paid Claims</h4>
          <p className="text-xs text-slate-400 mt-1">Archive records</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Processing Queue</h3>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Low Risk
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Medium Risk
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400">
                <span className="w-2 h-2 bg-rose-500 rounded-full"></span> High Risk
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type & Compliance</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount (AED)</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ERP Link</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        req.complianceRisk === 'High' ? 'bg-rose-500 animate-pulse' :
                        req.complianceRisk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{req.type}</p>
                        {req.complianceReason && (
                          <p className="text-[9px] text-rose-500 font-bold uppercase tracking-tighter mt-0.5">{req.complianceReason}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-700">{req.employeeName}</td>
                  <td className="px-8 py-5 font-black text-slate-900">{req.amount.toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      req.status === RequestStatus.PENDING ? 'bg-amber-50 text-amber-600' :
                      req.status === RequestStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' :
                      req.status === RequestStatus.PAID ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {req.isPushedToERP ? (
                      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-lg w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Pushed
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Not Synced</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    {role === 'Admin' && req.status === RequestStatus.PAID && !req.isPushedToERP && (
                      <button 
                        onClick={() => pushToERP(req.id)}
                        disabled={pushingERP === req.id}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all"
                      >
                        {pushingERP === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowUpRight className="w-3 h-3" />}
                        Push to ERP
                      </button>
                    )}
                    {role !== 'Employee' && req.status === RequestStatus.PENDING && (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => updateStatus(req.id, RequestStatus.REJECTED)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors"><XCircle /></button>
                        <button onClick={() => updateStatus(req.id, RequestStatus.APPROVED)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"><CheckCircle2 /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">New Financial Claim</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400"><XCircle /></button>
            </div>
            <form onSubmit={submitClaim} className="p-8 space-y-6">
              <div className="bg-indigo-50/50 p-6 rounded-3xl border-2 border-dashed border-indigo-200 text-center relative">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                {isScanning ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-xs font-black text-indigo-600 uppercase tracking-widest animate-pulse">AI Scanning Receipt...</p>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2">
                    <Camera className="w-10 h-10 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-700">Upload Receipt for AI Auto-Fill</span>
                    <span className="text-[10px] text-slate-400 uppercase font-black">Supported: Fuel, Salik, Food, Taxi</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Claim Type</label>
                  <select 
                    value={newClaim.type} 
                    onChange={e => setNewClaim({...newClaim, type: e.target.value as ReimbursementType})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-500 outline-none"
                  >
                    <option value="Petty Cash">Petty Cash (Fuel, Taxi, Food)</option>
                    <option value="Travel Ticket">Annual Travel Ticket</option>
                    <option value="Cash Advance">Salary Cash Advance</option>
                    <option value="Fuel/Salik">Salik/Fuel Recharge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount (AED)</label>
                  <input 
                    type="number" 
                    value={newClaim.amount} 
                    onChange={e => setNewClaim({...newClaim, amount: parseFloat(e.target.value)})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Receipt Date</label>
                  <input 
                    type="date" 
                    value={newClaim.date} 
                    onChange={e => setNewClaim({...newClaim, date: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    value={newClaim.description} 
                    onChange={e => setNewClaim({...newClaim, description: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-indigo-500 outline-none"
                    rows={2}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                Submit Claim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reimbursements;
