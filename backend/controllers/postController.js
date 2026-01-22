import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import jwt from "jsonwebtoken";

const getUserId = (req) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

const getPostStats = async (postId, userId) => {
  const [likesCount, dislikesCount, commentsCount, likedUsers] = await Promise.all([
    Like.countDocuments({ postId, type: "like" }),
    Like.countDocuments({ postId, type: "dislike" }),
    Comment.countDocuments({ postId }),
    Like.find({ postId, type: "like" }).populate("userId", "name username avatar profileImage").limit(10),
  ]);

  let userReaction = null;
  if (userId) {
    const reaction = await Like.findOne({ postId, userId });
    if (reaction) userReaction = reaction.type;
  }

  return {
    totalLikeCount: likesCount,
    dislikeCount: dislikesCount,
    commentsCount,
    likedByCurrentUser: userReaction === 'like',
    otherLikeCount: Math.max(0, likesCount - (userReaction === 'like' ? 1 : 0)),
    userReaction,
    likedUsers: likedUsers.map(l => ({
      userId: l.userId._id,
      name: l.userId.name
    }))
  };
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    let uploadImage = req.body.uploadImage;

    if (req.file) {
      uploadImage = req.file.path;
    }

    const post = await Post.create({
      title,
      content,
      uploadImage,
      author: req.user.userId,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name email"
    );

    res.status(201).json({
      _id: populatedPost._id,
      title: populatedPost.title,
      content: populatedPost.content,
      uploadImage: populatedPost.uploadImage,
      author: populatedPost.author?.name,
      email: populatedPost.author?.email,
      createdAt: populatedPost.createdAt,
      updatedAt: populatedPost.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username email")
      .sort({ createdAt: -1 });

    const result = await Promise.all(
      posts.map(async (post) => {
        const userId = getUserId(req);
        const stats = await getPostStats(post._id, userId);

        return {
          _id: post._id,
          title: post.title,
          content: post.content,
          uploadImage: post.uploadImage,
          author: post.author?.name || "Unknown",
          authorUsername: post.author?.username || "unknown",
          email: post.author?.email || "",
          ...stats,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name username email"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = getUserId(req);
    const stats = await getPostStats(post._id, userId);

    const comments = await Comment.find({ postId: post._id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      _id: post._id,
      title: post.title,
      content: post.content,
      uploadImage: post.uploadImage,
      author: post.author?.name || "Unknown",
      authorUsername: post.author?.username || "unknown",
      email: post.author?.email || "",
      ...stats,
      comments: comments.map(c => ({
        commentId: c._id,
        text: c.text,
        createdAt: c.createdAt,
        author: {
          id: c.userId._id,
          name: c.userId.name
        }
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reactPost = async (req, res) => {
  try {
    const { reaction } = req.body;
    const userId = req.user.userId;
    const postId = req.params.id;

    const existingReaction = await Like.findOne({ postId, userId });
    let userReaction = reaction;

    if (existingReaction) {
      if (existingReaction.type === reaction || reaction === null) {
        await existingReaction.deleteOne();
        userReaction = null;
      } else {
        existingReaction.type = reaction;
        await existingReaction.save();
      }
    } else {
      if (reaction === "like" || reaction === "dislike") {
        await Like.create({ postId, userId, type: reaction });
      }
    }

    const stats = await getPostStats(postId, userId);

    res.status(200).json({
      ...stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      postId: req.params.id,
      userId: req.user.userId,
      text,
    });

    const populatedComment = await Comment.findById(comment._id).populate("userId", "name");

    res.status(201).json({
      commentId: populatedComment._id,
      text: populatedComment.text,
      createdAt: populatedComment.createdAt,
      author: {
        id: populatedComment.userId._id,
        name: populatedComment.userId.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    let uploadImage = req.body.uploadImage;

    if (req.file) {
      uploadImage = req.file.path;
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (uploadImage) post.uploadImage = uploadImage;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Like.deleteMany({ postId: post._id });
    await Comment.deleteMany({ postId: post._id });
    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createPost,
  getAllPosts,
  getPostById,
  reactPost,
  addComment,
  updatePost,
  deletePost,
  deleteComment,
};
