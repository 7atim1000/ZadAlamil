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
exports.GetCartSummaryController = exports.ClearCartController = exports.RemoveFromCartController = exports.UpdateCartItemController = exports.AddToCartController = exports.GetUserCartController = void 0;
const CartService = __importStar(require("./cart.service"));
// Get user's cart
const GetUserCartController = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.user;
        const result = await CartService.getCartByUserService(userId);
        result.success
            ? res.status(200).json(result)
            : res.status(404).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.GetUserCartController = GetUserCartController;
// Add to cart
const AddToCartController = async (req, res) => {
    try {
        const cartData = {
            ...req.body,
            user: req.user?._id || req.body.user,
            total: req.body.price * req.body.quantity
        };
        const result = await CartService.AddItemToCartService(cartData);
        result.success
            ? res.status(201).json(result)
            : res.status(400).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.AddToCartController = AddToCartController;
// Update cart item
const UpdateCartItemController = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const result = await CartService.UpdateCartItemService(id, quantity);
        result.success
            ? res.status(200).json(result)
            : res.status(404).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.UpdateCartItemController = UpdateCartItemController;
// Remove from cart
const RemoveFromCartController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await CartService.RemoveFromCartService(id);
        result.success
            ? res.status(200).json(result)
            : res.status(404).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.RemoveFromCartController = RemoveFromCartController;
// Clear cart
const ClearCartController = async (req, res) => {
    try {
        const userId = req.user?._id;
        const result = await CartService.ClearCartService(userId);
        result.success
            ? res.status(200).json(result)
            : res.status(400).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.ClearCartController = ClearCartController;
// Get cart summary
const GetCartSummaryController = async (req, res) => {
    try {
        const userId = req.user?._id;
        const result = await CartService.GetCartSummaryService(userId);
        result.success
            ? res.status(200).json(result)
            : res.status(400).json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.GetCartSummaryController = GetCartSummaryController;
