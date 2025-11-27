"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCartSummaryService = exports.ClearCartService = exports.RemoveFromCartService = exports.UpdateCartItemService = exports.AddItemToCartService = exports.getCartByUserService = void 0;
const cart_model_1 = __importDefault(require("./cart.model"));
const getCartByUserService = async (userId) => {
    try {
        const cartItems = await cart_model_1.default.find({ user: userId })
            .populate('user', 'name email')
            .populate('product', 'name price productImg qty')
            .populate('category', 'name');
        return { success: true, cartItems };
    }
    catch (error) {
        return { success: false, message: error.messsage };
    }
};
exports.getCartByUserService = getCartByUserService;
const AddItemToCartService = async (cartData) => {
    try {
        const existingCartItem = await cart_model_1.default.findOne({
            user: cartData.user,
            product: cartData.product
        });
        if (existingCartItem) {
            existingCartItem.quantity += cartData.quantity || 1;
            existingCartItem.total = existingCartItem.price * existingCartItem.quantity;
            await existingCartItem.save();
            return { success: true, cartItem: existingCartItem };
        }
        const cartItem = new cart_model_1.default(cartData);
        await cartItem.save();
        const populatedCartItem = await cart_model_1.default.findById(cartItem._id)
            .populate('user', 'name email')
            .populate('product', 'name price images')
            .populate('category', 'name');
        return { success: true, cartItem: populatedCartItem };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.AddItemToCartService = AddItemToCartService;
// Update cart item quantity
const UpdateCartItemService = async (cartItemId, quantity) => {
    try {
        const cartItem = await cart_model_1.default.findById(cartItemId);
        if (!cartItem) {
            return { success: false, message: 'Cart item not found' };
        }
        cartItem.quantity = quantity;
        cartItem.total = cartItem.price * quantity;
        await cartItem.save();
        return { success: true, cartItem };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.UpdateCartItemService = UpdateCartItemService;
// Remove item from cart
const RemoveFromCartService = async (cartItemId) => {
    try {
        const cartItem = await cart_model_1.default.findByIdAndDelete(cartItemId);
        if (!cartItem) {
            return { success: false, message: 'Cart item not found' };
        }
        return { success: true, message: 'Item removed from cart' };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.RemoveFromCartService = RemoveFromCartService;
// Clear user's entire cart
const ClearCartService = async (userId) => {
    try {
        await cart_model_1.default.deleteMany({ user: userId });
        return { success: true, message: 'Cart cleared successfully' };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.ClearCartService = ClearCartService;
// Get cart summary (total items, total price)
const GetCartSummaryService = async (userId) => {
    try {
        const cartItems = await cart_model_1.default.find({ user: userId });
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);
        return {
            success: true,
            summary: { totalItems, totalPrice }
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.GetCartSummaryService = GetCartSummaryService;
