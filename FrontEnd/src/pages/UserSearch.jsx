import { useState, useEffect } from "react";
import { Search, User, Mail, GraduationCap, Users, Filter, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { useNavigate, useOutletContext } from "react-router-dom";
import UserSkeleton from "../components/Directory/UserSkeleton";

export default function UserSearch() {
  const { user: currentUser } = useOutletContext();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState(currentUser?.role === "student" ? "teacher" : ""); // Students only see teachers
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isStudent = currentUser?.role === "student";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Fetch if there's a query OR if it's a student (who should see teachers by default)
      if (query.length >= 2 || (query.length === 0)) {
        handleSearch();
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, role]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Role is already constrained by the state initialization and UI hiding for students
      const res = await api.get(`/users/search?query=${query}&role=${role}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {isStudent ? "Faculty Directory" : "Academic Directory"}
          </h1>
          <p className="text-slate-500 font-medium">
            {isStudent 
              ? "Discover and connect with mentors and faculty members across Scholiva."
              : "Discover and connect with faculty and fellow students across Scholiva."}
          </p>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={isStudent ? "Search for teachers by name..." : "Search by name or email..."}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            
            {!isStudent && (
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setRole("")}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${!role ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setRole("teacher")}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${role === "teacher" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Teachers
                </button>
                <button
                  onClick={() => setRole("student")}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${role === "student" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Students
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {users.map((user, idx) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/user/${user._id}`)}
                  className="bg-white border border-slate-200 rounded-[28px] p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-indigo-400" />
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-xl shrink-0 overflow-hidden shadow-sm">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.name[0].toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 truncate">{user.name}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          user.role === 'teacher' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm mb-3 font-medium">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      {user.bio && (
                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed italic">
                          "{user.bio}"
                        </p>
                      )}

                      {user.education && (
                        <div className="mt-4 flex items-center gap-2 text-indigo-600 text-[11px] font-bold">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{user.education}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : query.length >= 2 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">No matches found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search terms or filters.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
