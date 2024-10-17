import express from "express";

const router = express.Router();

router.post("/signup", (req, res) => {
  res.json({
    message: "Welcome to the signup page",
  });
});
router.post("/login", (req, res) => {
  res.json({
    message: "Welcome to the login page",
  });
});
router.post("/logout", (req, res) => {
  res.json({
    message: "Welcome to the logout page",
  });
});
export default router;
