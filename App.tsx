
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Scale, 
  ShieldCheck, 
  Calculator, 
  LogOut, 
  Search, 
  Bell, 
  Menu,
  X,
  UserCircle,
  Briefcase,
  BarChart3,
  Sparkles,
  MessageSquare,
  Wallet,
  Globe,
  Database
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ComplianceAI from './components/ComplianceAI';
import GratuityCalc from './components/GratuityCalc';
import EmployeeList from './components/EmployeeList';
import EmployeePortal from './components/EmployeePortal';
import SupervisorPortal from './components/SupervisorPortal';
import Reports from './components/Reports';
import HRAssistant from './components/HRAssistant';
import Reimbursements from './components/Reimbursements';
import ERPConnector from './components/ERPConnector';
import { Role, Language } from './types';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; onClick?: () => void }> = ({ to, icon, label, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    {icon}
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </Link>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<Role>('Admin');
  const [lang, setLang] = useState<Language>('EN');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = lang === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'AR' ? 'ar' : 'en';
  }, [lang]);

  const canAccess = (feature: string) => {
    switch(feature) {
      case 'dashboard': return role === 'Admin' || role === 'Supervisor';
      case 'workforce': return role === 'Admin';
      case 'legal-ai': return role === 'Admin' || role === 'Supervisor';
      case 'gratuity': return role === 'Admin' || role === 'Supervisor';
      case 'reports': return role === 'Admin' || role === 'Supervisor';
      case 'manager-hub': return role === 'Admin' || role === 'Supervisor';
      case 'reimbursements': return true;
      case 'erp-settings': return role === 'Admin';
      case 'self-service': return true;
      case 'hr-buddy': return true;
      default: return false;
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' && role === 'Employee') navigate('/my-portal');
  }, [role, location.pathname, navigate]);

  const t = (en: string, ar: string) => lang === 'EN' ? en : ar;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className={`min-h-screen flex bg-slate-50 relative ${lang === 'AR' ? 'font-arabic' : ''}`}>
      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`fixed inset-y-0 ${lang === 'EN' ? 'left-0 border-r' : 'right-0 border-l'} z-50 w-72 bg-white border-slate-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : (lang === 'EN' ? '-translate-x-full' : 'translate-x-full')}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">{t('OPUS HR', 'أوبوس للموارد')}</h1>
              <p className="text-[10px] text-indigo-600 font-black tracking-widest uppercase">{t('UAE Enterprise', 'مؤسسة إماراتية')}</p>
            </div>
          </div>

          <nav className="space-y-1.5 flex-1 overflow-y-auto px-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4 rtl:mr-4 rtl:ml-0">{t('Management', 'الإدارة')}</div>
            {canAccess('dashboard') && <SidebarItem to="/" label={t('Dashboard', 'لوحة التحكم')} icon={<LayoutDashboard className="w-5 h-5" />} active={location.pathname === '/'} onClick={closeMobileMenu} />}
            {canAccess('workforce') && <SidebarItem to="/employees" label={t('Workforce', 'القوى العاملة')} icon={<Users className="w-5 h-5" />} active={location.pathname === '/employees'} onClick={closeMobileMenu} />}
            {canAccess('reports') && <SidebarItem to="/reports" label={t('Reports', 'التقارير')} icon={<BarChart3 className="w-5 h-5" />} active={location.pathname === '/reports'} onClick={closeMobileMenu} />}
            
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] my-6 ml-4 rtl:mr-4 rtl:ml-0">{t('Finance & Law', 'المالية والقانون')}</div>
            {canAccess('reimbursements') && <SidebarItem to="/claims" label={t('Claims Hub', 'مركز المطالبات')} icon={<Wallet className="w-5 h-5" />} active={location.pathname === '/claims'} onClick={closeMobileMenu} />}
            {canAccess('legal-ai') && <SidebarItem to="/compliance" label={t('Legal AI', 'الذكاء القانوني')} icon={<Scale className="w-5 h-5" />} active={location.pathname === '/compliance'} onClick={closeMobileMenu} />}
            {canAccess('gratuity') && <SidebarItem to="/gratuity" label={t('Gratuity', 'مكافأة الخدمة')} icon={<Calculator className="w-5 h-5" />} active={location.pathname === '/gratuity'} onClick={closeMobileMenu} />}
            {canAccess('erp-settings') && <SidebarItem to="/erp" label={t('ERP Link', 'ربط المحاسبة')} icon={<Database className="w-5 h-5" />} active={location.pathname === '/erp'} onClick={closeMobileMenu} />}
            
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] my-6 ml-4 rtl:mr-4 rtl:ml-0">{t('Personal', 'الشخصي')}</div>
            {canAccess('self-service') && <SidebarItem to="/my-portal" label={t('Portal', 'البوابة')} icon={<UserCircle className="w-5 h-5" />} active={location.pathname === '/my-portal'} onClick={closeMobileMenu} />}
            {canAccess('hr-buddy') && <SidebarItem to="/hr-buddy" label={t('AI Buddy', 'مساعد أوبوس')} icon={<Sparkles className="w-5 h-5" />} active={location.pathname === '/hr-buddy'} onClick={closeMobileMenu} />}
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <button 
              onClick={() => { setLang(lang === 'EN' ? 'AR' : 'EN'); closeMobileMenu(); }}
              className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl mb-4 group hover:bg-indigo-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-widest">{lang === 'EN' ? 'عربي' : 'English'}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{lang}</span>
            </button>
            <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
              <select 
                value={role} 
                onChange={(e) => { setRole(e.target.value as any); closeMobileMenu(); }}
                className="w-full bg-white border-2 border-slate-100 text-xs font-black rounded-xl p-3 focus:border-indigo-500 outline-none appearance-none"
              >
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      <main className={`flex-1 ${lang === 'EN' ? 'lg:ml-72' : 'lg:mr-72'} flex flex-col min-h-screen`}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">{t('Finance Bridge Active', 'ربط المالية نشط')}</span>
             </div>
          </div>
          <div className="flex items-center gap-3">
              <div className="text-right rtl:text-left">
                <p className="text-sm font-black text-slate-800">Sarah Al-Maktoum</p>
                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{role}</p>
              </div>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" alt="Profile" />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full flex-1">
          <Routes>
            <Route path="/" element={role !== 'Employee' ? <Dashboard /> : <Navigate to="/my-portal" />} />
            <Route path="/claims" element={<Reimbursements role={role} />} />
            <Route path="/erp" element={canAccess('erp-settings') ? <ERPConnector /> : <Navigate to="/claims" />} />
            <Route path="/compliance" element={canAccess('legal-ai') ? <ComplianceAI /> : <Navigate to="/my-portal" />} />
            <Route path="/gratuity" element={canAccess('gratuity') ? <GratuityCalc /> : <Navigate to="/my-portal" />} />
            <Route path="/employees" element={canAccess('workforce') ? <EmployeeList /> : <Navigate to="/my-portal" />} />
            <Route path="/reports" element={canAccess('reports') ? <Reports /> : <Navigate to="/my-portal" />} />
            <Route path="/my-portal" element={<EmployeePortal />} />
            <Route path="/hr-buddy" element={<HRAssistant />} />
            <Route path="*" element={<Navigate to="/my-portal" />} />
          </Routes>
        </div>
      </main>

      <button onClick={() => setIsChatOpen(!isChatOpen)} className={`fixed bottom-8 ${lang === 'EN' ? 'right-8' : 'left-8'} z-[100] bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 font-black group`}>
        <Sparkles className={`w-6 h-6 ${isChatOpen ? 'rotate-90' : ''} transition-transform`} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300">{t('Ask Opus AI', 'اسأل أوبوس')}</span>
      </button>

      {isChatOpen && (
        <div className={`fixed bottom-28 ${lang === 'EN' ? 'right-8' : 'left-8'} z-[100] w-full max-w-md h-[500px] animate-in slide-in-from-bottom-4`}>
          <div className="h-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
              <span className="font-black text-sm tracking-tight uppercase">{t('Instant HR Support', 'دعم فوري')}</span>
              <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-hidden"><HRAssistant /></div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
