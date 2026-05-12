import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { UserPlus, ShieldCheck } from 'lucide-react';
import RequestItem from '../components/Requests/RequestItem';
import ConfirmModal from '../components/UI/ConfirmModal';

export default function Requests() {
  const { showToast } = useToast();
  const { user, fetchProfile } = useOutletContext();
  const [classrooms, setClassrooms] = useState([]);
  const [pendingAction, setPendingAction] = useState(null); // { id, type, extraId, action, name }
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === 'teacher') fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await api.get('/classrooms');
      setClassrooms(res.data);
    } catch (err) { console.error(err); }
  };

  const executeAction = async () => {
    if (!pendingAction) return;
    setLoading(true);
    try {
      const { id, type, extraId, action } = pendingAction;
      if (type === 'connection') {
        await api.post('/users/requests', { studentId: id, action });
      } else {
        await api.post(`/classrooms/${extraId}/requests`, { studentId: id, action });
      }
      fetchProfile();
      if (pendingAction.type === 'classroom') fetchClassrooms();
      showToast(`Request ${pendingAction.action}ed`, "success");
      setPendingAction(null);
    } catch (err) { 
      showToast("Action failed", "error"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="text-4xl font-black text-slate-900">All Requests</h2>
      
      <ConfirmModal 
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={executeAction}
        loading={loading}
        title={pendingAction?.action === 'accept' ? 'Approve Request' : 'Reject Request'}
        message={`Are you sure you want to ${pendingAction?.action} the request from ${pendingAction?.name}?`}
        confirmText={pendingAction?.action === 'accept' ? 'Approve' : 'Reject'}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Connection Requests */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-indigo-600" /> Connection Requests
          </h3>
          <div className="space-y-4">
            {user?.pendingConnections?.map(student => {
              const studentName = typeof student === 'object' ? student.name : `Student (${student})`;
              const studentId = typeof student === 'object' ? student._id : student;
              return (
                <RequestItem 
                  key={studentId} 
                  name={studentName} 
                  onProfileClick={() => navigate(`/user/${studentId}`)}
                  onAccept={() => setPendingAction({ id: studentId, type: 'connection', action: 'accept', name: studentName })}
                  onReject={() => setPendingAction({ id: studentId, type: 'connection', action: 'reject', name: studentName })}
                />
              );
            })}
            {user?.pendingConnections?.length === 0 && <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No pending connections.</p>}
          </div>
        </div>
        
        {/* Classroom Requests */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" /> Classroom Requests
          </h3>
          <div className="space-y-4">
            {classrooms.map(c => c.requests.map(student => {
              const studentName = typeof student === 'object' ? student.name : 'Unknown Student';
              const studentId = typeof student === 'object' ? student._id : student;
              return (
                <RequestItem 
                  key={studentId} 
                  name={`${studentName} for ${c.name}`} 
                  onProfileClick={() => navigate(`/user/${studentId}`)}
                  onAccept={() => setPendingAction({ id: studentId, type: 'classroom', extraId: c._id, action: 'accept', name: studentName })}
                  onReject={() => setPendingAction({ id: studentId, type: 'classroom', extraId: c._id, action: 'reject', name: studentName })}
                />
              );
            }))}
            {classrooms.every(c => c.requests.length === 0) && <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No pending room requests.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
