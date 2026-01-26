import axios from "axios";

const API = axios.create({
    baseURL: "https://blog-fullstack-application.onrender.com/api",
});

API.interceptors.request.use((req) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);
export const logout = () => API.post("/auth/logout");
export const updateProfile = (formData) => API.put("/auth/profile", formData);

export const fetchPosts = () => API.get("/posts");
export const fetchPostById = (id) => API.get(`/posts/${id}`);
export const createPost = (newPost) => API.post("/posts", newPost);
export const updatePost = (id, updatedPost) => API.put(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const reactPost = (id, reaction) => API.post(`/posts/${id}/react`, { reaction });
export const addComment = (id, commentData) => API.post(`/posts/${id}/comments`, commentData);
export const deleteComment = (id, commentId) => API.delete(`/posts/${id}/comments/${commentId}`);

export default API;
