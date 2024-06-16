const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpreeError = require("../utils/ExpressError");

// Middleware to wrap async functions
const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};

// Create review for a listing
module.exports.createReview = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const { comment, rating } = req.body.review;
  if (!comment || !rating) {
    throw new ExpreeError(400, "Please fill out all fields");
  }
  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
});

// Delete review for a listing
module.exports.deleteReview = wrapAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
});
