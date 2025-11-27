import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {IVendor} from './vendor.interface';


const vendorSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type:String, required: true},
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
})

// Hash password before saving
vendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
vendorSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};


const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema);
export default Vendor ;



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