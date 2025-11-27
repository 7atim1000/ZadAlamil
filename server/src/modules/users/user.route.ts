import express from 'express' ;
import * as UserController from './user.controller';
import * as ProductController from '../products/product.controller';
import * as CategoryController from '../categories/category.controller';
import * as CartController from '../cart/cart.controller';
import * as OrderController from '../order/order.controller';
import * as AddressController from '../address/address.controller';

import { protectUserRoute } from '@/middleware/authMiddleware';
const router = express.Router();

router.post('/signup', UserController.SignupController);
router.post('/login', UserController.LoginController);
router.post('/logout', UserController.logoutController);


// Get categories for users
router.get('/get-categories',  CategoryController.getCategoriesUserController);

// Get products for users
router.get('/product/:categoryId', ProductController.getProductsByCategoryController);

// userCart
router.get('/cart', protectUserRoute, CartController.GetUserCartController);
router.post('/cart/add', protectUserRoute, CartController.AddToCartController);
router.put('/cart/update/:id',protectUserRoute, CartController.UpdateCartItemController);
router.delete('/cart/remove/:id', protectUserRoute, CartController.RemoveFromCartController);
router.delete('/cart/clear', protectUserRoute, CartController.ClearCartController);
router.get('/cart/summary', protectUserRoute, CartController.GetCartSummaryController);

// userorders
router.post('/order/create', protectUserRoute, OrderController.createOrderController);
router.get('/user-orders', protectUserRoute, OrderController.getUserOrdersController);
router.get('/order/:id', protectUserRoute, OrderController.getOrderByIdController);
router.put('/order/:id/cancel', protectUserRoute, OrderController.cancelOrderController);

// userAddresses
router.get('/addresses/fetch', protectUserRoute, AddressController.getUserAddressesController);
router.post('/addresses/add', protectUserRoute, AddressController.createAddressController);
router.put('/addresses/update/:id', protectUserRoute, AddressController.updateAddressController);
router.delete('/addresses/remove/:id', protectUserRoute, AddressController.deleteAddressController);
router.put('/addresses/:id/set-default', protectUserRoute, AddressController.setDefaultAddressController);


// Add to your routes
// router.get('/addresses/test', AddressController.testAddressRoute);

export default router ;

