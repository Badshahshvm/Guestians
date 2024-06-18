const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  signup,
  createUser,
  login,
  loginUser,
  logout,
} = require("../controller/user");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", signup);
router.post("/signup", createUser);
router.get("/login", login);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  loginUser
);
router.get("/logout", logout);

module.exports = router;
