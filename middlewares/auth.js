const { validateToken } = require("../services/auth");

async function restrictToLoggedInUsersOnly(req, res, next) {
  const token = req.cookies?.uid;
  if (!token || token == undefined || token == null) {
    return res.redirect('/user/login/?error="Login to Continue."');
  }
  const user = validateToken(token);
  if (user) {
    req.user = user;
    next();
  } else {
    res.redirect('/user/login/?error="Login to Continue."');
  }
}

module.exports = restrictToLoggedInUsersOnly;
