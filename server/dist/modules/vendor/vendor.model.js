"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const vendorSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    // tradeName: {
    //     type: String,
    //     required: true
    // },
    licenseNumber: { type: String, required: true, unique: true },
    companyName: { type: String, required: true, unique: true },
    livePhoto: { type: String, default: 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg' },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    action: { type: Boolean, default: true }
}, {
    timestamps: true
});
// Hash password before saving
vendorSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    next();
});
// Compare password method
vendorSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs_1.default.compare(candidatePassword, this.password);
};
const Vendor = mongoose_1.default.model('Vendor', vendorSchema);
exports.default = Vendor;
// For vendor order management, you should add vendor field to the PRODUCT collection, not the orders collection. Here's why and how:
// Recommended Database Design
// 1. Product Collection (Add vendor field)
// typescript
// // product.model.ts
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   vendor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Vendor',
//     required: true
//   },
//   // ... other product fields
// }, { timestamps: true });
// 2. Order Collection (No vendor field needed)
// typescript
// // order.model.ts - Keep as is, no vendor field
// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: [{
//     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true },
//     total: { type: Number, required: true },
//     // Each item automatically has vendor through product reference
//   }],
//   status: { 
//     type: String, 
//     enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   // ... other order fields
// }, { timestamps: true });
// 3. Vendor Collection (New)
// typescript
// // vendor.model.ts
// const vendorSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   businessName: { type: String, required: true },
//   status: { 
//     type: String, 
//     enum: ['active', 'inactive', 'suspended'],
//     default: 'active'
//   },
//   // ... other vendor fields
// }, { timestamps: true });
