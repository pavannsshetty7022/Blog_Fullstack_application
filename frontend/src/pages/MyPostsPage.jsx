import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchPosts, deletePost } from "../services/api";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import usePageTitle from "../hooks/usePageTitle";

const MyPostsPage = () => {
    usePageTitle("My Posts");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const loadMyPosts = async () => {
        if (!user) return;
        try {
            const { data } = await fetchPosts();
            const myPosts = data.filter(post => post.email === user.email || post.authorId === user.userId);
            setPosts(myPosts);
        } catch (err) {
            console.error("Error loading user posts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyPosts();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await deletePost(id);
            loadMyPosts();
        } catch (err) {
            console.error("Error deleting post", err);
        }
    };

    if (loading) {
        return (
            <div className="container py-large text-center relative z-10" style={{ position: "relative", zIndex: 10 }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4 py-md-5 relative z-10" style={{ position: "relative", zIndex: 10 }}>
            <BackButton />
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="fw-bold mb-1">My Posts</h1>
                    <p className="text-secondary">Manage and track your published articles.</p>
                </div>
                <Link to="/create" className="btn btn-primary rounded-pill px-4">
                    <i className="bi bi-plus-lg me-2"></i> New Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 border">
                    <i className="bi bi-file-earmark-post fs-1 text-muted mb-3 d-block"></i>
                    <h3>You haven't written anything yet</h3>
                    <p className="text-muted mb-4">Your stories could inspire someone. Start writing today!</p>
                    <Link to="/create" className="btn btn-outline-primary rounded-pill px-4">Create Your First Post</Link>
                </div>
            ) : (
                <div className="row g-4">
                    {posts.map((post) => (
                        <div key={post._id} className="col-12">
                            <div className="card border-0 shadow-sm p-3">
                                <div className="row align-items-center">
                                    <div className="col-md-9">
                                        <h4 className="mb-2">
                                            <Link to={`/post/${post._id}`} className="text-decoration-none text-dark">{post.title}</Link>
                                        </h4>
                                        {post.uploadImage && (
                                            <div className="mb-3">
                                                <img 
                                                    src={`http://localhost:5000/${post.uploadImage}`} 
                                                    alt={post.title}
                                                    className="img-fluid rounded"
                                                    style={{ maxWidth: "100%", height: "250px", width:"350px", objectFit: "cover", borderRadius: "2px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
                                                />
                                            </div>
                                        )}
                                        <p className="text-secondary " style={{
                                            // display: "-webkit-box",
                                            // WebkitLineClamp: 2,
                                            // WebkitBoxOrient: "vertical",
                                            // overflow: "hidden"
                                        }}>
                                            {post.content}
                                        </p>
                                        
                                        <div className="d-flex gap-3 text-muted small">
                                            <span><i className="bi bi-calendar3 me-1"></i> {new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span><i className="bi bi-hand-thumbs-up me-1"></i> {post.totalLikeCount || 0} Likes</span>
                                            <span><i className="bi bi-chat-left-text me-1"></i> {post.commentsCount || 0} Comments</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3 text-md-end mt-3 mt-md-0">
                                        <button className="btn btn-light rounded-circle me-2" onClick={() => navigate(`/edit/${post._id}`)}>
                                            <i className="bi bi-pencil text-primary"></i>
                                        </button>
                                        <button className="btn btn-light rounded-circle" onClick={() => handleDelete(post._id)}>
                                            <i className="bi bi-trash text-danger"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPostsPage;
