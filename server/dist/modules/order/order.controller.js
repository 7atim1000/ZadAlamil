"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStatisticsController = exports.cancelOrderController = exports.updatePaymentStatusController = exports.updateOrderStatusController = exports.getAllOrdersController = exports.getOrderByIdController = exports.getUserOrdersController = exports.createOrderController = void 0;
const OrderService = __importStar(require("./order.service"));
/////////For users
// create order
const createOrderController = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { shippingAddress } = req.body;
        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: 'Shipping address is required'
            });
        }
        const result = await OrderService.createOrderService(userId, shippingAddress);
        if (result.success) {
            res.status(201).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.createOrderController = createOrderController;
// get user order 
const getUserOrdersController = async (req, res) => {
    try {
        const userId = req.user?._id;
        const result = await OrderService.getUserOrdersService(userId);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getUserOrdersController = getUserOrdersController;
// get user by Id 
const getOrderByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const result = await OrderService.getOrderByIdService(id, userId);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getOrderByIdController = getOrderByIdController;
///////////////////For Admin
// get all orders
const getAllOrdersController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await OrderService.getAllOrdersService(page, limit);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getAllOrdersController = getAllOrdersController;
// Update order status for admin
const updateOrderStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }
        const result = await OrderService.updateOrderStatusService(id, status);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateOrderStatusController = updateOrderStatusController;
/////////////////////
// update payment status
const updatePaymentStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;
        if (!paymentStatus) {
            return res.status(400).json({
                success: false,
                message: 'Payment status is required'
            });
        }
        const result = await OrderService.updatePaymentStatusService(id, paymentStatus);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.updatePaymentStatusController = updatePaymentStatusController;
// cancel order 
const cancelOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        const result = await OrderService.cancelOrderService(id, userId);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.cancelOrderController = cancelOrderController;
const getOrderStatisticsController = async (req, res) => {
    try {
        const result = await OrderService.getOrderStatisticsService();
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getOrderStatisticsController = getOrderStatisticsController;
