import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/api";
import BackButton from "../components/BackButton";
import usePageTitle from "../hooks/usePageTitle";

const ProfilePage = () => {
    usePageTitle("Profile");
    const { user, updateAuth } = useAuth();
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        password: ""
    });
    const [originalData, setOriginalData] = useState({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        password: ""
    });

    React.useEffect(() => {
        if (user) {
            const userData = {
                name: user.name || "",
                username: user.username || "",
                email: user.email || "",
                password: ""
            };
            setFormData(userData);
            setOriginalData(userData);
        }
    }, [user]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditClick = () => {
        setIsEditMode(true);
        setMessage({ type: "", text: "" });
    };

    const handleCancelClick = () => {
        setFormData(originalData);
        setIsEditMode(false);
        setMessage({ type: "", text: "" });
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const { data } = await updateProfile(formData);
            setMessage({ type: "success", text: "Profile updated successfully!" });
            if (data.token) {
                updateAuth(data.token);
            }
            setOriginalData({ ...formData, password: "" });
            setFormData(prev => ({ ...prev, password: "" }));
            setIsEditMode(false);
        } catch (err) {
            setMessage({ type: "danger", text: err.response?.data?.message || "Failed to update profile." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 relative z-10" style={{ position: "relative", zIndex: 10 }}>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <BackButton />
                    <div className="card p-4 shadow-sm border-0">
                        <div className="text-center mb-4">
                            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "90px", height: "90px" }}>
                                <span className="fs-1 fw-bold text-primary">{getInitials(user?.name)}</span>
                            </div>
                            <h2 className="fw-bold mb-1">{user?.name}</h2>
                            <p className="text-muted small">@{user?.username} • {user?.email}</p>
                        </div>

                        {message.text && (
                            <div className={`alert alert-${message.type} alert-dismissible fade show border-0 small`} role="alert">
                                {message.text}
                                <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
                            </div>
                        )}

                        {!isEditMode ? (
                            <div>
                                <div className="mb-4">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small text-muted">Full Name</label>
                                        <p className="mb-0 fs-6">{formData.name}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small text-muted">Username</label>
                                        <p className="mb-0 fs-6">@{formData.username}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small text-muted">Email Address</label>
                                        <p className="mb-0 fs-6">{formData.email}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold"
                                    onClick={handleEditClick}
                                >
                                    Update Profile
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control form-control-lg border-2"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Username</label>
                                    <div className="input-group">
                                        <span className="input-group-text border-2 bg-light">@</span>
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control form-control-lg border-2"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control form-control-lg border-2"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold small">Change Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control form-control-lg border-2"
                                        placeholder="Leave blank to keep current"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary py-3 rounded-pill fw-bold"
                                        disabled={loading}
                                    >
                                        {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary py-3 rounded-pill fw-bold"
                                        onClick={handleCancelClick}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
