const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be loged in");
    res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings"); // Redirect to a suitable location if listing not found
    }

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("error", "You don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }

    next(); // Call next middleware if the user is the owner
  } catch (err) {
    console.error("Error in isOwner middleware:", err);
    req.flash("error", "Something went wrong");
    return res.redirect("/listings"); // Handle any other error case appropriately
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to delete review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
