import { UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserName from "../Common/UserName";
export default function CommentCard({
  comment,
  post,
  user,
  confirmDeleteComment,
}) {
  const navigate = useNavigate();
  const userId = comment?.user?._id;
  return (
    <div className="flex gap-3 group/comment">
      <div
        className="w-8 h-8 bg-white rounded-lg flex cursor-pointer items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm shrink-0 uppercase"
        onClick={() => {
          navigate(`/user/${userId}`);
        }}
      >
        {comment.user?.profilePicture ? (
          <img
            src={comment.user.profilePicture}
            alt={comment.user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserRound className="w-4 h-4" />
        )}
      </div>
      <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex-1 relative">
        <UserName
          userId={userId}
          userName={comment.user?.name || "Unknown User"}
        />
        <p className="text-sm text-slate-600 font-medium">{comment.content}</p>
        {(comment.user._id === user._id || post.teacher._id === user._id) && (
          <button
            onClick={() => confirmDeleteComment(comment._id)}
            className="absolute -right-2 top-2 w-6 h-6 bg-rose-50 text-rose-500 rounded-lg opacity-0 group-hover/comment:opacity-100 transition-all flex items-center justify-center hover:bg-rose-500 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
