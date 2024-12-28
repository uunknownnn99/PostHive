const express = require("express");
const cookieParser = require("cookie-parser");
const connectMongoDB = require("./services/connectDB");
const Posts = require("./models/post");

const app = express();
connectMongoDB();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const restrictToLoggedInUsersOnly = require("./middlewares/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

const port = process.env.PORT || 8000;

app.get("/", restrictToLoggedInUsersOnly, async (req,res)=>{
    const posts = await Posts.getLatestPosts();
    posts.forEach(post => {
      const userLiked = post.likedBy.some(like => like.user._id.toString() === req.user.id.toString());
      post.userLiked = userLiked;
    });
  res.render("homepage", { posts: posts, loggedInUser: req.user.id});
});

app.use("/user", userRoutes);

app.use("/post", restrictToLoggedInUsersOnly, postRoutes);

app.listen(port, () => {
  console.log(`Server Started at PORT ${port}`);
});
