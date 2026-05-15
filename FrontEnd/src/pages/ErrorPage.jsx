import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle, RefreshCcw } from 'lucide-react';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Animated Icon Area */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-[40px] shadow-2xl flex items-center justify-center border border-slate-100 group hover:rotate-6 transition-transform duration-500">
            <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-indigo-600 group-hover:scale-110 transition-transform" />
            
            {/* Small floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 animate-bounce">
              <span className="text-rose-500 font-black text-xl">!</span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Academic Detour
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-md mx-auto leading-relaxed">
            It looks like this scholarly resource is currently unavailable or has been relocated to another department.
          </p>
          
          {error?.statusText || error?.message ? (
            <div className="inline-block px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
              <code className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                Error: {error.statusText || error.message}
              </code>
            </div>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/feed')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Back to Portal
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-600 font-black rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCcw className="w-5 h-5" />
            Retry Connection
          </button>
        </div>

        {/* Helpful Tip */}
        <div className="pt-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to previous section</span>
          </button>
        </div>
      </div>
    </div>
  );
}
