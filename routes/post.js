const express = require("express");
const router = express.Router();


const { uploadPostMedia } = require("../services/upload");
const { handleCreatePost ,handleGetPost, handlePostComment, handlePostLike, handlePostUnlike, handleCommentDelete, handlePostDelete } = require("../controllers/post");

router.route("/createPost")
.get((req,res) =>{ res.render("createPost"); })
.post( uploadPostMedia.array('media', 4), handleCreatePost);

router.route("/:id")
.get( handleGetPost)
.delete( handlePostDelete );

router.post("/:id/comment" , handlePostComment);

router.post("/:id/like", handlePostLike );

router.post("/:id/unlike", handlePostUnlike );

router.delete("/:id/:commentId", handleCommentDelete );

module.exports = router;