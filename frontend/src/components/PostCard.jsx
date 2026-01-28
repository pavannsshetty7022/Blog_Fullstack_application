import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { reactPost } from "../services/api";
import LikesDropdown from "./LikesDropdown";

const PostCard = ({ post }) => {
  const { user } = useAuth();

  const [reaction, setReaction] = useState(post.userReaction || null);
  const [likesCount, setLikesCount] = useState(post.totalLikeCount || 0);
  const [dislikesCount, setDislikesCount] = useState(post.dislikeCount || 0);

  const [stats, setStats] = useState({
    totalLikeCount: post.totalLikeCount || 0,
    likedByCurrentUser: post.likedByCurrentUser || false,
    otherLikeCount: post.otherLikeCount || 0,
    likedUsers: post.likedUsers || [],
  });

  useEffect(() => {
    setReaction(post.userReaction || null);
    setLikesCount(post.totalLikeCount || 0);
    setDislikesCount(post.dislikeCount || 0);
    setStats({
      totalLikeCount: post.totalLikeCount || 0,
      likedByCurrentUser: post.likedByCurrentUser || false,
      otherLikeCount: post.otherLikeCount || 0,
      likedUsers: post.likedUsers || [],
    });
  }, [post]);

  const handleReact = async (type) => {
    if (!user) return;

    const oldReaction = reaction;
    const newReaction = oldReaction === type ? null : type;

    setReaction(newReaction);

    let newLikes = likesCount;
    let newDislikes = dislikesCount;

    if (oldReaction === "like") newLikes--;
    if (oldReaction === "dislike") newDislikes--;

    if (newReaction === "like") newLikes++;
    if (newReaction === "dislike") newDislikes++;

    setLikesCount(newLikes);
    setDislikesCount(newDislikes);

    const newIsLiked = newReaction === "like";
    setStats((prev) => ({
      ...prev,
      totalLikeCount: newLikes,
      likedByCurrentUser: newIsLiked,
      otherLikeCount: Math.max(0, newLikes - (newIsLiked ? 1 : 0)),
    }));

    try {
      const { data } = await reactPost(post._id, newReaction);
      setLikesCount(data.totalLikeCount);
      setDislikesCount(data.dislikeCount);
      setReaction(data.userReaction);
      setStats({
        totalLikeCount: data.totalLikeCount,
        likedByCurrentUser: data.likedByCurrentUser,
        otherLikeCount: data.otherLikeCount,
        likedUsers: data.likedUsers,
      });
    } catch (err) {
      console.error("Reaction failed", err);
      setReaction(oldReaction);
      setLikesCount(likesCount);
      setDislikesCount(dislikesCount);
      const oldIsLiked = oldReaction === "like";
      setStats((prev) => ({
        ...prev,
        totalLikeCount: likesCount,
        likedByCurrentUser: oldIsLiked,
        otherLikeCount: Math.max(0, likesCount - (oldIsLiked ? 1 : 0)),
      }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="card h-100 border-0 shadow-sm animate-fade-in">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge badge-highlight rounded-pill px-3 py-2">
            Blog Post
          </span>
          <small className="text-muted">{formatDate(post.createdAt)}</small>
        </div>
        <h4 className="card-title mb-3">
          <Link
            to={`/post/${post._id}`}
            className="text-decoration-none"
            style={{ color: "var(--headings-color)" }}
          >
            {post.title}
          </Link>
        </h4>
        {post.uploadImage && (
          <div className="row mb-2">
            <div className="col-12 d-flex justify-content-center">
              <img
                src={post.uploadImage}
                alt={post.title}
                className="img-fluid rounded"
                style={{
                  height: "250px",
                  width: "300px",
                  objectFit: "cover",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          </div>
        )}

        <p
          className="card-text text-secondary mb-4"
          style={{
            // display: "-webkit-box",
            // WebkitLineClamp: 3,
            // WebkitBoxOrient: "vertical",
            // overflow: "hidden",
          }}
        >
          {post.content}
        </p>

        <div className="d-flex align-items-center mb-4">
          <div
            className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: "32px", height: "32px" }}
          >
            <i className="bi bi-person text-primary"></i>
          </div>
          <span className="fw-semibold small">{post.author}</span>
        </div>
        <hr className="my-3 opacity-10" />
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-4">
            <button
              className={`btn btn-link p-0 d-flex align-items-center text-decoration-none transition-all ${reaction === "like" ? "text-dark" : "text-muted text-opacity-50"}`}
              onClick={() => handleReact("like")}
              style={{ transition: "0.2s transform" }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <i
                className={`bi bi-hand-thumbs-up${reaction === "like" ? "-fill" : ""} fs-5 me-1`}
              ></i>
              <span className="fw-bold small">{likesCount}</span>
            </button>
            <button
              className={`btn btn-link p-0 d-flex align-items-center text-decoration-none transition-all ${reaction === "dislike" ? "text-dark" : "text-muted text-opacity-50"}`}
              onClick={() => handleReact("dislike")}
              style={{ transition: "0.2s transform" }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <i
                className={`bi bi-hand-thumbs-down${reaction === "dislike" ? "-fill" : ""} fs-5 me-1`}
              ></i>
              <span className="fw-bold small">{dislikesCount}</span>
            </button>
          </div>
          <Link
            to={`/post/${post._id}`}
            className="btn btn-sm btn-outline-primary px-3"
          >
            Read More
          </Link>
        </div>
        {likesCount > 0 && (
          <div className="mt-3 pt-2 border-top border-light">
            <LikesDropdown
              totalLikeCount={stats.totalLikeCount}
              likedByCurrentUser={stats.likedByCurrentUser}
              otherLikeCount={stats.otherLikeCount}
              likedUsers={stats.likedUsers}
              currentUser={user}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
