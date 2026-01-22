import express from "express";
import {
  createPost,
  getAllPosts,
  reactPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  getPostById
} from "../controllers/postController.js";
import auth from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", auth, upload.single("image"), createPost);
router.get("/", getAllPosts);

router.post("/:id/react", auth, reactPost);

router.put("/:id", auth, upload.single("image"), updatePost);
router.delete("/:id", auth, deletePost);

router.post("/:id/comments", auth, addComment);
router.delete("/:id/comments/:commentId", auth, deleteComment);
router.get("/:id", getPostById);


export default router;
