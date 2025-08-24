import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cart_item: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      variantId: { type: mongoose.Schema.Types.ObjectId },
      series: String,
      item_count: Number,
      quantity: Number,
      cogs: Number,
      price: Number,
      vendor_margin: Number,
      order_status: String,
    },
  ],
  payment_at: { type: Date },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;