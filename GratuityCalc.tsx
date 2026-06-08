
import React, { useState } from 'react';
import { Calculator, Calendar, Wallet, Landmark, Loader2 } from 'lucide-react';
import { calculateGratuityAI } from '../services/geminiService';
import { GratuityResult } from '../types';

const GratuityCalc: React.FC = () => {
  const [basicSalary, setBasicSalary] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('Resignation');
  const [result, setResult] = useState<GratuityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!basicSalary || !joiningDate || !endDate) return;
    setLoading(true);
    try {
      const calcResult = await calculateGratuityAI(
        parseFloat(basicSalary),
        joiningDate,
        endDate,
        reason
      );
      setResult(calcResult);
    } catch (err) {
      alert("Error calculating gratuity. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <Calculator className="text-indigo-600 w-6 h-6" />
          <h3 className="text-xl font-bold text-slate-800">Gratuity Calculator</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Basic Salary (AED)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">AED</span>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                className="w-full pl-12 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. 15000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Joining Date</label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Working Day</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Termination Type</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option>Resignation</option>
              <option>Termination for non-performance</option>
              <option>Termination for cause (Art. 44)</option>
              <option>Contract End</option>
            </select>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Calculate Gratuity'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {result ? (
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-emerald-800 font-bold text-lg mb-6 flex items-center gap-2">
              <Landmark className="w-5 h-5" /> Calculation Result
            </h4>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-4 rounded-xl border border-emerald-200">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Payable Amount</p>
                <p className="text-2xl font-black text-emerald-900">AED {result.gratuityAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-emerald-200">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Service Period</p>
                <p className="text-lg font-bold text-emerald-900">{result.years}Y {result.months}M {result.days}D</p>
              </div>
            </div>

            <div className="bg-emerald-100/50 p-6 rounded-xl border border-emerald-200">
              <h5 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Policy Breakdown
              </h5>
              <p className="text-emerald-800 text-sm leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Calculator className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">Enter employee details to see the gratuity breakdown according to Article 51 of the UAE Labor Law.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GratuityCalc;
