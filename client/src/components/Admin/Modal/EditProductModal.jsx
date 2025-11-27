import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";

export function EditProductModal({ 
    open, 
    setOpen, 
    product, 
    categories = [], 
    vendors = [],
    onFormChange, 
    onVendorChange,
    onImageChange, 
    onConfirm 
}) {
    const [localProduct, setLocalProduct] = useState({});

    // Initialize local state when product changes
    useEffect(() => {
        if (product) {
            setLocalProduct({
                ...product,
                // Ensure numbers are properly set
                price: product.price ?? '',
                stock: product.stock ?? '',
                originalPrice: product.originalPrice ?? ''
            });
        }
    }, [product]);

    if (!product || !localProduct._id) return null;

    // Safe function to get category ID
    const getCategoryId = () => {
        if (!localProduct.category) return '';
        return typeof localProduct.category === 'object' ? localProduct.category._id : localProduct.category;
    };

    // Safe function to get vendor ID
    const getVendorId = () => {
        if (!localProduct.vendor) return '';
        return typeof localProduct.vendor === 'object' ? localProduct.vendor._id : localProduct.vendor;
    };

    // Helper function to handle number input changes
    const handleNumberChange = (field, value) => {
        // If empty string, set as empty
        if (value === '') {
            setLocalProduct(prev => ({ ...prev, [field]: '' }));
            onFormChange(field, '');
            return;
        }
        
        // Convert to number
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setLocalProduct(prev => ({ ...prev, [field]: numValue }));
            onFormChange(field, numValue);
        }
    };

    // Helper function to handle string input changes
    const handleStringChange = (field, value) => {
        setLocalProduct(prev => ({ ...prev, [field]: value }));
        onFormChange(field, value);
    };

    // Handle vendor change
    const handleVendorSelect = (value) => {
        if (value && value !== '') {
            setLocalProduct(prev => ({ ...prev, vendor: value }));
            onVendorChange(value);
        }
    };

    // Handle category change
    const handleCategorySelect = (value) => {
        if (value && value !== '') {
            setLocalProduct(prev => ({ ...prev, category: value }));
            onFormChange('category', value);
        }
    };

    // Find the current category and vendor for display
    const currentCategory = categories.find(cat => 
        cat._id?.toString() === getCategoryId()?.toString()
    );
    const currentVendor = vendors.find(vendor => 
        vendor._id?.toString() === getVendorId()?.toString()
    );

    // Check if form is valid
    const isFormValid = () => {
        return localProduct.name && 
               getCategoryId() && 
               getVendorId() && 
               localProduct.price !== '' && 
               !isNaN(localProduct.price) && 
               localProduct.stock !== '' && 
               !isNaN(localProduct.stock);
    };

    return (
        <Dialog
            open={open}
            handler={() => setOpen(false)}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.0, y: -100 },
            }}
            className='border-2 border-gray-300 max-h-[90vh] overflow-y-auto'
        >
            <div className='p-6'>
                <DialogHeader>
                    <div className="flex justify-between w-full">
                        <span className="text-xl font-bold">Edit Product</span>
                        <Button
                            variant="text"
                            color="black"
                            onClick={() => setOpen(false)}
                            className="p-0 text-sm"
                        >
                            <span className="material-icons text-xl">×</span>
                        </Button>
                    </div>
                </DialogHeader>
                
                <DialogBody>
                    <div className="space-y-4">
                        {/* Product Name */}
                        <Input
                            label="Product Name *"
                            value={localProduct.name || ''}
                            onChange={(e) => handleStringChange('name', e.target.value)}
                            required
                        />

                        {/* Vendor Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vendor *
                            </label>
                            <Select
                                label="Select Vendor"
                                value={getVendorId()}
                                onChange={handleVendorSelect}
                                required
                            >
                                <Option value="">
                                    Select a vendor
                                </Option>
                                {vendors.map((vendor) => (
                                    <Option key={vendor._id} value={vendor._id}>
                                        {vendor.companyName} - {vendor.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* Category Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <Select
                                label="Select Category"
                                value={getCategoryId()}
                                onChange={handleCategorySelect}
                                required
                            >
                                <Option value="">
                                    Select a category
                                </Option>
                                {categories.map((category) => (
                                    <Option key={category._id} value={category._id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* Pricing */}
                        <Input
                            label="Original Price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={localProduct.originalPrice ?? ''}
                            onChange={(e) => handleNumberChange('originalPrice', e.target.value)}
                        />

                        <Input
                            label="Selling Price *"
                            type="number"
                            min="0"
                            step="0.01"
                            value={localProduct.price ?? ''}
                            onChange={(e) => handleNumberChange('price', e.target.value)}
                            required
                        />

                        {/* Stock */}
                        <Input
                            label="Stock Quantity *"
                            type="number"
                            min="0"
                            value={localProduct.stock ?? ''}
                            onChange={(e) => handleNumberChange('stock', e.target.value)}
                            required
                        />

                        {/* Color */}
                        <Input
                            label="Color"
                            value={localProduct.color || ''}
                            onChange={(e) => handleStringChange('color', e.target.value)}
                            placeholder="e.g., Red, Blue, Green"
                        />

                        {/* Description */}
                        <Textarea
                            label="Description"
                            value={localProduct.description || ''}
                            onChange={(e) => handleStringChange('description', e.target.value)}
                            rows={4}
                        />

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {localProduct.productImg && typeof localProduct.productImg === 'string' && (
                                <div className="mt-2">
                                    <img 
                                        src={localProduct.productImg} 
                                        alt="Current product" 
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </DialogBody>
                
                <DialogFooter className='mt-5 flex justify-between'>
                    <Button
                        variant="text"
                        color="black"
                        onClick={() => setOpen(false)}
                        className="border-2 border-black px-6 py-2"
                    >
                        <span>CANCEL</span>
                    </Button>
                    <Button
                        className='bg-green-900 text-white px-6 py-2'
                        onClick={onConfirm}
                        disabled={!isFormValid()}
                    >
                        <span>UPDATE PRODUCT</span>
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

EditProductModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    product: PropTypes.object,
    categories: PropTypes.array.isRequired,
    vendors: PropTypes.array.isRequired,
    onFormChange: PropTypes.func.isRequired,
    onVendorChange: PropTypes.func.isRequired,
    onImageChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};