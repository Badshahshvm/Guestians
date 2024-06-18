const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const data = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/Guestians";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
  await Listing.deleteMany({}); // Deletes all documents in the Listing collection

  // Assuming initData and Obj are defined somewhere else
  const updatedData = initData.data.map((obj) => ({
    ...obj, // Corrected from Obj to obj (case-sensitive)
    owner: "66701985bf39cd738b147ee3", // Assuming this is the correct owner ID
  }));

  await Listing.insertMany(updatedData); // Insert the updated data into the Listing collection

  console.log("Data was initialized");
};

initDB();
