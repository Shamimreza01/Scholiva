import Modal from "./Modal";
import { AlertCircle, Loader2 } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-8">
        <div className="flex items-start gap-5 bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-600 font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-4 rounded-2xl font-black text-sm text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="flex-[2] bg-indigo-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
