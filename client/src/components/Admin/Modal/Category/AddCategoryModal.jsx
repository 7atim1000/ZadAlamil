import { PropTypes } from 'prop-types';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function AddCategoryModal({ open, setOpen, saveCategory, onCategoryAdded, vendors, vendorsLoading }) {

    const [categoryName, setCategoryName] = useState("");
    const [selectedVendor, setSelectedVendor] = useState(""); // Add vendor state
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); 
    const [img, setImg] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);

    useEffect(() => {
        if(open) {
            setErrorMessage("");
            setCategoryName("");
            setSelectedVendor(""); // Reset vendor selection
            setImg(null);
            setImgPreview(null);
        }
    }, [open])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (validImageTypes.includes(file.type)) {
                setImg(file);
                setImgPreview(URL.createObjectURL(file));
                setErrorMessage(""); 
            } else {
                setImg(null);
                setImgPreview(null);
                setErrorMessage("Invalid file type. Only PNG, JPG, and JPEG are allowed.");
            }
        }
    };

    const handleSave = async () => {
        // Add vendor validation
        if (!categoryName.trim() || !img || !selectedVendor) {
            setErrorMessage("Please provide category name, image, and select a vendor.");
            return;
        }

        const formData = new FormData();
        
        formData.append("name", categoryName);
        formData.append("categoryImg", img);
        formData.append("vendorId", selectedVendor); // Add vendorId to FormData
        
        console.log("Sending FormData with vendor:", selectedVendor);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        setLoading(true);
        setErrorMessage("");    

        try {
            const data = await saveCategory(formData);
            console.log("Category created successfully:", data);
            toast.success("Category added successfully");
            setOpen(false);
            
            if (onCategoryAdded) {
                onCategoryAdded(data.category);
            }
        
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(error.message || "Failed to add category");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCategoryName("");
        setSelectedVendor("");
        setImg(null);
        setImgPreview(null);
        setErrorMessage("");
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
            className='border-2 border-gray-300'
            >
            <div className='p-6'>
                <DialogHeader>
                    <div className="flex justify-between w-full">
                        <span className="text-xl font-bold">Add Category</span>
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
                        <label className="text-lg font-medium">Select Vendor *</label>
                        <select
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            disabled={vendorsLoading}
                            required
                        >
                            <option value="">{vendorsLoading ? 'Loading vendors...' : 'Select a vendor'}</option>
                            {vendors.map((vendor) => (
                                <option key={vendor._id} value={vendor._id}>
                                    {vendor.name || vendor.companyName} - {vendor.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Name */}
                    <div>
                        <label className="text-lg font-medium">Category Name</label>
                        <div>
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    {/* Category Image */}
                    <div>
                        <label className="text-sm font-medium">Category Image (PNG, JPG, JPEG)</label>
                        <div>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        { imgPreview && (
                            <div className='mt-4'>
                                <img
                                    src={imgPreview}
                                    alt="Image Preview"
                                    className='w-20 rounded-lg'
                                 />
                            </div>
                        )}
                    </div>

                    {errorMessage && (
                        <div className='text-red-900 mt-2 text-sm'>
                            {errorMessage}
                        </div>
                    )}
                    
                </form>
                </DialogBody>

                <DialogFooter className='mt-5 flex justify-between'>
                    <Button
                        variant="text"
                        color="black"
                        onClick={handleClose}
                        disabled ={loading}
                        className="border-2 border-gray-400 px-6 py-2"
                    >
                        <span>CANCEL</span>
                    </Button>
                    <Button
                        className='bg-green-900 text-white px-6 py-2 rounded-md'
                        onClick={handleSave}
                        disabled={loading || vendorsLoading}
                    >
                        {loading ? (
                            <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                        ) : (
                            <span>SAVE</span>
                        )}
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

AddCategoryModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    saveCategory: PropTypes.func.isRequired,
    onCategoryAdded: PropTypes.func,
    vendors: PropTypes.array.isRequired,
    vendorsLoading: PropTypes.bool
};