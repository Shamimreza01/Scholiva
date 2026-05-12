import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { 
  Plus, LogOut, BookOpen, Clock, BarChart3, ArrowRight, Award, 
  Users, Home, Settings, UserPlus, Check, X, ShieldCheck, 
  Globe, Lock, MessageSquare, Search, Menu, Edit
} from 'lucide-react';

export default function Dashboard() {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      const uRes = await api.get('/users/profile');
      setUser(uRes.data);

      if (uRes.data.role === 'teacher') {
        if (activeTab === 'home') {
          const qRes = await api.get('/quizzes/teacher');
          setQuizzes(qRes.data);
        } else if (activeTab === 'classrooms' || activeTab === 'requests') {
          const cRes = await api.get('/classrooms');
          setClassrooms(cRes.data);
        }
      } else {
        if (activeTab === 'home') {
          const qRes = await api.get('/quizzes');
          setQuizzes(qRes.data);
          const sRes = await api.get('/submissions/my');
          setSubmissions(sRes.data);
        } else if (activeTab === 'teachers') {
          const tRes = await api.get('/users/teachers');
          setTeachers(tRes.data);
        } else if (activeTab === 'classrooms') {
          const cRes = await api.get('/classrooms/available');
          setClassrooms(cRes.data);
        }
      }
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateClassroom = async () => {
    if (!newRoomName) return;
    try {
      await api.post('/classrooms', { name: newRoomName });
      showToast("Classroom created!", "success");
      setIsRoomModalOpen(false);
      setNewRoomName('');
      fetchUserData();
    } catch (err) { showToast("Failed to create classroom", "error"); }
  };

  const handleConnectRequest = async (id) => {
    try {
      await api.post(`/users/connect/${id}`);
      showToast("Request sent!", "success");
      fetchUserData();
    } catch (err) { showToast("Request failed", "error"); }
  };

  const handleJoinClassroom = async (id) => {
    try {
      await api.post(`/classrooms/${id}/join`);
      showToast("Join request sent!", "success");
      fetchUserData();
    } catch (err) { showToast("Request failed", "error"); }
  };

  const handleRequestAction = async (id, action, type, extraId) => {
    try {
      if (type === 'connection') {
        await api.post('/users/requests', { studentId: id, action });
      } else {
        await api.post(`/classrooms/${extraId}/requests`, { studentId: id, action });
      }
      showToast(`Request ${action}ed`, "success");
      fetchUserData();
    } catch (err) { showToast("Action failed", "error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Award className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">QuizApp</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar - Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 z-50 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Award className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">QuizApp</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <TabButton id="home" icon={<Home className="w-5 h-5" />} label="Home" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
          {user?.role === 'teacher' ? (
            <>
              <TabButton id="classrooms" icon={<Users className="w-5 h-5" />} label="My Classrooms" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
              <TabButton id="requests" icon={<UserPlus className="w-5 h-5" />} label="Requests" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
            </>
          ) : (
            <>
              <TabButton id="teachers" icon={<Search className="w-5 h-5" />} label="Find Teachers" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
              <TabButton id="classrooms" icon={<Globe className="w-5 h-5" />} label="Classrooms" activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
            </>
          )}
        </nav>

        <div className="mt-auto">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-sm">
              {user?.name?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-slate-400 hover:text-rose-600 font-bold p-3 transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
        {activeTab === 'home' && (
          <div className="space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Welcome, {user?.name.split(' ')[0]}</h2>
                <p className="text-slate-500 mt-2 text-sm md:text-base">Here is what is happening today.</p>
              </div>
              {user?.role === 'teacher' && (
                <button onClick={() => navigate('/create-quiz')} className="w-full md:w-auto bg-indigo-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Create Quiz
                </button>
              )}
            </div>

            {/* Quizzes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes.map(quiz => (
                <QuizCard key={quiz._id} quiz={quiz} navigate={navigate} role={user?.role} />
              ))}
            </div>

            {user?.role === 'student' && submissions.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900">Recent Results</h3>
                <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quiz</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {submissions.map(sub => (
                        <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 font-bold text-slate-900">{sub.quiz.title}</td>
                          <td className="px-8 py-6">
                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black">{sub.score.toFixed(1)}</span>
                          </td>
                          <td className="px-8 py-6">
                            <button onClick={() => navigate(`/quiz/${sub.quiz._id}`, { state: { submissionId: sub._id } })} className="text-indigo-600 font-black text-[10px] uppercase hover:underline">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'classrooms' && (
          <div className="space-y-12">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black text-slate-900">Classrooms</h2>
              {user?.role === 'teacher' && (
                <button onClick={() => setIsRoomModalOpen(true)} className="bg-slate-900 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2">
                  <Plus className="w-5 h-5" /> New Room
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classrooms.map(c => (
                <div key={c._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{c.name}</h3>
                  <p className="text-sm text-slate-400 font-medium mb-6">{user?.role === 'teacher' ? `${c.students.length} Members` : `By ${c.teacher.name}`}</p>
                  
                  {user?.role === 'student' ? (
                    <button 
                      onClick={() => handleJoinClassroom(c._id)}
                      disabled={c.requests?.includes(user?._id) || c.students?.includes(user?._id)}
                      className="w-full py-4 rounded-xl font-black text-sm transition-all bg-indigo-600 text-white disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {c.students?.includes(user?._id) ? 'Joined' : c.requests?.includes(user?._id) ? 'Pending' : 'Request to Join'}
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-50 p-3 rounded-xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Members</p>
                        <p className="font-bold text-slate-900">{c.students.length}</p>
                      </div>
                      <div className="flex-1 bg-indigo-50 p-3 rounded-xl text-center">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pending</p>
                        <p className="font-bold text-indigo-600">{c.requests.length}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="space-y-12">
            <h2 className="text-4xl font-black text-slate-900">Teachers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.map(t => {
                const isConnected = t.connections.includes(user?._id);
                const isPending = t.pendingConnections.includes(user?._id);
                return (
                  <div key={t._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <div 
                      onClick={() => navigate(`/user/${t._id}`)}
                      className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                    >
                      <BookOpen className="w-10 h-10" />
                    </div>
                    <h3 onClick={() => navigate(`/teacher/${t._id}`)} className="text-xl font-bold text-slate-900 cursor-pointer hover:text-indigo-600">{t.name}</h3>
                    <p className="text-sm text-slate-400 mb-8">{t.email}</p>
                    <button 
                      onClick={() => handleConnectRequest(t._id)}
                      disabled={isConnected || isPending}
                      className="w-full py-4 rounded-xl font-black text-sm transition-all bg-indigo-600 text-white disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {isConnected ? 'Connected' : isPending ? 'Request Sent' : 'Connect to Teacher'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-12">
            <h2 className="text-4xl font-black text-slate-900">All Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Connection Requests */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-indigo-600" /> Connection Requests
                </h3>
                <div className="space-y-4">
                  {user?.pendingConnections?.map(student => {
                    console.log('Pending student:', student);
                    const studentName = typeof student === 'object' ? student.name : `Student (${student})`;
                    return (
                      <RequestItem 
                        key={typeof student === 'object' ? student._id : student} 
                        name={studentName} 
                        onProfileClick={() => navigate(`/user/${typeof student === 'object' ? student._id : student}`)}
                        onAccept={() => handleRequestAction(typeof student === 'object' ? student._id : student, 'accept', 'connection')}
                        onReject={() => handleRequestAction(typeof student === 'object' ? student._id : student, 'reject', 'connection')}
                      />
                    );
                  })}
                  {user?.pendingConnections?.length === 0 && <p className="text-slate-400">No pending connections.</p>}
                </div>
              </div>
              
              {/* Classroom Requests */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" /> Classroom Requests
                </h3>
                <div className="space-y-4">
                  {classrooms.map(c => c.requests.map(student => {
                    const studentName = typeof student === 'object' ? student.name : 'Unknown Student';
                    const studentId = typeof student === 'object' ? student._id : student;
                    return (
                      <RequestItem 
                        key={studentId} 
                        name={`${studentName} for ${c.name}`} 
                        onProfileClick={() => navigate(`/user/${studentId}`)}
                        onAccept={() => handleRequestAction(studentId, 'accept', 'classroom', c._id)}
                        onReject={() => handleRequestAction(studentId, 'reject', 'classroom', c._id)}
                      />
                    );
                  }))}
                  {classrooms.every(c => c.requests.length === 0) && <p className="text-slate-400">No pending room requests.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Classroom Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl border border-slate-100 scale-in-center">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Create New Room</h3>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Set a name for your private space</p>
            <input 
              autoFocus
              type="text" 
              placeholder="Room Name (e.g., Biology 101)" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 font-bold mb-8 outline-none"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setIsRoomModalOpen(false)}
                className="flex-1 py-4 text-slate-400 font-black text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateClassroom}
                className="flex-[2] py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ id, icon, label, activeTab, setActiveTab }) {
  const active = activeTab === id;
  return (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
        active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function QuizCard({ quiz, navigate, role }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center ${
          quiz.visibility === 'public' ? 'bg-emerald-50 text-emerald-600' : 
          quiz.visibility === 'protected' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {quiz.visibility === 'public' ? <Globe className="w-5 h-5 md:w-6 md:h-6" /> : 
           quiz.visibility === 'protected' ? <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" /> : <Lock className="w-5 h-5 md:w-6 md:h-6" />}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quiz.visibility}</span>
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 leading-tight">{quiz.title}</h3>
      <p 
        onClick={() => navigate(`/user/${quiz.teacher._id}`)}
        className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6 cursor-pointer hover:text-indigo-600 inline-block"
      >
        By {quiz.teacher.name}
      </p>
      
      <div className="flex gap-4 mb-8">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Clock className="w-4 h-4" /> {Math.floor(quiz.duration / 60)}m
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <BarChart3 className="w-4 h-4" /> {quiz.questions.length} Qs
        </div>
      </div>

      <div className="flex gap-2">
        {role === 'teacher' && (
          <button 
            onClick={() => navigate(`/edit-quiz/${quiz._id}`)}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            title="Edit Quiz"
          >
            <Edit className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={() => role === 'teacher' ? navigate(`/rankings/${quiz._id}`) : navigate(`/quiz/${quiz._id}`)}
          className="flex-1 py-4 rounded-xl font-black text-sm bg-slate-900 text-white group-hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
        >
          {role === 'teacher' ? 'Rankings' : 'Start Quiz'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function RequestItem({ name, onAccept, onReject, onProfileClick }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
      <span 
        onClick={onProfileClick}
        className="font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors"
      >
        {name}
      </span>
      <div className="flex gap-2">
        <button onClick={onAccept} className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><Check className="w-5 h-5" /></button>
        <button onClick={onReject} className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"><X className="w-5 h-5" /></button>
      </div>
    </div>
  );
}
