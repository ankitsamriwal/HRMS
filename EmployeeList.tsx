
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus,
  X,
  Mail,
  Briefcase,
  Camera,
  RefreshCw,
  Banknote,
  User,
  Hash,
  CheckSquare,
  MoreVertical
} from 'lucide-react';
import { Employee, VisaStatus, Department } from '../types';

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'OPUS-2024-001',
    name: 'Ahmed Hassan',
    position: 'Senior Engineer',
    department: 'Engineering',
    joiningDate: '15/03/2021',
    basicSalary: 15000,
    totalSalary: 25000,
    visaStatus: VisaStatus.RESIDENT,
    isEmirati: false,
    email: 'ahmed.h@opus.ae',
    avatar: 'https://picsum.photos/seed/ahmed/40/40',
    leaveBalances: { annual: 15, sick: 10, parental: 0 }
  },
  {
    id: 'OPUS-2024-002',
    name: 'Fatima Al-Zahra',
    position: 'HR Manager',
    department: 'HR',
    joiningDate: '01/11/2020',
    basicSalary: 18000,
    totalSalary: 30000,
    visaStatus: VisaStatus.RESIDENT,
    isEmirati: true,
    email: 'fatima.a@opus.ae',
    avatar: 'https://picsum.photos/seed/fatima/40/40',
    leaveBalances: { annual: 22, sick: 15, parental: 0 }
  }
];

// Helper for DD/MM/YYYY
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  // If already formatted or is YYYY-MM-DD
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }
  return dateStr;
};

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [editingSalaryEmp, setEditingSalaryEmp] = useState<Employee | null>(null);

  const [salaryForm, setSalaryForm] = useState({ basic: 0 });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [newEmp, setNewEmp] = useState<Partial<Employee>>({
    name: '',
    position: '',
    department: 'Engineering',
    visaStatus: VisaStatus.RESIDENT,
    email: '',
    joiningDate: new Date().toISOString().split('T')[0],
    avatar: '',
    supervisorId: ''
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = 
        emp.name.toLowerCase().includes(lowerSearch) || 
        emp.id.toLowerCase().includes(lowerSearch);
      const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchTerm, deptFilter]);

  const upcomingId = useMemo(() => {
    const year = new Date().getFullYear();
    const count = employees.length + 1;
    return `OPUS-${year}-${count.toString().padStart(3, '0')}`;
  }, [employees]);

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setIsCameraActive(false);
      alert("Camera access denied.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        setNewEmp(prev => ({ ...prev, avatar: canvasRef.current!.toDataURL('image/jpeg') }));
        stopCamera();
      }
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const employee: Employee = {
      ...newEmp as Employee,
      id: upcomingId,
      joiningDate: formatDate(newEmp.joiningDate!),
      avatar: newEmp.avatar || `https://picsum.photos/seed/${newEmp.name}/128/128`,
      basicSalary: 0,
      totalSalary: 0,
      isEmirati: false,
      leaveBalances: { annual: 30, sick: 15, parental: 0 }
    };
    setEmployees([employee, ...employees]);
    setIsModalOpen(false);
    setNewEmp({ name: '', position: '', department: 'Engineering', visaStatus: VisaStatus.RESIDENT, email: '', joiningDate: new Date().toISOString().split('T')[0], avatar: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workforce Directory</h1>
          <p className="text-slate-600">Standardized UAE Employment Records</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          <UserPlus className="w-5 h-5" /> Add Member
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by Employee Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </div>
        <select 
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value as any)}
          className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer transition-all"
        >
          <option value="All">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Employee Details</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Role & Team</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Joined On</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Visa Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm ring-2 ring-white" />
                      <div>
                        <p className="font-bold text-slate-900">{emp.name}</p>
                        <p className="text-xs font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-0.5">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{emp.position}</p>
                    <p className="text-xs text-slate-500 font-medium">{emp.department}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {emp.joiningDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${emp.visaStatus === 'Resident' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {emp.visaStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      {/* Added missing MoreVertical icon */}
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
                  <UserPlus className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">New Workforce Onboarding</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Hash className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">ASSIGNED ID: {upcomingId}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => { setIsModalOpen(false); stopCamera(); }} className="p-2 text-slate-400 hover:bg-slate-100 rounded-2xl">
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-8 space-y-8">
              <div className="flex flex-col items-center gap-6 py-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="relative w-36 h-36 rounded-[2.5rem] overflow-hidden bg-slate-200 border-4 border-white shadow-2xl ring-1 ring-slate-200">
                  {isCameraActive ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : (
                    newEmp.avatar ? <img src={newEmp.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-100"><User className="w-16 h-16 text-slate-300" /></div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex gap-3">
                  {!isCameraActive ? (
                    <button type="button" onClick={startCamera} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm">
                      <Camera className="w-4 h-4" /> {newEmp.avatar ? 'Retake Photo' : 'Capture Member Photo'}
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button type="button" onClick={capturePhoto} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700">Capture Now</button>
                      <button type="button" onClick={stopCamera} className="px-8 py-3 bg-slate-200 text-slate-700 rounded-2xl text-sm font-black hover:bg-slate-300">Exit Camera</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2 ml-1">Full Legal Name</label>
                  <input required type="text" placeholder="Johnathan Doe" value={newEmp.name} onChange={(e) => setNewEmp({...newEmp, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2 ml-1">Joined Date</label>
                  <input required type="date" value={newEmp.joiningDate} onChange={(e) => setNewEmp({...newEmp, joiningDate: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all font-bold text-slate-900" />
                  <p className="text-[10px] text-slate-400 mt-2 italic">Format displayed system-wide as DD/MM/YYYY</p>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2 ml-1">Department</label>
                  <select value={newEmp.department} onChange={(e) => setNewEmp({...newEmp, department: e.target.value as Department})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:outline-none transition-all font-bold text-slate-900 cursor-pointer">
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-100 text-slate-600 font-black hover:bg-slate-50 transition-all">Cancel Process</button>
                <button type="submit" className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100">Confirm & Onboard</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
