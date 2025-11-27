import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";

import { getCategories } from '../../../../Utils/categoryService';

export function AddProductVendorModal({ open, setOpen, saveProduct, onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
    originalPrice: '',
    category: '',
    color: '',
    productImg: null // CHANGED: from 'image' to 'productImg'
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch categories when modal opens
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await getCategories(1, 1000); 
        console.log("Categories API response:", data);

        if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.warn("Unexpected API response structure:", data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error loading categories:", error.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadCategories();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          productImg: 'Please select an image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          productImg: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        productImg: file // CORRECT: matches state field name
      }));

      // Clear image error
      if (errors.productImg) {
        setErrors(prev => ({
          ...prev,
          productImg: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Debug: Log form data before sending
      console.log('Form data before submission:', formData);
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'productImg' && formData[key]) { // CHANGED: from 'image' to 'productImg'
          submitData.append('productImg', formData[key]); // CHANGED: from 'image' to 'productImg'
          console.log('File appended:', formData[key].name);
        } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          submitData.append(key, formData[key].toString());
          console.log('Field appended:', key, formData[key]);
        }
      });

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      await saveProduct(submitData);
      
      // Reset form on successful submission
      setFormData({
        name: '',
        description: '',
        stock: '',
        price: '',
        originalPrice: '',
        category: '',
        color: '',
        productImg: null // CHANGED: from 'image' to 'productImg'
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      stock: '',
      price: '',
      originalPrice: '',
      category: '',
      color: '',
      productImg: null // CHANGED: from 'image' to 'productImg'
    });
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      handler={handleClose}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.0, y: -100 },
      }}
      className='border-2 border-gray-300 h-[calc(100vh)] overflow-y-scroll'
      size="lg"
    >
      <div className='p-6'>
        <DialogHeader>
          <div className="flex justify-between w-full items-center">
            <span className="text-xl font-bold">Add New Product</span>
            <Button
              variant="text"
              color="black"
              onClick={handleClose}
              className="p-0 text-sm"
            >
              X
            </Button>
          </div>
        </DialogHeader>
        
        <DialogBody>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-h-[600px] overflow-y-auto pr-2">
            {/* 1. General Info */}
            <label className="text-sm font-medium mt-2">1. General Info</label>
            <div className="space-y-3">
              <div>
                <Input
                  type="text"
                  name="name"
                  label="Product Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  className="w-full"
                />
                {errors.name && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.name}
                  </Typography>
                )}
              </div>
              <div>
                <Textarea
                  name="description"
                  label="Description *"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  rows="3"
                />
                {errors.description && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.description}
                  </Typography>
                )}
              </div>
            </div>

            {/* 2. Stock */}
            <label className="text-sm font-medium mt-2">2. Stock</label>
            <div>
              <Input
                type="number"
                name="stock"
                label="Stock Quantity *"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                error={!!errors.stock}
              />
              {errors.stock && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.stock}
                </Typography>
              )}
            </div>

            {/* 3. Pricing */}
            <label className="text-sm font-medium mt-2">3. Pricing</label>
            <div className="space-y-3">
              <Input
                type="number"
                name="originalPrice"
                label="Original Price (AED)"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="Optional"
              />
              <div>
                <Input
                  type="number"
                  name="price"
                  label="Sale Price (AED) *"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  error={!!errors.price}
                  required
                />
                {errors.price && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.price}
                  </Typography>
                )}
              </div>
            </div>

            {/* 4. Category */}
            <label className="text-sm font-medium mt-2">4. Category</label>
            <div>
              <select
                className='w-full bg-gray-100 text-[#1f1f1f] h-12 rounded-sm border border-gray-300 px-3'
                onChange={handleInputChange}
                value={formData.category}
                name="category"
                disabled={loading}
              >
                <option value="" className='text-gray-500 text-xs font-normal'>
                  {loading ? 'Loading categories...' : 'Select a category'}
                </option>
                {categories.map((category, index) => (
                  <option key={category._id || index} value={category._id} className='text-xs font-normal'>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.category}
                </Typography>
              )}
            </div>

            {/* 5. Color */}
            <label className="text-sm font-medium mt-2">5. Color</label>
            <div>
              <Input
                type="text"
                name="color"
                label="Color *"
                value={formData.color}
                onChange={handleInputChange}
                error={!!errors.color}
              />
              {errors.color && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.color}
                </Typography>
              )}
            </div>

            {/* 6. Media */}
            <label className="text-sm font-medium mt-2">6. Media</label>
            <div>
              <Input
                type="file"
                name="productImg" // CORRECT: matches Multer field name
                onChange={handleFileChange}
                accept="image/*"
                label="Product Image"
                className="w-full"
              />
              {errors.productImg && ( // CHANGED: from 'image' to 'productImg'
                <Typography variant="small" color="red" className="mt-1">
                  {errors.productImg} {/* CHANGED: from 'image' to 'productImg' */}
                </Typography>
              )}
              {formData.productImg && ( // CHANGED: from 'image' to 'productImg'
                <Typography variant="small" color="green" className="mt-1">
                  {formData.productImg.name} selected {/* CHANGED: from 'image' to 'productImg' */}
                </Typography>
              )}
            </div>

            {/* Optional: Brand field if needed */}
            <label className="text-sm font-medium mt-2">7. Brand (Optional)</label>
            <Input
              type="text"
              name="brand"
              label="Brand"
              onChange={handleInputChange}
              placeholder="Optional"
            />

            {/* Optional: Model field if needed */}
            <label className="text-sm font-medium mt-2">8. Model (Optional)</label>
            <Input
              type="text"
              name="model"
              label="Model"
              onChange={handleInputChange}
              placeholder="Optional"
            />
          </form>
        </DialogBody>

        <DialogFooter className='mt-5 flex justify-between'>
          <Button
            variant="outlined"
            color="red"
            onClick={handleClose}
            className="px-6 py-2"
            disabled={loading}
          >
            <span>CANCEL</span>
          </Button>
          <Button
            className='bg-green-900 text-white px-6 py-2 rounded-md'
            onClick={handleSubmit}
            disabled={loading}
          >
            <span>{loading ? 'SAVING...' : 'SAVE PRODUCT'}</span>
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

AddProductVendorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveProduct: PropTypes.func.isRequired,
  onProductAdded: PropTypes.func,
};