import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    user.password = null;
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while getting your profile.",
    });
  }
};
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = await User.findOne(req.user._id);
    const userToFollow = await User.findById(id);
    if (!loggedInUser || !userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself.",
      });
    }

    const isFollowing = loggedInUser.following.includes(id);
    // console.log(isFollowing);
    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
    }
    const updatedUser = await User.findById(req.user._id);
    updatedUser.password = null;

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};
export const suggestedUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const usersFollowedByMe = await User.findById(loggedInUser).select(
      "following"
    );
    const usersNotFollowedByMe = await User.aggregate([
      {
        $match: {
          _id: { $ne: loggedInUser },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);
    const filteredUsers = usersNotFollowedByMe.filter((user) => {
      return !usersFollowedByMe.following.includes(user._id);
    });
    // console.log(filteredUsers);
    const suggestedUsers = filteredUsers.slice(0, 5);
    suggestedUsers.forEach((user) => (user.password = null));
    return res.status(200).json({
      success: true,
      suggestedUsers,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

export const updateProfile = async (req, res) => {
  const { username, name, email, currentPassword, newPassword, bio, link } =
    req.body;
  const profile = req.files?.profileImage;
  const cover = req.files?.coverImage;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required or both.",
      });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Incorrect current password.",
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long.",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
    }
    let profileImage;
    if (profile) {
      if (user.profileImage) {
        await cloudinary.uploader.destroy(
          user.profileImage.split("/").pop().split(".")[0]
        );
      }
      const uploadResponse = await cloudinary.uploader.upload(
        profile.tempFilePath,
        {
          folder: "SnapWay", // Optional: Specify a folder in Cloudinary
          use_filename: true, // Optional: Use the original file name
          unique_filename: true, // Optional: Ensure unique file names
        }
      );
      profileImage = uploadResponse.secure_url;
    }
    let coverImage;
    if (cover) {
      if (user.coverImage) {
        await cloudinary.uploader.destroy(
          user.coverImage.split("/").pop().split(".")[0]
        );
      }
      const uploadResponse = await cloudinary.uploader.upload(
        cover.tempFilePath,
        {
          folder: "SnapWay", // Optional: Specify a folder in Cloudinary
          use_filename: true, // Optional: Use the original file name
          unique_filename: true, // Optional: Ensure unique file names
        }
      );
      coverImage = uploadResponse.secure_url;
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;
    user.username = username || user.username;
    await user.save();
    user.password = null;
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};
