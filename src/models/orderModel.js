import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    cedula: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    zipcode: { type: String, required: true },
    cartItems: { type: Array, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
