import { 
  Globe, ShieldCheck, Lock, Clock, BarChart3, ArrowRight, Edit 
} from "lucide-react";

export default function QuizCard({ quiz, navigate, role }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all relative">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center ${
            quiz.visibility === "public"
              ? "bg-emerald-50 text-emerald-600"
              : quiz.visibility === "protected"
                ? "bg-indigo-50 text-indigo-600"
                : "bg-rose-50 text-rose-600"
          }`}
        >
          {quiz.visibility === "public" ? (
            <Globe className="w-5 h-5 md:w-6 md:h-6" />
          ) : quiz.visibility === "protected" ? (
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <Lock className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {quiz.visibility}
        </span>
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 leading-tight">
        {quiz.title}
      </h3>
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
          <BarChart3 className="w-4 h-4" /> {quiz.questions?.length} Qs
        </div>
      </div>

      <div className="flex gap-2">
        {role === "teacher" && (
          <button
            onClick={() => navigate(`/edit-quiz/${quiz._id}`)}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            title="Edit Quiz"
          >
            <Edit className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() =>
            role === "teacher"
              ? navigate(`/rankings/${quiz._id}`)
              : navigate(`/quiz/${quiz._id}`)
          }
          className={`flex-1 py-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
            quiz.hasSubmitted 
              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
              : "bg-slate-900 text-white group-hover:bg-indigo-600"
          }`}
        >
          {role === "teacher" 
            ? "Rankings" 
            : quiz.hasSubmitted 
              ? "Review Result" 
              : "Start Quiz"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {quiz.hasSubmitted && (
        <div className="absolute top-6 right-6 bg-emerald-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">
          Completed
        </div>
      )}
    </div>
  );
}
