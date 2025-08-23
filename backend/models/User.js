// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   address: { type: String }
// }, { timestamps: true });

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  address: addressSchema
}, { timestamps: true });

export default mongoose.model("User", userSchema);