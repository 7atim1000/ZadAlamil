import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from "@material-tailwind/react";

export function EditCategoryVendorModal({ open, setOpen, saveCategory, category }) {
  const [formData, setFormData] = useState({
    name: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when category changes or modal opens
  useEffect(() => {
    if (category && open) {
      setFormData({
        name: category.name || '',
        image: null // Reset image to allow new upload
      });
    }
  }, [category, open]);

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
          image: 'Please select an image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
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
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          submitData.append('image', formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key].toString());
        }
      });

      console.log('Updating category with data:', {
        name: formData.name,
        hasNewImage: !!formData.image
      });

      await saveCategory(submitData);
      
    } catch (error) {
      console.error('Error in form submission:', error);
      throw error; // Re-throw to handle in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      image: null
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
      className='border-2 border-gray-300 overflow-y-scroll h-[calc(100vh)]'
      size="md"
    >
      <div className='p-6'>
        <DialogHeader>
          <div className="flex justify-between w-full items-center">
            <span className="text-xl font-bold">Edit Category</span>
            <Button
              variant="text"
              color="black"
              onClick={handleClose}
              className="p-0 text-sm"
              disabled={loading}
            >
              X
            </Button>
          </div>
        </DialogHeader>
        
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="text-lg font-medium mb-2 block">Category Name *</label>
              <Input
                type="text"
                name="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                className="w-full"
                disabled={loading}
              />
              {errors.name && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.name}
                </Typography>
              )}
            </div>

            {/* Current Image */}
            {category?.categoryImg && (
              <div>
                <label className="text-lg font-medium mb-2 block">Current Image</label>
                <div className="border border-gray-200 rounded-lg p-3 text-center">
                  <img 
                    src={category.categoryImg} 
                    alt="Current category" 
                    className="w-32 h-32 object-cover rounded mx-auto"
                  />
                  <Typography variant="small" color="gray" className="mt-2">
                    Current category image
                  </Typography>
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div>
              <label className="text-lg font-medium mb-2 block">
                {category?.categoryImg ? 'Update Image (Optional)' : 'Category Image *'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="category-image-upload-edit"
                  disabled={loading}
                />
                <label 
                  htmlFor="category-image-upload-edit" 
                  className="cursor-pointer block"
                >
                  {formData.image ? (
                    <div className="space-y-2">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <Typography variant="small" color="green" className="font-medium">
                        {formData.image.name}
                      </Typography>
                      <Typography variant="small" color="gray">
                        Click to change image
                      </Typography>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <Typography variant="small" color="gray">
                        Click to upload new image
                      </Typography>
                      <Typography variant="small" color="gray" className="text-xs">
                        PNG, JPG, JPEG up to 5MB
                      </Typography>
                    </div>
                  )}
                </label>
              </div>
              {errors.image && (
                <Typography variant="small" color="red" className="mt-1 text-center">
                  {errors.image}
                </Typography>
              )}
            </div>

            {/* New Image Preview */}
            {formData.image && (
              <div className="text-center">
                <Typography variant="small" className="font-medium mb-2">
                  New Image Preview:
                </Typography>
                <div className="inline-block border border-gray-200 rounded-lg p-2">
                  <img 
                    src={URL.createObjectURL(formData.image)} 
                    alt="New category preview" 
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              </div>
            )}
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
            <span>{loading ? 'UPDATING...' : 'UPDATE CATEGORY'}</span>
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

EditCategoryVendorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveCategory: PropTypes.func.isRequired,
  category: PropTypes.object,
};