import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, GraduationCap, Users, Globe, BookOpen,
  CheckCircle2, BookMarked, RefreshCw, Search, SlidersHorizontal,
  ChevronDown, X, Sparkles
} from 'lucide-react';
import QuizCard from '../components/Quiz/QuizCard';

export default function Quizzes() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quizTypeFilter, setQuizTypeFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('all'); // 'all' | 'classroom' | 'network' | 'public'
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Categorize
  const categorized = {
    classroom: quizzes.filter(q => q.visibility === 'private'),
    network: quizzes.filter(q => q.visibility === 'protected'),
    public: quizzes.filter(q => q.visibility === 'public'),
  };

  const applyFilters = (list) => {
    let result = list;
    if (searchQuery) {
      result = result.filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (quizTypeFilter === 'mcq') {
      result = result.filter(q => q.questions?.some(qu => qu.type === 'mcq'));
    } else if (quizTypeFilter === 'short') {
      result = result.filter(q => q.questions?.some(qu => qu.type === 'short'));
    }
    return result;
  };

  const getDisplayList = () => {
    if (activeSection === 'classroom') return applyFilters(categorized.classroom);
    if (activeSection === 'network') return applyFilters(categorized.network);
    if (activeSection === 'public') return applyFilters(categorized.public);
    return applyFilters(quizzes);
  };

  const displayList = getDisplayList();
  const totalFiltered = displayList.length;

  const sections = [
    { id: 'all', label: 'All Quizzes', icon: <Sparkles className="w-4 h-4" />, count: applyFilters(quizzes).length, color: 'indigo' },
    { id: 'classroom', label: 'Classroom', icon: <GraduationCap className="w-4 h-4" />, count: applyFilters(categorized.classroom).length, color: 'violet' },
    { id: 'network', label: 'My Network', icon: <Users className="w-4 h-4" />, count: applyFilters(categorized.network).length, color: 'blue' },
    { id: 'public', label: 'Open Hub', icon: <Globe className="w-4 h-4" />, count: applyFilters(categorized.public).length, color: 'emerald' },
  ];

  const typeFilters = [
    { id: 'all', label: 'All Types', icon: <BookMarked className="w-3.5 h-3.5" /> },
    { id: 'mcq', label: 'MCQ', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'short', label: 'Short Answer', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  const colorMap = {
    indigo: { pill: 'bg-indigo-50 text-indigo-600 border-indigo-200', active: 'bg-indigo-600 text-white shadow-lg shadow-indigo-200', dot: 'bg-indigo-500' },
    violet: { pill: 'bg-violet-50 text-violet-600 border-violet-200', active: 'bg-violet-600 text-white shadow-lg shadow-violet-200', dot: 'bg-violet-500' },
    blue: { pill: 'bg-blue-50 text-blue-600 border-blue-200', active: 'bg-blue-600 text-white shadow-lg shadow-blue-200', dot: 'bg-blue-500' },
    emerald: { pill: 'bg-emerald-50 text-emerald-600 border-emerald-200', active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200', dot: 'bg-emerald-500' },
  };

  return (
    <div className="min-h-screen pb-20">
      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[32px] md:rounded-[48px] p-8 md:p-14 mb-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/20 blur-[100px] -mr-20 -mt-20 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-600/10 blur-[80px] -ml-20 -mb-20 rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quiz Library</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              MCQ &amp; <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                Short Answer
              </span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-md leading-relaxed">
              Browse, filter, and take assessments from your classrooms, network, and the open hub.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 shrink-0">
            <div className="text-center">
              <p className="text-3xl font-black text-white">{quizzes.length}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-black text-white">{categorized.classroom.length}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Assigned</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-black text-white">{quizzes.filter(q => q.hasSubmitted).length}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Completed</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Controls Row ── */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search + Refresh */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile: toggle filter drawer */}
          <button
            onClick={() => setFiltersOpen(p => !p)}
            className={`md:hidden flex items-center gap-2 px-4 py-3.5 rounded-2xl border font-black text-xs transition-all ${
              filtersOpen ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={() => fetchQuizzes(true)}
            disabled={refreshing}
            className="hidden md:flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Type Filter — always shown on desktop, slide-toggle on mobile */}
        {/* Desktop */}
        <div className="hidden md:flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Type:</span>
          {typeFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setQuizTypeFilter(f.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all border ${
                quizTypeFilter === f.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Mobile — slide open/closed */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              key="mobile-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                {typeFilters.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setQuizTypeFilter(f.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all border ${
                      quizTypeFilter === f.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                    }`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
                <button
                  onClick={() => fetchQuizzes(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:text-indigo-600 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Section Pills ── */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
        {sections.map(s => {
          const isActive = activeSection === s.id;
          const c = colorMap[s.color];
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap border ${
                isActive ? c.active + ' border-transparent' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s.icon} {s.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {s.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Quiz Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-[28px] border border-slate-100 p-8 space-y-4 animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
              <div className="h-4 bg-slate-100 rounded-full w-3/4" />
              <div className="h-3 bg-slate-50 rounded-full w-1/2" />
              <div className="flex gap-3 mt-2">
                <div className="h-3 bg-slate-100 rounded-full w-16" />
                <div className="h-3 bg-slate-100 rounded-full w-16" />
              </div>
              <div className="h-11 bg-slate-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
            <BrainCircuit className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-700 mb-2">No quizzes found</h3>
          <p className="text-sm text-slate-400 font-medium max-w-xs">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search.`
              : 'No quizzes match your current filters.'}
          </p>
          {(searchQuery || quizTypeFilter !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setQuizTypeFilter('all'); }}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          key={`${activeSection}-${quizTypeFilter}-${searchQuery}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayList.map((quiz, idx) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <QuizCard quiz={quiz} navigate={navigate} role="student" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Result count footer */}
      {!loading && displayList.length > 0 && (
        <p className="text-center text-[11px] font-black text-slate-300 uppercase tracking-widest mt-10">
          Showing {totalFiltered} quiz{totalFiltered !== 1 ? 'zes' : ''}
        </p>
      )}
    </div>
  );
}
