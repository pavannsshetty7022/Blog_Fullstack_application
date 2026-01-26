import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPostById,
  reactPost,
  addComment,
  deleteComment,
  deletePost,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import LikesDropdown from "../components/LikesDropdown";
import usePageTitle from "../hooks/usePageTitle";

const PostDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  usePageTitle("Post Details");

  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadPost = async () => {
    const startTime = Date.now();
    try {
      const { data } = await fetchPostById(id);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      setPost(data);
    } catch (err) {
      console.error("Failed to load post", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const [reaction, setReaction] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (post) {
      setLikesCount(post.totalLikeCount || 0);
      setDislikesCount(post.dislikeCount || 0);
      setCommentsCount(post.commentsCount || post.comments?.length || 0);
      setReaction(post.userReaction || null);
    }
  }, [post]);

  const handleReact = async (type) => {
    if (!user) return;

    const oldReaction = reaction;
    const newReaction = oldReaction === type ? null : type;

    setReaction(newReaction);

    let nl = likesCount;
    let nd = dislikesCount;
    if (oldReaction === "like") nl--;
    if (oldReaction === "dislike") nd--;
    if (newReaction === "like") nl++;
    if (newReaction === "dislike") nd++;

    setLikesCount(nl);
    setDislikesCount(nd);

    try {
      const { data } = await reactPost(id, newReaction);
      setPost((prev) => ({
        ...prev,
        totalLikeCount: data.totalLikeCount,
        dislikeCount: data.dislikeCount,
        userReaction: data.userReaction,
        likedByCurrentUser: data.likedByCurrentUser,
        otherLikeCount: data.otherLikeCount,
        likedUsers: data.likedUsers,
      }));
      setLikesCount(data.totalLikeCount);
      setDislikesCount(data.dislikeCount);
      setReaction(data.userReaction);
    } catch (err) {
      console.error(err);
      setReaction(oldReaction);
      setLikesCount(likesCount);
      setDislikesCount(dislikesCount);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      await addComment(id, { text: commentText });
      setCommentText("");
      loadPost();
    } catch (err) {
      console.error("Error adding comment", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await deleteComment(id, commentId);
      loadPost();
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id);
      navigate("/my-posts");
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  if (loading) {
    return (
      <div
        className="container py-5 relative z-10"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <BackButton />

            <div className="animate-pulse">
              <div className="mb-4">
                <div
                  className="bg-secondary bg-opacity-10 rounded"
                  style={{ height: "48px", width: "80%" }}
                ></div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div
                  className="bg-secondary bg-opacity-10 rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                ></div>
                <div className="ms-3 flex-grow-1">
                  <div
                    className="bg-secondary bg-opacity-10 rounded mb-2"
                    style={{ height: "20px", width: "150px" }}
                  ></div>
                  <div
                    className="bg-secondary bg-opacity-10 rounded"
                    style={{ height: "16px", width: "200px" }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <div
                  className="bg-secondary bg-opacity-10 rounded mb-3"
                  style={{ height: "20px", width: "100%" }}
                ></div>
                <div
                  className="bg-secondary bg-opacity-10 rounded mb-3"
                  style={{ height: "20px", width: "95%" }}
                ></div>
                <div
                  className="bg-secondary bg-opacity-10 rounded mb-3"
                  style={{ height: "20px", width: "98%" }}
                ></div>
                <div
                  className="bg-secondary bg-opacity-10 rounded mb-3"
                  style={{ height: "20px", width: "90%" }}
                ></div>
                <div
                  className="bg-secondary bg-opacity-10 rounded mb-3"
                  style={{ height: "20px", width: "97%" }}
                ></div>
                <div
                  className="bg-secondary bg-opacity-10 rounded mb-3"
                  style={{ height: "20px", width: "92%" }}
                ></div>
              </div>

              <div className="border-top border-bottom py-3 mb-5">
                <div className="d-flex gap-4">
                  <div
                    className="bg-secondary bg-opacity-10 rounded"
                    style={{ height: "40px", width: "80px" }}
                  ></div>
                  <div
                    className="bg-secondary bg-opacity-10 rounded"
                    style={{ height: "40px", width: "80px" }}
                  ></div>
                  <div
                    className="bg-secondary bg-opacity-10 rounded"
                    style={{ height: "40px", width: "80px" }}
                  ></div>
                </div>
              </div>

              <div>
                <div
                  className="bg-secondary bg-opacity-10 rounded mb-4"
                  style={{ height: "32px", width: "200px" }}
                ></div>
                <div
                  className="bg-secondary bg-opacity-10 rounded mb-4"
                  style={{ height: "120px", width: "100%" }}
                ></div>

                {[1, 2].map((i) => (
                  <div key={i} className="d-flex mb-4">
                    <div
                      className="bg-secondary bg-opacity-10 rounded-circle"
                      style={{ width: "40px", height: "40px", flexShrink: 0 }}
                    ></div>
                    <div className="ms-3 flex-grow-1">
                      <div className="bg-secondary bg-opacity-10 rounded p-3">
                        <div
                          className="bg-secondary bg-opacity-25 rounded mb-2"
                          style={{ height: "16px", width: "120px" }}
                        ></div>
                        <div
                          className="bg-secondary bg-opacity-25 rounded"
                          style={{ height: "16px", width: "80%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className="container py-large text-center relative z-10"
        style={{ position: "relative", zIndex: 10 }}
      >
        <h3>Post not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const isAuthor =
    user && (user.userId === post.authorId || user.email === post.email);

  return (
    <div
      className="container py-4 py-md-5 relative z-10"
      style={{ position: "relative", zIndex: 10 }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <BackButton />

          <article>
            <header className="mb-5">
              <h1 className="display-5 display-md-4 fw-bold mb-3">
                {post.title}
              </h1>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                <div className="d-flex align-items-center">
                  <div className="bg-light rounded-circle p-2 me-3">
                    <i className="bi bi-person fs-4 text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">{post.author}</h6>
                    <small className="text-muted">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      · 5 min read
                    </small>
                  </div>
                </div>
                {isAuthor && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3 border-1"
                      onClick={() => navigate(`/edit/${post._id}`)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill px-3 border-1"
                      onClick={handleDeletePost}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                )}
              </div>
            </header>

            {post.uploadImage && (
              <div className="mb-5 d-flex justify-content-center">
                <img
                  src={post.uploadImage}
                  alt={post.title}
                  className="img-fluid rounded"
                  style={{
                    height: "400px",
                    width: "600px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            )}

            <div
              className="mb-5 fs-5 lh-lg text-secondary"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {post.content}
            </div>

            <div className="border-top border-bottom py-3 mb-5">
              <div className="d-flex align-items-center gap-4 mb-3">
                <button
                  className={`btn btn-link p-0 d-flex align-items-center text-decoration-none transition-all ${reaction === "like" ? "text-dark" : "text-muted text-opacity-50"}`}
                  onClick={() => handleReact("like")}
                  style={{ transition: "0.2s transform" }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <i
                    className={`bi bi-hand-thumbs-up${reaction === "like" ? "-fill" : ""} fs-4 me-2`}
                  ></i>
                  <span className="fw-bold">{likesCount}</span>
                </button>
                <button
                  className={`btn btn-link p-0 d-flex align-items-center text-decoration-none transition-all ${reaction === "dislike" ? "text-dark" : "text-muted text-opacity-50"}`}
                  onClick={() => handleReact("dislike")}
                  style={{ transition: "0.2s transform" }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <i
                    className={`bi bi-hand-thumbs-down${reaction === "dislike" ? "-fill" : ""} fs-4 me-2`}
                  ></i>
                  <span className="fw-bold">{dislikesCount}</span>
                </button>
                <button
                  className="btn btn-link link-dark text-decoration-none p-0 d-flex align-items-center"
                  onClick={() =>
                    document
                      .getElementById("comments")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <i className="bi bi-chat me-2 fs-4"></i>
                  <span className="fw-bold">{commentsCount}</span>
                </button>
              </div>

              {likesCount > 0 && (
                <LikesDropdown
                  totalLikeCount={post.totalLikeCount}
                  likedByCurrentUser={post.likedByCurrentUser}
                  otherLikeCount={post.otherLikeCount}
                  likedUsers={post.likedUsers}
                  currentUser={user}
                />
              )}
            </div>
          </article>

          <section id="comments">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0 fw-bold">Conversation ({commentsCount})</h4>
            </div>

            <form
              onSubmit={handleCommentSubmit}
              className="mb-5 bg-white p-4 rounded shadow-sm border"
            >
              <div className="d-flex mb-3">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: "45px", height: "45px", flexShrink: 0 }}
                >
                  <span className="fw-bold text-primary small">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <textarea
                  className="form-control border-0 bg-light p-3"
                  rows="3"
                  placeholder="Write a comment..."
                  style={{ resize: "none" }}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 fw-semibold"
                  disabled={submittingComment}
                >
                  {submittingComment ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  Submit
                </button>
              </div>
            </form>

            <div className="comment-list">
              {[...post.comments]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment) => (
                  <div key={comment.commentId} className="d-flex mb-4 group">
                    <div
                      className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px", flexShrink: 0 }}
                    >
                      <span className="text-secondary small fw-bold">
                        {(comment.author?.name || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <div className="bg-light p-3 rounded-4 position-relative">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold small">
                            {comment.author?.name}
                          </span>
                          {(user?.userId === comment.author?.id ||
                            isAuthor) && (
                              <button
                                className="btn btn-link link-danger p-0 ms-2"
                                onClick={() =>
                                  handleDeleteComment(comment.commentId)
                                }
                              >
                                <i className="bi bi-trash-fill small"></i>
                              </button>
                            )}
                        </div>
                        <p className="mb-0 text-secondary small">
                          {comment.text}
                        </p>
                      </div>
                      <small
                        className="text-muted ms-2 mt-1"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  </div>
                ))}
              {post.comments.length === 0 && (
                <div className="text-center py-5 bg-light rounded-4">
                  <i className="bi bi-chat-dots fs-1 text-muted opacity-25"></i>
                  <p className="text-muted mt-2">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
