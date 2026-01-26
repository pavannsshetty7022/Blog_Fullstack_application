import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../services/api";
import usePageTitle from "../hooks/usePageTitle.jsx";

const RegisterPage = () => {
  usePageTitle("Register");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerApi(formData);
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center py-5 relative z-10">
      <div className="row justify-content-center w-100">

        <div className="col-md-4 d-none d-md-flex align-items-center justify-content-center">
          <img
            src="/Blog Vector.png"
            alt="Blog Illustration"
            className="img-fluid"
            style={{ maxHeight: "620px" }}
          />
        </div>
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0">
            <h2 className="text-center mb-4 fw-bold">
              <i className="bi bi-person-plus me-2"></i>Sign Up
            </h2>

            {error && (
              <div className="alert alert-danger py-2">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="johndoe123"
                  required
                  autoComplete="username"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder="Choose a password"
                    required
                    autoComplete="new-password"
                    onChange={handleChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`bi bi-eye${showPassword ? "" : "-slash"}`}
                    ></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                )}
                Sign Up
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Already have an account?
              <Link to="/login" className="ms-1 text-decoration-none">
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
