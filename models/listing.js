const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  title: {
    type: String,
    reuired: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://www.google.com/imgres?q=hotel&imgurl=https%3A%2F%2Fwww.kayak.co.in%2Fnews%2Fwp-content%2Fuploads%2Fsites%2F76%2F2023%2F08%2FTHEME_HOTEL_SIGN_FIVE_STARS_FACADE_BUILDING_GettyImages-1320779330-3.jpg&imgrefurl=https%3A%2F%2Fwww.kayak.co.in%2Fnews%2Fwhat-do-hotel-stars-mean%2F&docid=j4uvNRhAPYcEeM&tbnid=4-4RPo13QrA8FM&vet=12ahUKEwi10vLX4NiGAxXCcmwGHTcyCk4QM3oECGcQAA..i&w=1920&h=1312&hcb=2&ved=2ahUKEwi10vLX4NiGAxXCcmwGHTcyCk4QM3oECGcQAA",
    set: (v) =>
      v === ""
        ? "https://www.google.com/imgres?q=hotel&imgurl=https%3A%2F%2Fwww.kayak.co.in%2Fnews%2Fwp-content%2Fuploads%2Fsites%2F76%2F2023%2F08%2FTHEME_HOTEL_SIGN_FIVE_STARS_FACADE_BUILDING_GettyImages-1320779330-3.jpg&imgrefurl=https%3A%2F%2Fwww.kayak.co.in%2Fnews%2Fwhat-do-hotel-stars-mean%2F&docid=j4uvNRhAPYcEeM&tbnid=4-4RPo13QrA8FM&vet=12ahUKEwi10vLX4NiGAxXCcmwGHTcyCk4QM3oECGcQAA..i&w=1920&h=1312&hcb=2&ved=2ahUKEwi10vLX4NiGAxXCcmwGHTcyCk4QM3oECGcQAA"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
const listModel = mongoose.model("Listing", listSchema);
module.exports = listModel;
