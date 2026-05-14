import {
  AlertCircle,
  Bell,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  Loader2,
  Send,
  ShieldCheck,
  Trophy,
  UserMinus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import PostCard from "../components/Feed/PostCard";
import Modal from "../components/UI/Modal";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";

export default function ClassroomDetail() {
  const { id } = useParams();
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [classroom, setClassroom] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [loading, setLoading] = useState(true);

  // Admission flow states
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [submittingJoin, setSubmittingJoin] = useState(false);

  // Teacher action states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch classroom details first
      const classRes = await api.get(`/classrooms/${id}`);
      setClassroom(classRes.data);
      setAnswers(
        new Array(classRes.data.admissionQuestions?.length || 0).fill(""),
      );

      // Try fetching rankings, but don't fail if it doesn't work (e.g. for non-members)
      try {
        const rankRes = await api.get(`/classrooms/${id}/rankings`);
        setRankings(rankRes.data);
      } catch (err) {
        console.warn("Rankings could not be loaded", err);
      }
    } catch (err) {
      console.error(err);
      showToast("Could not load classroom details", "error");
      navigate("/classrooms");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setSubmittingJoin(true);
    try {
      await api.post(`/classrooms/${id}/request-join`, { answers });
      showToast("Join request sent successfully!", "success");
      setIsJoinModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to send request",
        "error",
      );
    } finally {
      setSubmittingJoin(false);
    }
  };

  const handleRequestAction = async (studentId, action) => {
    setActionLoading(true);
    try {
      await api.post(`/classrooms/${id}/handle-request`, { studentId, action });
      showToast(`Request ${action}ed`, "success");
      setSelectedRequest(null);
      fetchData();
    } catch (err) {
      showToast("Action failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );

  if (!classroom) return null;

  const isTeacher = user._id === (classroom.teacher?._id || classroom.teacher);
  const isMember = classroom.isMember;

  if (!isMember && !isTeacher) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="h-48 bg-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 text-white">
              <h1 className="text-4xl font-black">{classroom.name}</h1>
              <p className="font-bold opacity-80 mt-1">
                Instructor: {classroom.teacher.name}
              </p>
            </div>
          </div>
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Join this Classroom
            </h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
              {classroom.description ||
                "Welcome to our academic space! To access class resources, participate in discussions, and take assessments, please request to join."}
            </p>

            {classroom.hasRequested ? (
              <div className="bg-amber-50 text-amber-700 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 mx-auto w-fit border border-amber-100">
                <Clock className="w-5 h-5" /> Pending Teacher Approval
              </div>
            ) : (
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all flex items-center gap-3 mx-auto"
              >
                Request to Join Classroom <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Admission Modal */}
        <Modal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          title="Classroom Admission"
        >
          <form onSubmit={handleJoinSubmit} className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-xl flex gap-3 text-indigo-700 text-sm font-medium border border-indigo-100">
              <HelpCircle className="w-5 h-5 shrink-0" />
              <p>
                {classroom.admissionQuestions?.length > 0
                  ? "The instructor has set some questions to help evaluate your application."
                  : "No specific admission questions are required for this classroom."}
              </p>
            </div>

            {classroom.admissionQuestions?.length > 0 ? (
              classroom.admissionQuestions.map((q, idx) => (
                <div key={idx} className="space-y-3">
                  <label className="block text-slate-700 font-black text-sm">
                    Question {idx + 1}: {q}
                  </label>
                  <textarea
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium resize-none min-h-[100px]"
                    placeholder="Type your answer here..."
                    value={answers[idx] || ""}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[idx] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-slate-400 font-medium italic">
                  Click submit to send your join request.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submittingJoin}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
            >
              {submittingJoin ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {classroom.admissionQuestions?.length > 0
                ? "Submit Application"
                : "Send Join Request"}
            </button>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Premium Header Dashboard */}
      <div className="bg-white rounded-[40px] border border-slate-200/60 p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-indigo-600 pointer-events-none">
          <GraduationCap className="w-64 h-64 rotate-12" />
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-indigo-100 shrink-0">
            {classroom.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  {classroom.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-slate-500 font-bold text-sm">
                  <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    {classroom.teacher.profilePicture ? (
                      <img
                        src={classroom.teacher.profilePicture}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      classroom.teacher.name[0]
                    )}
                  </div>
                  <span>Led by {classroom.teacher.name}</span>
                </div>
              </div>

              {/* Stats Widget */}
              <div className="flex gap-4">
                <StatCard
                  icon={<Users className="w-5 h-5" />}
                  value={classroom.students?.length || 0}
                  label="Students"
                />
                {!isTeacher && (
                  <StatCard
                    icon={<Trophy className="w-5 h-5" />}
                    value={`#${classroom.myRank}`}
                    label="Your Rank"
                    highlight
                  />
                )}
              </div>
            </div>

            <p className="mt-6 text-slate-600 font-medium leading-relaxed max-w-2xl">
              {classroom.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-200/50 p-1.5 rounded-[24px] w-fit border border-slate-200/60">
        <TabButton
          active={activeTab === "feed"}
          onClick={() => setActiveTab("feed")}
          icon={<Bell className="w-4 h-4" />}
          label="Notice Board"
        />
        <TabButton
          active={activeTab === "assessments"}
          onClick={() => setActiveTab("assessments")}
          icon={<FileText className="w-4 h-4" />}
          label="Assessments"
        />
        <TabButton
          active={activeTab === "rankings"}
          onClick={() => setActiveTab("rankings")}
          icon={<Trophy className="w-4 h-4" />}
          label="Performance"
        />
        <TabButton
          active={activeTab === "members"}
          onClick={() => setActiveTab("members")}
          icon={<GraduationCap className="w-4 h-4" />}
          label="Members"
        />
        {isTeacher && (
          <TabButton
            active={activeTab === "requests"}
            onClick={() => setActiveTab("requests")}
            icon={<ShieldCheck className="w-4 h-4" />}
            label={`Applications (${classroom.requests?.length || 0})`}
            badge={classroom.requests?.length > 0}
          />
        )}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === "feed" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-6">
              {classroom.posts?.map((post) => (
                <PostCard key={post._id} post={post} user={user} />
              ))}
              {classroom.posts?.length === 0 && (
                <div className="bg-white p-12 rounded-[40px] text-center border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold italic">
                    No notices or posts yet.
                  </p>
                </div>
              )}
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-slate-200/60 shadow-sm">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-500" /> Room Rules
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm font-medium text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />{" "}
                  Academic honesty is mandatory
                </li>
                <li className="flex gap-3 text-sm font-medium text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />{" "}
                  Submit assignments before deadline
                </li>
                <li className="flex gap-3 text-sm font-medium text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />{" "}
                  Respect fellow scholars
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "assessments" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classroom.quizzes?.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white p-6 rounded-[32px] border border-slate-200/60 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {quiz.title}
                </h4>
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 mt-auto pt-6 border-t border-slate-50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{" "}
                    {Math.floor(quiz.duration / 60)}m
                  </span>
                  <span className="flex items-center gap-1 uppercase tracking-tighter">
                    {quiz.questions?.length} Questions
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                  className="mt-6 w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:scale-[1.02] transition-all"
                >
                  Attempt Quiz
                </button>
              </div>
            ))}
            {classroom.quizzes?.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">
                No active assessments in this room.
              </div>
            )}
          </div>
        )}

        {activeTab === "rankings" && (
          <div className="bg-white rounded-[40px] border border-slate-200/60 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Rank
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Scholar
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                    Engagement
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rankings.map((r, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-slate-50/30 transition-colors ${r.name === user.name ? "bg-indigo-50/30" : ""}`}
                  >
                    <td className="px-8 py-6">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                          i === 0
                            ? "bg-amber-100 text-amber-600"
                            : i === 1
                              ? "bg-slate-100 text-slate-600"
                              : i === 2
                                ? "bg-orange-100 text-orange-600"
                                : "text-slate-300"
                        }`}
                      >
                        #{i + 1}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900">
                        {r.name} {r.name === user.name && "(You)"}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center font-bold text-slate-500">
                      {r.quizzesTaken} assessments
                    </td>
                    <td className="px-8 py-6 text-right font-black text-indigo-600 text-lg">
                      {r.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "members" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classroom.students.map((s) => (
              <div
                key={s._id}
                className="bg-white p-6 rounded-[32px] border border-slate-200/60 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl border border-slate-100 overflow-hidden">
                    {s.profilePicture ? (
                      <img
                        src={s.profilePicture}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center font-bold text-slate-400">
                        {s.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Scholar
                    </p>
                  </div>
                </div>
                {isTeacher && (
                  <button className="p-2 rounded-xl text-rose-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all">
                    <UserMinus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "requests" && isTeacher && (
          <div className="max-w-2xl space-y-4">
            {classroom.requests?.map((req, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                      {req.student.profilePicture ? (
                        <img
                          src={req.student.profilePicture}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">
                          {req.student.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">
                        {req.student.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {req.student.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs"
                    >
                      View Answers
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {classroom.requests?.length === 0 && (
              <p className="text-slate-400 font-bold italic text-center py-20">
                No pending applications.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Teacher View Request Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Admission Application"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="space-y-4">
              {classroom.admissionQuestions?.map((q, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Q: {q}
                  </p>
                  <p className="text-slate-900 font-bold">
                    {selectedRequest.answers[i] || "No answer provided"}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={() =>
                  handleRequestAction(selectedRequest.student._id, "reject")
                }
                disabled={actionLoading}
                className="flex-1 py-4 rounded-xl border border-rose-200 text-rose-500 font-black text-sm hover:bg-rose-50"
              >
                Reject
              </button>
              <button
                onClick={() =>
                  handleRequestAction(selectedRequest.student._id, "accept")
                }
                disabled={actionLoading}
                className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-black text-sm shadow-lg shadow-indigo-100 hover:scale-[1.02]"
              >
                Approve Entry
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatCard({ icon, value, label, highlight }) {
  return (
    <div
      className={`p-4 rounded-2xl border ${highlight ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100" : "bg-slate-50 text-slate-400 border-slate-100"} flex flex-col items-center min-w-[100px]`}
    >
      <div className={highlight ? "text-white/80" : "text-indigo-500"}>
        {icon}
      </div>
      <p
        className={`text-xl font-black mt-1 ${highlight ? "text-white" : "text-slate-900"}`}
      >
        {value}
      </p>
      <p
        className={`text-[9px] font-black uppercase tracking-widest ${highlight ? "text-white/60" : "text-slate-400"}`}
      >
        {label}
      </p>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-[20px] font-black text-xs transition-all relative ${
        active
          ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      {icon} {label}
      {badge && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
}
