const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");

// Middleware to wrap async functions
const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};

module.exports.signup = wrapAsync(async (req, res, next) => {
  res.render("users/signup.ejs");
});

module.exports.createUser = wrapAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = new User({ email, username });

  try {
    const registeredUser = await User.register(user, password);
    req.flash("success", "User registered successfully");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    // Redirect to signup page in case of error
    res.redirect("/signup");
  }
});

module.exports.login = wrapAsync(async (req, res, next) => {
  res.render("users/login.ejs");
});

module.exports.loginUser = wrapAsync(async (req, res, next) => {
  req.flash("success", "login successfully");
  const url = res.locals.redirectUrl || "/listings";
  res.redirect(url);
});

module.exports.logout = wrapAsync(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "logout successfully...");
    res.redirect("/listings");
  });
});
