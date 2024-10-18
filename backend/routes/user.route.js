import express from "express";
import protectedRoute from "../middlware/protectedRoute.js";
import {
  followUnfollowUser,
  getUserProfile,
  suggestedUsers,
  updateProfile,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggested", protectedRoute, suggestedUsers);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
router.post("/update", protectedRoute, updateProfile);

export default router;
