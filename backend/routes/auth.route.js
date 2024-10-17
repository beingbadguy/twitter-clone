import express from "express";

const router = express.Router();
import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import protectedRoute from "../middlware/protectedRoute.js";

router.get("/me", protectedRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
export default router;
