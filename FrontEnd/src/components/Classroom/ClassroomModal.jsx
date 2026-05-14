import { useState } from "react";
import Modal from "../UI/Modal";
import { Plus, Loader2, Trash2, HelpCircle } from "lucide-react";

export default function ClassroomModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    // Filter out empty questions
    const admissionQuestions = questions.filter(q => q.trim() !== "");
    await onCreate(name, description, admissionQuestions);
    setLoading(false);
    reset();
    onClose();
  };

  const reset = () => {
    setName("");
    setDescription("");
    setQuestions([""]);
  };

  const addQuestion = () => setQuestions([...questions, ""]);
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));
  const updateQuestion = (index, val) => {
    const newQs = [...questions];
    newQs[index] = val;
    setQuestions(newQs);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Classroom">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Name</label>
          <input 
            type="text"
            required
            placeholder="e.g. Advanced Physics 101"
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-slate-400">Description (Optional)</label>
          <textarea 
            placeholder="What will students learn in this room?"
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-600 resize-none min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center px-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
               <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Admission Questions
             </label>
             <button type="button" onClick={addQuestion} className="text-[10px] font-black text-indigo-600 hover:underline">
               + Add Question
             </button>
          </div>
          
          <div className="space-y-3">
             {questions.map((q, i) => (
               <div key={i} className="relative group">
                  <input 
                    type="text"
                    placeholder={`Question ${i+1} (e.g. Why do you want to join?)`}
                    className="w-full pl-6 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm text-slate-600"
                    value={q}
                    onChange={(e) => updateQuestion(i, e.target.value)}
                  />
                  {questions.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeQuestion(i)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
               </div>
             ))}
          </div>
        </div>
        
        <div className="bg-indigo-50/50 p-6 rounded-3xl">
          <p className="text-[11px] text-indigo-600 font-bold leading-relaxed">
             Students will need to answer these questions to request entry. You can approve or reject them based on their responses.
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-slate-200"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Launch Classroom
        </button>
      </form>
    </Modal>
  );
}
