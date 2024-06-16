const express = require("express");
const router = express.Router();

const { createReview, deleteReview } = require("../controller/review");

// Define routes using controller methods
router.post("/", createReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;
