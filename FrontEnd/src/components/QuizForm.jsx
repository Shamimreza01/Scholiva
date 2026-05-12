import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Download,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SpellingQuiz() {
  const questions = [
    {
      question: "Choose the correctly spelled word:",
      options: ["Accelerate", "Accelarate", "Accelerrate", "Excelerate"],
      answer: "Accelerate",
    },
    {
      question: "Identify the correct spelling:",
      options: ["Admittance", "Admittence", "Admitance", "Admittans"],
      answer: "Admittance",
    },
    {
      question: "Which of the following is correct?",
      options: ["Aluminum", "Alunimum", "Aliminum", "Aluminium"],
      answer: "Aluminum",
    },
    {
      question: "Pick the correct spelling for the study of history:",
      options: ["Archaeology", "Archeollogy", "Archaiology", "Archeology"],
      answer: "Archaeology",
    },
    {
      question: "Which one is spelled correctly?",
      options: ["Adolescent", "Adolscent", "Adolesent", "Adolessent"],
      answer: "Adolescent",
    },
    {
      question: "Identify the correct spelling:",
      options: [
        "Architecture",
        "Architechture",
        "Archetecture",
        "Archiitecture",
      ],
      answer: "Architecture",
    },
    {
      question: "Which word is spelled correctly?",
      options: ["Accessible", "Accesible", "Accessable", "Accesable"],
      answer: "Accessible",
    },
    {
      question: "Select the correct spelling:",
      options: [
        "Adulteration",
        "Adultration",
        "Adullteration",
        "Adulterretion",
      ],
      answer: "Adulteration",
    },
    {
      question: "Choose the correct spelling:",
      options: ["Arithmetic", "Arithmatic", "Arithmitic", "Arithmeticque"],
      answer: "Arithmetic",
    },
    {
      question: "Which of the following is correct?",
      options: ["Accessory", "Accesory", "Acessory", "Accessary"],
      answer: "Accessory",
    },
    {
      question: "Find the correctly spelled word:",
      options: ["Adultery", "Adultary", "Adulltery", "Adultery"],
      answer: "Adultery",
    },
    {
      question: "Which of these is correct?",
      options: ["Amateur", "Amature", "Amatuer", "Amateure"],
      answer: "Amateur",
    },
    {
      question: "Identify the correct spelling:",
      options: ["Arrogance", "Arogance", "Arrogence", "Arogence"],
      answer: "Arrogance",
    },
    {
      question: "Which word is correct?",
      options: ["Accidentally", "Accidently", "Acidentally", "Accidantally"],
      answer: "Accidentally",
    },
    {
      question: "Choose the correct spelling:",
      options: ["Adversity", "Adversaty", "Adversitty", "Advarsity"],
      answer: "Adversity",
    },
    {
      question: "Pick the correct spelling:",
      options: ["Anachronism", "Anachonism", "Anacronism", "Annachronism"],
      answer: "Anachronism",
    },
    {
      question: "Which is spelled correctly?",
      options: ["Ascend", "Asend", "Accend", "Ascand"],
      answer: "Ascend",
    },
    {
      question: "Identify the correct spelling:",
      options: ["Accommodate", "Accomodate", "Acommodate", "Accomadate"],
      answer: "Accommodate",
    },
    {
      question: "Which of the following is correct?",
      options: ["Advertise", "Advertize", "Advertice", "Advertyse"],
      answer: "Advertise",
    },
    {
      question: "Choose the correctly spelled word:",
      options: [
        "Accommodation",
        "Accomodation",
        "Acommodation",
        "Accommadation",
      ],
      answer: "Accommodation",
    },
    {
      question: "Identify the correctly spelled word:",
      options: ["Aerial", "Aireal", "Arial", "Areil"],
      answer: "Aerial",
    },
    {
      question: "Which word is spelled correctly?",
      options: ["Ascertain", "Acertain", "Assertain", "Ascertin"],
      answer: "Ascertain",
    },
    {
      question: "Pick the correct spelling:",
      options: ["Analytical", "Analitical", "Annanalytical", "Analytycal"],
      answer: "Analytical",
    },
    {
      question: "Which of these is correct?",
      options: ["Affection", "Effection", "Affectione", "Affaction"],
      answer: "Affection",
    },
    {
      question: "Identify the correctly spelled word:",
      options: [
        "Assassination",
        "Asassination",
        "Assasination",
        "Assassinasion",
      ],
      answer: "Assassination",
    },
    {
      question: "Choose the correct spelling:",
      options: ["Accompany", "Acompany", "Accompanny", "Accumpany"],
      answer: "Accompany",
    },
    {
      question: "Which is correct?",
      options: ["Anarchic", "Anarkic", "Annarchic", "Anarchick"],
      answer: "Anarchic",
    },
    {
      question: "Pick the correct spelling:",
      options: ["Accomplish", "Acomplish", "Accomplishe", "Accompelish"],
      answer: "Accomplish",
    },
    {
      question: "Which of the following is correct?",
      options: ["Aggravate", "Agravate", "Aggravete", "Agravete"],
      answer: "Aggravate",
    },
    {
      question: "Identify the correct spelling:",
      options: ["Assent", "Asent", "Accent", "Assant"],
      answer: "Assent",
    },
    {
      question: "Choose the correctly spelled word:",
      options: ["Annihilate", "Anihilate", "Annihillate", "Annihalate"],
      answer: "Annihilate",
    },
    {
      question: "Which word is correct?",
      options: ["Accumulate", "Acumulate", "Accummulate", "Accumalate"],
      answer: "Accumulate",
    },
    {
      question: "Pick the correct spelling:",
      options: ["Aggregate", "Agregate", "Agreggate", "Aggregat"],
      answer: "Aggregate",
    },
    {
      question: "Identify the correct spelling:",
      options: ["Assessment", "Assesment", "Assement", "Assisment"],
      answer: "Assessment",
    },
    {
      question: "Which of these is correct?",
      options: ["Aggression", "Agression", "Aggresion", "Aggressionn"],
      answer: "Aggression",
    },
    {
      question: "Choose the correct spelling:",
      options: ["Anniversary", "Aniversary", "Anniversery", "Anniverserry"],
      answer: "Anniversary",
    },
    {
      question: "Which word is correct?",
      options: ["Assign", "Asign", "Assigne", "Aceign"],
      answer: "Assign",
    },
    {
      question: "Pick the correct spelling:",
      options: ["Accuracy", "Acuracy", "Accurasy", "Accuracey"],
      answer: "Accuracy",
    },
    {
      question: "Identify the correct spelling:",
      options: ["Aggressive", "Agressive", "Aggresive", "Aggressiv"],
      answer: "Aggressive",
    },
    {
      question: "Which of the following is correct?",
      options: ["Annually", "Anually", "Annualy", "Annuallye"],
      answer: "Annually",
    },
    {
      question: "Pick the CORRECT spelling from this list:",
      options: ["Accurate", "Alchohol", "Aknowledge", "Ammendment"],
      answer: "Accurate",
    },
    {
      question: "Which word is spelled correctly?",
      options: ["Agreeable", "Agreable", "Aggreeable", "Agreebel"],
      answer: "Agreeable",
    },
    {
      question: "Identify the correctly spelled word:",
      options: ["Anonymity", "Anonimity", "Annonymity", "Anonymaty"],
      answer: "Anonymity",
    },
    {
      question: "Choose the correct spelling:",
      options: ["Associate", "Asociate", "Assosiate", "Assosciate"],
      answer: "Associate",
    },
    {
      question: "Which of these is correct?",
      options: ["Accustom", "Acustom", "Accustome", "Accustam"],
      answer: "Accustom",
    },
    {
      question: "Pick the correct spelling:",
      options: ["Agreement", "Agreemant", "Aggreement", "Agrement"],
      answer: "Agreement",
    },
    {
      question: "Identify the correct spelling:",
      options: ["Anonymous", "Anonymus", "Annonymous", "Anonnimus"],
      answer: "Anonymous",
    },
    {
      question: "Which word is correct?",
      options: ["Asthma", "Asthama", "Asma", "Athma"],
      answer: "Asthma",
    },
    {
      question: "Pick the correct spelling:",
      options: ["Anterior", "Anterier", "Antarior", "Antereor"],
      answer: "Anterior",
    },
    {
      question: "Which of the following is correct?",
      options: ["Achievement", "Acheivement", "Achievment", "Acheivment"],
      answer: "Achievement",
    },
  ];

  // Game Status: 'idle' | 'playing' | 'finished'
  const [status, setStatus] = useState("idle");
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(questions.length * 36);
  const certificateRef = useRef(null);
  const timerRef = useRef(null);

  const processedQuestions = useMemo(() => {
    return questions.map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));
  }, []);

  // Timer Logic
  useEffect(() => {
    if (status === "playing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === "playing") {
      handleSubmit(true); // Auto-submit when time is up
    }

    return () => clearInterval(timerRef.current);
  }, [status, timeLeft]);

  const startQuiz = () => {
    setStatus("playing");
    setTimeLeft(questions.length * 36);
    setAnswers({});
  };

  const handleChange = (qIndex, option) => {
    if (status === "finished") return;
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = (isAuto = false) => {
    if (!isAuto && Object.keys(answers).length < questions.length) {
      if (!confirm("You haven't answered all questions. Submit anyway?"))
        return;
    }

    clearInterval(timerRef.current);
    setStatus("finished");

    if (!isAuto) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4F46E5", "#10B981", "#F59E0B"],
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateScore = () => {
    return questions.reduce((total, q, i) => {
      if (answers[i] === q.answer) return total + 1;
      if (answers[i]) return total - 0.5; // Negative marking
      return total;
    }, 0);
  };

  const score = calculateScore();
  const percentage = Math.max(0, Math.round((score / questions.length) * 100));

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      element.style.display = "flex";
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
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
      pdf.save(`Quiz_Result_${score}.pdf`);
      element.style.display = "none";
    } catch (error) {
      alert("Failed to generate PDF.");
    }
  };

  // 1. IDLE STATE
  if (status === "idle") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-indigo-600 fill-indigo-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Ready for the Quiz?
          </h1>
          <p className="text-slate-500 mb-8">
            Test your spelling skills! You have{" "}
            <b>{questions.length * 36} seconds</b> to complete{" "}
            <b>{questions.length} questions</b>.
          </p>

          <div className="space-y-4 mb-8 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">
              Rules:
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                ✅ <b className="text-emerald-600">+1.0</b> for Correct Answer
              </li>
              <li className="flex items-center gap-2">
                ❌ <b className="text-rose-600">-0.5</b> for Wrong Answer
              </li>
              <li className="flex items-center gap-2">
                ⏱️ Total Time: {formatTime(questions.length * 36)}
              </li>
            </ul>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            Start Quiz Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Floating Timer (Only when playing) */}
        {status === "playing" && (
          <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all border-2 ${
              timeLeft <= 60
                ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse"
                : "bg-white border-slate-100 text-slate-900"
            }`}
          >
            <Clock
              className={`w-6 h-6 ${timeLeft <= 60 ? "text-rose-500" : "text-indigo-600"}`}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                Time Left
              </span>
              <span className="text-2xl font-black tabular-nums leading-none">
                {formatTime(timeLeft)}
              </span>
            </div>
            {timeLeft <= 60 && (
              <div className="ml-2 bg-rose-600 text-white p-1 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
            )}
          </div>
        )}

        {/* 1 Minute Warning Overlay */}
        {status === "playing" && timeLeft === 60 && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md pointer-events-none">
            <div className="bg-white p-12 rounded-[40px] text-center shadow-2xl animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-12 h-12 text-rose-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">
                Hurry Up!
              </h2>
              <p className="text-xl text-slate-500">Only 1 minute remaining!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Spelling <span className="text-indigo-600">Mastery</span> Quiz
          </h1>
          {status === "finished" && (
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Quiz finished! Check your score and review the correct answers
              below.
            </p>
          )}
        </div>

        {/* Results Banner */}
        {status === "finished" && (
          <div className="bg-indigo-600 rounded-3xl shadow-2xl p-8 mb-12 text-white overflow-hidden relative">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold mb-4">
                  <Award className="w-4 h-4" /> Final Result
                </div>
                <h2 className="text-3xl font-bold mb-1">
                  Score: {score} / {questions.length}
                </h2>
                <p className="text-indigo-100 opacity-80">
                  Negative marking applied for incorrect answers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button
                  onClick={downloadCertificate}
                  className="flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold py-4 px-8 rounded-2xl transition-all hover:scale-105 shadow-lg"
                >
                  <Download className="w-5 h-5" /> Download Result
                </button>
                <button
                  onClick={() => setStatus("idle")}
                  className="flex items-center justify-center gap-2 bg-indigo-500 text-white font-bold py-4 px-8 rounded-2xl transition-all border border-indigo-400/30"
                >
                  <RotateCcw className="w-5 h-5" /> Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-8">
          {processedQuestions.map((q, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl shadow-sm border p-6 md:p-8 transition-all ${
                status === "finished"
                  ? answers[i] === q.answer
                    ? "border-emerald-200 bg-emerald-50/30"
                    : answers[i]
                      ? "border-rose-200 bg-rose-50/30"
                      : "border-slate-200"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-lg">
                  {i + 1}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight pt-1">
                  {q.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-14">
                {q.options.map((option, idx) => {
                  const isSelected = answers[i] === option;
                  const isCorrect = option === q.answer;

                  let variantStyles =
                    "border-slate-100 bg-slate-50 hover:border-slate-300";
                  if (isSelected)
                    variantStyles =
                      "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/10";

                  if (status === "finished") {
                    if (isCorrect)
                      variantStyles =
                        "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                    else if (isSelected && !isCorrect)
                      variantStyles =
                        "border-rose-500 bg-rose-50 text-rose-900 font-bold opacity-80";
                    else variantStyles = "border-slate-100 bg-white opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={status === "finished"}
                      onClick={() => handleChange(i, option)}
                      className={`group flex items-center p-5 rounded-2xl border-2 transition-all text-left ${variantStyles}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-lg">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {status === "playing" && (
          <div className="mt-12 sticky bottom-8 flex justify-center px-4">
            <button
              onClick={() => handleSubmit(false)}
              className="w-full max-w-md bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              Finish & See Score
              <CheckCircle2 className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Certificate Template */}
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
        <h1 style={{ fontSize: "70px", fontWeight: "bold", color: "#0f172a" }}>
          Certificate of Achievement
        </h1>
        <p style={{ fontSize: "28px", color: "#475569" }}>
          Spelling Mastery Quiz Result
        </p>
        <div
          style={{ fontSize: "96px", fontWeight: "black", color: "#4f46e5" }}
        >
          {score} / {questions.length}
        </div>
        <p style={{ fontSize: "24px", color: "#64748b" }}>
          Negative Marking Applied
        </p>
        <p style={{ fontSize: "18px", marginTop: "40px" }}>
          Date: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
