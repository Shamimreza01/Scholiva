import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Home, 
  GraduationCap, 
  Users, 
  Zap, 
  Settings, 
  Search, 
  Bell,
  Menu
} from 'lucide-react';
import api from '../utils/api';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="relative mb-8">
          {/* Outer Pulse Rings */}
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping duration-[3000ms]" />
          <div className="absolute inset-0 bg-indigo-500/5 rounded-full animate-pulse duration-[2000ms]" />
          
          {/* Main Logo Container */}
          <div className="relative w-24 h-24 bg-indigo-600 rounded-[32px] shadow-2xl shadow-indigo-200 flex items-center justify-center group">
            <GraduationCap className="w-12 h-12 text-white animate-bounce duration-[2500ms]" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Scholiva</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
            Authenticating...
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="mt-12 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 animate-progress w-full rounded-full" />
        </div>
        
        <style>{`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-progress {
            animation: progress 1.5s infinite linear;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row overflow-x-hidden">
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 flex flex-col min-h-screen md:ml-[320px] overflow-hidden">
        {/* Global Professional Top Nav */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left Side: Search */}
            <div className="flex items-center gap-4 flex-1">
              {/* Search Bar - Professional Academic Style */}
              <div className="hidden lg:flex items-center w-full max-w-md relative group">
                <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search for courses, faculty, or research..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl outline-none text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* Center: Icons - Facebook/LinkedIn Professional Style */}
            <nav className="flex items-center gap-1 md:gap-2">
              <NavIcon 
                icon={<Home className="w-5 h-5" />} 
                label="Feed" 
                active={location.pathname === '/feed' || location.pathname === '/dashboard'} 
                onClick={() => navigate('/feed')}
              />
              <NavIcon 
                icon={<GraduationCap className="w-5 h-5" />} 
                label="Classrooms" 
                active={location.pathname.startsWith('/classroom')} 
                onClick={() => navigate('/classrooms')}
              />
              <NavIcon 
                icon={<Users className="w-5 h-5" />} 
                label="Faculty" 
                active={location.pathname === '/search'} 
                onClick={() => navigate('/search')}
              />
              {user.role === 'teacher' ? (
                <NavIcon 
                  icon={<Zap className="w-5 h-5" />} 
                  label="Studio" 
                  active={location.pathname === '/assessment-studio'} 
                  onClick={() => navigate('/assessment-studio')}
                />
              ) : (
                <NavIcon 
                  icon={<Zap className="w-5 h-5" />} 
                  label="Exams" 
                  active={location.pathname === '/quizzes'} 
                  onClick={() => navigate('/quizzes')}
                />
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/settings')}
                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ user, fetchProfile }} />
          </div>
        </div>
      </main>
    </div>
  );
}

function NavIcon({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-12 h-11 md:w-16 md:h-12 rounded-xl transition-all group ${
        active 
          ? "text-indigo-600 bg-indigo-50/50" 
          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
      }`}
      title={label}
    >
      <div className={`${active ? "scale-110" : "group-hover:scale-110"} transition-transform duration-200`}>
        {icon}
      </div>
      <div className={`absolute bottom-1 w-1 h-1 rounded-full bg-indigo-600 transition-all duration-300 ${active ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
    </button>
  );
}
