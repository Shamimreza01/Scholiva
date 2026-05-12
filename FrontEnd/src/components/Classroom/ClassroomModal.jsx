import { useState } from "react";
import Modal from "../UI/Modal";
import { Plus, Loader2 } from "lucide-react";

export default function ClassroomModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    await onCreate(name);
    setLoading(false);
    setName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Classroom">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Name</label>
          <input 
            type="text"
            required
            autoFocus
            placeholder="e.g. Advanced Mathematics Section A"
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="bg-indigo-50/50 p-6 rounded-3xl mb-8">
          <p className="text-sm text-indigo-600 font-medium leading-relaxed">
            Students will be able to find and request to join this classroom once it's created. You can share quizzes and posts specifically to this room.
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-slate-200"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Create Room
        </button>
      </form>
    </Modal>
  );
}
