const mongoose = require("mongoose");
const crypto = require("crypto");

const { createToken, validateToken } = require(`../services/auth`);
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
    default: "/images/defaultProfileImage.png",
  },
});

//Encrypting password
userSchema.pre("save", function (next) {
  const user = this;
  if (!this.isModified("password")) return next(); //isModified is In-built Mongoose Function

  const salt = crypto.randomBytes(10);
  const hash = crypto.createHash("sha256", salt);
  const hashedPassword = hash.update(user.password).digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static("hashPassword", function (salt = null, id = null, password) {
  if (!salt) {
    salt = this.findById(id).salt;
  }
  const userProvidedHash = crypto
    .createHash("sha256", salt)
    .update(password)
    .digest("hex");
  return userProvidedHash;
});

userSchema.static(
  "validatePasswordAndGenerateUid",
  async function (email, password) {
    const user = await this.findOne({ email: email });
    if (!user) {
      throw new Error("User not found!");
    }
    const userProvidedHash = this.hashPassword(this.salt, null, password);
    if (user.password !== userProvidedHash)
      throw new Error("Incorrect Password");

    const token = createToken(user);
    return token;
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
