import mongoose from "mongoose";
const otpSchema = mongoose.Schema(
  {
    phone: {
      type: String,
    },
    otp: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      index: {
        expires: 300,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Otp", otpSchema);
