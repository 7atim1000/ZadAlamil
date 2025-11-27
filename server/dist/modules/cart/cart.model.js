"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = exports.cartSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.cartSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    category: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    coupon: { type: String },
}, {
    timestamps: true
});
exports.Cart = mongoose_1.default.model('Cart', exports.cartSchema);
exports.default = exports.Cart;
