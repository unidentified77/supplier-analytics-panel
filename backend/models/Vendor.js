import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

export default mongoose.model('Vendor', VendorSchema);