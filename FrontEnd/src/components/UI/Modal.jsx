import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-900">{title}</h3>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
