import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  ChevronLeft, BookOpen, Mail, Users, UserPlus, 
  ShieldCheck, Check, Clock, Award, Globe, Lock
} from 'lucide-react';
import QuizCard from '../components/Quiz/QuizCard';

export default function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [tRes, uRes] = await Promise.all([
        api.get(`/users/teacher/${id}`),
        api.get('/users/profile')
      ]);
      setTeacher(tRes.data);
      setCurrentUser(uRes.data);
      
      // Fetch public/accessible quizzes from this teacher
      const qRes = await api.get('/quizzes');
      const teacherQuizzes = qRes.data.filter(q => q.teacher._id === id);
      setQuizzes(teacherQuizzes);
      
      setLoading(false);
    } catch (err) {
      alert("Failed to load profile");
      navigate('/dashboard');
    }
  };

  const handleConnect = async () => {
    try {
      await api.post(`/users/connect/${id}`);
      fetchData();
    } catch (err) {
      alert("Connection request failed");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse">Loading Profile...</div>;

  const isConnected = teacher.connections?.some(c => c._id === currentUser?._id) || teacher.connections?.includes(currentUser?._id);
  const isPending = teacher.pendingConnections?.includes(currentUser?._id);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-10 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header Profile Card */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <BookOpen className="w-16 h-16" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 mb-2">{teacher.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 font-bold text-sm mb-6 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {teacher.email}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {teacher.connections?.length || 0} Connections</span>
              </div>
              
              <button 
                onClick={handleConnect}
                disabled={isConnected || isPending || currentUser?._id === teacher._id}
                className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  isConnected ? 'bg-emerald-50 text-emerald-600 cursor-default' :
                  isPending ? 'bg-slate-100 text-slate-400 cursor-default' :
                  'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:scale-[1.02]'
                }`}
              >
                {isConnected ? 'Connected' : isPending ? 'Request Pending' : 'Connect with Teacher'}
              </button>
            </div>
          </div>
        </div>

        {/* Teacher's Quizzes Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-slate-900">Quizzes by {teacher.name.split(' ')[0]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map(quiz => (
              <QuizCard key={quiz._id} quiz={quiz} navigate={navigate} role={currentUser?.role} />
            ))}
            {quizzes.length === 0 && (
              <div className="col-span-full bg-slate-100/50 p-12 rounded-[32px] text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No accessible quizzes found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
