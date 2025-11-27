import mongoose from 'mongoose' ;
import { ICart } from './cart.interface';

export const cartSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    coupon: { type: String },

}, {
    timestamps: true 
});


export const Cart = mongoose.model<ICart>('Cart', cartSchema);
export default Cart ;