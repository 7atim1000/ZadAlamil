import Category from './category.model';
import Product from '../products/product.model';
import { CategoryResponse, ICategory } from './category.interface';
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



// Admin Department - Add Category with Vendor field
export const AddCategoryService = async (
  name: string,
  vendorId: string, // Add vendorId parameter
  fileBuffer?: Buffer,
  originalname?: string
): Promise<CategoryResponse> => {
  try {
    console.log('AddCategoryService called with:', {
      name,
      vendorId,
      hasFile: !!fileBuffer,
      originalname
    });

    // Check if category already exists for this vendor
    const existingCategory = await Category.findOne({
      name,
      vendor: vendorId
    });

    if (existingCategory) {
      throw new Error(`Sorry ${name} already exists for this vendor`);
    }

    // Generate random sales value (0-100) as per frontend requirement
    const sales = Math.floor(Math.random() * 101);

    let cloudinaryUrl = '';

    // If file buffer is provided, upload to Cloudinary
    if (fileBuffer && originalname) {
      console.log('Uploading file to Cloudinary...');
      cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);
      console.log('Cloudinary URL received:', cloudinaryUrl);
    } else {
      console.log('No file provided for upload');
    }

    const newCategory = new Category({
      name,
      categoryImg: cloudinaryUrl,
      sales,
      vendor: vendorId // Add vendor field
    });

    const savedCategory = await newCategory.save();
    console.log('Category saved to database:', savedCategory);

    // Populate vendor information if needed
    await savedCategory.populate('vendor', 'name email companyName');

    return {
      _id: savedCategory._id.toString(),
      name: savedCategory.name,
      categoryImg: savedCategory.categoryImg,
      status: savedCategory.status,
      sales: savedCategory.sales,
      vendor: savedCategory.vendor, // Include vendor info in response
      createdAt: savedCategory.createdAt,
      updatedAt: savedCategory.updatedAt
    };

  } catch (error: any) {
    console.error('Error in AddCategoryService:', error);
    throw new Error(error.message);
  }
};


// Get categories for admin
export const GetCategoryService = async (page: number = 1, limit: number = 10, search: string = '', status: string = 'all'): Promise<{ categories: CategoryResponse[];  totalCategories: number; totalPages: number; currentPage: number }> => {
 
    try {
    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    // Filter by status
    if (status !== 'all' && ['LIST', 'UNLIST'].includes(status)) {
      query.status = status;
    }

    // Get categories with pagination
    const categories = await Category.find(query)
      .populate('vendor', 'name email companyName') // Populate category name
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean();
      

    // Get total count for pagination
    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);

    // Transform categories - URLs are already Cloudinary URLs
    const transformedCategories: CategoryResponse[] = categories.map(category => ({
      _id: category._id.toString(),
      name: category.name,
      categoryImg: category.categoryImg || '',
      status: category.status,
      vendor: category.vendor,
      sales: category.sales,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));

    return {
      categories: transformedCategories,
      totalCategories,
      totalPages,
      currentPage: page
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Delete Category for admin
export const DeleteCategoryService = async (categoryId: string): Promise<{ message: string }> => {
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    // Delete category image from Cloudinary if exists
    if (category.categoryImg) {
      await deleteFromCloudinary(category.categoryImg);
    }

    await Category.findByIdAndDelete(categoryId);

    return { message: 'Category deleted successfully' };

  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Update Category for admin
export const UpdateCategoryService = async (
  categoryId: string, 
  name: string, 
  vendorId?: string, // Add vendorId parameter
  fileBuffer?: Buffer, 
  originalname?: string
): Promise<CategoryResponse> => {
  try {
    const category = await Category.findById(categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if name already exists for the same vendor (excluding current category)
    const existingCategory = await Category.findOne({ 
      name, 
      vendor: vendorId || category.vendor, // Use new vendorId or keep current
      _id: { $ne: categoryId } 
    });
    
    if (existingCategory) {
      throw new Error('Category with this name already exists for this vendor');
    }

    // Update fields
    category.name = name;
    
    // Update vendor if provided
    if (vendorId) {
      category.vendor = vendorId;
    }
    
    if (fileBuffer && originalname) {
      // Upload new image to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);
      
      // Delete old image from Cloudinary if exists
      if (category.categoryImg) {
        await deleteFromCloudinary(category.categoryImg);
      }
      
      category.categoryImg = cloudinaryUrl;
    };

    const updatedCategory = await category.save();
    
    // Populate vendor information
    await updatedCategory.populate('vendor', 'name email companyName');

    return {
      _id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      categoryImg: updatedCategory.categoryImg,
      status: updatedCategory.status,
      sales: updatedCategory.sales,
      vendor: updatedCategory.vendor, // Include vendor in response
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
// Users Department
// Get categories for users
export const getCategoriesUserService = async (search?: string): Promise<{ 
  categories: CategoryResponse[]; 
  totalCategories: number 
}> => {
  try {
    // Build search query
    const searchFilter = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ]
    } : {};

    // Only fetch categories with LIST status for users
    const statusFilter = { status: 'LIST' };

    // Combine filters
    const filter = {
      ...statusFilter,
      ...searchFilter
    };

    // Get categories with search and status filter
    const categories = await Category.find(filter)
      .select('_id name categoryImg status sales createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    const totalCategories = await Category.countDocuments(filter);

    // Transform categories - Cloudinary URLs are ready to use
    const transformedCategories: CategoryResponse[] = categories.map(category => ({
      _id: category._id.toString(),
      name: category.name,
      categoryImg: category.categoryImg || '',
      status: category.status,
      vendor: category.vendor,
      sales: category.sales,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));

    return {
      categories: transformedCategories,
      totalCategories
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};


//////////////////////////////////////////////////////////
// Vendor department
// Vendor Add Category
export const AddVendorCategoryService = async (
  name: string, 
  vendorId: string,
  fileBuffer?: Buffer, 
  originalname?: string
): Promise<CategoryResponse> => {
  try {
    console.log('AddVendorCategoryService called with:', { name, vendorId, hasFile: !!fileBuffer, originalname });

    // Check if category with same name exists for this vendor
    const existingCategory = await Category.findOne({ name, vendor: vendorId });
    if (existingCategory) {
      throw new Error(`Sorry ${name} already exists for your store`);
    }

    // Generate random sales value (0-100) as per frontend requirement
    const sales = Math.floor(Math.random() * 101);

    let cloudinaryUrl = '';
    
    // If file buffer is provided, upload to Cloudinary
    if (fileBuffer && originalname) {
      console.log('Uploading file to Cloudinary...');
      cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);
      console.log('Cloudinary URL received:', cloudinaryUrl);
    } else {
      console.log('No file provided for upload');
    }

    const newCategory = new Category({
      name,
      categoryImg: cloudinaryUrl,
      sales,
      vendor: vendorId // Add vendor reference
    });

    const savedCategory = await newCategory.save();
    console.log('Category saved to database:', savedCategory);
    
    return {
      _id: savedCategory._id.toString(),
      name: savedCategory.name,
      categoryImg: savedCategory.categoryImg,
      status: savedCategory.status,
      sales: savedCategory.sales,
      createdAt: savedCategory.createdAt,
      updatedAt: savedCategory.updatedAt,
      vendor: savedCategory.vendor // Include vendor info if needed
    };

  } catch (error: any) {
    console.error('Error in AddVendorCategoryService:', error);
    throw new Error(error.message);
  }
};


// Get categories for vendor (only their categories)
export const GetVendorCategoriesService = async (
  vendorId: string,
  page: number = 1, 
  limit: number = 10, 
  search: string = '', 
  status: string = 'all'
): Promise<{ 
  categories: CategoryResponse[];  
  totalCategories: number; 
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
    
    // Filter by status
    if (status !== 'all' && ['LIST', 'UNLIST'].includes(status)) {
      query.status = status;
    }

    // Get categories with pagination
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean();

    // Get total count for pagination
    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);

    // Transform categories
    const transformedCategories: CategoryResponse[] = categories.map(category => ({
      _id: category._id.toString(),
      name: category.name,
      categoryImg: category.categoryImg || '',
      status: category.status,
      sales: category.sales,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      vendor: category.vendor // Include vendor info
    }));

    return {
      categories: transformedCategories,
      totalCategories,
      totalPages,
      currentPage: page
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};


// Delete Category for vendor (only if they own it)
export const DeleteVendorCategoryService = async (
  categoryId: string, 
  vendorId: string
): Promise<{ message: string }> => {
  try {
    const category = await Category.findOne({ _id: categoryId, vendor: vendorId });

    if (!category) {
      throw new Error('Category not found or you do not have permission to delete it');
    }

    // Check if category has associated products
    const productCount = await Product.countDocuments({ category: categoryId, vendor: vendorId });
    if (productCount > 0) {
      throw new Error(`Cannot delete category. There are ${productCount} products associated with this category. Please delete or reassign the products first.`);
    }

    // Delete category image from Cloudinary if exists
    if (category.categoryImg) {
      await deleteFromCloudinary(category.categoryImg);
    }

    await Category.findByIdAndDelete(categoryId);

    return { message: 'Category deleted successfully' };

  } catch (error: any) {
    throw new Error(error.message);
  }
};


// Update Category for vendor (only if they own it)
export const UpdateVendorCategoryService = async (
  categoryId: string, 
  name: string,
  vendorId: string,
  fileBuffer?: Buffer, 
  originalname?: string
): Promise<CategoryResponse> => {
  try {
    const category = await Category.findOne({ _id: categoryId, vendor: vendorId });
    
    if (!category) {
      throw new Error('Category not found or you do not have permission to update it');
    }

    // Check if name already exists for this vendor (excluding current category)
    const existingCategory = await Category.findOne({ 
      name, 
      vendor: vendorId,
      _id: { $ne: categoryId } 
    });
    
    if (existingCategory) {
      throw new Error('Category with this name already exists in your store');
    }

    // Update fields
    category.name = name;
    
    if (fileBuffer && originalname) {
      // Upload new image to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(fileBuffer, originalname);
      
      // Delete old image from Cloudinary if exists
      if (category.categoryImg) {
        await deleteFromCloudinary(category.categoryImg);
      }
      
      category.categoryImg = cloudinaryUrl;
    };

    const updatedCategory = await category.save();

    return {
      _id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      categoryImg: updatedCategory.categoryImg,
      status: updatedCategory.status,
      sales: updatedCategory.sales,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt,
      vendor: updatedCategory.vendor
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};


// Get single category for vendor (only if they own it)
export const GetVendorCategoryByIdService = async (
  categoryId: string, 
  vendorId: string
): Promise<CategoryResponse> => {
  try {
    const category = await Category.findOne({ _id: categoryId, vendor: vendorId }).lean();

    if (!category) {
      throw new Error('Category not found or you do not have permission to access it');
    }

    return {
      _id: category._id.toString(),
      name: category.name,
      categoryImg: category.categoryImg || '',
      status: category.status,
      sales: category.sales,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      vendor: category.vendor
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};


