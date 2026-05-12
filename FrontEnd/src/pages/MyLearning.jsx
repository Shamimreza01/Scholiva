import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Target, Zap, Award, Calendar,
  Layout, Filter, Search, Sparkles, CheckCircle2
} from 'lucide-react';

export default function MyLearning() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/users/learning-stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-50 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Learning Data...</p>
      </div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-16 space-y-16"
      >
        {/* ── Premium Header ── */}
        <section className="relative overflow-hidden bg-[#0F172A] rounded-[40px] md:rounded-[60px] p-8 md:p-20 text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] -mr-64 -mt-64 rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -ml-64 -mb-64 rounded-full pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-8 md:space-y-10">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-inner">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Achievement Hub</span>
              </motion.div>

              <div className="space-y-4 md:space-y-6">
                <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                  Scale Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">Intelligence.</span>
                </motion.h1>
                <motion.p variants={itemVariants} className="text-slate-400 text-base md:text-xl font-medium max-w-lg leading-relaxed">
                  Analyze performance, conquer classroom challenges, and unlock new academic heights through data-driven learning.
                </motion.p>
              </div>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-6 md:gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black text-white">{stats?.overall.total || 0}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Milestones Reached</span>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black text-white">{stats?.mcqStats.avgScore.toFixed(1)}%</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Accuracy</span>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <HeaderCard
                icon={<Target className="w-6 h-6 text-indigo-400" />}
                label="MCQ Performance"
                value={`${stats?.mcqStats.avgScore.toFixed(0)}%`}
                trend="+4.2%"
              />
              <HeaderCard
                icon={<GraduationCap className="w-6 h-6 text-emerald-400" />}
                label="Class Rank"
                value={`#${stats?.classrooms[0]?.rank || '-'}`}
                trend="Top 5%"
              />
            </motion.div>
          </div>
        </section>

        {/* ── Tab Navigation ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex p-1.5 bg-slate-50 rounded-[28px] border border-slate-100 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <TabItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Layout className="w-4 h-4" />} label="Overview" />
            <TabItem active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} icon={<GraduationCap className="w-4 h-4" />} label="Classrooms" />
            <TabItem active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Calendar className="w-4 h-4" />} label="Activity" />
          </div>
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12"
            >
              <div className="lg:col-span-2 space-y-10 md:space-y-12">
                {/* Elite Performance */}
                <section className="bg-white rounded-[40px] md:rounded-[48px] border border-slate-100 p-8 md:p-10 space-y-8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900">Elite Performance</h2>
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="space-y-4">
                    {stats?.classrooms.slice(0, 3).map((cls, idx) => (
                      <EliteRow key={cls._id} cls={cls} rank={cls.rank} delay={idx * 0.1} />
                    ))}
                    {!stats?.classrooms?.length && (
                      <p className="text-sm font-bold text-slate-400 text-center py-6">Join a classroom to see your rank here.</p>
                    )}
                  </div>
                </section>

                {/* Recent Milestones */}
                <section className="space-y-8">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">Recent Milestones</h2>
                  {stats?.submissions?.length === 0 ? (
                    <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 text-center">
                      <p className="text-sm font-bold text-slate-400">No quiz submissions yet. Head to <button onClick={() => navigate('/quizzes')} className="text-indigo-600 underline underline-offset-2">MCQ / Short Answer</button> to start!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {stats?.submissions.slice(0, 4).map((sub) => (
                        <div
                          key={sub._id}
                          className="p-6 md:p-8 bg-slate-50 rounded-[36px] md:rounded-[40px] border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-2xl transition-all cursor-pointer group"
                          onClick={() => navigate(`/quiz/${sub.quiz._id}`, { state: { submissionId: sub._id } })}
                        >
                          <div className="flex items-center gap-4 md:gap-5">
                            <div className="w-11 h-11 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                              <Zap className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm md:text-base">{sub.quiz.title}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{new Date(sub.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="w-11 h-11 md:w-12 md:h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 flex items-center justify-center font-black text-xs text-indigo-600 shrink-0">
                            {sub.score.toFixed(0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column */}
              <div className="space-y-10 md:space-y-12">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 md:p-10 rounded-[40px] md:rounded-[48px] text-white shadow-2xl shadow-indigo-200">
                  <h3 className="text-lg md:text-xl font-black mb-8 md:mb-10 flex items-center gap-3">
                    <Award className="w-6 h-6" /> Proficiency
                  </h3>
                  <div className="space-y-8 md:space-y-10">
                    <StatBar label="Critical Thinking" percent={88} />
                    <StatBar label="Recall Speed" percent={72} />
                    <StatBar label="Short Answer Logic" percent={stats?.shortStats.completed > 5 ? 90 : 40} />
                  </div>
                </div>

                <div className="bg-slate-900 p-8 md:p-10 rounded-[40px] md:rounded-[48px] text-white">
                  <h3 className="text-lg md:text-xl font-black mb-6 md:mb-8 text-indigo-400">Achievements</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <SmallBadge icon="🔥" label="Unstoppable" />
                    <SmallBadge icon="🧪" label="Analytical" />
                    <SmallBadge icon="📜" label="Historian" />
                    <SmallBadge icon="🎯" label="Sniper" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CLASSROOMS TAB */}
          {activeTab === 'classes' && (
            <motion.div
              key="classes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            >
              {stats?.classrooms.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-slate-400 font-bold">You haven't joined any classrooms yet.</p>
                </div>
              )}
              {stats?.classrooms.map((cls) => (
                <div
                  key={cls._id}
                  onClick={() => navigate(`/classroom/${cls._id}`)}
                  className="group bg-white p-8 md:p-10 rounded-[40px] md:rounded-[50px] border border-slate-100 shadow-sm hover:shadow-3xl hover:-translate-y-3 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full group-hover:bg-indigo-50 transition-colors"></div>
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-[20px] md:rounded-[24px] flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-50 border border-slate-50">
                        <GraduationCap className="w-7 h-7 md:w-8 md:h-8" />
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-slate-200 group-hover:text-indigo-100 transition-colors">#{cls.rank}</div>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1">{cls.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cls.teacher.name}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>XP Progress</span>
                        <span>{cls.myScore} PTS</span>
                      </div>
                      <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((cls.myScore / (cls.myScore + 50)) * 100, 100)}%` }}
                          className="h-full bg-indigo-600 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-[40px] md:rounded-[50px] border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 md:p-12 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">Activity Log</h2>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Comprehensive audit of your academic journey</p>
                </div>
                <Filter className="w-6 h-6 text-slate-300" />
              </div>

              {stats?.submissions?.length === 0 ? (
                <div className="p-16 text-center">
                  <p className="text-slate-400 font-bold">No activity recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 md:px-12 py-6 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Title</th>
                        <th className="px-8 md:px-12 py-6 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                        <th className="px-8 md:px-12 py-6 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Result</th>
                        <th className="px-8 md:px-12 py-6 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timeline</th>
                        <th className="px-8 md:px-12 py-6 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats?.submissions.map(sub => (
                        <tr
                          key={sub._id}
                          className="group hover:bg-slate-50/30 transition-colors cursor-pointer"
                          onClick={() => navigate(`/quiz/${sub.quiz._id}`, { state: { submissionId: sub._id } })}
                        >
                          <td className="px-8 md:px-12 py-6 md:py-8">
                            <p className="font-bold text-slate-900 text-base md:text-lg">{sub.quiz.title}</p>
                          </td>
                          <td className="px-8 md:px-12 py-6 md:py-8">
                            <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                              {sub.quiz.questions.some(q => q.type === 'short') ? 'Analysis' : 'Quant'}
                            </span>
                          </td>
                          <td className="px-8 md:px-12 py-6 md:py-8 text-center">
                            <span className="text-xl font-black text-indigo-600">{sub.score.toFixed(1)}</span>
                          </td>
                          <td className="px-8 md:px-12 py-6 md:py-8">
                            <span className="text-sm font-bold text-slate-500">
                              {new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                            </span>
                          </td>
                          <td className="px-8 md:px-12 py-6 md:py-8 text-right">
                            <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                              <CheckCircle2 className="w-4 h-4" /> Verified
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function HeaderCard({ icon, label, value, trend }) {
  return (
    <div className="bg-white/5 backdrop-blur-3xl p-6 md:p-8 rounded-[36px] md:rounded-[40px] border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-2xl flex items-center justify-center">
          {icon}
        </div>
        <span className="text-emerald-400 text-[10px] font-black tracking-widest">{trend}</span>
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-black text-white">{value}</div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">{label}</div>
      </div>
    </div>
  );
}

function TabItem({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3.5 md:py-4 rounded-[22px] font-black text-xs transition-all whitespace-nowrap ${
        active ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200/50' : 'text-slate-400 hover:text-slate-900'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function EliteRow({ cls, rank, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center justify-between p-6 md:p-8 bg-slate-50 rounded-[36px] md:rounded-[40px] border border-slate-100 group hover:bg-white hover:shadow-3xl hover:border-indigo-100 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4 md:gap-6">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-[18px] md:rounded-[20px] flex items-center justify-center font-black text-lg md:text-xl ${
          rank === 1 ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-300'
        }`}>
          #{rank}
        </div>
        <div>
          <h4 className="text-base md:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{cls.name}</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cls.teacher.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl md:text-2xl font-black text-slate-900">{cls.myScore}</p>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">ACCUMULATED XP</p>
      </div>
    </motion.div>
  );
}

function StatBar({ label, percent }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-200">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5 }}
          className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        ></motion.div>
      </div>
    </div>
  );
}

function SmallBadge({ icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center p-5 md:p-6 bg-white/5 rounded-[28px] md:rounded-[32px] border border-white/5 group hover:bg-indigo-500/10 transition-colors">
      <span className="text-2xl md:text-3xl mb-2 md:mb-3 group-hover:scale-125 transition-transform">{icon}</span>
      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">{label}</span>
    </div>
  );
}
