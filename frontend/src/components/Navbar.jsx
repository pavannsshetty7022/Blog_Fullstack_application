import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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

  const handleLinkClick = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const toggler = document.querySelector(".navbar-toggler");
      if (toggler && window.getComputedStyle(toggler).display !== "none") {
        toggler.click();
      }
    }
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link px-3 ${isActive ? "fw-bold text-dark" : "text-secondary"}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom fixed-top">
      <div className="container">
        <NavLink
          className="navbar-brand d-flex align-items-center"
          to="/"
          onClick={handleLinkClick}
        >
          <i className="bi bi-journal-text me-2 text-primary fs-3"></i>
          <span>BlogApp</span>
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <NavLink
                to="/"
                onClick={handleLinkClick}
                className={navLinkClass}
              >
                Home
              </NavLink>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/create"
                    onClick={handleLinkClick}
                    className={navLinkClass}
                  >
                    Create Post
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/my-posts"
                    onClick={handleLinkClick}
                    className={navLinkClass}
                  >
                    My Posts
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {user && (
            <div className="dropdown">
              <button
                className="btn btn-link p-0 border-0 text-decoration-none dropdown-toggle d-flex align-items-center"
                type="button"
                id="userNavbarDropdown"
                data-bs-toggle="dropdown"
              >
                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: "38px", height: "38px" }}
                >
                  <span className="small fw-bold text-primary">
                    {getInitials(user.name)}
                  </span>
                </div>
                <span className="d-none d-md-inline fw-medium text-dark">
                  {user.name}
                </span>
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2 rounded-3"
                aria-labelledby="userNavbarDropdown"
              >
                <li className="px-3 py-2 border-bottom mb-2 bg-light rounded-top">
                  <p className="small text-muted mb-0">Logged in as</p>
                  <p className="fw-bold mb-0">@{user.username}</p>
                </li>

                <li>
                  <NavLink
                    to="/profile"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `dropdown-item py-2 px-3 rounded ${
                        isActive ? "fw-bold text-dark bg-light" : ""
                      }`
                    }
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Profile
                  </NavLink>
                </li>

                <li>
                  <hr className="dropdown-divider opacity-50" />
                </li>

                <li>
                  <button
                    className="dropdown-item py-2 px-3 rounded text-danger"
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
