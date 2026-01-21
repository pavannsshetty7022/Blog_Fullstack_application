import React, { useEffect, useState } from "react";
import { fetchPosts } from "../services/api";
import PostCard from "../components/PostCard";
import usePageTitle from "../hooks/usePageTitle";


const HomePage = () => {
    usePageTitle("Home");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPosts = async () => {
        const startTime = Date.now();
        try {
            const { data } = await fetchPosts();
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 2000 - elapsedTime);

            await new Promise(resolve => setTimeout(resolve, remainingTime));
            setPosts(data);
        } catch (err) {
            setError("Failed to load posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    if (loading) {
        return (
            <div className="container py-5 relative z-10" style={{ position: "relative", zIndex: 10 }}>
                <header className="mb-5">
                    <h1 className="display-5 mb-2">Editor's Picks</h1>
                    <p className="text-secondary lead">Explore the latest thoughts and stories from our community.</p>
                </header>

                <div className="row g-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body p-4 animate-pulse">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="bg-secondary bg-opacity-10 rounded-pill" style={{ height: "28px", width: "100px" }}></div>
                                        <div className="bg-secondary bg-opacity-10 rounded" style={{ height: "16px", width: "80px" }}></div>
                                    </div>
                                    <div className="bg-secondary bg-opacity-10 rounded mb-3" style={{ height: "28px", width: "85%" }}></div>
                                    <div className="mb-4">
                                        <div className="bg-secondary bg-opacity-10 rounded mb-2" style={{ height: "16px", width: "100%" }}></div>
                                        <div className="bg-secondary bg-opacity-10 rounded mb-2" style={{ height: "16px", width: "95%" }}></div>
                                        <div className="bg-secondary bg-opacity-10 rounded" style={{ height: "16px", width: "80%" }}></div>
                                    </div>
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="bg-secondary bg-opacity-10 rounded-circle me-2" style={{ width: "32px", height: "32px" }}></div>
                                        <div className="bg-secondary bg-opacity-10 rounded" style={{ height: "16px", width: "120px" }}></div>
                                    </div>
                                    <hr className="my-3 opacity-10" />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex gap-4">
                                            <div className="bg-secondary bg-opacity-10 rounded" style={{ height: "24px", width: "50px" }}></div>
                                            <div className="bg-secondary bg-opacity-10 rounded" style={{ height: "24px", width: "50px" }}></div>
                                        </div>
                                        <div className="bg-secondary bg-opacity-10 rounded-pill" style={{ height: "32px", width: "100px" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 relative z-10" style={{ position: "relative", zIndex: 10 }}>
            <header className="mb-5">
                <h1 className="display-5 mb-2">Editor's Picks</h1>
                <p className="text-secondary lead">Explore the latest thoughts and stories from our community.</p>
            </header>

            {error && <div className="alert alert-danger">{error}</div>}

            {posts.length === 0 ? (
                <div className="text-center py-5 border rounded-4 bg-light">
                    <i className="bi bi-mailbox fs-1 text-muted mb-3 d-block"></i>
                    <h3>No posts found</h3>
                    <p className="text-muted">Be the first to share something amazing!</p>
                </div>
            ) : (
                <div className="row g-4">
                    {posts.map((post) => (
                        <div key={post._id} className="col-md-6 col-lg-4">
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
