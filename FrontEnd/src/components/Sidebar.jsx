import {
  BrainCircuit,
  ChevronRight,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Settings,
  UserPlus,
  X,
  LayoutDashboard,
  ClipboardList,
  BookOpenCheck,
  Users,
  FileEdit,
  Zap,
  BarChart3,
  Compass,
  Bell,
  MoreHorizontal,
  Bookmark,
  Calendar,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ user, onLogout, isOpen, onClose }) {
  const navigate = useNavigate();

  const NavItem = ({ to, icon, label, badge, color = "indigo" }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-2 py-2 rounded-xl font-medium text-[14px] transition-all duration-200 ${
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
        to === window.location.pathname ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
      }`}>
        {icon}
      </div>
      <span className="flex-1 truncate font-semibold tracking-tight">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm">
          {badge}
        </span>
      )}
    </NavLink>
  );

  const SectionLabel = ({ children }) => (
    <div className="flex items-center justify-between px-2 pt-6 pb-2">
      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider uppercase tracking-widest">
        {children}
      </p>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`
          fixed top-0 md:left-0 h-screen w-[320px] z-[58]
          bg-[#F7F8FA] border-l md:border-r border-slate-200/60
          flex flex-col overflow-hidden
          transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? "right-0 translate-x-0" : "right-0 translate-x-full md:translate-x-0"}
        `}
      >
        {/* Top Branding & Profile Area */}
        <div className="bg-white px-6 py-6 border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900">Scholiva</h1>
          </div>

          {/* User Card - Facebook Style */}
          <div 
            onClick={() => { navigate(`/user/${user._id}`); onClose(); }}
            className="flex items-center gap-4 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="User" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 font-medium capitalize">{user?.role} Portal</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
          
          <div className="space-y-1">
            <NavItem
              to="/feed"
              icon={<Home className="w-5 h-5" />}
              label="Home Feed"
            />
            <NavItem
              to="/search"
              icon={<Search className="w-5 h-5" />}
              label={user?.role === "student" ? "Faculty Directory" : "Academic Directory"}
            />
          </div>

          {/* Dynamic Shortcuts based on role */}
          <SectionLabel>Your Shortcuts</SectionLabel>
          <div className="space-y-1">
            {user?.role === "teacher" ? (
              <>
                <NavItem
                  to="/assessment-studio"
                  icon={<PlusCircle className="w-5 h-5" />}
                  label="Assessment Studio"
                />
                <NavItem
                  to="/requests"
                  icon={<UserPlus className="w-5 h-5" />}
                  label="Student Requests"
                />
              </>
            ) : (
              <>
                <NavItem
                  to="/my-learning"
                  icon={<BarChart3 className="w-5 h-5" />}
                  label="Learning Insights"
                />
                <NavItem
                  to="/quizzes"
                  icon={<BookOpenCheck className="w-5 h-5" />}
                  label="Exam Center"
                />
              </>
            )}
            <NavItem
              to="/classrooms"
              icon={<GraduationCap className="w-5 h-5" />}
              label="Virtual Classrooms"
            />
          </div>
        </div>

        {/* Bottom Utility Card */}
        <div className="p-4 bg-white border-t border-slate-100 mt-auto shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => { navigate("/settings"); onClose(); }}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100"
            >
              <Settings className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Logout</span>
            </button>
          </div>

          {/* Developer Credit */}
          <div className="pt-2 text-center border-t border-slate-50">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Designed & Built By</p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://github.com/Shamimreza01" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-900 transition-colors"
                title="Md Shamim Reza - GitHub"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </div>
              </a>
              <p className="text-[11px] font-black text-slate-800 tracking-tight">Shamim Reza</p>
              <a 
                href="https://www.linkedin.com/in/shamimreza01/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors"
                title="Md Shamim Reza - LinkedIn"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
