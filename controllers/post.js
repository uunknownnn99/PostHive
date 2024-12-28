const Posts = require("../models/post");

async function handleCreatePost(req, res) {
  const medias = [];
  for (const media of req.files) {
    medias.push({
      type: media.mimetype.split("/")[0],
      url: `/media/${media.filename}`,
    });
  }
  const posts = await Posts.create({
    createdBy: {
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
    title: req.body.title,
    content: req.body.content,
    media: medias,
  });
  res.redirect("/");
}

async function handleGetPost(req, res) {
  const postId = req.params.id;
  const post = await Posts.findById(postId);
  const isLiked = post.likedBy.some(
    (like) => like.user._id.toString() === req.user.id.toString()
  );
  res.render("postPage", {
    post: post,
    userLiked: isLiked,
    loggedInUser: req.user.id,
  });
}

async function handlePostComment(req, res) {
  const postId = req.params.id;
  const post = await Posts.findById(postId);
  const commentData = {
    user: {
      _id: req.user.id,
      name: req.user.name,
    },
    text: req.body.text,
  };
  post.comments.push(commentData);
  await post.save();
  const isLiked = post.likedBy.some(
    (like) => like.user._id.toString() === req.user.id.toString()
  );
  res.render("postPage", { post: post, userLiked: isLiked , loggedInUser: req.user.id,});
}

async function handlePostLike(req, res) {
  const postId = req.params.id;
  const post = await Posts.findById(postId);
  post.likes = post.likes + 1;
  post.likedBy.push({
    user: {
      _id: req.user.id,
      name: req.user.name,
    },
  });
  await post.save();
  res.end();
}

async function handlePostUnlike(req, res) {
  const postId = req.params.id;
  const post = await Posts.findById(postId);
  post.likes = post.likes - 1;
  post.likedBy = post.likedBy.filter(
    (like) => String(like.user._id) !== String(req.user.id)
  );
  await post.save();
  res.end();
}

async function handleCommentDelete(req, res) {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  const post = await Posts.findById(postId);
  post.comments = post.comments.filter(
    (comment) => comment._id.toString() !== commentId
  );
  post.save();
  res.end();
}

async function handlePostDelete(req, res) {
  const postId = req.params.id;
  await Posts.findByIdAndDelete(postId);
  res.end();
}

module.exports = {
  handleCreatePost,
  handleGetPost,
  handlePostComment,
  handlePostLike,
  handlePostUnlike,
  handleCommentDelete,
  handlePostDelete,
};
