const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const express = require("express");
const multer = require("multer");
const app = express();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dquqmakyx",
  api_key: process.env.API_KEY || "995949394255253",
  api_secret: process.env.API_SECRET || "efJELAFje92tfjyRvVEXB8s0Ynw",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Guestians",
    allowerdFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
