const mongoose = require("mongoose");

const passpoerLocal = require("passport-local-mongoose");
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});
userSchema.plugin(passpoerLocal);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
