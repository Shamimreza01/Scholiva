import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Award, CheckCircle2, Clock, Download, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../components/UI/ConfirmModal";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, idle, playing, finished
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submission, setSubmission] = useState(null);
  const timerRef = useRef(null);
  const certificateRef = useRef(null);
  const { showToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const init = async () => {
      const subId = location.state?.submissionId;
      const quizData = await fetchQuiz(!!subId);

      if (subId) {
        await fetchSubmission(subId);
      } else if (quizData?.alreadySubmitted) {
        // Fetch submission by quiz ID since we know they submitted
        await fetchSubmissionByQuiz();
      }
    };
    init();
  }, [quizId]);

  const fetchQuiz = async (isReview = false) => {
    try {
      const res = await api.get(`/quizzes/${quizId}`);
      setQuiz(res.data);
      if (!isReview && !res.data.alreadySubmitted) setStatus("idle");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load quiz";
      showToast(errorMsg, "error");
      navigate("/feed");
    }
  };

  const fetchSubmissionByQuiz = async () => {
    try {
      const res = await api.get(`/submissions/my-quiz/${quizId}`);
      applySubmission(res.data);
    } catch (err) {
      console.error("Failed to load submission by quiz:", err);
    }
  };

  const fetchSubmission = async (subId) => {
    try {
      const res = await api.get(`/submissions/details/${subId}`);
      applySubmission(res.data);
    } catch (err) {
      console.error("Failed to load submission:", err);
    }
  };

  const applySubmission = (data) => {
    setSubmission(data);
    const savedAnswers = {};
    data.answers.forEach((ans) => {
      savedAnswers[ans.questionIndex] = ans.selectedOption || ans.shortAnswer;
    });
    setAnswers(savedAnswers);
    setStatus("finished");
  };

  useEffect(() => {
    if (status === "playing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === "playing") {
      handleSubmit(true);
    }
    return () => clearInterval(timerRef.current);
  }, [status, timeLeft]);

  const startQuiz = () => {
    setStatus("playing");
    setTimeLeft(quiz.duration);
  };

  const handleChange = (qIndex, option, qType) => {
    if (status === "finished") return;
    const newAnswers = { ...answers };
    newAnswers[qIndex] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (isAuto = false) => {
    if (!isAuto && Object.keys(answers).length < quiz.questions.length) {
      setShowConfirm(true);
      return;
    }
    processSubmit();
  };

  const processSubmit = async () => {
    setShowConfirm(false);

    try {
      const formattedAnswers = Object.keys(answers).map((key) => {
        const question = quiz.questions[key];
        return {
          questionIndex: parseInt(key),
          selectedOption: question.type === "mcq" ? answers[key] : null,
          shortAnswer: question.type === "short" ? answers[key] : null,
        };
      });

      const res = await api.post("/submissions/submit", {
        quizId,
        answers: formattedAnswers,
        timeTaken: quiz.duration - timeLeft,
      });

      setSubmission(res.data);
      setStatus("finished");
      clearInterval(timerRef.current);

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      showToast("Failed to submit quiz", "error");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    if (!element) return;
    element.style.display = "flex";
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight(),
    );
    pdf.save(`Result_${quiz.title}.pdf`);
    element.style.display = "none";
  };

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (status === "idle") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-slate-100">
          <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-600">
            <Clock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">
            {quiz.title}
          </h1>
          <div className="space-y-4 mb-10 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              Details:
            </p>
            <ul className="space-y-3 text-slate-600 font-bold">
              <li className="flex items-center gap-3">
                ⏱️ {formatTime(quiz.duration)} Minutes
              </li>
              <li className="flex items-center gap-3">
                ❓ {quiz.questions.length} Questions
              </li>
              <li className="flex items-center gap-3 text-rose-500">
                ❌ -{quiz.negativeMarking} Negative Mark
              </li>
            </ul>
          </div>
          <button
            onClick={startQuiz}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            Start Attempt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {status === "playing" && (
          <div
            className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-8 py-5 rounded-[24px] shadow-2xl border-2 transition-all ${
              timeLeft <= 60
                ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
                : "bg-white border-slate-100 text-slate-900"
            }`}
          >
            <Clock className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                Time Left
              </span>
              <span className="text-2xl font-black tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
            {quiz.title}
          </h1>
        </div>

        {status === "finished" && submission && (
          <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden mb-12">
            <div className="bg-indigo-600 p-8 md:p-12 text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase mb-3 tracking-widest">
                    Assessment Report
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-2">
                    Score: {submission.score.toFixed(1)}
                  </h2>
                  <p className="text-indigo-100 font-medium italic">
                    "Every mistake is a step towards mastery."
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <button
                    onClick={downloadCertificate}
                    className="flex-1 bg-white text-indigo-600 font-black py-4 px-8 rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" /> Download Result
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 bg-indigo-500 text-white font-black py-4 px-8 rounded-2xl border border-indigo-400 hover:bg-indigo-400 transition-all"
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
              <div className="p-8 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Total
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {quiz.questions.length}
                </p>
              </div>
              <div className="p-8 text-center bg-emerald-50/30">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                  Correct
                </p>
                <p className="text-2xl font-black text-emerald-700">
                  {submission.answers.filter((a) => a.isCorrect).length}
                </p>
              </div>
              <div className="p-8 text-center bg-rose-50/30">
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">
                  Incorrect
                </p>
                <p className="text-2xl font-black text-rose-700">
                  {submission.answers.filter((a) => !a.isCorrect).length}
                </p>
              </div>
              <div className="p-8 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Accuracy
                </p>
                <p className="text-2xl font-black text-indigo-600">
                  {(
                    (submission.answers.filter((a) => a.isCorrect).length /
                      quiz.questions.length) *
                    100
                  ).toFixed(0)}
                  %
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 md:space-y-10">
          {quiz.questions.map((q, i) => {
            const userAns = submission?.answers.find(
              (a) => a.questionIndex === i,
            );
            const isWrong = userAns && !userAns.isCorrect;
            const isSkipped = !userAns;

            return (
              <div
                key={i}
                className={`bg-white rounded-[20px] md:rounded-[32px] border p-6 md:p-10 transition-all ${
                  status === "finished"
                    ? userAns?.isCorrect
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-rose-100 bg-rose-50/20"
                    : "border-slate-100 shadow-sm"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <h3 className="text-base md:text-xl font-bold text-slate-800 flex gap-3 pr-4 leading-snug">
                    <span className="text-slate-300">0{i + 1}</span>{" "}
                    {q.question}
                  </h3>
                  {status === "finished" && (
                    <div className="flex-shrink-0">
                      {userAns?.isCorrect ? (
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" />{" "}
                          {isSkipped ? "Skipped" : "Incorrect"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {q.type === "mcq" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt, idx) => {
                      const isSelected = answers[i] === opt;
                      const isCorrectOption = opt === q.answer;

                      let btnStyles =
                        "border-slate-50 bg-slate-50 hover:border-slate-200";
                      if (isSelected)
                        btnStyles =
                          "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/10";

                      if (status === "finished") {
                        if (isCorrectOption)
                          btnStyles =
                            "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10 text-emerald-900 font-bold";
                        else if (isSelected && !isCorrectOption)
                          btnStyles =
                            "border-rose-500 bg-rose-50 text-rose-900 font-bold opacity-70";
                        else btnStyles = "border-slate-100 bg-white opacity-40";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={status === "finished"}
                          onClick={() => handleChange(i, opt)}
                          className={`p-4 md:p-5 rounded-xl md:rounded-2xl border-2 text-left transition-all relative flex items-center justify-between text-sm md:text-base ${btnStyles}`}
                        >
                          <span className="font-semibold">{opt}</span>
                          {status === "finished" && isCorrectOption && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                          {status === "finished" &&
                            isSelected &&
                            !isCorrectOption && (
                              <XCircle className="w-4 h-4 text-rose-600" />
                            )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    <textarea
                      disabled={status === "finished"}
                      className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all resize-none"
                      rows="4"
                      placeholder="Type your response here..."
                      value={answers[i] || ""}
                      onChange={(e) => handleChange(i, e.target.value)}
                    />
                    {status === "finished" && (
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                          <Award className="w-3 h-3" /> Model Answer
                        </p>
                        <p className="text-slate-700 font-bold text-sm">
                          {q.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {status === "finished" && (isWrong || isSkipped) && (
                  <div className="mt-6 p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[24px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 blur-2xl -mr-12 -mt-12 transition-all group-hover:scale-150"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                          Correct Solution
                        </span>
                      </div>
                      <p className="text-slate-900 font-bold text-lg leading-relaxed">
                        {q.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {status === "playing" && (
          <div className="mt-12 flex justify-center sticky bottom-6 px-4">
            <button
              onClick={() => handleSubmit(false)}
              className="w-full md:w-auto bg-slate-900 text-white font-black py-4 px-10 rounded-xl md:rounded-[24px] shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Finish Attempt <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={certificateRef}
        style={{
          display: "none",
          width: "1123px",
          height: "794px",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "-50",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          padding: "60px",
          border: "30px solid #4f46e5",
          fontFamily: "serif",
        }}
      >
        <Award
          style={{
            width: "120px",
            height: "120px",
            color: "#4f46e5",
            marginBottom: "30px",
          }}
        />
        <h1 style={{ fontSize: "70px", fontWeight: "bold" }}>
          Quiz Certificate
        </h1>
        <p style={{ fontSize: "32px" }}>{quiz?.title}</p>
        <div
          style={{ fontSize: "96px", fontWeight: "black", color: "#4f46e5" }}
        >
          {submission?.score.toFixed(1)}
        </div>
        <p style={{ fontSize: "24px" }}>Accuracy & Integrity Certified</p>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={processSubmit}
        title="Unfinished Quiz"
        message="You haven't answered all questions. Are you sure you want to submit?"
        confirmText="Yes, Submit"
      />
    </div>
  );
}
