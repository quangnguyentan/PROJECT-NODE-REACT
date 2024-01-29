const mongoose = require("mongoose");
const createSlugCategories = require("../utils/helper");
var productSchema = mongoose.Schema(
  {
    thumb: {
      type: Array,
    },
    images: {
      type: Array,
    },
    brand: {
      type: String,
    },
    brandLink: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sold: {
      type: String,
    },
    prices: {
      type: Number,
    },
    slug: {
      type: String,
      required: true,
      // unique: true,
      lowercase: true,
    },
    rating: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
        updatedAt: {
          type: Date,
        },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
    variants: {
      type: Array,
    },
    type: {
      type: String,
    },
    color: {
      type: Array,
    },
  },

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", productSchema);
