import { Request, Response } from 'express' ;
import * as ProductService from './product.service' ;
import { AddProductRequest } from './product.interface';

// Admin Department
// Add Product for admin
export const addProductController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, originalPrice, price, stock, description, color, vendor } = req.body;
    
    // For Image
    let fileBuffer: Buffer | undefined;
    let originalname: string | undefined;

    // Handle file upload
    if (req.file) {
      fileBuffer = req.file.buffer;
      originalname = req.file.originalname;
      console.log('File prepared for service:', {
        hasBuffer: !!fileBuffer,
        bufferLength: fileBuffer?.length,
        originalname
      });
    } else {
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

    const productData: AddProductRequest = {
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

  } catch (error: any) {
    console.error('Error adding product:', error.message);
    
    // Handle specific error cases
    if (error.message.includes('already exists')) {
        res.status(409).json({ 
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

// Get Products for admin
export const getProductsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || 'all';

    const result = await ProductService.getProductsService(page, limit, search, category);

    res.status(200).json({
      success: true,
      products: result.products,
      totalProducts: result.totalProducts,
      totalPages: result.totalPages,
      currentPage: result.currentPage
    });

  } catch (error: any) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({success: false,message: error.message});
  }
};


// Get Product by ID  for admin
export const getProductByIdController = async (req: Request, res: Response): Promise<void> => {

  try {
    const { productId } = req.params;

    const product = await ProductService.getProductByIdService(productId);

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error: any) {
    console.error('Error fetching product:', error.message);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};


// Update Product for admin
export const updateProductController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { name, category, originalPrice, price, stock, description, color, vendor } = req.body;
    
    let fileBuffer: Buffer | undefined;
    let originalname: string | undefined;

    if (req.file) {
      fileBuffer = req.file.buffer;
      originalname = req.file.originalname;
    }

    const productData: Partial<AddProductRequest> = {};
    if (name) productData.name = name;
    if (category) productData.category = category;
    if (vendor) productData.vendor = vendor;
    if (originalPrice) productData.originalPrice = parseFloat(originalPrice);
    if (price) productData.price = parseFloat(price);
    if (stock) productData.stock = parseInt(stock);
    if (description !== undefined) productData.description = description;
    if (color !== undefined) productData.color = color;

    const updatedProduct = await ProductService.updateProductService(productId, productData, fileBuffer, originalname);

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating product:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Delete Product for admin
export const deleteProductController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    const result = await ProductService.deleteProductService(productId);

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error: any) {
    console.error('Error deleting product:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};




////////////////////////////////////////////////
// User Department

export const getProductsByCategoryController = async (req: Request, res: Response): Promise<void> => {
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

    const result = await ProductService.getProductsByCategoryService(categoryId, search as string);

      res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        products: result.products,
    
        totalProducts: result.totalProducts,
        categoryId: categoryId,
        category: result.category?.name || 'Products' // Add category name here
      });

  } catch (error: any) {
    console.error('Error fetching products by category:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


///////////////////////////////////////////////////////////////////
// Vendor department
// Add Product for Vendor
export const addVendorProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, stock, price, originalPrice, category, color, brand, model } = req.body;
    const vendorId = (req as any).vendor?.vendorId;

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

    let fileBuffer: Buffer | undefined;
    let originalname: string | undefined;

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
    } else {
      console.log('No file uploaded in vendor product controller');
    }

    const productData: AddProductRequest = {
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

  } catch (error: any) {
    console.error('Error in addVendorProduct controller:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get Vendor Products
export const getVendorProducts = async (req: Request, res: Response) => {
    try {
        const vendorId = (req as any).vendor?.vendorId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';
        const category = (req.query.category as string) || 'all';

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

    } catch (error: any) {
        console.error('Error in getVendorProducts:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Get Single Vendor Product
export const getVendorProductById = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const vendorId = (req as any).vendor?.vendorId;

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

    } catch (error: any) {
        console.error('Error in getVendorProductById:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Update Vendor Product
export const updateVendorProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const productData = req.body;
        const vendorId = (req as any).vendor?.vendorId;

        if (!vendorId) {
            return res.status(401).json({
                success: false,
                message: 'Vendor authentication required'
            });
        }

        let fileBuffer: Buffer | undefined;
        let originalname: string | undefined;

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

    } catch (error: any) {
        console.error('Error in updateVendorProduct:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Delete Vendor Product
export const deleteVendorProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const vendorId = (req as any).vendor?.vendorId;

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

    } catch (error: any) {
        console.error('Error in deleteVendorProduct:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get Vendor Product Statistics
export const getVendorProductStats = async (req: Request, res: Response) => {
    try {
        const vendorId = (req as any).vendor?.vendorId;

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

    } catch (error: any) {
        console.error('Error in getVendorProductStats:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};







