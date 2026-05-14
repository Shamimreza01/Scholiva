import {
  ChevronLeft,
  Clock,
  FileJson,
  Globe,
  Layout,
  ListChecks,
  Plus,
  Save,
  Shield,
  Target,
  Trash2,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

export default function CreateQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(300);
  const [negativeMarking, setNegativeMarking] = useState(0.5);
  const [questions, setQuestions] = useState([
    { question: "", type: "mcq", options: ["", "", "", ""], answer: "" },
  ]);
  const [visibility, setVisibility] = useState("public");
  const [classroomId, setClassroomId] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [bulkText, setBulkText] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    fetchClassrooms();
    if (id) fetchQuizDetails();
  }, [id]);

  const fetchClassrooms = async () => {
    try {
      const res = await api.get("/classrooms");
      setClassrooms(res.data);
    } catch (err) {
      console.error("Failed to fetch classrooms");
    }
  };

  const fetchQuizDetails = async () => {
    try {
      const res = await api.get(`/quizzes/${id}`);
      const q = res.data;
      setTitle(q.title);
      setDuration(q.duration);
      setNegativeMarking(q.negativeMarking);
      setQuestions(q.questions);
      setVisibility(q.visibility);
      if (q.classroomId) setClassroomId(q.classroomId);
      setLoading(false);
    } catch (err) {
      showToast("Failed to load quiz details", "error");
      navigate("/dashboard");
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", type: "mcq", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "question") newQuestions[index].question = value;
    else if (field === "type") {
      newQuestions[index].type = value;
      if (value === "short") {
        newQuestions[index].options = [];
      } else if (newQuestions[index].options.length === 0) {
        newQuestions[index].options = ["", "", "", ""];
      }
    }
    else if (field === "answer") newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleBulkImport = () => {
    try {
      const data = JSON.parse(bulkText);
      if (!Array.isArray(data)) throw new Error("Must be an array");
      const validated = data.map((q) => ({
        question: q.question || "",
        type: q.type || "mcq",
        options:
          Array.isArray(q.options)
            ? q.options
            : ["", "", "", ""],
        answer: q.answer || "",
      }));
      setQuestions([...questions, ...validated]);
      setShowBulk(false);
      setBulkText("");
    } catch (err) {
      showToast("Invalid JSON format. Check the sample.", "warning");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      duration,
      negativeMarking,
      questions,
      visibility,
      classroomId: visibility === "private" ? classroomId : null,
    };
    try {
      if (id) {
        await api.put(`/quizzes/${id}`, payload);
      } else {
        await api.post("/quizzes", payload);
      }
      showToast(id ? "Quiz updated!" : "Quiz published!", "success");
      navigate("/assessment-studio");
    } catch (err) {
      showToast("Failed to save quiz", "error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse">
        Loading Quiz Data...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-12 px-4 md:px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/assessment-studio")}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 md:mb-10 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Assessment Studio
        </button>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
          {/* Settings Card */}
          <div className="bg-white rounded-[24px] md:rounded-[40px] shadow-sm border border-slate-100 p-6 md:p-12">
            <div className="flex items-center gap-3 mb-8 md:mb-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Layout className="text-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {id ? "Edit" : "Create"} Quiz
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-5 md:px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base md:text-lg font-bold"
                  placeholder="e.g., Physics Midterm 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time (seconds)
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Penalty Mark
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                  value={negativeMarking}
                  onChange={(e) => setNegativeMarking(e.target.value)}
                />
              </div>

              {/* Visibility Layer */}
              <div className="md:col-span-2 pt-6 border-t border-slate-50">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">
                  Access Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "public",
                      label: "Public",
                      icon: <Globe className="w-4 h-4" />,
                    },
                    {
                      id: "protected",
                      label: "Protected",
                      icon: <Shield className="w-4 h-4" />,
                    },
                    {
                      id: "private",
                      label: "Classroom",
                      icon: <Lock className="w-4 h-4" />,
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setVisibility(opt.id)}
                      className={`p-4 rounded-xl md:rounded-2xl border-2 text-left transition-all flex flex-col gap-2 ${
                        visibility === opt.id
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-slate-50 bg-white"
                      }`}
                    >
                      <div
                        className={
                          visibility === opt.id
                            ? "text-indigo-600"
                            : "text-slate-300"
                        }
                      >
                        {opt.icon}
                      </div>
                      <p className="font-bold text-sm text-slate-900">
                        {opt.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {visibility === "private" && (
                <div className="md:col-span-2 animate-in slide-in-from-top-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Assigned Classroom
                  </label>
                  <select
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700"
                    value={classroomId}
                    onChange={(e) => setClassroomId(e.target.value)}
                  >
                    <option value="">Select a classroom...</option>
                    {classrooms.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Questions Container */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
                <ListChecks className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />{" "}
                Questions
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulk(!showBulk)}
                  className="p-2 md:px-4 md:py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-indigo-600 transition-all shadow-sm"
                >
                  <FileJson className="w-5 h-5 md:hidden" />
                  <span className="hidden md:inline font-black text-xs uppercase tracking-widest">
                    Bulk Import
                  </span>
                </button>
                <span className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center uppercase">
                  {questions.length} Qs
                </span>
              </div>
            </div>

            {showBulk && (
              <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-[24px] md:rounded-[32px] p-6 md:p-8 animate-in slide-in-from-top-4">
                <textarea
                  className="w-full h-40 p-4 bg-white border border-indigo-100 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
                  placeholder='[{"question":"...","options":["...","...","...","..."],"answer":"..."}]'
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest"
                >
                  Append JSON Data
                </button>
              </div>
            )}

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 p-6 md:p-10 relative animate-in slide-in-from-bottom-4"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="absolute top-6 md:top-8 right-6 md:right-8 text-slate-200 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>

                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Question {qIndex + 1}
                      </label>
                      <select 
                        value={q.type}
                        onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
                        className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-none focus:ring-0"
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="short">Short Answer</option>
                      </select>
                    </div>
                    <textarea
                      required
                      rows="2"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold resize-none"
                      placeholder={q.type === 'mcq' ? "Type your question..." : "Type your short question/task..."}
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "question", e.target.value)
                      }
                    />
                  
                  {q.type === 'mcq' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xs">
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <input
                              type="text"
                              required
                              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
                              placeholder={`Option ${oIndex + 1}`}
                              value={opt}
                              onChange={(e) =>
                                handleOptionChange(qIndex, oIndex, e.target.value)
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                          Correct Key
                        </label>
                        <select
                          required
                          className="w-full px-6 py-4 bg-indigo-50/50 border border-indigo-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 appearance-none text-sm"
                          value={q.answer}
                          onChange={(e) =>
                            handleQuestionChange(qIndex, "answer", e.target.value)
                          }
                        >
                          <option value="">Select correct answer</option>
                          {q.options.map((opt, i) => (
                            <option key={i} value={opt}>
                              Option {String.fromCharCode(65 + i)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        Model Answer / Key Points
                      </label>
                      <textarea
                        required
                        className="w-full px-6 py-4 bg-indigo-50/30 border border-indigo-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold resize-none"
                        placeholder="Enter the expected answer or keywords..."
                        value={q.answer}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, "answer", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-6 md:py-10 border-2 border-dashed border-slate-200 rounded-[24px] md:rounded-[32px] text-slate-400 font-bold hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-3 text-sm md:text-base"
            >
              <Plus className="w-5 h-5 md:w-6 md:h-6" /> Add New Question
            </button>
          </div>

          <div className="pt-8 md:pt-12 flex justify-center sticky bottom-6 z-10 px-4 md:px-0">
            <button
              type="submit"
              className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-[24px] shadow-2xl shadow-indigo-100 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 text-base md:text-lg"
            >
              <Save className="w-5 h-5 md:w-6 md:h-6" />{" "}
              {id ? "Save Changes" : "Publish Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
