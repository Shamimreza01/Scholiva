import {
  BookOpen,
  Calendar,
  CheckCircle,
  Lock,
  MessageCircle,
  Repeat,
  Send,
  Share2,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  UserRound,
  Globe,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFacebookVideoUrl,
  getYoutubeVideoUrl,
} from "../../utils/getVideoUrl";
import CommentCard from "./CommentCard";

export default function PostCard({
  post,
  user,
  onDelete,
  onInteract,
  onComment,
  onDeleteComment,
  onShare,
}) {
  const [commentContent, setCommentContent] = useState("");
  const [isShared, setIsShared] = useState(false);
  const hasLiked = post.likes?.includes(user._id);
  const hasDisliked = post.dislikes?.includes(user._id);
  console.log(post);
  const navigate = useNavigate();
  const teacherId = post.teacher?._id || post.teacher;
  const classroomId = post.classroomId?._id || post.classroomId;

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url);
    setIsShared(true);
    if (onShare) await onShare(post._id);
    setTimeout(() => setIsShared(false), 2000);
  };

  const videoId = getYoutubeVideoUrl(post.content);
  const fbVideoUrl = getFacebookVideoUrl(post.content);

  const confirmDelete = () => {
    if (window.confirm("Delete this post? This cannot be undone."))
      onDelete(post._id);
  };

  const confirmDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?"))
      onDeleteComment(post._id, commentId);
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      {post.isShared && (
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-100 flex items-center gap-2 text-slate-500">
          <Repeat className="w-3.5 h-3.5" />
          <p className="text-[11px] font-bold">
            {post.teacher?.name} shared a post
          </p>
        </div>
      )}
      <div className="p-6 relative">
        {user._id === (post.teacher?._id || post.teacher) && (
          <button
            onClick={confirmDelete}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border border-slate-100 overflow-hidden bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
              {post.teacher?.profilePicture ? (
                <img src={post.teacher.profilePicture} className="w-full h-full object-cover" />
              ) : (
                post.teacher?.name?.[0] || '?'
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50">
              {post.visibility === "public" ? (
                <Globe className="w-3 h-3 text-emerald-500" />
              ) : post.visibility === "protected" ? (
                <Users className="w-3 h-3 text-indigo-500" />
              ) : (
                <Lock className="w-3 h-3 text-rose-500" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p
                onClick={() => navigate(`/user/${teacherId}`)}
                className="font-bold cursor-pointer text-slate-900 hover:text-indigo-600 transition-colors"
              >
                {post.teacher?.name}
              </p>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Instructor
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] font-medium text-slate-400">
              <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span className="capitalize">{post.visibility}</span>
              {post.classroomId && (
                <>
                  <span>•</span>
                  <span
                    className="cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors font-bold"
                    onClick={() => navigate(`/classroom/${classroomId}`)}
                  >
                    {post.classroomId.name || "Classroom"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{post.title}</h3>
        <p className="text-slate-600 leading-relaxed wrap-break-word mb-6 text-[15px]">
          {post.content}
        </p>

        {videoId && (
          <div className="mb-6 rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-100 shadow-sm">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {fbVideoUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-100 shadow-sm">
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(fbVideoUrl)}&show_text=0&width=560`}
              width="100%"
              height="100%"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onInteract(post._id, "like")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-all ${hasLiked ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-indigo-600" : ""}`} />
              <span>{post.likes?.length || 0}</span>
            </button>
            <button
              onClick={() => onInteract(post._id, "dislike")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-all ${hasDisliked ? "bg-rose-50 text-rose-600" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <ThumbsDown className={`w-4 h-4 ${hasDisliked ? "fill-rose-600" : ""}`} />
              <span>{post.dislikes?.length || 0}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
             <button
              className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments?.length || 0}</span>
            </button>
            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-all ${isShared ? "bg-emerald-50 text-emerald-600" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {isShared ? <CheckCircle className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{isShared ? "Copied" : post.shares?.length || 0}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/40 px-6 py-6 border-t border-slate-100/60">
        <div className="space-y-4 mb-6">
          {post.comments?.slice(0, 3).map((comment, i) => (
            <CommentCard
              key={i}
              comment={comment}
              post={post}
              user={user}
              confirmDeleteComment={onDeleteComment}
            />
          ))}
          {post.comments?.length > 3 && (
            <button className="text-[11px] font-bold text-indigo-600 hover:underline pl-12">
              View {post.comments.length - 3} more comments
            </button>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!commentContent.trim()) return;
            onComment(post._id, commentContent);
            setCommentContent("");
          }}
          className="flex gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs overflow-hidden shrink-0 border border-white shadow-sm">
            {user.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : user.name[0]}
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              required
              placeholder="Write a professional response..."
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-[13px] outline-none shadow-sm pr-10"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
