import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { username, name, email, password } = req.body;
  try {
    if (!username || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const doesEmailExist = await User.findOne({ email });
    if (doesEmailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const doesUsernameExist = await User.findOne({ username });
    if (doesUsernameExist) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        followers: newUser.followers,
        follwing: newUser.followers,
        bio: newUser.bio,
        profileImage: newUser.profileImage,
        coverImage: newUser.coverImage,
        bio: newUser.bio,
        link: newUser.link,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create user",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      sucess: false,
      message: "Failed to Signup",
    });
  }
};
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists?.password || " "
    );
    if (!userExists || !isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    generateTokenAndSetCookie(userExists._id, res);
    res.status(200).json({
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      username: userExists.username,
      followers: userExists.followers,
      follwing: userExists.followers,
      bio: userExists.bio,
      profileImage: userExists.profileImage,
      coverImage: userExists.coverImage,
      bio: userExists.bio,
      link: userExists.link,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to Login",
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("twitter", "", { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to Logout",
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
};
