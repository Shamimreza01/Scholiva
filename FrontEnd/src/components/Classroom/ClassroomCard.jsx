import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClassroomCard({ classroom, user, onJoin, onRequestManage }) {
  const navigate = useNavigate();
  const isTeacher = user.role === "teacher";
  const isMember = classroom.students?.some(
    (s) => (s._id || s) === user._id
  );
  const isPending = classroom.requests?.some(
    (r) => (r.student?._id || r.student || r) === user._id
  );

  const handleCardClick = () => {
    navigate(`/classroom/${classroom._id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white p-5 md:p-7 rounded-[28px] md:rounded-[32px] border border-slate-100 shadow-sm transition-all relative overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1.5 group"
    >
      {isTeacher && classroom.requests?.length > 0 && (
        <div className="absolute top-4 right-4 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-rose-200 animate-pulse z-10">
          {classroom.requests.length} NEW
        </div>
      )}
      
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
          <Users className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {classroom.name}
        </h3>
        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">
          {isTeacher
            ? `Admin Portfolio`
            : `Instructor: ${classroom.teacher.name.split(" ")[0]}`}
        </p>
      </div>

      {!isTeacher ? (
        <button
          onClick={(e) => { e.stopPropagation(); onJoin(classroom._id); }}
          disabled={isMember || isPending}
          className={`w-full py-3.5 rounded-xl font-black text-[13px] transition-all ${
            isMember 
              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
              : isPending 
                ? "bg-slate-50 text-slate-400 cursor-not-allowed" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          }`}
        >
          {isMember ? "Enter Classroom" : isPending ? "Waiting for Approval" : "Request Admission"}
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-50/80 p-3 rounded-2xl text-center border border-transparent hover:border-slate-100 transition-colors">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Scholars
            </p>
            <p className="font-bold text-slate-900">
              {classroom.students.length}
            </p>
          </div>
          <div className="bg-indigo-50/50 p-3 rounded-2xl text-center border border-transparent hover:border-indigo-100 transition-colors">
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
              Requests
            </p>
            <p className="font-bold text-indigo-600">
              {classroom.requests.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
