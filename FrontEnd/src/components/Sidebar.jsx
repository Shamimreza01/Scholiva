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
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setIsOpen(false);

  // ─── Nav Item ──────────────────────────────────────────────────────────────
  const NavItem = ({ to, icon, label, badge }) => (
    <NavLink
      to={to}
      onClick={close}
      className={({ isActive }) =>
        `group flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-[13px] transition-all duration-200 ${
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-1"
            : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`shrink-0 transition-transform duration-200 ${
            isActive ? "scale-110" : "group-hover:scale-110"
          }`}>
            {icon}
          </span>
          <span className="flex-1 truncate tracking-tight">{label}</span>
          {badge && (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
              isActive ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"
            }`}>
              {badge}
            </span>
          )}
          {!isActive && (
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          )}
        </>
      )}
    </NavLink>
  );

  // ─── Section Label ─────────────────────────────────────────────────────────
  const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 pb-2 pt-6 first:pt-2">
      {children}
    </p>
  );

  return (
    <>
      {/* ── Mobile Header ──────────────────────────────────────────────── */}
      <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-900 font-black text-xl tracking-tighter">Scholiva</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all border border-slate-100"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Overlay ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 md:hidden animate-in fade-in duration-300"
          onClick={close}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-[280px] z-50
          bg-white border-r border-slate-100
          flex flex-col
          transition-all duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ── Brand ── */}
        <div className="px-7 py-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[18px] flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 font-black text-xl tracking-tighter leading-none">Scholiva</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mt-1.5 opacity-70">
                Academic Portal
              </p>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          
          {/* ─── STUDENT EXPERIENCE ───────────────────────────────── */}
          {user?.role !== "teacher" && (
            <>
              <SectionLabel>Campus</SectionLabel>
              <NavItem
                to="/feed"
                icon={<Compass className="w-4 h-4" />}
                label="Discovery Hub"
              />

              <SectionLabel>Academic Core</SectionLabel>
              <NavItem
                to="/my-learning"
                icon={<BarChart3 className="w-4 h-4" />}
                label="Performance Insights"
              />
              <NavItem
                to="/quizzes"
                icon={<BookOpenCheck className="w-4 h-4" />}
                label="Assessment Center"
                badge="Active"
              />

              <SectionLabel>Instructors</SectionLabel>
              <NavItem
                to="/classrooms"
                icon={<GraduationCap className="w-4 h-4" />}
                label="My Classrooms"
              />
              <NavItem
                to="/find-teachers"
                icon={<Search className="w-4 h-4" />}
                label="Faculty Search"
              />
            </>
          )}

          {/* ─── TEACHER EXPERIENCE ───────────────────────────────── */}
          {user?.role === "teacher" && (
            <>
              <SectionLabel>Portal</SectionLabel>
              <NavItem
                to="/feed"
                icon={<Compass className="w-4 h-4" />}
                label="Campus Feed"
              />

              <SectionLabel>Academic Studio</SectionLabel>
              <NavItem
                to="/create-quiz"
                icon={<PlusCircle className="w-4 h-4" />}
                label="Create Assessment"
              />

              <SectionLabel>Administration</SectionLabel>
              <NavItem
                to="/classrooms"
                icon={<Users className="w-4 h-4" />}
                label="My Classrooms"
              />
              <NavItem
                to="/requests"
                icon={<UserPlus className="w-4 h-4" />}
                label="Student Inquiries"
              />
            </>
          )}
        </nav>

        {/* ── Footer / User ── */}
        <div className="p-6 mt-auto">
          <div className="bg-slate-50/80 rounded-[28px] p-4 border border-slate-100 group">
            {/* User Profile */}
            <div 
              onClick={() => { navigate(`/user/${user._id}`); close(); }}
              className="flex items-center gap-3 mb-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 font-black shadow-sm overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-slate-900 text-[13px] font-black truncate leading-none mb-1">
                  {user?.name}
                </p>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-md border border-slate-100">
                  {user?.role}
                </span >
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { navigate("/settings"); close(); }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-slate-500 hover:text-indigo-600 border border-slate-100 shadow-sm transition-all text-[11px] font-black"
              >
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-slate-400 hover:text-rose-500 border border-slate-100 shadow-sm transition-all text-[11px] font-black"
              >
                <LogOut className="w-3.5 h-3.5" /> Exit
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
