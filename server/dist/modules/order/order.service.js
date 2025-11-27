"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStatisticsService = exports.cancelOrderService = exports.updatePaymentStatusService = exports.updateOrderStatusService = exports.getAllOrdersService = exports.getOrderByIdService = exports.getUserOrdersService = exports.createOrderService = void 0;
const order_model_1 = __importDefault(require("./order.model"));
const cart_model_1 = __importDefault(require("../cart/cart.model"));
const createOrderService = async (userId, shippingAddress) => {
    try {
        // Get user's cart items
        const cartItems = await cart_model_1.default.find({ user: userId })
            .populate('product', 'name price images stock')
            .populate('category', 'name');
        if (!cartItems || cartItems.length === 0) {
            return { success: false, message: 'Cart is empty' };
        }
        // Calculate order items and total
        const orderItems = cartItems.map(item => ({
            product: item.product._id, // Now TypeScript knows _id exists
            quantity: item.quantity,
            price: item.price,
            total: item.total
        }));
        const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);
        // Create new order
        const order = new order_model_1.default({
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            status: 'pending',
            paymentStatus: 'pending'
        });
        await order.save();
        // Populate the order with product details
        const populatedOrder = await order_model_1.default.findById(order._id)
            .populate('user', 'name email')
            .populate('items.product', 'name price images');
        return {
            success: true,
            order: populatedOrder,
            message: 'Order created successfully'
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.createOrderService = createOrderService;
const getUserOrdersService = async (userId) => {
    try {
        const orders = await order_model_1.default.find({ user: userId })
            .populate('user', 'name email')
            // .populate('items.product', 'name price images vendor')
            .populate({
            path: 'items.product',
            select: 'name price productImg category vendor',
            populate: [
                {
                    path: 'category',
                    select: 'name'
                },
                {
                    path: 'vendor',
                    select: 'name businessName email phone'
                }
            ]
        })
            .sort({ createdAt: -1 });
        return { success: true, orders };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getUserOrdersService = getUserOrdersService;
const getOrderByIdService = async (orderId, userId) => {
    try {
        const order = await order_model_1.default.findOne({ _id: orderId, user: userId })
            .populate('user', 'name email')
            // .populate('items.product', 'name price images category');
            .populate({
            path: 'items.product',
            select: 'name price productImg category vendor',
            populate: [
                {
                    path: 'category',
                    select: 'name'
                },
                {
                    path: 'vendor',
                    select: 'name businessName email phone'
                }
            ]
        });
        if (!order) {
            return { success: false, message: 'Order not found' };
        }
        return { success: true, order };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getOrderByIdService = getOrderByIdService;
// For admin
const getAllOrdersService = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const orders = await order_model_1.default.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalOrders = await order_model_1.default.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);
        return {
            success: true,
            orders,
            currentPage: page,
            totalPages,
            totalOrders
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getAllOrdersService = getAllOrdersService;
// update order status for admin
const updateOrderStatusService = async (orderId, status) => {
    try {
        const order = await order_model_1.default.findByIdAndUpdate(orderId, { status }, { new: true }).populate('user', 'name email')
            .populate('items.product', 'name price');
        if (!order) {
            return { success: false, message: 'Order not found' };
        }
        return {
            success: true,
            order,
            message: 'Order status updated successfully'
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.updateOrderStatusService = updateOrderStatusService;
// Update payment status 
const updatePaymentStatusService = async (orderId, paymentStatus) => {
    try {
        const order = await order_model_1.default.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
        if (!order) {
            return { success: false, message: 'Order not found' };
        }
        return {
            success: true,
            order,
            message: 'Payment status updated successfully'
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.updatePaymentStatusService = updatePaymentStatusService;
// Cancel order 
const cancelOrderService = async (orderId, userId) => {
    try {
        const order = await order_model_1.default.findOne({ _id: orderId, user: userId });
        if (!order) {
            return { success: false, message: 'Order not found' };
        }
        // Check if order can be cancelled
        if (order.status !== 'pending') {
            return {
                success: false,
                message: 'Order cannot be cancelled at this stage'
            };
        }
        order.status = 'cancelled';
        await order.save();
        return {
            success: true,
            order,
            message: 'Order cancelled successfully'
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.cancelOrderService = cancelOrderService;
// Get order statistics (for admin dashboard)
const getOrderStatisticsService = async () => {
    try {
        const totalOrders = await order_model_1.default.countDocuments();
        const pendingOrders = await order_model_1.default.countDocuments({ status: 'pending' });
        const completedOrders = await order_model_1.default.countDocuments({ status: 'delivered' });
        const totalRevenue = await order_model_1.default.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        return {
            success: true,
            statistics: {
                totalOrders,
                pendingOrders,
                completedOrders,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getOrderStatisticsService = getOrderStatisticsService;
