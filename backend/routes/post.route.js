import express from "express";
import protectedRoute from "../middlware/protectedRoute.js";
import {
  allPosts,
  commentPost,
  createPost,
  deletePost,
  likeUnlikePost,
  userPosts,
} from "../controllers/post.contoller.js";
const router = express.Router();

router.get("/all", protectedRoute, allPosts); // done
router.get("/:username", protectedRoute, userPosts);
router.post("/create", protectedRoute, createPost); //done
router.delete("/delete/:id", protectedRoute, deletePost);
router.put("/comment/:id", protectedRoute, commentPost);
router.put("/like/:id", protectedRoute, likeUnlikePost); //done

export default router;
