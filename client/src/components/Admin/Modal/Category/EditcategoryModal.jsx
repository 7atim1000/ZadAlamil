import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function EditCategoryModal({ 
    open, 
    setOpen, 
    category, 
    vendors, // Add vendors prop
    vendorsLoading, // Add loading state
    onFormChange, 
    onVendorChange, // Add vendor change handler
    onImageChange, 
    onConfirm  
}) {
    const [selectedVendor, setSelectedVendor] = useState('');

    // Set initial vendor when category changes
    useEffect(() => {
        if (category && category.vendor) {
            setSelectedVendor(category.vendor._id || category.vendor);
        }
    }, [category]);

    const handleVendorSelect = (e) => {
        const vendorId = e.target.value;
        setSelectedVendor(vendorId);
        if (onVendorChange) {
            onVendorChange(vendorId);
        }
    };

    const handleClose = () => {
        setSelectedVendor('');
        setOpen(false);
    };

    if (!category) return null;

    return (
        <Dialog
            open={open}
            handler={handleClose}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.0, y: -100 },
            }}
            className='border-2 border-gray-300'
            >
            <div className='p-6'>
                <DialogHeader>
                    <div className="flex justify-between w-full">
                        <span className="text-xl font-bold">Edit Category</span>
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
                <form className="items-center space-y-4">
                    {/* Vendor Selection */}
                    <div>
                        <label className="text-sm font-medium">Vendor</label>
                        <select
                            value={selectedVendor}
                            onChange={handleVendorSelect}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            disabled={vendorsLoading}
                        >
                            <option value="">{vendorsLoading ? 'Loading vendors...' : 'Select a vendor'}</option>
                            {vendors.map((vendor) => (
                                <option key={vendor._id} value={vendor._id}>
                                    {vendor.name || vendor.companyName} - {vendor.email}
                                </option>
                            ))}
                        </select>
                        {category.vendor && (
                            <p className="text-xs text-gray-500 mt-1">
                                Current: {category.vendor.name || category.vendor.companyName}
                            </p>
                        )}
                    </div>

                    {/* Category Name */}
                    <div>
                        <label className="text-sm font-medium">Category Name</label>
                        <input
                            type="text"
                            value={category.name || ""}
                            onChange={(e) => onFormChange('name', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    {/* Category Image */}
                    <div>
                        <label className="text-sm font-medium">Category Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />

                        {category.categoryImg && (
                            <div className="mt-2">
                                {typeof category.categoryImg === 'string' ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Current image:</span>
                                        <img 
                                            src={category.categoryImg} 
                                            alt="Current category" 
                                            className="w-16 h-16 object-cover rounded border"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        New image: {category.categoryImg.name}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </form>
                </DialogBody>

                <DialogFooter className='flex justify-between'>
                    <Button
                        variant="outlined"
                        color="red"
                        onClick={handleClose}
                        className="px-6 py-2"
                    >
                        <span>CANCEL</span>
                    </Button>
                    <Button
                        className='bg-green-900 text-white px-6 py-2 rounded-md'
                        onClick={onConfirm}
                    >
                        <span>UPDATE</span>
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

EditCategoryModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired,
    vendors: PropTypes.array,
    vendorsLoading: PropTypes.bool,
    onFormChange: PropTypes.func.isRequired,
    onVendorChange: PropTypes.func, // Add prop type
    onImageChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};