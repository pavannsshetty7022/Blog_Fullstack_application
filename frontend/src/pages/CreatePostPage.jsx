import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import BackButton from "../components/BackButton";
import usePageTitle from "../hooks/usePageTitle";

const CreatePostPage = () => {
    usePageTitle("Create Post");
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            setError("Both title and content are required.");
            return;
        }
        setLoading(true);
        try {
            await createPost(formData);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 relative z-10" style={{ position: "relative", zIndex: 10 }}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <BackButton />
                    <div className="card p-4 shadow-sm border-0">
                        <h2 className="mb-4 fw-bold">Write a New Story</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control form-control-lg border-2 shadow-none"
                                    placeholder="Give your story a catchy title..."
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Content</label>
                                <textarea
                                    name="content"
                                    className="form-control border-2 shadow-none"
                                    rows="12"
                                    placeholder="Tell your story..."
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="d-flex gap-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-5 py-2 rounded-pill fw-semibold"
                                    disabled={loading}
                                >
                                    {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                                    Publish Now
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-light px-4 py-2 rounded-pill fw-semibold text-secondary"
                                    onClick={() => navigate("/")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostPage;
