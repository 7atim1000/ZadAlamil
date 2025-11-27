import mongoose ,{Schema} from 'mongoose';
import {IProduct} from './product.interface';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor'},
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    productImg: { type: String, default: ''},
    description: { type: String },
    color: { type: String },
    status: { type: String, enum: ['LIST', 'UNLIST'], default: 'LIST'}
}, {
    timestamps: true 
});


export const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product ;