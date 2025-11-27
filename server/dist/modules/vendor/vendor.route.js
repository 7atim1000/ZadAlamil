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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VendorController = __importStar(require("./vendor.controller"));
const CategoryController = __importStar(require("../categories/category.controller"));
const ProductController = __importStar(require("../products/product.controller"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const upload_1 = __importDefault(require("../../middleware/upload"));
const router = express_1.default.Router();
router.post('/', VendorController.AddVendorController);
// GET /api/vendors - Get all vendors (for your table)
router.get('/', VendorController.GetVendorsController);
// Public routes
router.post('/register', VendorController.registerVendor);
router.post('/login', VendorController.loginVendor);
// Protected routes (require vendor authentication)
router.post('/logout', authMiddleware_1.vendorAuthMiddleware, VendorController.logoutVendor);
router.get('/profile', authMiddleware_1.vendorAuthMiddleware, VendorController.getVendorProfile);
// Vender Service
router.get('/orders', authMiddleware_1.vendorAuthMiddleware, VendorController.getVendorOrders);
router.get('/orders/:orderId', authMiddleware_1.vendorAuthMiddleware, VendorController.getVendorOrderById);
router.get('/orders/stats', authMiddleware_1.vendorAuthMiddleware, VendorController.getVendorOrderStats);
router.put('/orders/:orderId/status', authMiddleware_1.vendorAuthMiddleware, VendorController.updateVendorOrderStatus);
// Vendor Categories
//category functions modified to work with vendor-specific categories
router.post('/categories', authMiddleware_1.vendorAuthMiddleware, upload_1.default.single('image'), CategoryController.addVendorCategory);
router.get('/categories', authMiddleware_1.vendorAuthMiddleware, CategoryController.getVendorCategories);
router.get('/categories/:categoryId', authMiddleware_1.vendorAuthMiddleware, CategoryController.getVendorCategoryById);
router.put('/categories/:categoryId', authMiddleware_1.vendorAuthMiddleware, upload_1.default.single('image'), CategoryController.updateVendorCategory);
router.delete('/categories/:categoryId', authMiddleware_1.vendorAuthMiddleware, CategoryController.deleteVendorCategory);
// Vendor Products
router.post('/products', authMiddleware_1.vendorAuthMiddleware, upload_1.default.single('productImg'), ProductController.addVendorProduct);
router.get('/products', authMiddleware_1.vendorAuthMiddleware, ProductController.getVendorProducts);
router.get('/products/stats', authMiddleware_1.vendorAuthMiddleware, ProductController.getVendorProductStats);
router.get('/products/:productId', authMiddleware_1.vendorAuthMiddleware, ProductController.getVendorProductById);
router.put('/products/:productId', authMiddleware_1.vendorAuthMiddleware, upload_1.default.single('image'), ProductController.updateVendorProduct);
router.delete('/products/:productId', authMiddleware_1.vendorAuthMiddleware, ProductController.deleteVendorProduct);
exports.default = router;
