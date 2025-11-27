//http://localhost:5173/admin/product-management
import express from 'express';
import * as AdminController from './admin.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

import * as CategoryController from '../categories/category.controller';
import * as ProductController from '../products/product.controller';
import * as VendorController from '../vendor/vendor.controller';
import * as OrderController from '../order/order.controller';

import  upload  from '@/middleware/upload';

//interactive application system architecture diagram

const router = express.Router();

// Admin login route - matches frontend POST /api/admin/login
router.post('/login', AdminController.AdminLoginController);
// Token verification route (optional)
router.get('/verify-token', AdminController.VerifyTokenController);
// get dashboard data 
router.get('/admin-dashboard', authMiddleware,AdminController.getDashboardDataController);


// Categories
// router.use('/', CategoryRoute);
router.post('/add-category', upload.single('categoryImg'), authMiddleware, CategoryController.AddCategoryController);

router.get('/get-categories', authMiddleware, CategoryController.GetCategoriesController);
router.delete('/delete-category/:categoryId',authMiddleware, CategoryController.DeleteCategoryController);
router.put('/edit-category/:categoryId', upload.single('categoryImg'), authMiddleware, CategoryController.UpdateCategoryController);


// Products
router.post('/add-product', upload.single('productImg'), authMiddleware,ProductController.addProductController);
router.get('/get-products', authMiddleware, ProductController.getProductsController);
router.get('/get-product/:productId', authMiddleware, ProductController.getProductByIdController);
router.put('/edit-product/:productId', upload.single('productImg'), authMiddleware, ProductController.updateProductController);
router.delete('/delete-product/:productId', authMiddleware, ProductController.deleteProductController);

// Vender
router.post('/add-vender', VendorController.AddVendorController);
router.get('/vendors', VendorController.GetVendorsController);

// Orders
router.get('/orders', authMiddleware, OrderController.getAllOrdersController);
router.put('/:id/status', authMiddleware, OrderController.updateOrderStatusController);
router.get('/orders/statistics', authMiddleware, OrderController.getOrderStatisticsController);

// Payment webhook (no auth needed for payment gateway callbacks)
router.put('/:id/payment-status', OrderController.updatePaymentStatusController);


export default router;