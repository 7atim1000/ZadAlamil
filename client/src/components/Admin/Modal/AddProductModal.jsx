import {useState, useEffect} from 'react';
import { PropTypes } from 'prop-types';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { getCategories } from '../../../Utils/categoryService';
import { toast } from 'react-hot-toast';

export function AddProductModal({ open, setOpen, saveProduct, onProductAdded, vendors }) {

    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productVendor, setProductVendor] = useState("");
    const [productOriginalPrice, setProductOriginalPrice] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productStock, setProductStock] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productColor, setProductColor] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [img, setImg] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setErrorMessage("");
            setProductName("");
            setProductCategory("");
            setProductVendor("");
            setProductOriginalPrice("");
            setProductPrice("");
            setProductStock("");
            setProductDescription("");
            setProductColor("");
            setImg(null);
            setImgPreview(null);
        }
    }, [open]);

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
        // Validate required fields
        if (!productName.trim() || !img || !productCategory || !productVendor || !productPrice || !productStock || !productDescription || !productColor) {
            setErrorMessage("Please provide all fields including vendor and image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", productName);
        formData.append("category", productCategory);
        formData.append("vendor", productVendor); // Add vendor to form data
        formData.append("originalPrice", productOriginalPrice);
        formData.append("price", productPrice);
        formData.append("stock", productStock);
        formData.append("description", productDescription);
        formData.append("color", productColor);
        formData.append("productImg", img);
        
        setLoading(true);
        setErrorMessage("");

        try {
            const data = await saveProduct(formData);
            console.log("Product created successfully:", data);
            setOpen(false);

            // Call the callback to update parent component
            if (onProductAdded) {
                onProductAdded(data.product);
            }
            
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(error.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            setCategoriesLoading(true);
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
                setCategoriesLoading(false);
            }
        };
        
        if (open) {
            loadCategories();
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            handler={() => setOpen(false)}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.0, y: -100 },
            }}
            className='border-2 border-gray-300 h-[calc(100vh)] overflow-y-scroll'
        >
            <div className='p-6'>
                <DialogHeader>
                    <div className="flex justify-between w-full">
                        <span className="text-xl font-bold">Add Product</span>
                        <Button
                            variant="text"
                            color="black"
                            onClick={() => setOpen(false)}
                            className="p-0 text-sm"
                        >
                            X
                        </Button>
                    </div>
                </DialogHeader>
                
                <DialogBody>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center scroll">
                        {/* General Info */}
                        <label className="text-lg font-medium">1. General Info</label>
                        <div>
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <textarea
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                placeholder="Description"
                                rows="3"
                                className="w-full px-4 py-2 mt-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            ></textarea>
                        </div>

                        {/* Vendor Selection */}
                        <label className="text-lg font-medium">2. Vendor</label>
                        <select
                            className='w-full bg-gray-100 text-[#1f1f1f] h-12 rounded-sm border px-2'
                            onChange={(e) => setProductVendor(e.target.value)}
                            value={productVendor}
                        >
                            <option value="">Select a vendor</option>
                            {vendors && vendors.map((vendor) => (
                                <option key={vendor._id} value={vendor._id}>
                                    {vendor.name} - {vendor.companyName} ({vendor.email})
                                </option>
                            ))}
                        </select>

                        {/* Stocking */}
                        <label className="text-lg font-medium">3. Stocking</label>
                        <input
                            type="number"
                            value={productStock}
                            onChange={(e) => setProductStock(e.target.value)}
                            placeholder="Stock Quantity"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />

                        {/* Pricing */}
                        <label className="text-lg font-medium">4. Original Price</label>
                        <input
                            type="number"
                            step="0.01"
                            value={productOriginalPrice}
                            onChange={(e) => setProductOriginalPrice(e.target.value)}
                            placeholder="Original Price"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        
                        <label className="text-lg font-medium">5. Selling Price</label>
                        <input
                            type="number"
                            step="0.01"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            placeholder="Selling Price"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />

                        {/* Category */}
                        <label className="text-lg font-medium">6. Category</label>
                        <select
                            className='w-full bg-gray-100 text-[#1f1f1f] h-12 rounded-sm border px-2'
                            onChange={(e) => setProductCategory(e.target.value)}
                            value={productCategory}
                            disabled={categoriesLoading}
                        >
                            <option value="">
                                {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                            </option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Media */}
                        <label className="text-lg font-medium">7. Product Image (PNG, JPG, JPEG)</label>
                        <div>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {imgPreview && (
                                <div className='mt-4'>
                                    <img
                                        src={imgPreview}
                                        alt="Product Preview"
                                        className='w-20 h-20 object-cover rounded-lg border'
                                    />
                                </div>
                            )}
                        </div>

                        {/* Color */}
                        <label className="text-lg font-medium">8. Color</label>
                        <input
                            type="text"
                            value={productColor}
                            onChange={(e) => setProductColor(e.target.value)}
                            placeholder="Product Color"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />

                        {/* Error Message */}
                        {errorMessage && (
                            <div className='col-span-2 text-red-600 mt-2 text-sm text-center p-2 bg-red-50 rounded'>
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </DialogBody>

                <DialogFooter className='mt-5 flex justify-between'>
                    <Button
                        variant="text"
                        color="black"
                        onClick={() => setOpen(false)}
                        className="border-2 border-gray-400 px-6 py-2"
                    >
                        <span>CANCEL</span>
                    </Button>
                    <Button
                        className='bg-green-900 text-white px-6 py-2 rounded-md'
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="spinner-border animate-spin h-4 w-4 border-t-2 border-white rounded-full" />
                                <span>SAVING...</span>
                            </div>
                        ) : (
                            <span>SAVE PRODUCT</span>
                        )}
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

AddProductModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    saveProduct: PropTypes.func.isRequired,
    onProductAdded: PropTypes.func,
    vendors: PropTypes.array.isRequired
};