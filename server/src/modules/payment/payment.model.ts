import mongoose from 'mongoose' ;
import { IPayment } from './payment.interface';

const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId ,ref: 'Cart', required: true },
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, 
        enum: ['Cash On Delivery', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Paypal', 'stripe'], 
        required: true,
    },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded']},
    transactionId: { type: String },
    paymentGateway: { type: String, enum: ['stripe', 'paypal', 'custom']},
    getewayResponse: {type: String},
} , {
    timestamps: true
});


export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;