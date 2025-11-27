"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorOrderByIdService = exports.updateVendorOrderStatusService = exports.getVendorOrderStatsService = exports.getVendorOrdersService = exports.registerVendorService = exports.getVendorProfileService = exports.logoutVendorService = exports.loginVendorService = exports.GetVendorsByStatusService = exports.GetVendorsService = exports.AddVendorService = void 0;
const vendor_model_1 = __importDefault(require("./vendor.model"));
const product_model_1 = __importDefault(require("../products/product.model"));
const order_model_1 = __importDefault(require("../order/order.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AddVendorService = async (vendorData) => {
    try {
        // Validate required fields  
        if (!vendorData.name || !vendorData.email || !vendorData.companyName || !vendorData.licenseNumber || !vendorData.phone) {
            return { success: false, message: 'Sory all fields are required' };
        }
        // validate email format 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(vendorData.email)) {
            return {
                success: false,
                message: 'Invalid email format'
            };
        }
        // Check if vendor with same email already exists
        const existingVendorByEmail = await vendor_model_1.default.findOne({ email: vendorData.email });
        if (existingVendorByEmail) {
            return {
                success: false,
                message: 'Vendor with this email already exists'
            };
        }
        // Check if vendor with same license number already exists
        const existingVendorByLicense = await vendor_model_1.default.findOne({ LicenseNumber: vendorData.licenseNumber });
        if (existingVendorByLicense) {
            return {
                success: false,
                message: 'Vendor with this license number already exists'
            };
        }
        // Create new vendor in database
        const newVendor = new vendor_model_1.default({
            name: vendorData.name,
            email: vendorData.email,
            phone: vendorData.phone,
            companyName: vendorData.companyName,
            licenseNumber: vendorData.licenseNumber,
            // status: vendorData.status || 'pending',
            // action: vendorData.action !== undefined ? vendorData.action : true
        });
        // Save to database
        const savedVendor = await newVendor.save();
        return {
            success: true,
            message: 'Vendor added successfully',
            vendorId: savedVendor._id.toString(),
            data: savedVendor
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.AddVendorService = AddVendorService;
const GetVendorsService = async () => {
    try {
        // Get all vendors from database, sorted by latest first
        const vendors = await vendor_model_1.default.find()
            .sort({ createdAt: -1 })
            .select('-__v') // Exclude version key
            .lean();
        // Transform the data to match IVendorResponse interface
        const transformedVendors = vendors.map(vendor => ({
            _id: vendor._id.toString(),
            name: vendor.name || '', // Provide default if null
            email: vendor.email || '',
            phone: vendor.phone || '', // Add missing field
            licenseNumber: vendor.licenseNumber || '',
            companyName: vendor.companyName || '', // Add missing field
            livePhoto: vendor.livePhoto || 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg',
            status: vendor.status, // Type assertion
            action: vendor.action || false, // Provide default
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt
        }));
        return transformedVendors;
    }
    catch (error) {
        console.error('Error fetching vendors:', error.message);
        throw new Error('Failed to fetch vendors from database');
    }
};
exports.GetVendorsService = GetVendorsService;
// Optional: Get vendors by status
const GetVendorsByStatusService = async (status) => {
    try {
        const vendors = await vendor_model_1.default.find({ status })
            .sort({ createdAt: -1 })
            .select('-__v')
            .lean();
        const transformedVendors = vendors.map(vendor => ({
            _id: vendor._id.toString(),
            name: vendor.name,
            email: vendor.email,
            // tradeName: vendor.tradeName,
            phone: vendor.phone,
            licenseNumber: vendor.licenseNumber,
            companyName: vendor.companyName,
            livePhoto: vendor.livePhoto || 'https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg',
            status: vendor.status,
            action: vendor.action,
            createdAt: vendor.createdAt,
            updatedAt: vendor.updatedAt
        }));
        return transformedVendors;
    }
    catch (error) {
        console.error('Error fetching vendors by status:', error.message);
        throw new Error('Failed to fetch vendors by status');
    }
};
exports.GetVendorsByStatusService = GetVendorsByStatusService;
const loginVendorService = async (email, password) => {
    try {
        // Find vendor by email
        const vendor = await vendor_model_1.default.findOne({ email, status: 'active' });
        if (!vendor) {
            return { success: false, message: 'Vendor not found or inactive' };
        }
        // Check password
        const isPasswordValid = await vendor.comparePassword(password);
        if (!isPasswordValid) {
            return { success: false, message: 'Invalid credentials' };
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            vendorId: vendor._id,
            email: vendor.email,
            role: 'vendor'
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Return vendor data without password
        const vendorData = {
            _id: vendor._id,
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            companyName: vendor.companyName,
            status: vendor.status
        };
        return {
            success: true,
            vendor: vendorData,
            // vendor: {
            //   id: vendor._id,
            //   name: vendor.name,
            //   email: vendor.email
            // },
            token,
            message: 'Login successfully'
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.loginVendorService = loginVendorService;
const logoutVendorService = async (vendorId) => {
    try {
        return {
            success: true,
            message: 'Logout successful'
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.logoutVendorService = logoutVendorService;
const getVendorProfileService = async (vendorId) => {
    try {
        const vendor = await vendor_model_1.default.findById(vendorId).select('-password');
        if (!vendor) {
            return { success: false, message: 'Vendor not found' };
        }
        return { success: true, vendor };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getVendorProfileService = getVendorProfileService;
// Register a new vendor
const registerVendorService = async (vendorData) => {
    try {
        // Check if vendor already exists
        const existingVendor = await vendor_model_1.default.findOne({ email: vendorData.email });
        if (existingVendor) {
            return { success: false, message: 'Vendor already exists with this email' };
        }
        // Create new vendor
        const vendor = new vendor_model_1.default(vendorData);
        await vendor.save();
        // Generate token for auto-login after registration
        const token = jsonwebtoken_1.default.sign({
            vendorId: vendor._id,
            email: vendor.email,
            role: 'vendor'
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Return vendor data without password
        const vendorResponse = {
            _id: vendor._id,
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            companyName: vendor.companyName,
            // businessName: vendor.businessName,
            // businessType: vendor.businessType,
            // address: vendor.address,
            status: vendor.status,
            // isEmailVerified: vendor.isEmailVerified
        };
        return {
            success: true,
            vendor: vendorResponse,
            token,
            message: 'Vendor registered successfully'
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.registerVendorService = registerVendorService;
// Get vendor orders 
const getVendorOrdersService = async (vendorId, page = 1, limit = 10, status) => {
    try {
        const skip = (page - 1) * limit;
        // First, get all product IDs belonging to this vendor
        const vendorProducts = await product_model_1.default.find({ vendor: vendorId }).select('_id');
        const vendorProductIds = vendorProducts.map(product => product._id);
        if (vendorProductIds.length === 0) {
            return {
                success: true,
                orders: [],
                currentPage: page,
                totalPages: 0,
                totalOrders: 0
            };
        }
        // Build query to find orders that contain vendor's products
        let query = {
            'items.product': { $in: vendorProductIds }
        };
        // Add status filter if provided
        if (status && status !== 'all') {
            query.status = status;
        }
        const orders = await order_model_1.default.find(query)
            .populate('user', 'name email phone')
            .populate({
            path: 'items.product',
            select: 'name price productImg vendor',
            populate: {
                path: 'vendor',
                select: 'name companyName'
            }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalOrders = await order_model_1.default.countDocuments(query);
        return {
            success: true,
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getVendorOrdersService = getVendorOrdersService;
// Get vendor order statistics : 
const getVendorOrderStatsService = async (vendorId) => {
    try {
        const vendorProducts = await product_model_1.default.find({ vendor: vendorId }).select('_id');
        const vendorProductIds = vendorProducts.map(product => product._id);
        if (vendorProductIds.length === 0) {
            return {
                success: true,
                statistics: {
                    totalOrders: 0,
                    pendingOrders: 0,
                    confirmedOrders: 0,
                    shippedOrders: 0,
                    deliveredOrders: 0,
                    cancelledOrders: 0,
                    totalRevenue: 0
                }
            };
        }
        const query = { 'items.product': { $in: vendorProductIds } };
        const [totalOrders, pendingOrders, confirmedOrders, shippedOrders, deliveredOrders, cancelledOrders, revenueData] = await Promise.all([
            order_model_1.default.countDocuments(query),
            order_model_1.default.countDocuments({ ...query, status: 'pending' }),
            order_model_1.default.countDocuments({ ...query, status: 'confirmed' }),
            order_model_1.default.countDocuments({ ...query, status: 'shipped' }),
            order_model_1.default.countDocuments({ ...query, status: 'delivered' }),
            order_model_1.default.countDocuments({ ...query, status: 'cancelled' }),
            order_model_1.default.aggregate([
                { $match: { ...query, status: 'delivered' } },
                { $unwind: '$items' },
                { $match: { 'items.product': { $in: vendorProductIds } } },
                { $group: { _id: null, total: { $sum: '$items.total' } } }
            ])
        ]);
        return {
            success: true,
            statistics: {
                totalOrders,
                pendingOrders,
                confirmedOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue: revenueData[0]?.total || 0
            }
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.getVendorOrderStatsService = getVendorOrderStatsService;
// Update status 
const updateVendorOrderStatusService = async (orderId, vendorId, status) => {
    try {
        // Get valid statuses from your Order model (if defined in schema)
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return {
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            };
        }
        // Verify the order contains vendor's products
        const vendorProducts = await product_model_1.default.find({ vendor: vendorId }).select('_id');
        const vendorProductIds = vendorProducts.map(product => product._id);
        const order = await order_model_1.default.findOne({
            _id: orderId,
            'items.product': { $in: vendorProductIds }
        });
        if (!order) {
            return { success: false, message: 'Order not found or does not contain your products' };
        }
        // Update order status
        order.status = status;
        await order.save();
        // Populate the updated order
        const updatedOrder = await order_model_1.default.findById(orderId)
            .populate('user', 'name email phone')
            .populate({
            path: 'items.product',
            select: 'name price productImg vendor',
            populate: {
                path: 'vendor',
                select: 'name companyName'
            }
        });
        return {
            success: true,
            order: updatedOrder,
            message: `Order status updated to ${status}`
        };
    }
    catch (error) {
        return { success: false, message: error.message };
    }
};
exports.updateVendorOrderStatusService = updateVendorOrderStatusService;
// Get vendor order by ID
const getVendorOrderByIdService = async (orderId, vendorId) => {
    try {
        console.log("🔍 Service started - Order ID:", orderId, "Vendor ID:", vendorId);
        // First, get all product IDs belonging to this vendor
        const vendorProducts = await product_model_1.default.find({ vendor: vendorId }).select('_id');
        const vendorProductIds = vendorProducts.map(product => product._id);
        console.log("Vendor products found:", vendorProducts.length);
        console.log("Vendor product IDs:", vendorProductIds);
        if (vendorProductIds.length === 0) {
            return {
                success: false,
                message: 'No products found for this vendor'
            };
        }
        // Use the SAME query pattern as getVendorOrdersService
        const order = await order_model_1.default.findOne({
            _id: orderId,
            'items.product': { $in: vendorProductIds } // This ensures the order contains vendor's products
        })
            .populate('user', 'name email phone')
            .populate({
            path: 'items.product',
            select: 'name price productImg vendor',
            populate: {
                path: 'vendor',
                select: 'name companyName'
            }
        });
        if (!order) {
            console.log("Order not found or doesn't contain vendor's products");
            return { success: false, message: 'Order not found or does not contain your products' };
        }
        console.log("Order found, total items:", order.items.length);
        // console.log("All items:", order.items.map(item => ({
        //   productId: item.product?._id?.toString(),
        //   productName: item.product?.name,
        //   vendorId: item.product?.vendor?._id?.toString()
        // })));
        // Since we filtered at database level, all items should be vendor's products
        // But we can still filter to be safe
        const vendorItems = order.items.filter(item => {
            // const productId = item.product?._id?.toString();
            const productId = item.product?._id?.toString();
            const isVendorProduct = vendorProductIds.some(vendorProductId => vendorProductId.toString() === productId);
            console.log(`📦 Checking item ${productId}: ${isVendorProduct}`);
            return isVendorProduct;
        });
        console.log("✅ Final vendor items:", vendorItems.length);
        return {
            success: true,
            order: {
                ...order.toObject(),
                items: vendorItems
            }
        };
    }
    catch (error) {
        console.error('💥 Service error:', error);
        return { success: false, message: error.message };
    }
};
exports.getVendorOrderByIdService = getVendorOrderByIdService;
