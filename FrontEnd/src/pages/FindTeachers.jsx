import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function FindTeachers() {
  const { user, fetchProfile } = useOutletContext();
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/users/teachers');
      setTeachers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleConnectRequest = async (id) => {
    try {
      await api.post(`/users/connect/${id}`);
      showToast("Connection request sent!", "success");
      fetchTeachers();
      fetchProfile();
    } catch (err) { showToast("Request failed", "error"); }
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
      <h2 className="text-4xl font-black text-slate-900">Teachers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map(t => {
          const isConnected = t.connections?.includes(user?._id) || t.connections?.some(c => c === user?._id);
          const isPending = t.pendingConnections?.includes(user?._id) || t.pendingConnections?.some(p => p === user?._id);
          return (
            <div key={t._id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div 
                onClick={() => navigate(`/user/${t._id}`)}
                className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              >
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 onClick={() => navigate(`/user/${t._id}`)} className="text-xl font-bold text-slate-900 cursor-pointer hover:text-indigo-600">{t.name}</h3>
              <p className="text-sm text-slate-400 mb-8">{t.email}</p>
              <button 
                onClick={() => handleConnectRequest(t._id)}
                disabled={isConnected || isPending || t._id === user?._id}
                className="w-full py-4 rounded-xl font-black text-sm transition-all bg-indigo-600 text-white disabled:bg-slate-100 disabled:text-slate-400"
              >
                {isConnected ? 'Connected' : isPending ? 'Request Sent' : 'Connect to Teacher'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
