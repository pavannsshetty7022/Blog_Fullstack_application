import express from "express";
import {
  createPost,
  getAllPosts,
  toggleDislike,
  toggleLike,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  getPostById
} from "../controllers/postController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createPost);
router.get("/", getAllPosts);

router.post("/like/:id", auth, toggleLike);
router.post("/dislike/:id", auth, toggleDislike);

router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

router.post("/:id/comments", auth, addComment);
router.delete("/:id/comments/:commentId", auth, deleteComment);
router.get("/posts/:id", auth, getPostById);


export default router;
