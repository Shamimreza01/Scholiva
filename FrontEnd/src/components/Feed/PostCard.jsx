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
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group">
      {post.isShared && (
        <div className="bg-indigo-50/50 px-8 py-3 border-b border-slate-50 flex items-center gap-2 text-indigo-600">
          <Repeat className="w-4 h-4" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            {post.teacher.name} shared {post.parentPost?.teacher?.name || "a"}'s
            post
          </p>
        </div>
      )}
      <div className="p-8 relative">
        {user._id === post.teacher._id && (
          <button
            onClick={confirmDelete}
            className="absolute top-8 right-8 text-slate-200 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              post.visibility === "public"
                ? "bg-emerald-50 text-emerald-600"
                : post.visibility === "protected"
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-rose-50 text-rose-600"
            }`}
          >
            {post.teacher?.profilePicture ? (
              <img
                src={post.teacher?.profilePicture}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : post.visibility === "public" ? (
              <UserRound className="w-5 h-5" />
            ) : post.visibility === "protected" ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            {}
          </div>
          <div>
            <p
              onClick={() => navigate(`/user/${teacherId}`)}
              className="font-bold cursor-pointer text-slate-900"
            >
              {post.teacher.name}
            </p>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span>{post.visibility}</span>
              {post.classroomId && (
                <span
                  className="flex items-center gap-1 cursor-pointer text-indigo-400 hover:text-indigo-600 transition-colors"
                  onClick={() => navigate(`/classroom/${classroomId}`)}
                >
                  <BookOpen className="w-3 h-3" />{" "}
                  {post.classroomId.name || "Classroom"}
                </span>
              )}
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">{post.title}</h3>
        <p className="text-slate-600 leading-relaxed wrap-break-word mb-8">
          {post.content}
        </p>

        {videoId && (
          <div className="mb-8 rounded-[24px] overflow-hidden aspect-video bg-slate-100 shadow-inner">
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
          <div className="mb-8 rounded-[24px] overflow-hidden aspect-video bg-slate-100 shadow-inner">
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

        <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
          <button
            onClick={() => onInteract(post._id, "like")}
            className={`flex items-center gap-2 font-bold text-xs transition-all ${hasLiked ? "text-indigo-600 scale-110" : "text-slate-400 hover:text-indigo-600"}`}
          >
            <ThumbsUp
              className={`w-5 h-5 ${hasLiked ? "fill-indigo-600" : ""}`}
            />{" "}
            {post.likes?.length || 0}
          </button>
          <button
            onClick={() => onInteract(post._id, "dislike")}
            className={`flex items-center gap-2 font-bold text-xs transition-all ${hasDisliked ? "text-rose-600 scale-110" : "text-slate-400 hover:text-rose-600"}`}
          >
            <ThumbsDown
              className={`w-5 h-5 ${hasDisliked ? "fill-rose-600" : ""}`}
            />{" "}
            {post.dislikes?.length || 0}
          </button>
          <button
            onClick={handleShare}
            className={`flex items-center gap-2 font-bold text-xs transition-all ${isShared ? "text-emerald-500" : "text-slate-400 hover:text-indigo-600"}`}
          >
            {isShared ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
            {isShared ? "Copied!" : `${post.shares?.length || 0} `}
          </button>
          <div className="flex items-center gap-2 font-bold text-xs text-slate-400 ml-auto">
            <MessageCircle className="w-5 h-5" />{" "}
            {post.comments?.length || 0}{" "}
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 p-8 space-y-6">
        <div className="space-y-4">
          {post.comments?.map((comment, i) => (
            <CommentCard
              key={i}
              comment={comment}
              post={post}
              user={user}
              confirmDeleteComment={onDeleteComment}
            />
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onComment(post._id, commentContent);
            setCommentContent("");
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            required
            placeholder="Write a comment..."
            className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-sm shadow-sm"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
