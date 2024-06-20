const mongoose = require("mongoose");
const { Schema } = mongoose;
const reviewModel = require("./review");

const listSchema = Schema({
  title: {
    type: String,
    required: true, // corrected typo: changed 'reuired' to 'required'
  },
  description: String,
  // image: {
  //  url: String,
  //   default:
  //     "https://static.toiimg.com/thumb/msid-92079511,width-748,height-499,resizemode=4,imgsize-140014/Etiquette-tips-for-a-first-timer-to-a-5-star-hotel.jpg", // simplified default image URL
  //   set: (v) =>
  //     v
  //       ? v
  //       : "https://static.toiimg.com/thumb/msid-92079511,width-748,height-499,resizemode=4,imgsize-140014/Etiquette-tips-for-a-first-timer-to-a-5-star-hotel.jpg", // simplified setter
  // },
  image: { url: String, filename: String },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // category: {
  //   type: String,
  //   enum: ["mountains", "arctic", "deserts", "farms"],
  // },
});

listSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await reviewModel.deleteMany({ _id: { $in: listing.reviews } }).exec();
  }
});

const Listing = mongoose.model("Listing", listSchema); // corrected model name to Listing
module.exports = Listing; // exporting Listing model
