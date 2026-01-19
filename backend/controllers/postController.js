import Post from "../models/Post.js";

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
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
      author: populatedPost.author.name,
      email: populatedPost.author.email,
      likes: populatedPost.likes,
      dislikes: populatedPost.dislikes,
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
      .populate("author", "name email")
      .populate("likes", "name")
      .populate("dislikes", "name")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author.name,
      email: post.author.email,
      likes: post.likes.map((user) => user.name),
      dislikes: post.dislikes.map((user) => user.name),
      comments: post.comments.map((comment) => ({
        _id: comment._id,
        text: comment.text,
        user: comment.user?.name,
        email: comment.user?.email,
        createdAt: comment.createdAt,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.userId;

    const liked = post.likes.some((id) => id.toString() === userId);
    const disliked = post.dislikes.some((id) => id.toString() === userId);

    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
      if (disliked) post.dislikes.pull(userId);
    }

    await post.save();

    res.status(200).json({
      liked: !liked,
      likesCount: post.likes.length,
      dislikesCount: post.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleDislike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.userId;

    const disliked = post.dislikes.some((id) => id.toString() === userId);
    const liked = post.likes.some((id) => id.toString() === userId);

    if (disliked) {
      post.dislikes.pull(userId);
    } else {
      post.dislikes.push(userId);
      if (liked) post.likes.pull(userId);
    }

    await post.save();

    res.status(200).json({
      disliked: !disliked,
      likesCount: post.likes.length,
      dislikesCount: post.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const post = await Post.findById(req.params.id).populate(
      "comments.user",
      "name"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user.userId,
      text,
    });

    await post.save();

    const latestComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: "Comment added",
      comment: {
        text: latestComment.text,
        user: latestComment.user.name,
        createdAt: latestComment.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
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

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }


    if (
      comment.user.toString() !== req.user.userId &&
      post.author.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("likes", "name")
      .populate("dislikes", "name")
      .populate("comments.user", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const formattedPost = {
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author.name,
      email: post.author.email,
      likes: post.likes.map((user) => user.name),
      dislikes: post.dislikes.map((user) => user.name),
      comments: post.comments.map((comment) => ({
        _id: comment._id,
        text: comment.text,
        user: comment.user?.name,
        email: comment.user?.email,
        createdAt: comment.createdAt,
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    res.status(200).json(formattedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createPost,
  getAllPosts,
  getPostById,
  toggleLike,
  toggleDislike,
  addComment,
  updatePost,
  deletePost,
  deleteComment
};
