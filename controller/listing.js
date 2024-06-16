const Listing = require("../models/listing");
const ExpreeError = require("../utils/ExpressError");

// Middleware to wrap async functions
const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};

// Controller methods
module.exports.newListing = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    throw new ExpreeError(404, "Listing not found");
  }
  res.render("listings/show", { listing });
});

module.exports.getAllListings = wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

module.exports.createListing = wrapAsync(async (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpreeError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

module.exports.getEditListingForm = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
});

module.exports.updateListing = wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

module.exports.deleteListing = wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
