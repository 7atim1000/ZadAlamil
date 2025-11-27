import Product from './product.model';
import Category from '../categories/category.model';
import Order from '../order/order.model';
import {ProductResponse, AddProductRequest} from './product.interface';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer: Buffer, originalname: string): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'categories',
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
          public_id: `category-${Date.now()}-${Math.random().toString(36).substring(7)}`
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload image to cloud storage'));
          } else if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Cloudinary upload failed: No result returned'));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to cloud storage');
  }
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return;
    }

    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const publicId = filenameWithExtension.split('.')[0];
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw error to avoid breaking the main operation
  }
};



// Admin DEPARTMENT
// add product for admin
export const addProductService = async(
  productData: AddProductRequest, 
  fileBuffer?: Buffer, 
  originalname?: string
): Promise<ProductResponse> => {
    try {
        // For debug
        console.log('AddProductService called with:', { 
            productData, 
            hasFile: !!fileBuffer, 
            originalname 
        });

        // Check if product already exists for this vendor
        const existingProduct = await Product.findOne({ 
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
        } else {
            console.log('No file provided for upload');
        }

        const newProduct = new Product({
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
        

    } catch (error: any) {
        console.error('Error in addProductService:', error.message);
        throw new Error(error.message); 
    }
};


// get products for admin
export const getProductsService = async(
    page: number = 1, 
    limit: number = 10, 
    search: string = '',
    category: string = 'all'
): Promise<{ products: ProductResponse[]; totalProducts: number; totalPages: number; currentPage: number }> => {
    try {
        const skip = (page - 1) * limit;
    
        // Build query
        let query: any = {};
    
        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by category
        if (category !== 'all') {
            query.category = category;
        }

        // Get products with pagination and populate category & vendor
        const products = await Product.find(query)
            .populate('category', 'name') // Populate category name
            .populate('vendor', 'name email companyName') // Populate vendor details
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v')
            .lean();

        // Get total count for pagination
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Transform products
        const transformedProducts: ProductResponse[] = products.map(product => ({
            _id: product._id.toString(),
            name: product.name,
            category: product.category, // This will have { _id, name } from populate
            // vendor: product.vendor ? {
            //     _id: product.vendor._id?.toString(),
            //     name: product.vendor.name,
            //     email: product.vendor.email,
            //     companyName: product.vendor.companyName
            // } : null,
            vendor: (product.vendor as any)?._id?.toString() || '', // Type assertion
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

    } catch (error: any) {
        throw new Error(error.message);
    }
};


// Get Product by ID for admin
export const getProductByIdService = async (productId: string): Promise<ProductResponse> => {
  try {
    const product = await Product.findById(productId)
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

  } catch (error: any) {
    throw new Error(error.message);
  }
};



// Update Product for admin
export const updateProductService = async (
    productId: string,
    productData: Partial<AddProductRequest>,
    fileBuffer?: Buffer, 
    originalname?: string
): Promise<ProductResponse> => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        // Check if name already exists (excluding current product)
        if (productData.name && productData.name !== product.name) {
            const existingProduct = await Product.findOne({
                name: productData.name,
                _id: { $ne: productId }
            });

            if (existingProduct) {
                throw new Error('Product with this name already exists');
            }
        }

        // Update fields
        if (productData.name) product.name = productData.name;
        if (productData.category) product.category = productData.category;
        if (productData.vendor) product.vendor = productData.vendor;

        if (productData.originalPrice !== undefined) product.originalPrice = productData.originalPrice;
        if (productData.price !== undefined) product.price = productData.price;
        
        if (productData.stock !== undefined) product.stock = productData.stock;
        if (productData.description !== undefined) product.description = productData.description;
        if (productData.color !== undefined) product.color = productData.color;

        if (fileBuffer && originalname) {
            // Upload new image to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);

            // Delete old image from Cloudinary if exists
            if (product.productImg) {
                await deleteFromCloudinary(product.productImg);
            }

            product.productImg = cloudinaryUrl;
        };

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

    } catch (error: any) {
        throw new Error(error.message);
    }
};



// Delete Product for admin
export const deleteProductService = async (productId: string): Promise<{ message: string }> => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        // Delete product image file if exists
        if (product.productImg) {
            await deleteFromCloudinary(product.productImg);
        }

        await Product.findByIdAndDelete(productId);

        return { message: 'Product deleted successfully' };

    } catch (error: any) {
        throw new Error(error.message);
    }
};




///////////////////////////////////////////////////////////////
// USER DEPARTMENT  Get products depend on categories for users 

export const getProductsByCategoryService = async (categoryId: string, search?: string): Promise<{ products: ProductResponse[]; totalProducts: number; category: any }> => {
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
    const products = await Product.find(filter)
      .select('_id name description price originalPrice stock color productImg status category createdAt updatedAt')
      .populate('category', 'name _id') // Populate category name
      .sort({ createdAt: -1 })
      .lean();

    const totalProducts = await Product.countDocuments(filter);
     // Get category details separately to ensure we have the name
    const category = await Category.findById(categoryId).select('name _id');

    return {
      products: products as ProductResponse[],
      totalProducts,
      category: category
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};


////////////////////////////////////////////////////////////
/// Vendor Department
// Vendor Add Product
export const addVendorProductService = async(
  productData: AddProductRequest, 
  vendorId: string,
  fileBuffer?: Buffer, 
  originalname?: string
): Promise<ProductResponse> => {
    try {
        console.log('AddVendorProductService called with:', { 
            productData, 
            vendorId, 
            hasFile: !!fileBuffer, 
            originalname 
        });

        // Check if product already exists for this vendor
        const existingProduct = await Product.findOne({ 
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
        } else {
            console.log('No file provided for upload');
        }

        const newProduct = new Product({
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
        

    } catch (error: any) {
        console.error('Error in addVendorProductService:', error.message);
        throw new Error(error.message); 
    }
};

// Get products for vendor (only their products)
export const getVendorProductsService = async(
  vendorId: string,
  page: number = 1, 
  limit: number = 10, 
  search: string = '',
  category: string = 'all'
): Promise<{ 
  products: ProductResponse[]; 
  totalProducts: number; 
  totalPages: number; 
  currentPage: number 
}> => {
    try {
        const skip = (page - 1) * limit;
    
        // Build query - always filter by vendorId
        let query: any = { vendor: vendorId };
    
        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by category
        if (category !== 'all') {
            query.category = category;
        }

        // Get products with pagination and populate category
        const products = await Product.find(query)
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v')
            .lean();

        // Get total count for pagination
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Transform products
        const transformedProducts: ProductResponse[] = products.map(product => ({
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

    } catch (error: any) {
        throw new Error(error.message);
    }
};


// Get Vendor Product by ID (only if they own it)
export const getVendorProductByIdService = async (
  productId: string, 
  vendorId: string
): Promise<ProductResponse> => {
  try {
    const product = await Product.findOne({ _id: productId, vendor: vendorId })
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

  } catch (error: any) {
    throw new Error(error.message);
  }
};


// Update Product for vendor (only if they own it)
export const updateVendorProductService = async (
    productId: string,
    productData: Partial<AddProductRequest>,
    vendorId: string,
    fileBuffer?: Buffer, 
    originalname?: string
): Promise<ProductResponse> => {
    try {
        const product = await Product.findOne({ _id: productId, vendor: vendorId });

        if (!product) {
            throw new Error('Product not found or you do not have permission to update it');
        }

        // Check if name already exists for this vendor (excluding current product)
        if (productData.name && productData.name !== product.name) {
            const existingProduct = await Product.findOne({
                name: productData.name,
                vendor: vendorId,
                _id: { $ne: productId }
            });

            if (existingProduct) {
                throw new Error('Product with this name already exists in your store');
            }
        }

        // Update fields
        if (productData.name) product.name = productData.name;
        if (productData.category) product.category = productData.category;
        // vendor should not be updated - it's fixed to the authenticated vendor

        if (productData.originalPrice !== undefined) product.originalPrice = productData.originalPrice;
        if (productData.price !== undefined) product.price = productData.price;
        if (productData.stock !== undefined) product.stock = productData.stock;
        if (productData.description !== undefined) product.description = productData.description;
        if (productData.color !== undefined) product.color = productData.color;

        if (fileBuffer && originalname) {
            // Upload new image to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);

            // Delete old image from Cloudinary if exists
            if (product.productImg) {
                await deleteFromCloudinary(product.productImg);
            }

            product.productImg = cloudinaryUrl;
        };

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

    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Delete Product for vendor (only if they own it)
export const deleteVendorProductService = async (
  productId: string, 
  vendorId: string
): Promise<{ message: string }> => {
    try {
        const product = await Product.findOne({ _id: productId, vendor: vendorId });

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

        await Product.findByIdAndDelete(productId);

        return { message: 'Product deleted successfully' };

    } catch (error: any) {
        throw new Error(error.message);
    }
};


// Get vendor product statistics
export const getVendorProductStatsService = async (vendorId: string) => {
    try {
        const totalProducts = await Product.countDocuments({ vendor: vendorId });
        const listedProducts = await Product.countDocuments({ vendor: vendorId, status: 'LIST' });
        const outOfStockProducts = await Product.countDocuments({ vendor: vendorId, stock: 0 });
        
        // Get top selling products
        const topSellingProducts = await Product.find({ vendor: vendorId })
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
    } catch (error: any) {
        throw new Error(error.message);
    }
};







