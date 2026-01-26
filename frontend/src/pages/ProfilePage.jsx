import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/api";
import BackButton from "../components/BackButton";
import usePageTitle from "../hooks/usePageTitle.jsx";

const ProfilePage = () => {
  usePageTitle("Profile");

  const { user, updateAuth } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || "");
  const [removeImage, setRemoveImage] = useState(false);

  const [originalData, setOriginalData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  React.useEffect(() => {
    if (user) {
      const data = {
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        password: "",
      };
      setFormData(data);
      setOriginalData(data);
      setImagePreview(user.profileImage || "");
      setRemoveImage(false);
      setImageFile(null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setRemoveImage(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setMessage({ type: "", text: "" });
  };

  const handleCancelClick = () => {
    setFormData(originalData);
    setImagePreview(user?.profileImage || "");
    setImageFile(null);
    setRemoveImage(false);
    setIsEditMode(false);
    setMessage({ type: "", text: "" });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("username", formData.username);
      dataToSend.append("email", formData.email);
      if (formData.password) dataToSend.append("password", formData.password);
      if (imageFile) dataToSend.append("image", imageFile);
      if (removeImage) dataToSend.append("removeImage", "true");

      const { data } = await updateProfile(dataToSend);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      if (data.token) {
        updateAuth(data.token);
      }

      setOriginalData({ ...formData, password: "" });
      setFormData((prev) => ({ ...prev, password: "" }));
      setImageFile(null);
      setRemoveImage(false);
      setIsEditMode(false);
    } catch (err) {
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 py-md-5 position-relative z-10">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <BackButton />

          <div className="card p-4 shadow-sm border-0">
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block mb-3">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center overflow-hidden border border-primary border-opacity-10"
                  style={{ width: "100px", height: "100px" }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <span className="fs-1 fw-bold text-primary">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>

                {isEditMode && (
                  <div className="position-absolute bottom-0 end-0 d-flex gap-1">
                    <label
                      htmlFor="profileImageInput"
                      className="btn btn-primary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: "32px", height: "32px", cursor: "pointer" }}
                      title="Upload Photo"
                    >
                      <i className="bi bi-camera-fill small"></i>
                      <input
                        type="file"
                        id="profileImageInput"
                        className="d-none"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                        style={{ width: "32px", height: "32px" }}
                        onClick={handleRemoveImage}
                        title="Remove Photo"
                      >
                        <i className="bi bi-trash-fill small"></i>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <h2 className="fw-bold mb-1">{user?.name}</h2>
              <p className="text-muted small">
                @{user?.username} • {user?.email}
              </p>
            </div>

            {message.text && (
              <div
                className={`alert alert-${message.type} alert-dismissible fade show border-0 small`}
              >
                {message.text}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMessage({ type: "", text: "" })}
                ></button>
              </div>
            )}

            {!isEditMode ? (
              <>
                <div className="mb-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted">
                      Full Name
                    </label>
                    <p className="mb-0">{formData.name}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted">
                      Username
                    </label>
                    <p className="mb-0">@{formData.username}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-muted">
                      Email Address
                    </label>
                    <p className="mb-0">{formData.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm w-100 py-2 px-4"
                  onClick={handleEditClick}
                >
                  Update Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-sm border-2"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Username
                  </label>
                  <div className="input-group">
                    <span className="input-group-text border-2 bg-light py-1 px-2">
                      @
                    </span>
                    <input
                      type="text"
                      name="username"
                      className="form-control form-control-sm border-2"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-sm border-2"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">
                    Change Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-sm border-2"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex justify-content-center gap-3 px-5">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm py-2 px-4 fw-semibold"
                    disabled={loading}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    )}
                    Save
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm py-2 px-3 fw-semibold"
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
