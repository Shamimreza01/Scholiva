import { Check, X } from "lucide-react";

export default function RequestItem({ name, onAccept, onReject, onProfileClick }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
      <span
        onClick={onProfileClick}
        className="font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors"
      >
        {name}
      </span>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
        >
          <Check className="w-5 h-5" />
        </button>
        <button
          onClick={onReject}
          className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
