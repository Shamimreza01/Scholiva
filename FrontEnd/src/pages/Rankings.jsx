import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ChevronLeft, Award, Mail, Calendar, User, Search, Filter } from 'lucide-react';

export default function Rankings() {
  const { quizId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRankings();
  }, [quizId]);

  const fetchRankings = async () => {
    try {
      const qRes = await api.get(`/quizzes/${quizId}`);
      setQuiz(qRes.data);
      const res = await api.get(`/submissions/quiz/${quizId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error('Failed to fetch rankings');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Student Performance</h1>
            <p className="text-slate-500 text-lg">Results for: <span className="text-indigo-600 font-bold">{quiz?.title}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Attempts</span>
              <span className="text-2xl font-black text-slate-900">{submissions.length}</span>
            </div>
            <div className="bg-indigo-600 px-6 py-3 rounded-2xl shadow-lg shadow-indigo-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Pass Rate</span>
              <span className="text-2xl font-black text-white">
                {submissions.length > 0 ? Math.round((submissions.filter(s => s.score >= 5).length / submissions.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Rank</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Student Details</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Score</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Completion Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                    <td className="px-10 py-8">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                        index === 0 ? 'bg-amber-100 text-amber-600' : 
                        index === 1 ? 'bg-slate-200 text-slate-500' : 
                        index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div 
                        onClick={() => navigate(`/user/${sub.student._id}`)}
                        className="flex items-center gap-4 cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{sub.student.name}</p>
                          <div className="flex items-center gap-1.5 text-sm text-slate-400">
                            <Mail className="w-3 h-3" /> {sub.student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className={`text-2xl font-black ${sub.score >= 5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {sub.score.toFixed(1)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Points Scored</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 opacity-40" />
                        {new Date(sub.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-10 py-24 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="text-slate-200 w-10 h-10" />
                      </div>
                      <p className="text-slate-400 font-medium text-lg">No submissions recorded for this quiz yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
