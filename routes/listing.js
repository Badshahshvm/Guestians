const express = require("express");
const router = express.Router();
const {
  newListing,
  showListing,
  getAllListings,
  createListing,
  getEditListingForm,
  updateListing,

  deleteListing,
} = require("../controller/listing");

// Define routes using controller mecreateListingthods
router.get("/new", newListing);
router.get("/:id", showListing);
router.get("/", getAllListings);
router.post("/", createListing);
router.get("/:id/edit", getEditListingForm);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

module.exports = router;
