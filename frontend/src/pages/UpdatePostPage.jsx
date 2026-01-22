import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, updatePost } from "../services/api";
import BackButton from "../components/BackButton";
import usePageTitle from "../hooks/usePageTitle.jsx";

const UpdatePostPage = () => {
    usePageTitle("Update Post");
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPost = async () => {
            try {
                const { data } = await fetchPostById(id);
                setFormData({ title: data.title, content: data.content });
            } catch (err) {
                setError("Failed to load post data.");
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("content", formData.content);
            if (image) {
                data.append("image", image);
            }

            await updatePost(id, data);
            navigate(`/post/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update post.");
        } finally {
            setSubmitting(false);
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
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <BackButton />
                    <div className="card p-4 shadow-sm border-0">
                        <h2 className="mb-4 fw-bold">Edit Your Story</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control form-control-lg border-2 shadow-none"
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
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Update Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            <div className="d-flex gap-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-5 py-2 rounded-pill fw-semibold"
                                    disabled={submitting}
                                >
                                    {submitting && <span className="spinner-border spinner-border-sm me-2"></span>}
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-light px-4 py-2 rounded-pill fw-semibold text-secondary"
                                    onClick={() => navigate(-1)}
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

export default UpdatePostPage;
