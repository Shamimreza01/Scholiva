import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Plus, Check } from 'lucide-react';
import ClassroomCard from '../components/Classroom/ClassroomCard';
import ClassroomModal from '../components/Classroom/ClassroomModal';
import ConfirmModal from '../components/UI/ConfirmModal';
import ClassroomRequestModal from '../components/Classroom/ClassroomRequestModal';

export default function Classrooms() {
  const { user } = useOutletContext();
  const { showToast } = useToast();
  const [classrooms, setClassrooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRequestRoom, setActiveRequestRoom] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const endpoint = user.role === 'teacher' ? '/classrooms' : '/classrooms/available';
      const res = await api.get(endpoint);
      setClassrooms(res.data);
      if (activeRequestRoom) {
        const updated = res.data.find(r => r._id === activeRequestRoom._id);
        setActiveRequestRoom(updated);
      }
    } catch (err) { console.error(err); }
  };



  const handleRequestAction = async () => {
    if (!pendingAction) return;
    setLoading(true);
    try {
      const { studentId, action, roomId } = pendingAction;
      showToast(`Request ${action}ed`, "success");
      fetchClassrooms();
      setPendingAction(null);
    } catch (err) { showToast("Action failed", "error"); }
    finally { setLoading(false); }
  };

  const joinedRooms = classrooms.filter(c => c.students?.some(s => (s._id || s) === user._id));
  const availableRooms = classrooms.filter(c => !c.students?.some(s => (s._id || s) === user._id));

  return (
    <div className="space-y-16 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900">Classrooms</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            {user.role === 'teacher' ? 'Manage your virtual learning spaces' : 'Join rooms to access exclusive content'}
          </p>
        </div>
        {user?.role === 'teacher' && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-slate-900 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100"
          >
            <Plus className="w-5 h-5" /> New Room
          </button>
        )}
      </div>

      <ClassroomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={async (name, description, admissionQuestions) => {
          try { 
            await api.post('/classrooms', { name, description, admissionQuestions }); 
            showToast("Classroom created!", "success");
            fetchClassrooms(); 
          } 
          catch (err) { showToast("Failed to create room", "error"); }
        }} 
      />

      <ClassroomRequestModal 
        isOpen={!!activeRequestRoom}
        onClose={() => setActiveRequestRoom(null)}
        classroom={activeRequestRoom}
        onAction={(studentId, action, roomId, name) => setPendingAction({ studentId, action, roomId, name })}
      />

      <ConfirmModal 
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={handleRequestAction}
        loading={loading}
        title={pendingAction?.action === 'accept' ? 'Approve Student' : 'Reject Student'}
        message={`Are you sure you want to ${pendingAction?.action} the request from ${pendingAction?.name}?`}
        confirmText={pendingAction?.action === 'accept' ? 'Approve' : 'Reject'}
      />

      {/* Student: Joined Rooms */}
      {user.role === 'student' && joinedRooms.length > 0 && (
        <div className="space-y-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Check className="w-6 h-6 text-emerald-500" /> My Classes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {joinedRooms.map(c => (
              <ClassroomCard key={c._id} classroom={c} user={user} onJoin={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Available / All Rooms */}
      <div className="space-y-8">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Plus className="w-6 h-6 text-indigo-500" /> {user.role === 'teacher' ? 'Your Rooms' : 'Available Rooms'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(user.role === 'teacher' ? classrooms : availableRooms).map(c => (
            <ClassroomCard 
              key={c._id} 
              classroom={c} 
              user={user} 
              onJoin={(id) => navigate(`/classroom/${id}`)} 
              onRequestManage={(room) => setActiveRequestRoom(room)}
            />
          ))}
          {((user.role === 'teacher' && classrooms.length === 0) || (user.role === 'student' && availableRooms.length === 0)) && (
            <div className="col-span-full py-24 bg-slate-100/50 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No rooms found here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
