const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    role: { type: String, require: true, enum: ["user", "therapist"] },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date },
    address: { type: String, default: "" },
    googleId: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

// userSchema.statics.findOrCreate = async (profile) => {
//   try {
//     let user = await User.findOne({ email: profile.email });
//     if (!user) {
//       let newPassword = profile.password || "123456";
//       const salt = await bcrypt.genSalt(10);
//       newPassword = await bcrypt.hash(newPassword, salt);

//       user = await User.create({
//         role: profile.role,
//         name: profile.name,
//         email: profile.email,
//         password: newPassword,
//         avatarUrl: profile.avatarUrl,
//         googleId: profile.googleId,
//       });
//       return user;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "365d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
