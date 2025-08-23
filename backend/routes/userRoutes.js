import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create or update user address
router.post("/address", async (req, res) => {
  try {
    const { email, address } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, address });
    } else {
      user.address = address;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;

