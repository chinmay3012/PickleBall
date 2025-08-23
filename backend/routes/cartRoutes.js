import express from "express";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { email, product } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
      await user.save();
    }

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [product] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId === product.productId
      );
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        cart.items.push(product);
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get cart by user email
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.json([]);

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return res.json([]);

    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from cart
router.delete("/remove", async (req, res) => {
  try {
    const { email, productId } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();

    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
