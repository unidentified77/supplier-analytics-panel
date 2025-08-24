// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import Order from "./models/Order.js";
import ParentProduct from "./models/ParentProduct.js";
import Vendor from "./models/Vendor.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

// ------------------------
// 0. Vendor bilgisi endpoint (frontend için gerekli)
// ------------------------
app.get("/api/vendors/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await Vendor.findById(vendorId);
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor bulunamadı" });
    }
    
    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Vendor bilgisi alınamadı." });
  }
});

// ------------------------
// 1. Aylık satış endpoint
// ------------------------
app.get("/api/vendors/:vendorId/monthly-sales", async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Önce bu vendor'ın ürünlerini bul
    const vendorProducts = await ParentProduct.find({ vendor: new mongoose.Types.ObjectId(vendorId) });
    const productIds = vendorProducts.map(p => p._id);

    // Aggregation ile Orders koleksiyonunu ay bazında grupla
    const monthlySales = await Order.aggregate([
      { $unwind: "$cart_item" },
      { $match: { "cart_item.product": { $in: productIds } } },
      {
        $addFields: {
          payment_date: { $toDate: "$payment_at" }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$payment_date" }, 
            month: { $month: "$payment_date" } 
          },
          totalSales: { $sum: { $multiply: ["$cart_item.price", "$cart_item.quantity"] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json(monthlySales);
  } catch (err) {
    console.error("Aylık satış hatası:", err);
    res.status(500).json({ message: "Monthly sales fetch failed.", error: err.message });
  }
});

// ------------------------
// 2. Ürün bazlı satış endpoint
// ------------------------
app.get("/api/vendors/:vendorId/product-sales", async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Önce bu vendor'ın ürünlerini bul
    const vendorProducts = await ParentProduct.find({ vendor: new mongoose.Types.ObjectId(vendorId) });
    const productIds = vendorProducts.map(p => p._id);

    const productSales = await Order.aggregate([
      { $unwind: "$cart_item" },
      { $match: { "cart_item.product": { $in: productIds } } },
      {
        $group: {
          _id: "$cart_item.product",
          totalQuantity: { $sum: "$cart_item.quantity" },
          totalRevenue: { $sum: { $multiply: ["$cart_item.price", "$cart_item.quantity"] } }
        }
      },
      {
        $lookup: {
          from: "parentproducts", // Koleksiyon adınız
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: 0,
          productName: "$productInfo.name",
          totalQuantity: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json(productSales);
  } catch (err) {
    console.error("Ürün satış hatası:", err);
    res.status(500).json({ message: "Product sales fetch failed.", error: err.message });
  }
});

// ------------------------
// 3. Debug endpoint - Tüm vendor'ları listele
// ------------------------
app.get("/api/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Vendors fetch failed." });
  }
});

// ------------------------
// 4. Debug endpoint - Vendor'ın ürünlerini listele
// ------------------------
app.get("/api/vendors/:vendorId/products", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const products = await ParentProduct.find({ vendor: new mongoose.Types.ObjectId(vendorId) });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Vendor products fetch failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);