import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Vendor from './models/Vendor.js';
import ParentProduct from './models/ParentProduct.js';
import Order from './models/Order.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

function safeObjectId(idObj) {
    return idObj && idObj.$oid ? new mongoose.Types.ObjectId(idObj.$oid) : undefined;
}

function safeDate(dateObj) {
    return dateObj && dateObj.$date && dateObj.$date.$numberLong ? new Date(Number(dateObj.$date.$numberLong)) : undefined;
}

// JSON dosyalarını oku ve diziye çevir
let vendors = JSON.parse(fs.readFileSync('./data/vendors.json', 'utf-8'));
if (!Array.isArray(vendors)) vendors = [vendors];

let parentProducts = JSON.parse(fs.readFileSync('./data/parent_products.json', 'utf-8'));
if (!Array.isArray(parentProducts)) parentProducts = [parentProducts];

let orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf-8'));
if (!Array.isArray(orders)) orders = [orders];

try {
    // ObjectId dönüşümleri ve eksik alanları atla
    const vendorsFixed = vendors
        .map(v => {
            const _id = safeObjectId(v._id);
            if (!_id) return null;
            return { ...v, _id };
        })
        .filter(v => v);

    const parentProductsFixed = parentProducts
        .map(p => {
            const _id = safeObjectId(p._id);
            const vendor = safeObjectId(p.vendor);
            if (!_id || !vendor || !p.name) return null;
            return { ...p, _id, vendor };
        })
        .filter(p => p);

    const ordersFixed = orders
        .map(o => {
            const _id = safeObjectId(o._id);
            if (!_id || !o.cart_item) return null;

            const cart_item = o.cart_item
                .map(ci => {
                    const _ci_id = safeObjectId(ci._id);
                    const product = safeObjectId(ci.product);
                    const variantId = safeObjectId(ci.variantId);
                    if (!_ci_id || !product || !variantId) return null;
                    return { ...ci, _id: _ci_id, product, variantId };
                })
                .filter(ci => ci);

            const payment_at = safeDate(o.payment_at);
            return { ...o, _id, cart_item, payment_at };
        })
        .filter(o => o);

    // Veriyi eklemeden önce sil
    if (vendorsFixed.length) await Vendor.deleteMany();
    if (parentProductsFixed.length) await ParentProduct.deleteMany();
    if (ordersFixed.length) await Order.deleteMany();

    // Yeni veriyi ekle
    if (vendorsFixed.length) await Vendor.insertMany(vendorsFixed);
    if (parentProductsFixed.length) await ParentProduct.insertMany(parentProductsFixed);
    if (ordersFixed.length) await Order.insertMany(ordersFixed);

    process.exit();
} catch (err) {
    console.error(err);
    process.exit(1);
}
