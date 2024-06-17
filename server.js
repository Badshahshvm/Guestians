const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpreeError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
// const listings = require("./routes/listing");
// const reviews = require("./routes/reviews");

const { listingSchema, reviewSchema } = require("./schema"); // Assuming you have a listingSchema defined in schema.js
const wrapAsync = require("./utils/wrapAsync");

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Guestians")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Middleware and configurations
const sessionOptions = {
  secret: "MySecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.get("/", (req, res) => {
  res.send("home page");
});
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // Validate req.body against reviewSchema
  if (error) {
    const message = error.details.map((el) => el.message).join(". ");
    next(new ExpreeError(400, message)); // Pass error to error handler middleware
  } else {
    next(); // Proceed to the next middleware or route handler
  }
};
// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews);

// New Listing Form
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show Listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing You requested for does't exist ");
      res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  })
);

// All Listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// Create Listing
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      throw new ExpreeError(
        400,
        error.details.map((err) => err.message).join(", ")
      );
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
  })
);

// Edit Listing Form
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing You requested for does't exist ");
      res.redirect("/listings");
    }
    req.flash("success", "Edition is done!...");
    res.render("listings/edit", { listing });
  })
);

// Update Listing
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "List is updated!...");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is deleted!...");
    res.redirect("/listings");
  })
);

// Create Review for a Listing
app.post(
  "/listings/:id/reviews",

  wrapAsync(async (req, res, next) => {
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
    req.flash("success", "Review is done!...");
    res.redirect(`/listings/${listing._id}`);
  })
);
//Delete Review Route:-

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is deleted!...");
    res.redirect(`/listings/${id}`);
  })
);

// Error Handling Middleware
app.all("*", (req, res, next) => {
  next(new ExpreeError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error", { error: err });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
