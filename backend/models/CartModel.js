const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  originalPrice: Number,
  discountPrice: Number,
  variant: String,
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
  thumbnail: String,
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },
    items: [cartItemSchema],
  },
  { timestamps: true, versionKey: false },
);

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
