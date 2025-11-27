"use strict";
// import Payment from "./payment.model";
// import Cart from '../cart/cart.model';
// import Order from "../order/order.model";
// export const createPaymentService = async(orderId: string, userId: string) => {
//     try {
//         // calculate total from order 
//         const order= await Order.findById(orderId).populate('items.product');
//         const totalAmount= order.totalAmount;
//         // create payment record
//         const payment = new Payment({
//         order: orderId,
//         user: userId,
//         amount: totalAmount,
//         currency: 'AED',
//         paymentStatus: 'pending',
//         paymentMethod: 'Cash On Delivery' // or from request
//       });
//       await payment.save();
//         // Integrate with payment gateway (Stripe example)
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: totalAmount * 100, // in cents
//         currency: 'aed',
//         metadata: {
//           orderId: orderId,
//           userId: userId
//         }
//       });
//         return { 
//         success: true, 
//         paymentIntentId: paymentIntent.id,
//         clientSecret: paymentIntent.client_secret,
//         paymentId: payment._id
//       };
//     } catch (error: any) {
//         return { success: false, message: error.message };
//     }
// };
// export const confirmPaymentService = async(paymentIntentId: string, paymentId: string) => {
//     try {
//         const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
//         if (paymentIntent.status === succeeded) {
//         // Update payment status
//         await Payment.findByIdAndUpdate(paymentId, {
//             paymentStatus: 'completed',
//             transactionId: paymentIntentId
//         });
//         // Update order status
//         const payment = await Payment.findById(paymentId);
//         await Order.findByIdAndUpdate(payment.order, { status: 'confirmed' });
//         // Clear user's cart
//         await Cart.deleteMany({ user: payment.user });
//         return { success: true, message: 'Payment successful' };
//         }
//     } catch (error: any) {
//         return { success: false, message: error.message}
//     }
// }
