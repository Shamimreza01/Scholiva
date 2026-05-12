import {
  BookOpen,
  Globe,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const NavItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) => `
        flex items-center gap-3 p-4 rounded-2xl font-bold transition-all
        ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:bg-slate-50"}
      `}
    >
      {icon} {label}
    </NavLink>
  );

  return (
    <>
      {/* ... (mobile header remains same) ... */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img
            src="./scolivaLogo.png"
            alt="Scoliva Logo"
            className="h-12 rounded-2xl object-cover"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Content */}
      <aside
        className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 z-50 transition-transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="hidden md:flex items-center gap-3">
          <img
            src="./scolivaLogo.png"
            alt="Scoliva Logo"
            className="h-12 rounded-2xl object-cover"
          />
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Scholiva
          </h1>
        </div>

        <div className="flex flex-col gap-8 overflow-y-auto custom-scrollbar">
          {/* Social Section */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">
              Social Feed
            </p>
            <NavItem
              to="/feed"
              icon={<Globe className="w-5 h-5" />}
              label="Global Feed"
            />
          </div>

          {/* Academic Section */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">
              Management
            </p>
            {user?.role === "teacher" ? (
              <>
                <NavItem
                  to="/create-quiz"
                  icon={<PlusCircle className="w-5 h-5" />}
                  label="Create Quiz"
                />
                <NavItem
                  to="/classrooms"
                  icon={<Users className="w-5 h-5" />}
                  label="My Classrooms"
                />
                <NavItem
                  to="/requests"
                  icon={<UserPlus className="w-5 h-5" />}
                  label="Requests"
                />
              </>
            ) : (
              <>
                <NavItem
                  to="/my-learning"
                  icon={<BookOpen className="w-5 h-5" />}
                  label="My Learning"
                />
                <NavItem
                  to="/find-teachers"
                  icon={<Search className="w-5 h-5" />}
                  label="Discover"
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <div
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4 group cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => navigate(`/user/${user._id}`)}
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-sm overflow-hidden shrink-0">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.[0]
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user?.name}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/settings");
                }}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors flex items-center gap-1"
              >
                <Settings className="w-3 h-3" /> Edit Profile
              </button>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-rose-600 font-bold p-3 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
