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
exports.getVendorOrderById = exports.updateVendorOrderStatus = exports.getVendorOrderStats = exports.getVendorOrders = exports.registerVendor = exports.getVendorProfile = exports.logoutVendor = exports.loginVendor = exports.GetVendorsController = exports.AddVendorController = void 0;
const VendorService = __importStar(require("./vendor.service"));
const AddVendorController = async (req, res) => {
    try {
        const { name, email, companyName, licenseNumber, phone } = req.body;
        // Create vendor data object
        const vendorData = {
            name,
            email,
            companyName,
            licenseNumber,
            phone,
            // status: status || 'pending', // Default value if not provided
            // action: action !== undefined ? action : true // Default value if not provided
        };
        // Call the service to add vendor
        const result = await VendorService.AddVendorService(vendorData);
        // Send appropriate response based on service result
        if (result.success) {
            res.status(201).json({
                success: true,
                message: result.message,
                vendorId: result.vendorId,
                data: result.data
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    }
    catch (error) {
        console.log('Error in AddVendorController:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.AddVendorController = AddVendorController;
// export const GetVendorsController = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { status } = req.query;
//     let vendors;
//     if (status && ['PENDING', 'APPROVED', 'REJECTED', 'ONGOING'].includes(status as string)) {
//       vendors = await VendorService.GetVendorsByStatusService(status as string);
//     } else {
//       vendors = await VendorService.GetVendorsService();
//     }
//     res.status(200).json(vendors);
//   } catch (error: any) {
//     console.error('Error in GetVendorsController:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while fetching vendors'
//     });
//   }
// };
const GetVendorsController = async (req, res) => {
    try {
        const { status } = req.query;
        let vendors;
        if (status && ['PENDING', 'APPROVED', 'REJECTED', 'ONGOING'].includes(status)) {
            vendors = await VendorService.GetVendorsByStatusService(status);
        }
        else {
            vendors = await VendorService.GetVendorsService();
        }
        // Return proper response structure
        res.status(200).json({
            success: true,
            vendors: vendors, // Wrap the vendors array in a vendors property
            totalVendors: vendors.length,
            message: 'Vendors fetched successfully'
        });
    }
    catch (error) {
        console.error('Error in GetVendorsController:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching vendors'
        });
    }
};
exports.GetVendorsController = GetVendorsController;
const loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        const result = await VendorService.loginVendorService(email, password);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(401).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.loginVendor = loginVendor;
const logoutVendor = async (req, res) => {
    try {
        const vendorId = req.vendor?.vendorId;
        const result = await VendorService.logoutVendorService(vendorId);
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
exports.logoutVendor = logoutVendor;
const getVendorProfile = async (req, res) => {
    try {
        const vendorId = req.vendor?.vendorId;
        const result = await VendorService.getVendorProfileService(vendorId);
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
exports.getVendorProfile = getVendorProfile;
const registerVendor = async (req, res) => {
    try {
        const vendorData = req.body;
        // Validate required fields
        const requiredFields = ['name', 'email', 'password', 'phone'];
        const missingFields = requiredFields.filter(field => !vendorData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        const result = await VendorService.registerVendorService(vendorData);
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
exports.registerVendor = registerVendor;
// get vendor Orders
const getVendorOrders = async (req, res) => {
    try {
        const vendorId = req.vendor?.vendorId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const result = await VendorService.getVendorOrdersService(vendorId, page, limit, status);
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
exports.getVendorOrders = getVendorOrders;
// Get vendor order statistics
const getVendorOrderStats = async (req, res) => {
    try {
        const vendorId = req.vendor?.vendorId;
        const result = await VendorService.getVendorOrderStatsService(vendorId);
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
exports.getVendorOrderStats = getVendorOrderStats;
// Update status of orders
const updateVendorOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const vendorId = req.vendor?.vendorId;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }
        const result = await VendorService.updateVendorOrderStatusService(orderId, vendorId, status);
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
exports.updateVendorOrderStatus = updateVendorOrderStatus;
// decode the JWT token and extract the vendorId:
const getVendorOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const vendorId = req.vendor.vendorId;
        console.log("🔍 Vendor ID from middleware:", vendorId);
        console.log("🔍 Order ID:", orderId);
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        const result = await VendorService.getVendorOrderByIdService(orderId, vendorId);
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        console.error('Error in getVendorOrderById controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getVendorOrderById = getVendorOrderById;
