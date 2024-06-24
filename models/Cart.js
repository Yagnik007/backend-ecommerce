const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      name: String,
      price: Number,
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less than 1."],
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
