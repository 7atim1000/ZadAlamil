"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    order: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Cart', required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String,
        enum: ['Cash On Delivery', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Paypal', 'stripe'],
        required: true,
    },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'] },
    transactionId: { type: String },
    paymentGateway: { type: String, enum: ['stripe', 'paypal', 'custom'] },
    getewayResponse: { type: String },
}, {
    timestamps: true
});
exports.Payment = mongoose_1.default.model('Payment', paymentSchema);
exports.default = exports.Payment;
