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
exports.getVendorCategoryById = exports.updateVendorCategory = exports.deleteVendorCategory = exports.getVendorCategories = exports.addVendorCategory = exports.getCategoriesUserController = exports.UpdateCategoryController = exports.DeleteCategoryController = exports.GetCategoriesController = exports.AddCategoryController = void 0;
const CategoryService = __importStar(require("./category.service"));
// Admin Department 
const AddCategoryController = async (req, res) => {
    try {
        const { name, vendorId } = req.body; // Get vendorId from request body
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }
        if (!vendorId) {
            return res.status(400).json({
                success: false,
                message: 'Vendor ID is required'
            });
        }
        let fileBuffer;
        let originalname;
        // Handle file upload if present
        if (req.file) {
            fileBuffer = req.file.buffer;
            originalname = req.file.originalname;
        }
        const category = await CategoryService.AddCategoryService(name, vendorId, fileBuffer, originalname);
        res.status(201).json({
            success: true,
            message: 'Category added successfully',
            category
        });
    }
    catch (error) {
        console.error('Error in addCategoryController:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.AddCategoryController = AddCategoryController;
// export const AddCategoryController = async(req: Request, res: Response): Promise<void> => {
//     try {
//         console.log('=== ADD CATEGORY CONTROLLER DEBUG ===');
//         console.log('Request body:', req.body);
//         console.log('Request file:', req.file ? {
//             fieldname: req.file.fieldname,
//             originalname: req.file.originalname,
//             mimetype: req.file.mimetype,
//             size: req.file.size,
//             buffer: req.file.buffer ? `Buffer length: ${req.file.buffer.length}` : 'No buffer'
//         } : 'NO FILE IN REQUEST');
//         console.log('Request headers - content-type:', req.headers['content-type']);
//         console.log('====================================');
//         const { name } = req.body;
//         if (!name || name.trim() === '') {
//             res.status(400).json({ 
//                 success: false, 
//                 message: 'Category name is required' 
//             });
//             return;
//         }
//         let fileBuffer: Buffer | undefined;
//         let originalname: string | undefined;
//         // Handle file upload
//         if (req.file) {
//             fileBuffer = req.file.buffer;
//             originalname = req.file.originalname;
//             console.log('File prepared for service:', { 
//                 hasBuffer: !!fileBuffer, 
//                 bufferLength: fileBuffer?.length,
//                 originalname 
//             });
//         } else {
//             console.log('No file available to pass to service');
//         }
//         const category = await CategoryService.AddCategoryService(name.trim(), fileBuffer, originalname);
//         console.log('Final response from service:', category);
//         res.status(201).json({ 
//             success: true, 
//             category, 
//             message: 'Category created successfully' 
//         });
//     } catch (error: any) {
//         console.error('Error adding category:', error.message);
//         res.status(400).json({ 
//             success: false, 
//             message: error.message 
//         });
//     }
// };
const GetCategoriesController = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const search = req.query.search || '';
        const status = req.query.status || 'all';
        const result = await CategoryService.GetCategoryService(page, limit, search, status);
        res.status(200).json({
            success: true,
            categories: result.categories,
            totalCategories: result.totalCategories,
            totalPages: result.totalPages,
            currentPage: result.currentPage
        });
    }
    catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.GetCategoriesController = GetCategoriesController;
// Delete Category
const DeleteCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
            return;
        }
        const result = await CategoryService.DeleteCategoryService(categoryId);
        res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.error('Error deleting category:', error.message);
        // More specific error handling
        if (error.message.includes('not found')) {
            res.status(404).json({
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
exports.DeleteCategoryController = DeleteCategoryController;
// Update Category
const UpdateCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, vendorId } = req.body; // Add vendorId from request body
        if (!categoryId) {
            res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
            return;
        }
        if (!name || name.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
            return;
        }
        let fileBuffer;
        let originalname;
        if (req.file) {
            fileBuffer = req.file.buffer;
            originalname = req.file.originalname;
        }
        const updatedCategory = await CategoryService.UpdateCategoryService(categoryId, name.trim(), vendorId, // Pass vendorId to service
        fileBuffer, originalname);
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category: updatedCategory
        });
    }
    catch (error) {
        console.error('Error updating category:', error.message);
        if (error.message.includes('already exists')) {
            res.status(409).json({
                success: false,
                message: error.message
            });
        }
        else if (error.message.includes('not found')) {
            res.status(404).json({
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
exports.UpdateCategoryController = UpdateCategoryController;
/////////////////////////////////////////////////////////////////
// Users Department 
const getCategoriesUserController = async (req, res) => {
    try {
        const { search } = req.query;
        const result = await CategoryService.getCategoriesUserService(search);
        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            categories: result.categories,
            totalCategories: result.totalCategories
        });
    }
    catch (error) {
        console.error('Error fetching categories for user:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getCategoriesUserController = getCategoriesUserController;
//////////////////////////////////////////////////////////
// vendor department
// Add Category for Vendor
const addVendorCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const vendorId = req.vendor?.vendorId;
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }
        let fileBuffer;
        let originalname;
        // Handle file upload if present
        if (req.file) {
            fileBuffer = req.file.buffer;
            originalname = req.file.originalname;
        }
        const category = await CategoryService.AddVendorCategoryService(name, vendorId, fileBuffer, originalname);
        res.status(201).json({
            success: true,
            message: 'Category added successfully',
            category
        });
    }
    catch (error) {
        console.error('Error in addVendorCategory:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.addVendorCategory = addVendorCategory;
// Get Vendor Categories
const getVendorCategories = async (req, res) => {
    try {
        const vendorId = req.vendor?.vendorId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || 'all';
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        const result = await CategoryService.GetVendorCategoriesService(vendorId, page, limit, search, status);
        res.status(200).json({
            success: true,
            ...result
        });
    }
    catch (error) {
        console.error('Error in getVendorCategories:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getVendorCategories = getVendorCategories;
// Delete Vendor Category
const deleteVendorCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const vendorId = req.vendor?.vendorId;
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        const result = await CategoryService.DeleteVendorCategoryService(categoryId, vendorId);
        res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.error('Error in deleteVendorCategory:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.deleteVendorCategory = deleteVendorCategory;
// Update Vendor Category
const updateVendorCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;
        const vendorId = req.vendor?.vendorId;
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }
        let fileBuffer;
        let originalname;
        // Handle file upload if present
        if (req.file) {
            fileBuffer = req.file.buffer;
            originalname = req.file.originalname;
        }
        const category = await CategoryService.UpdateVendorCategoryService(categoryId, name, vendorId, fileBuffer, originalname);
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    }
    catch (error) {
        console.error('Error in updateVendorCategory:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateVendorCategory = updateVendorCategory;
// Get Single Vendor Category
const getVendorCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const vendorId = req.vendor?.vendorId;
        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }
        const category = await CategoryService.GetVendorCategoryByIdService(categoryId, vendorId);
        res.status(200).json({
            success: true,
            category
        });
    }
    catch (error) {
        console.error('Error in getVendorCategoryById:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getVendorCategoryById = getVendorCategoryById;
