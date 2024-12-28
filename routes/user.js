const express = require("express");
const { uploadProfileImage } = require("../services/upload");
const restrictToLoggedInUsersOnly = require("../middlewares/auth");
const {
  handleGetUserProfile,
  handleEditUserProfile,
  handleUserLogIn,
  handleUserSignUp,
  handleDeleteUser,
  handleChangePassword,
  handleLogout,
} = require("../controllers/user");

const router = express.Router();

router
  .route("/profile")
  .get(restrictToLoggedInUsersOnly, handleGetUserProfile)
  .post(restrictToLoggedInUsersOnly, uploadProfileImage.single("newProfileImage"), handleEditUserProfile
);

router
  .route("/login")
  .get((req, res) => {
    res.render("loginSignup", { error: req.query.error });
  })
  .post(handleUserLogIn
);

router
  .route("/signup")
  .get((req, res) => {
    res.render("loginSignup", { error: req.query.error });
  })
  .post(uploadProfileImage.single("profileImage"), handleUserSignUp
);

router.get("/logout",
  restrictToLoggedInUsersOnly,
  handleLogout,
);

router.post(
  "/delete",
  restrictToLoggedInUsersOnly,
  handleDeleteUser,
);

router.post(
  "/changePassword",
  restrictToLoggedInUsersOnly,
  handleChangePassword,
);

module.exports = router;
