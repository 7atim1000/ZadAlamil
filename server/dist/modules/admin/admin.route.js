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
//http://localhost:5173/admin/product-management
const express_1 = __importDefault(require("express"));
const AdminController = __importStar(require("./admin.controller"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const CategoryController = __importStar(require("../categories/category.controller"));
const ProductController = __importStar(require("../products/product.controller"));
const VendorController = __importStar(require("../vendor/vendor.controller"));
const OrderController = __importStar(require("../order/order.controller"));
const upload_1 = __importDefault(require("../../middleware/upload"));
//interactive application system architecture diagram
const router = express_1.default.Router();
// Admin login route - matches frontend POST /api/admin/login
router.post('/login', AdminController.AdminLoginController);
// Token verification route (optional)
router.get('/verify-token', AdminController.VerifyTokenController);
// get dashboard data 
router.get('/admin-dashboard', authMiddleware_1.authMiddleware, AdminController.getDashboardDataController);
// Categories
// router.use('/', CategoryRoute);
router.post('/add-category', upload_1.default.single('categoryImg'), authMiddleware_1.authMiddleware, CategoryController.AddCategoryController);
router.get('/get-categories', authMiddleware_1.authMiddleware, CategoryController.GetCategoriesController);
router.delete('/delete-category/:categoryId', authMiddleware_1.authMiddleware, CategoryController.DeleteCategoryController);
router.put('/edit-category/:categoryId', upload_1.default.single('categoryImg'), authMiddleware_1.authMiddleware, CategoryController.UpdateCategoryController);
// Products
router.post('/add-product', upload_1.default.single('productImg'), authMiddleware_1.authMiddleware, ProductController.addProductController);
router.get('/get-products', authMiddleware_1.authMiddleware, ProductController.getProductsController);
router.get('/get-product/:productId', authMiddleware_1.authMiddleware, ProductController.getProductByIdController);
router.put('/edit-product/:productId', upload_1.default.single('productImg'), authMiddleware_1.authMiddleware, ProductController.updateProductController);
router.delete('/delete-product/:productId', authMiddleware_1.authMiddleware, ProductController.deleteProductController);
// Vender
router.post('/add-vender', VendorController.AddVendorController);
router.get('/vendors', VendorController.GetVendorsController);
// Orders
router.get('/orders', authMiddleware_1.authMiddleware, OrderController.getAllOrdersController);
router.put('/:id/status', authMiddleware_1.authMiddleware, OrderController.updateOrderStatusController);
router.get('/orders/statistics', authMiddleware_1.authMiddleware, OrderController.getOrderStatisticsController);
// Payment webhook (no auth needed for payment gateway callbacks)
router.put('/:id/payment-status', OrderController.updatePaymentStatusController);
exports.default = router;
