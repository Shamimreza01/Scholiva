import * as LucideIcons from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import QuizCard from "../components/Quiz/QuizCard";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

// Safe Icon Component
const Icon = ({ name, className = "w-5 h-5" }) => {
  const Component = LucideIcons[name] || LucideIcons.Globe || (() => <div className={className} />);
  return <Component className={className} />;
};

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profileUser, setProfileUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useOutletContext();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const pRes = await api.get(`/users/${id}`);
      setProfileUser(pRes.data);

      if (pRes.data.role === "teacher") {
        const qRes = await api.get("/quizzes");
        const teacherQuizzes = qRes.data.filter((q) => q.teacher._id === id);
        setQuizzes(teacherQuizzes);
      }
      setLoading(false);
    } catch (err) {
      showToast("Failed to load profile", "error");
      navigate("/dashboard");
    }
  };

  const handleConnect = async () => {
    try {
      await api.post(`/users/connect/${id}`);
      showToast("Connection request sent!", "success");
      fetchData();
    } catch (err) {
      showToast("Connection request failed", "error");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center font-black text-indigo-600 animate-pulse py-20">
        Loading Profile...
      </div>
    );

  const isTeacher = profileUser.role === "teacher";
  const isConnected = profileUser.connections?.some(
    (c) => c._id === currentUser?._id || c === currentUser?._id,
  );
  const isPending = profileUser.pendingConnections?.some(
    (p) => p === currentUser?._id,
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 md:mb-8 transition-colors group px-4 md:px-0"
      >
        <Icon name="ChevronLeft" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Header Profile Card */}
      <div className="bg-white rounded-[24px] md:rounded-[40px] shadow-sm border border-slate-100 p-6 md:p-12 mb-8 mx-4 md:mx-0">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div
            className={`w-28 h-28 md:w-32 md:h-32 rounded-[28px] md:rounded-[40px] flex items-center justify-center overflow-hidden shadow-xl border-4 border-white ${isTeacher ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"}`}
          >
            {profileUser.profilePicture ? (
              <img src={profileUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : isTeacher ? (
              <Icon name="BookOpen" className="w-12 h-12 md:w-16 md:h-16" />
            ) : (
              <Icon name="GraduationCap" className="w-12 h-12 md:w-16 md:h-16" />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-3">
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                {profileUser.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] ${isTeacher ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"}`}
              >
                {profileUser.role}
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6 text-slate-400 font-bold text-[10px] md:text-xs mb-8 md:mb-6 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Icon name="Mail" className="w-4 h-4 text-slate-300" /> {profileUser.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="Users" className="w-4 h-4 text-slate-300" />{" "}
                {profileUser.connections?.length || 0} Connections
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              {isTeacher && currentUser?.role === "student" && (
                <button
                  onClick={handleConnect}
                  disabled={isConnected || isPending || currentUser?._id === profileUser._id}
                  className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    isConnected ? "bg-emerald-50 text-emerald-600 cursor-default" : isPending ? "bg-slate-100 text-slate-400 cursor-default" : "bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95"
                  }`}
                >
                  {isConnected ? "Connected" : isPending ? "Request Pending" : "Connect"}
                </button>
              )}
              {currentUser?._id === profileUser._id && (
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95"
                >
                  <Icon name="Settings" className="w-5 h-5" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 px-4 md:px-0">
        <div className="md:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-[28px] md:rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">About {profileUser.name}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {profileUser.bio || "No bio provided yet."}
            </p>
          </div>

          {profileUser.education && (
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Icon name="GraduationCap" className="w-4 h-4 text-indigo-600" /> Education
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {profileUser.education}
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Connect</h3>
            <div className="space-y-4">
              {profileUser.socialLinks?.twitter && (
                <a href={profileUser.socialLinks.twitter} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-sky-50 transition-colors group">
                  <span className="flex items-center gap-3 font-bold text-sm text-slate-600 group-hover:text-sky-600"><Icon name="Twitter" className="w-4 h-4" /> Twitter</span>
                  <Icon name="ExternalLink" className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
              )}
              {profileUser.socialLinks?.linkedin && (
                <a href={profileUser.socialLinks.linkedin} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                  <span className="flex items-center gap-3 font-bold text-sm text-slate-600 group-hover:text-blue-600"><Icon name="Linkedin" className="w-4 h-4" /> LinkedIn</span>
                  <Icon name="ExternalLink" className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
              )}
              {profileUser.socialLinks?.github && (
                <a href={profileUser.socialLinks.github} target="_blank" className="flex items-center justify-blank p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                  <span className="flex items-center gap-3 font-bold text-sm text-slate-600 group-hover:text-slate-900"><Icon name="Github" className="w-4 h-4" /> GitHub</span>
                  <Icon name="ExternalLink" className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
              )}
              {!profileUser.socialLinks?.twitter && !profileUser.socialLinks?.linkedin && !profileUser.socialLinks?.github && (
                <p className="text-slate-400 text-[10px] font-black uppercase text-center py-4">No social links</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {isTeacher ? (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Icon name="ShieldCheck" className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Published Quizzes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                navigate={navigate}
                role={currentUser?.role}
              />
            ))}
            {quizzes.length === 0 && (
              <div className="col-span-full bg-white p-16 rounded-[40px] text-center border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No public quizzes found for this teacher.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <Icon name="Award" className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Student Achievements
            </h2>
          </div>
          <div className="bg-white p-12 rounded-[40px] border border-slate-100 text-center shadow-sm">
            <p className="text-slate-500 font-bold">
              Student profiles are private but connections show shared classes
              and goals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
