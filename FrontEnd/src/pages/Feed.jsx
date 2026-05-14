import { Send, Image, PlusCircle, Globe, Lock, Users, MessageSquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PostCard from "../components/Feed/PostCard";
import PostSkeleton from "../components/Feed/PostSkeleton";
import api from "../utils/api";
import Modal from "../components/UI/Modal";
import { motion } from "framer-motion";

export default function Feed() {
  const { user } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [classroomId, setClassroomId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
    if (user.role === "teacher") fetchClassrooms();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
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
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-200/60 mb-8">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-slate-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shrink-0">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                user.name[0]
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-slate-100/80 hover:bg-slate-100 text-left px-5 py-2.5 rounded-full text-slate-500 font-medium text-[15px] transition-colors"
            >
              What's on your academic mind, {user.name.split(" ")[0]}?
            </button>
          </div>
          <div className="flex gap-1 mt-4 pt-4 border-t border-slate-100">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-bold text-sm"
            >
              <Image className="w-4 h-4 text-emerald-500" /> Photo/Video
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-bold text-sm"
            >
              <PlusCircle className="w-4 h-4 text-indigo-500" /> Announcement
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-bold text-sm"
            >
              <MessageSquarePlus className="w-4 h-4 text-orange-500" /> Discussion
            </button>
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
              {user.profilePicture ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" /> : user.name[0]}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">{user.name}</p>
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
                      <option key={c._id} value={c._id}>{c.name}</option>
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
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                onDelete={handleDelete}
                onInteract={handleInteract}
                onShare={handleShare}
                onComment={handleComment}
                onDeleteComment={handleDeleteComment}
              />
            ))}
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
