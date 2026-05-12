import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PostCard from "../components/Feed/PostCard";
import api from "../utils/api";

export default function Feed() {
  const { user } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [classroomId, setClassroomId] = useState("");
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-700">
      {user.role === "teacher" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6"
        >
          <input
            type="text"
            required
            placeholder="Post Title"
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            required
            placeholder="What's on your mind? (Use @name to mention someone)"
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium min-h-[120px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <select
              className="w-full md:w-auto px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="protected">Protected (Connections)</option>
              <option value="private">Private (Classroom)</option>
            </select>

            {visibility === "private" && (
              <select
                required
                className="w-full md:w-auto px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-xl font-bold text-sm text-indigo-600"
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
              >
                <option value="">Select Room</option>
                {classrooms.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            <button
              type="submit"
              className="w-full md:ml-auto md:w-auto bg-indigo-600 text-white font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Send className="w-4 h-4" /> Post
            </button>
          </div>
        </form>
      )}

      <div className="space-y-8">
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
        {posts.length === 0 && !loading && (
          <div className="text-center py-20 bg-slate-100/50 rounded-[40px] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              No posts to show yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
