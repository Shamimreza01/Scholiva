import { useState, useEffect } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  Users, ShieldCheck, Trophy, ArrowLeft, 
  UserMinus, Check, X, GraduationCap, BarChart2
} from 'lucide-react';
import ConfirmModal from '../components/UI/ConfirmModal';
import RequestItem from '../components/Requests/RequestItem';

export default function ClassroomDetail() {
  const { id } = useParams();
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const [pendingAction, setPendingAction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [classRes, rankRes] = await Promise.all([
        api.get(`/classrooms/${id}`),
        api.get(`/classrooms/${id}/rankings`)
      ]);
      setClassroom(classRes.data);
      setRankings(rankRes.data);
    } catch (err) {
      console.error(err);
      navigate('/classrooms');
    }
  };

  const executeAction = async () => {
    if (!pendingAction) return;
    setLoading(true);
    try {
      const { studentId, action } = pendingAction;
      await api.post(`/classrooms/${id}/requests`, { studentId, action });
      fetchData();
      setPendingAction(null);
    } catch (err) {
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  if (!classroom) return null;

  const isTeacher = user.role === 'teacher';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => navigate('/classrooms')}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:shadow-lg transition-all border border-slate-50"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-4xl font-black text-slate-900">{classroom.name}</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Managed by {classroom.teacher.name} • {classroom.students.length} Members
          </p>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={executeAction}
        loading={loading}
        title={pendingAction?.action === 'accept' ? 'Approve Student' : 'Reject Request'}
        message={`Confirm ${pendingAction?.action} for ${pendingAction?.name}?`}
        confirmText={pendingAction?.action === 'accept' ? 'Approve' : 'Reject'}
      />

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[24px] w-fit">
        <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users className="w-4 h-4" />} label="Students" />
        {isTeacher && (
          <TabButton 
            active={activeTab === 'requests'} 
            onClick={() => setActiveTab('requests')} 
            icon={<ShieldCheck className="w-4 h-4" />} 
            label={`Requests (${classroom.requests.length})`} 
          />
        )}
        <TabButton active={activeTab === 'rankings'} onClick={() => setActiveTab('rankings')} icon={<Trophy className="w-4 h-4" />} label="Rankings" />
      </div>

      {/* Content */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm min-h-[400px]">
        {activeTab === 'students' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-600" /> Class Members
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classroom.students.map(s => (
                <div key={s._id} className="bg-slate-50 p-6 rounded-[32px] flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm">
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{s.email}</p>
                    </div>
                  </div>
                  {isTeacher && (
                    <button className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-rose-500 hover:text-white">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {classroom.students.length === 0 && <p className="text-slate-400 font-bold italic">No students joined yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" /> Pending Approval
            </h3>
            <div className="space-y-4">
              {classroom.requests.map(s => (
                <RequestItem 
                  key={s._id}
                  name={s.name}
                  onAccept={() => setPendingAction({ studentId: s._id, action: 'accept', name: s.name })}
                  onReject={() => setPendingAction({ studentId: s._id, action: 'reject', name: s.name })}
                  onProfileClick={() => navigate(`/user/${s._id}`)}
                />
              ))}
              {classroom.requests.length === 0 && <p className="text-slate-400 font-bold italic">No pending requests.</p>}
            </div>
          </div>
        )}

        {activeTab === 'rankings' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-amber-500" /> Classroom Leaderboard
            </h3>
            <div className="overflow-hidden rounded-[32px] border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Quizzes</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Avg Score</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rankings.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 font-black text-slate-300">#{i + 1}</td>
                      <td className="px-8 py-5">
                        <p className="font-bold text-slate-900">{r.name}</p>
                      </td>
                      <td className="px-8 py-5 text-center font-bold text-slate-600">{r.quizzesTaken}</td>
                      <td className="px-8 py-5 text-right font-bold text-indigo-600">{r.avgScore.toFixed(1)}%</td>
                      <td className="px-8 py-5 text-right font-black text-slate-900">{r.totalScore}</td>
                    </tr>
                  ))}
                  {rankings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-bold italic">No quiz data available yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-[20px] font-black text-xs transition-all ${
        active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {icon} {label}
    </button>
  );
}
