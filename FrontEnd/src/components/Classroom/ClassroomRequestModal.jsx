import Modal from "../UI/Modal";
import RequestItem from "../Requests/RequestItem";

export default function ClassroomRequestModal({ isOpen, onClose, classroom, onAction }) {
  if (!classroom) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Requests: ${classroom.name}`}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {classroom.requests?.map(student => {
          const studentName = typeof student === 'object' ? student.name : 'Unknown Student';
          const studentId = typeof student === 'object' ? student._id : student;
          
          return (
            <RequestItem 
              key={studentId}
              name={studentName}
              onAccept={() => onAction(studentId, 'accept', classroom._id, studentName)}
              onReject={() => onAction(studentId, 'reject', classroom._id, studentName)}
              onProfileClick={() => window.open(`/user/${studentId}`, '_blank')}
            />
          );
        })}
        {classroom.requests?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No pending requests for this room.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
