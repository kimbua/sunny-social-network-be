const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authController = {};
const { OAuth2Client } = require("google-auth-library");
const { eventNames } = require("../models/User");

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError(400, "Email does not exist", "Login Error"));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError(400, "Wrong password", "Login Error"));

  accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
authController.loginWithGoogle = catchAsync(async (req, res, next) => {
  const { idToken, role } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  console.log(ticket);
  const { email, name, picture, sub } = ticket.getPayload();
  console.log(email, name, picture, sub, role);
  // let user = await User.findOrCreate({
  //   role,
  //   email,
  //   name,
  //   avatarUrl: picture,
  //   googleId: sub,
  // });
  let user = await User.findOne({ email });
  if (!user) {
    let newPassword = "123456";
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);
    user = await User.create({
      role: "user",
      name: name,
      password: newPassword,
      email: email,
      avatarUrl: picture,
      googleId: sub,
    });
  }
  const accessToken = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
});
module.exports = authController;
