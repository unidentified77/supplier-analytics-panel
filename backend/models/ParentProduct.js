import mongoose from 'mongoose';

const ParentProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }
});

export default mongoose.model('ParentProduct', ParentProductSchema);