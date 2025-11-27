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
exports.getVendorProductStats = exports.deleteVendorProduct = exports.updateVendorProduct = exports.getVendorProductById = exports.getVendorProducts = exports.addVendorProduct = exports.getProductsByCategoryController = exports.deleteProductController = exports.updateProductController = exports.getProductByIdController = exports.getProductsController = exports.addProductController = void 0;
const ProductService = __importStar(require("./product.service"));
// Admin Department
// Add Product for admin
const addProductController = async (req, res) => {
    try {
        const { name, category, originalPrice, price, stock, description, color, vendor } = req.body;
        // For Image
        let fileBuffer;
        let originalname;
        // Handle file upload
        if (req.file) {
            fileBuffer = req.file.buffer;
            originalname = req.file.originalname;
            console.log('File prepared for service:', {
                hasBuffer: !!fileBuffer,
                bufferLength: fileBuffer?.length,
                originalname
            });
        }
        else {
            console.log('No file available to pass to service');
        }
        // Validate required fields - now including vendor
        if (!name || !category || !originalPrice || !price || !stock || !vendor) {
            res.status(400).json({
                success: false,
                message: 'name, category, price, stock, and vendor are required fields'
            });
            return;
        }
        // Validate vendor ID format (if using MongoDB ObjectId)
        // if (!mongoose.Types.ObjectId.isValid(vendor)) {
        //   res.status(400).json({
        //     success: false,
        //     message: 'Invalid vendor ID format'
        //   });
        //   return;
        // }
        const productData = {
            name: name.trim(),
            category: category,
            vendor: vendor, // Include vendor in product data
            originalPrice: parseFloat(originalPrice),
            price: parseFloat(price),
            stock: parseInt(stock),
            description: description || '',
            color: color || ''
        };
        console.log('Product data before service:', productData);
        const product = await ProductService.addProductService(productData, fileBuffer, originalname);
        res.status(201).json({
            success: true,
            product,
            message: 'Product created successfully'
        });
    }
    catch (error) {
        console.error('Error adding product:', error.message);
        // Handle specific error cases
        if (error.message.includes('already exists')) {
            res.status(409).json({
                success: false,
                message: error.message
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};
exports.addProductController = addProductController;
// Get Products for admin
const getProductsController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const category = req.query.category || 'all';
        const result = await ProductService.getProductsService(page, limit, search, category);
        res.status(200).json({
            success: true,
            products: result.products,
            totalProducts: result.totalProducts,
            totalPages: result.totalPages,
            currentPage: result.currentPage
        });
    }
    catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProductsController = getProductsController;
// Get Product by ID  for admin
const getProductByIdController = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await ProductService.getProductByIdService(productId);
        res.status(200).json({
            success: true,
            data: product
        });
    }
    catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
exports.getProductByIdController = getProductByIdController;
// Update Product for admin
const updateProductController = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, category, originalPrice, price, stock, description, color, vendor } = req.body;
        let fileBuffer;
        let originalname;
        if (req.file) {
            fileBuffer = req.file.buffer;
            originalname = req.file.originalname;
        }
        const productData = {};
        if (name)
            productData.name = name;
        if (category)
            productData.category = category;
        if (vendor)
            productData.vendor = vendor;
        if (originalPrice)
            productData.originalPrice = parseFloat(originalPrice);
        if (price)
            productData.price = parseFloat(price);
        if (stock)
            productData.stock = parseInt(stock);
        if (description !== undefined)
            productData.description = description;
        if (color !== undefined)
            productData.color = color;
        const updatedProduct = await ProductService.updateProductService(productId, productData, fileBuffer, originalname);
        res.status(200).json({
            success: true,
            data: updatedProduct,
            message: 'Product updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating product:', error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateProductController = updateProductController;
// Delete Product for admin
const deleteProductController = async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await ProductService.deleteProductService(productId);
        res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.deleteProductController = deleteProductController;
////////////////////////////////////////////////
// User Department
const getProductsByCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { search } = req.query;
        // Validate categoryId
        if (!categoryId) {
            res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
            return;
        }
        const result = await ProductService.getProductsByCategoryService(categoryId, search);
        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            products: result.products,
            totalProducts: result.totalProducts,
            categoryId: categoryId,
            category: result.category?.name || 'Products' // Add category name here
        });
    }
    catch (error) {
        console.error('Error fetching products by category:', error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getProductsByCategoryController = getProductsByCategoryController;
///////////////////////////////////////////////////////////////////
// Vendor department
// Add Product for Vendor
const addVendorProduct = async (req, res) => {
    try {
        const { name, description, stock, price, originalPrice, category, color, brand, model } = req.body;
        const vendorId = req.vendor?.vendorId;
        console.log('=== VENDOR PRODUCT CONTROLLER ===');
        console.log('Request body:', req.body);
        console.log('Vendor ID:', vendorId);
        console.log('Uploaded file:', req.file); // Check if file exists
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        // Validate required fields
        if (!name || !description || !stock || !price || !category || !color) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }
        let fileBuffer;
        let originalname;
        // Check if file was uploaded
        if (req.file) {
            fileBuffer = req.file.buffer;
            originalname = req.file.originalname;
            console.log('File details:', {
                originalname: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                bufferLength: req.file.buffer.length
            });
        }
        else {
            console.log('No file uploaded in vendor product controller');
        }
        const productData = {
            name,
            description,
            stock: parseInt(stock),
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
            category,
            color,
            brand: brand || '',
            model: model || ''
        };
        console.log('Calling addVendorProductService with:', {
            productData,
            vendorId,
            hasFile: !!fileBuffer,
            originalname
        });
        const product = await ProductService.addVendorProductService(productData, vendorId, fileBuffer, originalname);
        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product
        });
    }
    catch (error) {
        console.error('Error in addVendorProduct controller:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.addVendorProduct = addVendorProduct;
// Get Vendor Products
const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.vendor?.vendorId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const category = req.query.category || 'all';
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        const result = await ProductService.getVendorProductsService(vendorId, page, limit, search, category);
        res.status(200).json({
            success: true,
            ...result
        });
    }
    catch (error) {
        console.error('Error in getVendorProducts:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getVendorProducts = getVendorProducts;
// Get Single Vendor Product
const getVendorProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const vendorId = req.vendor?.vendorId;
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        const product = await ProductService.getVendorProductByIdService(productId, vendorId);
        res.status(200).json({
            success: true,
            product
        });
    }
    catch (error) {
        console.error('Error in getVendorProductById:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getVendorProductById = getVendorProductById;
// Update Vendor Product
const updateVendorProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const productData = req.body;
        const vendorId = req.vendor?.vendorId;
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        let fileBuffer;
        let originalname;
        if (req.file) {
            fileBuffer = req.file.buffer;
            originalname = req.file.originalname;
        }
        const product = await ProductService.updateVendorProductService(productId, productData, vendorId, fileBuffer, originalname);
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    }
    catch (error) {
        console.error('Error in updateVendorProduct:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateVendorProduct = updateVendorProduct;
// Delete Vendor Product
const deleteVendorProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const vendorId = req.vendor?.vendorId;
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        const result = await ProductService.deleteVendorProductService(productId, vendorId);
        res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.error('Error in deleteVendorProduct:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.deleteVendorProduct = deleteVendorProduct;
// Get Vendor Product Statistics
const getVendorProductStats = async (req, res) => {
    try {
        const vendorId = req.vendor?.vendorId;
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        const stats = await ProductService.getVendorProductStatsService(vendorId);
        res.status(200).json({
            success: true,
            ...stats
        });
    }
    catch (error) {
        console.error('Error in getVendorProductStats:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getVendorProductStats = getVendorProductStats;
