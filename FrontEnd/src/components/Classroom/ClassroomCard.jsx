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
      className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all relative overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1"
    >
      {isTeacher && classroom.requests?.length > 0 && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRequestManage(classroom); }}
          className="absolute top-6 right-6 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-rose-100 animate-bounce z-10"
        >
          {classroom.requests.length} NEW
        </button>
      )}
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
        <Users className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {classroom.name}
      </h3>
      <p className="text-sm text-slate-400 font-medium mb-6">
        {isTeacher
          ? `${classroom.students.length} Members`
          : `By ${classroom.teacher.name}`}
      </p>

      {!isTeacher ? (
        <button
          onClick={(e) => { e.stopPropagation(); onJoin(classroom._id); }}
          disabled={isMember || isPending}
          className="w-full py-4 rounded-xl font-black text-sm transition-all bg-indigo-600 text-white disabled:bg-slate-100 disabled:text-slate-400"
        >
          {isMember ? "View Room" : isPending ? "Pending" : "Request to Join"}
        </button>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-50 p-3 rounded-xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Members
            </p>
            <p className="font-bold text-slate-900">
              {classroom.students.length}
            </p>
          </div>
          <div className="flex-1 bg-indigo-50 p-3 rounded-xl text-center">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              Pending
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
