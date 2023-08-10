import { StatusCodes } from "http-status-codes";
import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      address,
      cedula,
      city,
      email,
      phoneNumber,
      zipcode,
      cartItems,
      price,
      iva,
      total,
      totalToPay,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !address ||
      !cedula ||
      !city ||
      !email ||
      !phoneNumber ||
      !zipcode ||
      !cartItems ||
      price === undefined ||
      iva === undefined ||
      total === undefined ||
      totalToPay === undefined
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Incomplete order data" });
    }

    const order = new Order({
      firstName,
      lastName,
      address,
      cedula,
      city,
      email,
      phoneNumber,
      zipcode,
      cartItems,
      price,
      iva,
      total,
      totalToPay,
    });

    const savedOrder = await order.save();

    res.status(StatusCodes.CREATED).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error creating order" });
  }
};
