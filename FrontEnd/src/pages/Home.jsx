import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../utils/api';
import { Plus } from 'lucide-react';
import QuizCard from '../components/Quiz/QuizCard';

export default function Home() {
  const { user } = useOutletContext();
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      if (user.role === 'teacher') {
        const res = await api.get('/quizzes/teacher');
        setQuizzes(res.data);
      } else {
        const [qRes, sRes] = await Promise.all([
          api.get('/quizzes'),
          api.get('/submissions/my')
        ]);
        setQuizzes(qRes.data);
        setSubmissions(sRes.data);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
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

      {/* Quizzes Grid */}
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
  );
}

