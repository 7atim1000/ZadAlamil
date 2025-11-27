import express from 'express' ;

import * as VendorController from './vendor.controller';
import * as CategoryController from '../categories/category.controller';
import * as ProductController from '../products/product.controller';

import { vendorAuthMiddleware } from '@/middleware/authMiddleware';
import  upload  from '@/middleware/upload';


const router = express.Router()

router.post('/', VendorController.AddVendorController);
// GET /api/vendors - Get all vendors (for your table)
router.get('/', VendorController.GetVendorsController);

// Public routes
router.post('/register', VendorController.registerVendor);
router.post('/login', VendorController.loginVendor);

// Protected routes (require vendor authentication)
router.post('/logout', vendorAuthMiddleware, VendorController.logoutVendor);
router.get('/profile', vendorAuthMiddleware, VendorController.getVendorProfile);


// Vender Service
router.get('/orders', vendorAuthMiddleware, VendorController.getVendorOrders);
router.get('/orders/:orderId', vendorAuthMiddleware, VendorController.getVendorOrderById);
router.get('/orders/stats', vendorAuthMiddleware, VendorController.getVendorOrderStats);
router.put('/orders/:orderId/status', vendorAuthMiddleware, VendorController.updateVendorOrderStatus);


// Vendor Categories
//category functions modified to work with vendor-specific categories
router.post('/categories', vendorAuthMiddleware, upload.single('image'), CategoryController.addVendorCategory);
router.get('/categories', vendorAuthMiddleware, CategoryController.getVendorCategories);
router.get('/categories/:categoryId', vendorAuthMiddleware, CategoryController.getVendorCategoryById);
router.put('/categories/:categoryId', vendorAuthMiddleware, upload.single('image'), CategoryController.updateVendorCategory);
router.delete('/categories/:categoryId', vendorAuthMiddleware, CategoryController.deleteVendorCategory);


// Vendor Products
router.post('/products', vendorAuthMiddleware, upload.single('productImg'), ProductController.addVendorProduct);
router.get('/products', vendorAuthMiddleware, ProductController.getVendorProducts);
router.get('/products/stats', vendorAuthMiddleware, ProductController.getVendorProductStats);
router.get('/products/:productId', vendorAuthMiddleware, ProductController.getVendorProductById);
router.put('/products/:productId', vendorAuthMiddleware, upload.single('image'), ProductController.updateVendorProduct);
router.delete('/products/:productId', vendorAuthMiddleware, ProductController.deleteVendorProduct);


export default router ;