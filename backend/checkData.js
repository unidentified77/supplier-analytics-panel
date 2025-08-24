import mongoose from "mongoose";
import dotenv from "dotenv";
import Vendor from "./models/Vendor.js";
import ParentProduct from "./models/ParentProduct.js";
import Order from "./models/Order.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const vendorCount = await Vendor.countDocuments();
const parentCount = await ParentProduct.countDocuments();
const orderCount = await Order.countDocuments();


process.exit();
