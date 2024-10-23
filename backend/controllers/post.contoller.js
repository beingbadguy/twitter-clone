import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
export const createPost = async (req, res) => {
  const { text } = req.body;
  let content = req.files?.image;
  // console.log(content);
  const userId = req.user._id.toString();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!text && !content) {
      return res.status(400).json({
        message: "Text or image is required",
      });
    }
    let image;
    if (content) {
      const response = await cloudinary.uploader.upload(content.tempFilePath, {
        folder: "SnapWay", // Optional: Specify a folder in Cloudinary
        use_filename: true, // Optional: Use the original file name
        unique_filename: true, // Optional: Ensure unique file names
      });
      image = response.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text,
      image: image,
    });
    await newPost.save();
    return res.status(201).json({ post: newPost });
  } catch (err) {
    console.log(err.message);
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id.toString();
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete post" });
    }
    if (post.image) {
      const imageId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imageId);
    }
    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: "Failed to delete post",
    });
  }
};

export const updatePost = async (req, res) => {};

export const likeUnlikePost = async (req, res) => {
  //   const { text } = req.body;
  const postId = req.params.id;
  const userId = req.user._id.toString();
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.likes.includes(userId)) {
      // unlike logic
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      return res.status(200).json({
        message: "Post unliked successfully",
      });
    } else {
      // like logic
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      return res.status(200).json({
        message: "Post liked successfully",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: "Failed to like/unlike post",
    });
  }
};

export const commentPost = async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.user._id.toString();
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const newComment = {
      user: userId,
      text,
    };
    post.comments.push(newComment);
    await post.save();
    return res.status(201).json({ comment: newComment });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "Failed to comment on post" });
  }
};

export const allPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(200).json({ posts: [] });
    }
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

export const userPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(200).json({ posts: [] });
    }
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};
