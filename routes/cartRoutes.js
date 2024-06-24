const express = require("express");
const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId",
      "name price"
    );
    if (cart) {
      res.json(cart);
    } else {
      res.status(404);
      throw new Error("Cart not found");
    }
  })
);

router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { productId, name, price, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, quantity });
      }

      await cart.save();
      res.json(cart);
    } else {
      const newCart = await Cart.create({
        userId: req.user._id,
        items: [{ productId, name, price, quantity }],
      });

      res.json(newCart);
    }
  })
);

router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === req.params.id
      );

      if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        item.quantity = quantity;
        await cart.save();
        res.json(cart);
      } else {
        res.status(404);
        throw new Error("Item not found in cart");
      }
    } else {
      res.status(404);
      throw new Error("Cart not found");
    }
  })
);

router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === req.params.id
      );
      if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.json(cart);
      } else {
        res.status(404);
        throw new Error("Item not found in cart");
      }
    } else {
      res.status(404);
      throw new Error("Cart not found");
    }
  })
);

module.exports = router;
