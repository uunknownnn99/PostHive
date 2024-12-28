const path = require("path");
const Users = require("../models/user");
const { createToken } = require("../services/auth");

async function handleUserLogIn(req, res) {
  const { email, password } = req.body;
  try {
    const token = await Users.validatePasswordAndGenerateUid(email, password);
    res.cookie("uid", token, { maxAge: 24 * 60 * 60 * 1000 });
    res.redirect(`/`);
  } catch (err) {
    res.redirect(`login?error="${encodeURIComponent(err.message)}"`);
  }
}

async function handleUserSignUp(req, res) {
  try {
    const profileImageUrl = req.file
      ? `/uploads/${req.file.fieldname}-${req.body.email}${path.extname(
          req.file.originalname
        )}`
      : null;
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profileImageUrl: profileImageUrl,
    });
    await user.save();
  } catch (err) {
    return res.redirect(`login/?error=${encodeURIComponent(err.message)}`); // Redirect on error with encoded message
  }
  return res.redirect(
    "login/?error='Successfully Registered. Login in to Continue'"
  );
}

async function handleGetUserProfile(req, res) {
  res.render("profilePage", { data: req.user, error: req.query.error });
}

async function handleEditUserProfile(req, res) {
  try {
    const profileImageUrl = req.file
      ? `/uploads/${req.file.fieldname}-${req.user.email}${path.extname(
          req.file.originalname
        )}`
      : req.user.profileImageUrl;
    await Users.findByIdAndUpdate(req.user.id, {
      name: req.body.newName,
      profileImageUrl: profileImageUrl,
    });
    const newUser = await Users.findById(req.user.id);
    const newToken = createToken(newUser);
    res.cookie("uid", newToken, { maxAge: 24 * 60 * 60 * 1000 });
    res.redirect("profile?error='Profile Updated Successfully.'");
  } catch (err) {
    res.clearCookie("uid");
    return res.redirect("login/?error='Login in to Continue'");
  }
}

async function handleDeleteUser(req, res) {
  try {
    Users.validatePasswordAndGenerateUid(
      req.user.email,
      req.body.password
    );
    await Users.findByIdAndDelete(req.user.id);
    res.redirect(`login/?error="Account Deleted Successfully"`);
  } catch (err) {
    res.redirect(`login/?error="${encodeURIComponent(err.message)}"`);
  }
}

async function handleChangePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  try {
    Users.validatePasswordAndGenerateUid(
      req.user.email,
      currentPassword
    );
    await Users.findByIdAndUpdate(req.user.id, {
      password: Users.hashPassword(null, req.user.id, newPassword),
    });
    res.redirect("profile?error='Password Updated Successfully.'");
  } catch (err) {
    res.redirect("profile?error='Wrong Current Password. Failed to Update.'");
  }
}

async function handleLogout(req, res) {
  try {
    res.clearCookie("uid");
  } catch (err) {}
  res.redirect("login/?error='Logged Out Successfully'");
}

module.exports = {
  handleGetUserProfile,
  handleEditUserProfile,
  handleUserLogIn,
  handleUserSignUp,
  handleDeleteUser,
  handleChangePassword,
  handleLogout,
};