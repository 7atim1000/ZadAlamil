import { Request, Response  } from "express";
import * as CategoryService from './category.service';

// Admin Department 
export const AddCategoryController = async (req: Request, res: Response) => {
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

    let fileBuffer: Buffer | undefined;
    let originalname: string | undefined;

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

  } catch (error: any) {
    console.error('Error in addCategoryController:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


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

export const GetCategoriesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
        const search = (req.query.search as string) || '';
        const status = (req.query.status as string) || 'all';

        const result = await CategoryService.GetCategoryService(page, limit, search, status);
        
        res.status(200).json({
            success: true,
            categories: result.categories,
            totalCategories: result.totalCategories,
            totalPages: result.totalPages,
            currentPage: result.currentPage
        });
        
    } catch (error: any) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({
            success: false, 
            message: error.message 
        });
    }
};

// Delete Category
export const DeleteCategoryController = async (req: Request, res: Response): Promise<void> => {
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

    } catch (error: any) {
        console.error('Error deleting category:', error.message);
        
        // More specific error handling
        if (error.message.includes('not found')) {
            res.status(404).json({
                success: false, 
                message: error.message
            });
        } else {
            res.status(400).json({
                success: false, 
                message: error.message
            });
        }
    }
};

// Update Category
export const UpdateCategoryController = async (req: Request, res: Response): Promise<void> => {
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

        let fileBuffer: Buffer | undefined;
        let originalname: string | undefined;

        if (req.file) {
            fileBuffer = req.file.buffer;
            originalname = req.file.originalname;
        }

        const updatedCategory = await CategoryService.UpdateCategoryService(
            categoryId, 
            name.trim(), 
            vendorId, // Pass vendorId to service
            fileBuffer, 
            originalname
        );

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category: updatedCategory
        });

    } catch (error: any) {
        console.error('Error updating category:', error.message);
        
        if (error.message.includes('already exists')) {
            res.status(409).json({
                success: false,
                message: error.message
            });
        } else if (error.message.includes('not found')) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

/////////////////////////////////////////////////////////////////
// Users Department 
export const getCategoriesUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search } = req.query;

        const result = await CategoryService.getCategoriesUserService(search as string);

        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            categories: result.categories,
            totalCategories: result.totalCategories
        });

    } catch (error: any) {
        console.error('Error fetching categories for user:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//////////////////////////////////////////////////////////
// vendor department
// Add Category for Vendor
export const addVendorCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const vendorId = (req as any).vendor?.vendorId;

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

    let fileBuffer: Buffer | undefined;
    let originalname: string | undefined;

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

  } catch (error: any) {
    console.error('Error in addVendorCategory:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Get Vendor Categories
export const getVendorCategories = async (req: Request, res: Response) => {
  try {
    const vendorId = (req as any).vendor?.vendorId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || 'all';

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

  } catch (error: any) {
    console.error('Error in getVendorCategories:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// Delete Vendor Category
export const deleteVendorCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const vendorId = (req as any).vendor?.vendorId;

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

  } catch (error: any) {
    console.error('Error in deleteVendorCategory:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update Vendor Category
export const updateVendorCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const vendorId = (req as any).vendor?.vendorId;

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

    let fileBuffer: Buffer | undefined;
    let originalname: string | undefined;

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

  } catch (error: any) {
    console.error('Error in updateVendorCategory:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Vendor Category
export const getVendorCategoryById = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const vendorId = (req as any).vendor?.vendorId;

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

  } catch (error: any) {
    console.error('Error in getVendorCategoryById:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

