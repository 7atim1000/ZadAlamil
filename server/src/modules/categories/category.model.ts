import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    vendor: {
        type: Schema.Types.ObjectId, ref: 'Vendor',
    },
    categoryImg: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['LIST', 'UNLIST'],
        default: 'LIST'
    },
    sales: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;