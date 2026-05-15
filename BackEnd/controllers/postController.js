import Post from "../models/Post.js";
import User from "../models/User.js";
import Classroom from "../models/Classroom.js";

export const createPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can create posts" });
    }

    const { title, content, visibility, classroomId } = req.body;
    const post = new Post({
      title,
      content,
      visibility,
      classroomId,
      teacher: req.user.id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { visibility: "public" };

    if (user.role === "teacher") {
      query = { $or: [{ teacher: req.user.id }, { visibility: "public" }] };
    } else {
      const teacherIds = user.connections.map((c) => c.toString());
      const classrooms = await Classroom.find({ students: req.user.id });
      const classroomIds = classrooms.map((c) => c._id.toString());

      query = {
        $or: [
          { visibility: "public" },
          { visibility: "protected", teacher: { $in: teacherIds } },
          { visibility: "private", classroomId: { $in: classroomIds } },
        ],
      };
    }

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 }) // Optimized: Newest first for Infinite Scroll
      .skip(skip)
      .limit(limit)
      .populate("teacher", "name role profilePicture")
      .populate("classroomId", "name")
      .populate({
        path: "parentPost",
        populate: { path: "teacher", select: "name" },
      })
      .populate("comments.user", "name profilePicture");

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: skip + posts.length < totalPosts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sharePost = async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost)
      return res.status(404).json({ message: "Post not found" });

    // 1. Track unique shares on original post
    if (!originalPost.shares.includes(req.user.id)) {
      originalPost.shares.push(req.user.id);
      await originalPost.save();
    }

    // 2. Create a NEW REPOST entry
    // This allows students to 'share' a post even if they can't create original posts
    const repost = new Post({
      title: originalPost.title,
      content: originalPost.content,
      teacher: req.user.id, // The sharer is the 'teacher' of this shared instance
      visibility: originalPost.visibility,
      classroomId: originalPost.classroomId,
      isShared: true,
      parentPost: originalPost._id,
    });

    await repost.save();

    res.json({ shares: originalPost.shares.length, repost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const interactWithPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'like' or 'dislike'
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Remove from both first to toggle/switch
    post.likes = post.likes.filter((uid) => uid.toString() !== userId);
    post.dislikes = post.dislikes.filter((uid) => uid.toString() !== userId);

    if (type === "like") post.likes.push(userId);
    if (type === "dislike") post.dislikes.push(userId);

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, content });
    await post.save();

    const updatedPost = await Post.findById(id).populate(
      "comments.user",
      "name profilePicture",
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only author or post owner (teacher) can delete
    if (
      comment.user.toString() !== req.user.id &&
      post.teacher.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.deleteOne();
    await post.save();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
