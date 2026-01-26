import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = sessionStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded);
                }
            } catch (error) {
                logout();
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const loginUser = (token) => {
        sessionStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        navigate("/");
    };

    const updateAuth = (token) => {
        sessionStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser(decoded);
    };

    const logout = async () => {
        sessionStorage.removeItem("token");
        setUser(null);
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout API failed", error);
        }
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, updateAuth, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
