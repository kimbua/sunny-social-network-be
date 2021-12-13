const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Users
const usersApi = require("./users.api");
router.use("/users", usersApi);

// Auth
const authRouter = require("./auth.api");
router.use("/auth", authRouter);

module.exports = router;
