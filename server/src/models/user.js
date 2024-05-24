import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
    },
    typeLogin: {
      type: String,
    },
    tokenLogin: {
      type: String,
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    cart: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        isChecked: {
          type: Boolean,
          default: false,
        },
        // prices: Number,
      },
    ],
    address: String,
    wishList: [{ type: mongoose.Types.ObjectId, ref: " Product" }],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    registerToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
