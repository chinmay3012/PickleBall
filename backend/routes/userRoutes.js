// import express from "express";
// import User from "../models/User.js";

// const router = express.Router();

// // Create or update user address
// router.post("/address", async (req, res) => {
//   try {
//     const { email, address } = req.body;
//     let user = await User.findOne({ email });

//     if (!user) {
//       user = new User({ email, address });
//     } else {
//       user.address = address;
//     }

//     await user.save();
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
import express from "express";
const router = express.Router();

// @desc    Add a new address for a user
// @route   POST /api/users/address
// @access  Public (for now, you can add auth middleware later)
router.post("/address", (req, res) => {
  const address = req.body;
  console.log("Received address:", address);

  // For now, we'll just send back a confirmation.
  // Later, you can add logic to save this to your database.
  res.status(201).json({ message: "Address received successfully", address: address });
});

export default router;

