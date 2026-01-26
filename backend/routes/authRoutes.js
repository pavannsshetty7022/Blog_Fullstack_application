import express from "express";
import { register, login, updateProfile, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/profile", authMiddleware, upload.single("image"), updateProfile);

export default router;
