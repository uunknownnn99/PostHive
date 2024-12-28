const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MediaSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video", "audio"], required: true },
  url: { type: String, required: true },
  thumbnail: { type: String, default: null },
});

const postSchema = new mongoose.Schema({
  createdBy: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String },
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  media: {
    type: [MediaSchema],
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
  }],
  comments: {
    type: [commentSchema],
    default: [],
  },
  shares: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.static("getLatestPosts", async function () {
  try {
    const posts = await Post.find({}).sort({createdAt: -1});
    return posts;
  } catch (error) {
    console.error('Error fetching random posts:', error);
    return [];
  }
});

const Post = mongoose.model("Posting", postSchema);
module.exports = Post;