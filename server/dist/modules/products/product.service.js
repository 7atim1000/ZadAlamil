"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVendorProductStatsService = exports.deleteVendorProductService = exports.updateVendorProductService = exports.getVendorProductByIdService = exports.getVendorProductsService = exports.addVendorProductService = exports.getProductsByCategoryService = exports.deleteProductService = exports.updateProductService = exports.getProductByIdService = exports.getProductsService = exports.addProductService = void 0;
const product_model_1 = __importDefault(require("./product.model"));
const category_model_1 = __importDefault(require("../categories/category.model"));
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Helper function to upload image buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, originalname) => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'categories',
                resource_type: 'image',
                quality: 'auto',
                fetch_format: 'auto',
                public_id: `category-${Date.now()}-${Math.random().toString(36).substring(7)}`
            }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(new Error('Failed to upload image to cloud storage'));
                }
                else if (result && result.secure_url) {
                    resolve(result.secure_url);
                }
                else {
                    reject(new Error('Cloudinary upload failed: No result returned'));
                }
            });
            uploadStream.end(fileBuffer);
        });
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image to cloud storage');
    }
};
// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
            return;
        }
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = filenameWithExtension.split('.')[0];
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error('Cloudinary delete error:', error);
        // Don't throw error to avoid breaking the main operation
    }
};
// Admin DEPARTMENT
// add product for admin
const addProductService = async (productData, fileBuffer, originalname) => {
    try {
        // For debug
        console.log('AddProductService called with:', {
            productData,
            hasFile: !!fileBuffer,
            originalname
        });
        // Check if product already exists for this vendor
        const existingProduct = await product_model_1.default.findOne({
            name: productData.name,
            vendor: productData.vendor // Check within the same vendor
        });
        if (existingProduct) {
            throw new Error('Product with this name already exists for this vendor');
        }
        let cloudinaryUrl = '';
        // If file buffer is provided, upload to Cloudinary
        if (fileBuffer && originalname) {
            console.log('Uploading file to Cloudinary...');
            cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);
            console.log('Cloudinary URL received:', cloudinaryUrl);
        }
        else {
            console.log('No file provided for upload');
        }
        const newProduct = new product_model_1.default({
            name: productData.name,
            category: productData.category,
            vendor: productData.vendor, // Use the vendor from request
            price: productData.price,
            originalPrice: productData.originalPrice,
            stock: productData.stock,
            productImg: cloudinaryUrl,
            description: productData.description,
            color: productData.color
        });
        const savedProduct = await newProduct.save();
        // Populate both category and vendor
        await savedProduct.populate('category', 'name');
        await savedProduct.populate('vendor', 'name email companyName'); // Populate vendor info
        return {
            _id: savedProduct._id.toString(),
            name: savedProduct.name,
            category: savedProduct.category,
            vendor: savedProduct.vendor, // Now includes populated vendor data
            productImg: savedProduct.productImg,
            price: savedProduct.price,
            originalPrice: savedProduct.originalPrice,
            stock: savedProduct.stock,
            color: savedProduct.color,
            status: savedProduct.status,
            description: savedProduct.description,
            createdAt: savedProduct.createdAt,
            updatedAt: savedProduct.updatedAt
        };
    }
    catch (error) {
        console.error('Error in addProductService:', error.message);
        throw new Error(error.message);
    }
};
exports.addProductService = addProductService;
// get products for admin
const getProductsService = async (page = 1, limit = 10, search = '', category = 'all') => {
    try {
        const skip = (page - 1) * limit;
        // Build query
        let query = {};
        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        // Filter by category
        if (category !== 'all') {
            query.category = category;
        }
        // Get products with pagination and populate category & vendor
        const products = await product_model_1.default.find(query)
            .populate('category', 'name') // Populate category name
            .populate('vendor', 'name email companyName') // Populate vendor details
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v')
            .lean();
        // Get total count for pagination
        const totalProducts = await product_model_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
        // Transform products
        const transformedProducts = products.map(product => ({
            _id: product._id.toString(),
            name: product.name,
            category: product.category, // This will have { _id, name } from populate
            // vendor: product.vendor ? {
            //     _id: product.vendor._id?.toString(),
            //     name: product.vendor.name,
            //     email: product.vendor.email,
            //     companyName: product.vendor.companyName
            // } : null,
            vendor: product.vendor?._id?.toString() || '', // Type assertion
            productImg: product.productImg || '',
            originalPrice: product.originalPrice,
            price: product.price,
            stock: product.stock,
            color: product.color,
            status: product.status,
            description: product.description,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));
        return {
            products: transformedProducts,
            totalProducts,
            totalPages,
            currentPage: page
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getProductsService = getProductsService;
// Get Product by ID for admin
const getProductByIdService = async (productId) => {
    try {
        const product = await product_model_1.default.findById(productId)
            .populate('category', 'name')
            .select('-__v');
        if (!product) {
            throw new Error('Product not found');
        }
        return {
            _id: product._id.toString(),
            name: product.name,
            category: product.category,
            vendor: product.vendor,
            productImg: product.productImg || '',
            originalPrice: product.originalPrice,
            price: product.price,
            stock: product.stock,
            color: product.color,
            status: product.status,
            description: product.description,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getProductByIdService = getProductByIdService;
// Update Product for admin
const updateProductService = async (productId, productData, fileBuffer, originalname) => {
    try {
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        // Check if name already exists (excluding current product)
        if (productData.name && productData.name !== product.name) {
            const existingProduct = await product_model_1.default.findOne({
                name: productData.name,
                _id: { $ne: productId }
            });
            if (existingProduct) {
                throw new Error('Product with this name already exists');
            }
        }
        // Update fields
        if (productData.name)
            product.name = productData.name;
        if (productData.category)
            product.category = productData.category;
        if (productData.vendor)
            product.vendor = productData.vendor;
        if (productData.originalPrice !== undefined)
            product.originalPrice = productData.originalPrice;
        if (productData.price !== undefined)
            product.price = productData.price;
        if (productData.stock !== undefined)
            product.stock = productData.stock;
        if (productData.description !== undefined)
            product.description = productData.description;
        if (productData.color !== undefined)
            product.color = productData.color;
        if (fileBuffer && originalname) {
            // Upload new image to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);
            // Delete old image from Cloudinary if exists
            if (product.productImg) {
                await deleteFromCloudinary(product.productImg);
            }
            product.productImg = cloudinaryUrl;
        }
        ;
        const updatedProduct = await product.save();
        await updatedProduct.populate('category', 'name');
        return {
            _id: updatedProduct._id.toString(),
            name: updatedProduct.name,
            category: updatedProduct.category,
            vendor: updatedProduct.vendor,
            productImg: updatedProduct.productImg,
            price: updatedProduct.price,
            originalPrice: updatedProduct.originalPrice,
            stock: updatedProduct.stock,
            color: updatedProduct.color,
            status: updatedProduct.status,
            description: updatedProduct.description,
            createdAt: updatedProduct.createdAt,
            updatedAt: updatedProduct.updatedAt
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.updateProductService = updateProductService;
// Delete Product for admin
const deleteProductService = async (productId) => {
    try {
        const product = await product_model_1.default.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        // Delete product image file if exists
        if (product.productImg) {
            await deleteFromCloudinary(product.productImg);
        }
        await product_model_1.default.findByIdAndDelete(productId);
        return { message: 'Product deleted successfully' };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.deleteProductService = deleteProductService;
///////////////////////////////////////////////////////////////
// USER DEPARTMENT  Get products depend on categories for users 
const getProductsByCategoryService = async (categoryId, search) => {
    try {
        // Build search query
        const searchFilter = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { color: { $regex: search, $options: 'i' } }
            ]
        } : {};
        // Filter by specific category ID
        const categoryFilter = { category: categoryId };
        // Combine filters
        const filter = {
            ...categoryFilter,
            ...searchFilter,
            status: 'LIST' // Only show listed products
        };
        // Get products with category filter and search
        const products = await product_model_1.default.find(filter)
            .select('_id name description price originalPrice stock color productImg status category createdAt updatedAt')
            .populate('category', 'name _id') // Populate category name
            .sort({ createdAt: -1 })
            .lean();
        const totalProducts = await product_model_1.default.countDocuments(filter);
        // Get category details separately to ensure we have the name
        const category = await category_model_1.default.findById(categoryId).select('name _id');
        return {
            products: products,
            totalProducts,
            category: category
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getProductsByCategoryService = getProductsByCategoryService;
////////////////////////////////////////////////////////////
/// Vendor Department
// Vendor Add Product
const addVendorProductService = async (productData, vendorId, fileBuffer, originalname) => {
    try {
        console.log('AddVendorProductService called with:', {
            productData,
            vendorId,
            hasFile: !!fileBuffer,
            originalname
        });
        // Check if product already exists for this vendor
        const existingProduct = await product_model_1.default.findOne({
            name: productData.name,
            vendor: vendorId
        });
        if (existingProduct) {
            throw new Error('Product with this name already exists in your store');
        }
        let cloudinaryUrl = '';
        // If file buffer is provided, upload to Cloudinary
        if (fileBuffer && originalname) {
            console.log('Uploading file to Cloudinary...');
            console.log('File buffer size:', fileBuffer.length);
            console.log('Original name:', originalname);
            cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);
            console.log('Cloudinary URL received:', cloudinaryUrl);
        }
        else {
            console.log('No file provided for upload');
        }
        const newProduct = new product_model_1.default({
            name: productData.name,
            category: productData.category,
            vendor: vendorId,
            price: productData.price,
            originalPrice: productData.originalPrice,
            stock: productData.stock,
            productImg: cloudinaryUrl,
            description: productData.description,
            color: productData.color
        });
        console.log('New product before save:', newProduct);
        const savedProduct = await newProduct.save();
        await savedProduct.populate('category', 'name');
        console.log('Product saved successfully:', savedProduct);
        return {
            _id: savedProduct._id.toString(),
            name: savedProduct.name,
            category: savedProduct.category,
            vendor: savedProduct.vendor,
            productImg: savedProduct.productImg, // Check if this has the Cloudinary URL
            price: savedProduct.price,
            originalPrice: savedProduct.originalPrice,
            stock: savedProduct.stock,
            color: savedProduct.color,
            status: savedProduct.status,
            description: savedProduct.description,
            createdAt: savedProduct.createdAt,
            updatedAt: savedProduct.updatedAt
        };
    }
    catch (error) {
        console.error('Error in addVendorProductService:', error.message);
        throw new Error(error.message);
    }
};
exports.addVendorProductService = addVendorProductService;
// Get products for vendor (only their products)
const getVendorProductsService = async (vendorId, page = 1, limit = 10, search = '', category = 'all') => {
    try {
        const skip = (page - 1) * limit;
        // Build query - always filter by vendorId
        let query = { vendor: vendorId };
        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        // Filter by category
        if (category !== 'all') {
            query.category = category;
        }
        // Get products with pagination and populate category
        const products = await product_model_1.default.find(query)
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v')
            .lean();
        // Get total count for pagination
        const totalProducts = await product_model_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
        // Transform products
        const transformedProducts = products.map(product => ({
            _id: product._id.toString(),
            name: product.name,
            category: product.category,
            vendor: product.vendor,
            productImg: product.productImg || '',
            originalPrice: product.originalPrice,
            price: product.price,
            stock: product.stock,
            color: product.color,
            status: product.status,
            description: product.description,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));
        return {
            products: transformedProducts,
            totalProducts,
            totalPages,
            currentPage: page
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getVendorProductsService = getVendorProductsService;
// Get Vendor Product by ID (only if they own it)
const getVendorProductByIdService = async (productId, vendorId) => {
    try {
        const product = await product_model_1.default.findOne({ _id: productId, vendor: vendorId })
            .populate('category', 'name')
            .select('-__v');
        if (!product) {
            throw new Error('Product not found or you do not have permission to access it');
        }
        return {
            _id: product._id.toString(),
            name: product.name,
            category: product.category,
            vendor: product.vendor,
            productImg: product.productImg || '',
            originalPrice: product.originalPrice,
            price: product.price,
            stock: product.stock,
            color: product.color,
            status: product.status,
            description: product.description,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getVendorProductByIdService = getVendorProductByIdService;
// Update Product for vendor (only if they own it)
const updateVendorProductService = async (productId, productData, vendorId, fileBuffer, originalname) => {
    try {
        const product = await product_model_1.default.findOne({ _id: productId, vendor: vendorId });
        if (!product) {
            throw new Error('Product not found or you do not have permission to update it');
        }
        // Check if name already exists for this vendor (excluding current product)
        if (productData.name && productData.name !== product.name) {
            const existingProduct = await product_model_1.default.findOne({
                name: productData.name,
                vendor: vendorId,
                _id: { $ne: productId }
            });
            if (existingProduct) {
                throw new Error('Product with this name already exists in your store');
            }
        }
        // Update fields
        if (productData.name)
            product.name = productData.name;
        if (productData.category)
            product.category = productData.category;
        // vendor should not be updated - it's fixed to the authenticated vendor
        if (productData.originalPrice !== undefined)
            product.originalPrice = productData.originalPrice;
        if (productData.price !== undefined)
            product.price = productData.price;
        if (productData.stock !== undefined)
            product.stock = productData.stock;
        if (productData.description !== undefined)
            product.description = productData.description;
        if (productData.color !== undefined)
            product.color = productData.color;
        if (fileBuffer && originalname) {
            // Upload new image to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);
            // Delete old image from Cloudinary if exists
            if (product.productImg) {
                await deleteFromCloudinary(product.productImg);
            }
            product.productImg = cloudinaryUrl;
        }
        ;
        const updatedProduct = await product.save();
        await updatedProduct.populate('category', 'name');
        return {
            _id: updatedProduct._id.toString(),
            name: updatedProduct.name,
            category: updatedProduct.category,
            vendor: updatedProduct.vendor,
            productImg: updatedProduct.productImg,
            price: updatedProduct.price,
            originalPrice: updatedProduct.originalPrice,
            stock: updatedProduct.stock,
            color: updatedProduct.color,
            status: updatedProduct.status,
            description: updatedProduct.description,
            createdAt: updatedProduct.createdAt,
            updatedAt: updatedProduct.updatedAt
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.updateVendorProductService = updateVendorProductService;
// Delete Product for vendor (only if they own it)
const deleteVendorProductService = async (productId, vendorId) => {
    try {
        const product = await product_model_1.default.findOne({ _id: productId, vendor: vendorId });
        if (!product) {
            throw new Error('Product not found or you do not have permission to delete it');
        }
        // Check if product is in any orders
        // const orderCount = await Order.countDocuments({ 
        //     'items.product': productId,
        //     'items.product': { $exists: true }
        // });
        // if (orderCount > 0) {
        //     throw new Error(`Cannot delete product. It is associated with ${orderCount} order(s).`);
        // }
        // Delete product image from Cloudinary if exists
        if (product.productImg) {
            await deleteFromCloudinary(product.productImg);
        }
        await product_model_1.default.findByIdAndDelete(productId);
        return { message: 'Product deleted successfully' };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.deleteVendorProductService = deleteVendorProductService;
// Get vendor product statistics
const getVendorProductStatsService = async (vendorId) => {
    try {
        const totalProducts = await product_model_1.default.countDocuments({ vendor: vendorId });
        const listedProducts = await product_model_1.default.countDocuments({ vendor: vendorId, status: 'LIST' });
        const outOfStockProducts = await product_model_1.default.countDocuments({ vendor: vendorId, stock: 0 });
        // Get top selling products
        const topSellingProducts = await product_model_1.default.find({ vendor: vendorId })
            .sort({ sales: -1 })
            .limit(5)
            .select('name sales stock')
            .lean();
        return {
            totalProducts,
            listedProducts,
            outOfStockProducts,
            topSellingProducts
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.getVendorProductStatsService = getVendorProductStatsService;
