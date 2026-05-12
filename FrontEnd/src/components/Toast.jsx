import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 2800); // Start exit animation slightly before context removes it
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const colors = {
    success: "border-emerald-100 bg-emerald-50 text-emerald-900",
    error: "border-rose-100 bg-rose-50 text-rose-900",
    warning: "border-amber-100 bg-amber-50 text-amber-900",
    info: "border-blue-100 bg-blue-50 text-blue-900",
  };

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl transition-all duration-300 ${colors[type]} ${isExiting ? 'opacity-0 translate-y-4 scale-95' : 'animate-in slide-in-from-bottom-4 fade-in'}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-black tracking-tight">{message}</p>
      <button 
        onClick={handleClose}
        className="ml-4 p-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 opacity-40" />
      </button>
    </div>
  );
}
