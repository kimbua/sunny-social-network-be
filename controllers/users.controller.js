const bcrypt = require("bcryptjs");
const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User");

const userController = {};

userController.create = catchAsync(async (req, res, next) => {
  let { role, name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user)
    return next(
      new AppError(409, "Email address is already being used", "Register Error")
    );

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({
    role,
    name,
    email,
    password,
  });
  const accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});
userController.get = async (req, res, next) => {
  try {
    let user = await User.find().limit(10);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Get all user successful"
    );
  } catch (error) {
    next(error);
  }
};

userController.read = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    res.status(404).json({ message: "User not Found" });
  } else {
    res.json(user);
  }
};

userController.update = async (req, res) => {
  await User.findByIdAndUpdate(
    { _id: req.params.id },
    { email: req.body.email },
    { new: true },
    (err, user) => {
      console.log({ err, user });
      if (!user) {
        res.status(404).json({ message: "User not Found" });
      } else {
        res.json(user);
      }
    }
  );
};

userController.destroy = async (req, res) => {
  await User.findByIdAndDelete(req.params.id, (err, user) => {
    if (!user) {
      res.status(404).json({ message: "User not Found" });
    } else {
      res.json(user);
    }
  });
};

module.exports = userController;
