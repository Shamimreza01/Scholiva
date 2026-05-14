import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  FileText, 
  Users, 
  Globe, 
  Shield, 
  Lock, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  BarChart2, 
  ChevronRight,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

export default function AssessmentStudio() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchMyQuizzes();
  }, []);

  const fetchMyQuizzes = async () => {
    try {
      const res = await api.get("/quizzes/teacher");
      setQuizzes(res.data);
    } catch (err) {
      showToast("Failed to fetch assessments", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes(quizzes.filter(q => q._id !== id));
      showToast("Assessment deleted", "success");
    } catch (err) {
      showToast("Failed to delete assessment", "error");
    }
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Assessment Studio</h1>
              <p className="text-slate-500 font-medium">Manage your academic evaluations and track student performance.</p>
            </div>
            <button
              onClick={() => navigate("/create-quiz")}
              className="bg-indigo-600 text-white px-8 py-4 rounded-[20px] font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5" /> Create MCQ/Short Q
            </button>
          </div>
          
          <div className="mt-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by assessment title..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 bg-indigo-100 rounded-full mb-4" />
            <div className="h-4 w-48 bg-slate-200 rounded-full" />
          </div>
        ) : filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div 
                key={quiz._id}
                className="bg-white border border-slate-200 rounded-[32px] p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    quiz.visibility === 'public' ? 'bg-emerald-50 text-emerald-600' :
                    quiz.visibility === 'protected' ? 'bg-indigo-50 text-indigo-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => navigate(`/edit-quiz/${quiz._id}`)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(quiz._id)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                  {quiz.title}
                </h3>

                <div className="flex flex-wrap gap-3 mt-auto pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    <Clock className="w-3.5 h-3.5" /> {Math.floor(quiz.duration / 60)} min
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    <Users className="w-3.5 h-3.5" /> {quiz.participants?.length || 0} Attempts
                  </div>
                  <div className="ml-auto">
                     {quiz.visibility === 'public' ? <Globe className="w-3.5 h-3.5 text-emerald-400" /> :
                      quiz.visibility === 'protected' ? <Shield className="w-3.5 h-3.5 text-indigo-400" /> :
                      <Lock className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/rankings/${quiz._id}`)}
                  className="mt-6 w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-[13px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <BarChart2 className="w-4 h-4" /> View Performance <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-slate-900 font-black text-xl">No assessments yet</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Create your first MCQ or Short Question assessment to start evaluating your students.</p>
            <button
              onClick={() => navigate("/create-quiz")}
              className="mt-8 text-indigo-600 font-black flex items-center gap-2 mx-auto hover:gap-3 transition-all"
            >
              Start Creating <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
