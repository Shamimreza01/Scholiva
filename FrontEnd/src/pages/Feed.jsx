import { 
  Image, 
  MessageSquarePlus, 
  PlusCircle, 
  Send, 
  Home, 
  GraduationCap, 
  Users, 
  Zap, 
  Settings 
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import PostCard from "../components/Feed/PostCard";
import PostSkeleton from "../components/Feed/PostSkeleton";
import Modal from "../components/UI/Modal";
import api from "../utils/api";

export default function Feed() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [classroomId, setClassroomId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const observer = useRef();
  const lastPostRef = useCallback((node) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    fetchInitialPosts();
    if (user.role === "teacher") fetchClassrooms();
  }, []);

  const fetchInitialPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts?page=1&limit=10");
      setPosts(res.data.posts);
      setHasMore(res.data.hasMore);
      setPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await api.get(`/posts?page=${nextPage}&limit=10`);
      setPosts((prev) => [...prev, ...res.data.posts]);
      setHasMore(res.data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const res = await api.get("/classrooms");
      setClassrooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/posts", {
        title,
        content,
        visibility,
        classroomId: visibility === "private" ? classroomId : null,
      });
      setTitle("");
      setContent("");
      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      alert("Failed to post");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
      showToast("Post deleted", "success");
      fetchPosts();
    } catch (err) {
      showToast("Failed to delete", "error");
    }
  };

  const handleInteract = async (id, type) => {
    try {
      await api.put(`/posts/${id}/interact`, { type });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (id) => {
    try {
      await api.put(`/posts/${id}/share`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId, commentContent) => {
    try {
      await api.post(`/posts/${postId}/comment`, { content: commentContent });
      fetchPosts();
    } catch (err) {
      showToast("Failed to comment", "error");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await api.delete(`/posts/${postId}/comment/${commentId}`);
      showToast("Comment deleted", "success");
      fetchPosts();
    } catch (err) {
      showToast("Failed to delete comment", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* --- CREATE POST TRIGGER (Teacher Only) --- */}
      {user.role === "teacher" && (
        <div className="bg-white rounded-[24px] md:rounded-[32px] p-3 md:p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-8 group hover:border-indigo-100 transition-all duration-300">
          <div className="flex gap-3 md:gap-4 items-center">
            <div className="relative shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100 overflow-hidden">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name[0]
                )}
              </div>
            </div>
            
            <div className="flex-1 flex items-center bg-slate-50/80 hover:bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-sm rounded-2xl transition-all overflow-hidden pr-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 text-left px-4 md:px-5 py-2.5 md:py-3 text-slate-400 font-semibold text-sm md:text-[15px] outline-none"
              >
                Share an academic insight...
              </button>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Media"
                >
                  <Image className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Quiz"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE POST MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Academic Post"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black overflow-hidden border border-slate-100">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name[0]
              )}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">
                {user.name}
              </p>
              <div className="flex gap-2 mt-1">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="bg-slate-100 text-slate-600 text-[11px] font-bold py-1 px-2 rounded-md outline-none border-none cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <option value="public">🌎 Public</option>
                  <option value="protected">👥 Connections</option>
                  <option value="private">🔒 Private (Room)</option>
                </select>

                {visibility === "private" && (
                  <select
                    required
                    value={classroomId}
                    onChange={(e) => setClassroomId(e.target.value)}
                    className="bg-indigo-50 text-indigo-600 text-[11px] font-bold py-1 px-2 rounded-md outline-none border-none cursor-pointer"
                  >
                    <option value="">Select Room</option>
                    {classrooms.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <input
            type="text"
            required
            placeholder="Post Title"
            className="w-full text-xl font-bold text-slate-900 placeholder:text-slate-300 outline-none border-none focus:ring-0 px-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            required
            placeholder={`What's on your academic mind, ${user.name.split(" ")[0]}?`}
            className="w-full min-h-[150px] text-slate-700 placeholder:text-slate-400 outline-none border-none focus:ring-0 px-0 resize-none text-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={!title || !content}
              className="w-full bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Send className="w-4 h-4" /> Share with Community
            </button>
          </div>
        </form>
      </Modal>

      <div className="space-y-8">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          <>
            {posts.map((post, index) => {
              const isLastPost = posts.length === index + 1;
              return (
                <div key={post._id} ref={isLastPost ? lastPostRef : null}>
                  <PostCard
                    post={post}
                    user={user}
                    onDelete={handleDelete}
                    onInteract={handleInteract}
                    onShare={handleShare}
                    onComment={handleComment}
                    onDeleteComment={handleDeleteComment}
                  />
                </div>
              );
            })}

            {loadingMore && (
              <div className="py-8 flex justify-center">
                <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="py-12 text-center">
                <div className="w-12 h-1 bg-slate-100 mx-auto rounded-full mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  You've caught up with all academic updates
                </p>
              </div>
            )}

            {posts.length === 0 && (
              <div className="text-center py-20 bg-slate-100/50 rounded-[40px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No posts to show yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PostTriggerAction({ icon, label, onClick, color, bgColor }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 px-2 py-3 rounded-2xl hover:bg-slate-50 transition-all group"
    >
      <div className={`p-2 md:p-2.5 rounded-xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-[11px] md:text-[14px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </button>
  );
}


