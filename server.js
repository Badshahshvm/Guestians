const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpreeError = require("./utils/ExpressError");
const {listingSchema}=require("./schema.js")
const wrapAsync = require("./utils/wrapAsync");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

async function connectToDb() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Guestians", {});
    console.log("Connected to database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

connectToDb();

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
  } catch (err) {
    console.error("Error retrieving listing:", err);
    res.status(500).send("Server Error");
  }
});

// Get all listings
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    console.error("Error retrieving listings:", err);
    res.status(500).send("Server Error");
  }
});

// Create Route
app.post("/listings", async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    if (
      !newListing.description ||
      !newListing.title ||
      !newListing.price ||
      !newListing.country ||
      !newListing.location
    ) {
      throw new ExpreeError(400, "Plaese fill the every field");
    }
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    next(err);
    res.status(500).send("Server Error");
  }
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  } catch (err) {
    console.error("Error retrieving listing for edit:", err);
    res.status(500).send("Server Error");
  }
});

// Update Route
app.put("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).send("Server Error");
  }
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).send("Server Error");
  }
});
app.all("*", (req, res, next) => {
  next(new ExpreeError(404, "Page not found"));
});

app.use((error, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = error;
  // res.status(status).send(message);
  res.render("listings/error", { error });
});
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
