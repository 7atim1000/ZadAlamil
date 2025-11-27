import { useState, useEffect } from 'react';
import Img1 from '../../../assets/images/mob1.png';
import { addProduct, getProducts, deleteProduct, updateProduct } from '../../../Utils/productService';
import { AddProductModal } from '../Modal/AddProductModal';
import { EditProductModal } from '../Modal/EditProductModal';
import { ConfirmEditProductModal } from '../Modal/ConfirmEditProductModal';
import { DeleteProductModal } from '../Modal/DeleteProductModal';
import { Input} from '@material-tailwind/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import {toast} from 'react-hot-toast';
import { Button } from "@material-tailwind/react";

import { getCategories } from '../../../Utils/categoryService';
import { useNavigate } from 'react-router-dom';
import { fetchVendors } from "../../../Utils/vendorService.js";

export default function ProductTable() {

    // Fetch product useState
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    
    // Search 
    // you're using searchQuery in your API call but managing searchTerm in your state. You need to connect them properly. Here are the solutions:
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery] = useState("");

    const [selectedProductId, setSelectedProductId] = useState(null); 
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Add and insert useState
    const [isModalOpenAddProduct, setIsModalOpenAddProduct] = useState(false);
    const [isModalOpenDeleteProduct, setIsModalOpenDeleteProduct] = useState(false);    


    // Editing and Update useState
    const [categories, setCategories] = useState([])
    const [editingProduct, setEditingProduct] = useState(null);
    const [isModalOpenEditProduct, setIsModalOpenEditProduct] = useState(false);
    const [isModalOpenConfirmEditProduct, setIsModalOpenConfirmEditProduct] = useState(false);
    // Load vendors
    const [vendorsLoading, setVendorsLoading] = useState(false); // to load vendors
    const [vendors, setVendors] = useState([]); // Add vendors state

    // Load vendors: 
    const loadVendors = async () => {
        setVendorsLoading(true);
        try {
            const response = await fetchVendors(1, 100); // Get first 100 vendors
            if (response.success) {
                setVendors(response.vendors || response.data || []); // Adjust based on your API response structure
            }
        } catch (error) {
            console.error("Error loading vendors:", error);
            toast.error("Failed to load vendors");
        } finally {
            setVendorsLoading(false);
        }
    };
    // In case back end not handle search
    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts(currentPage, 10);

            let filteredProducts = data.products;
            if (searchTerm.trim() !== "") {
                filteredProducts = data.products.filter((product) =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setProducts(filteredProducts);
            setTotalPages(Math.ceil(filteredProducts.length / 10)); // Adjust total pages for client-side filtering

        } catch (error) {
            console.error("Error loading products:", error.message);
            toast.error("Please login to access Products");
            navigate('/admin/admin-login');
        } finally {
            setLoading(false);
        }
    };

    // Use it in useEffect
    useEffect(() => {
        loadProducts();
        loadVendors();
    }, [currentPage, searchTerm])


    const handleSearch = (e) => {
        // setSearchQuery(searchTerm);
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    //////////////Add Add API
    // This function handles adding the new category to your state
    const handleProductAdded = (newProduct) => {
        console.log("New Product added:", newProduct);
        setProducts((prevProducts) => [...prevProducts, newProduct]);
    };
    // Add and insert end point
    const handleSaveProduct = async (productData) => {
        try {
            const data = await addProduct(productData);
            console.log("Product created successfully:", data);
            toast.success("Product added successfully")
            setIsModalOpenAddProduct(false);
            // setProducts((prevProducts) => [...prevProducts, data.product]);
            return data; 


        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(error.message || "Failed to add Product");
            throw error ;
        }
    };
    //////////////End Add API
    
    // const handleUpdateProduct = () => {
    //     setIsModalOpenEditProduct(false);
    //     setIsModalOpenConfirmEditProduct(true); 
    // };

    // Update end point
    // Load categories for dropdown
    const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
    
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories(); // Your categories API
                setCategories(data.categories || data);
                
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);



    ///////////////////////// Start edit process
    const handleEditProduct = (product) => {
    setEditingProduct({ ...product });

        setEditingProduct({ ...product });
        setIsModalOpenEditProduct(true);
    };


    // Handle form changes in edit modal
    const handleEditFormChange = (field, value) => {
        setEditingProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };
    // Handle vendor selection
    const handleVendorChange = (vendorId) => {
        setEditingProduct(prev => ({
            ...prev,
            vendor: vendorId // Store vendor ID directly in editingProduct
        }));
    };

    // Handle file upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditingProduct(prev => ({
                ...prev,
                productImg: file
            }));
        }
    };
    
    /*how the data is being passed from the frontend to the backend. The backend expects proper data types, but the frontend is sending FormData which might not be converting properly. Here are the fixes */
    // Use Json instead of forData
    const handleConfirmUpdate = async () => {
        try {
            setLoading(true);

            // Create clean JSON data
            const cleanData = {
                name: editingProduct.name?.trim() || '',
                category: editingProduct.category?._id || editingProduct.category,
                vendor: editingProduct.vendor?._id || editingProduct.vendor,
                originalPrice: Number(editingProduct.originalPrice) || 0,
                price: Number(editingProduct.price),
                stock: Number(editingProduct.stock),
                description: editingProduct.description?.trim() || '',
                color: editingProduct.color?.trim() || ''
            };

            console.log("Sending data:", cleanData);

            // Use your updateProduct function that accepts JSON
            const data = await updateProduct(editingProduct._id, cleanData);

            await loadProducts();
            toast.success("Product updated successfully");
            setIsModalOpenConfirmEditProduct(false);
            setEditingProduct(null);

        } catch (error) {
            console.error("Error updating product:", error);
            toast.error(error.message || "Error updating product");
        } finally {
            setLoading(false);
        }
    };
//     const handleConfirmUpdate = async () => {
//     try {
//         setLoading(true);

//         // DEBUG: Log the current state
//         console.log("🔄 DEBUG - Current editingProduct:", {
//             ...editingProduct,
//             category: editingProduct.category?._id || editingProduct.category,
//             vendor: editingProduct.vendor?._id || editingProduct.vendor,
//             price: editingProduct.price,
//             stock: editingProduct.stock,
//             priceType: typeof editingProduct.price,
//             stockType: typeof editingProduct.stock
//         });

//         // Validate and sanitize data
//         const categoryId = editingProduct.category?._id || editingProduct.category;
//         const vendorId = editingProduct.vendor?._id || editingProduct.vendor;
        
//         // Convert and validate numbers
//         const price = Number(editingProduct.price);
//         const stock = Number(editingProduct.stock);
//         const originalPrice = Number(editingProduct.originalPrice) || 0;

//         console.log("🔍 DEBUG - Sanitized values:", {
//             categoryId,
//             vendorId,
//             price,
//             stock,
//             originalPrice,
//             isPriceValid: !isNaN(price) && price >= 0,
//             isStockValid: !isNaN(stock) && stock >= 0
//         });

//         // Validate required fields
//         if (!categoryId || categoryId === 'undefined') {
//             toast.error("Please select a valid category");
//             setLoading(false);
//             return;
//         }

//         if (!vendorId || vendorId === 'undefined') {
//             toast.error("Please select a valid vendor");
//             setLoading(false);
//             return;
//         }

//         if (isNaN(price) || price < 0) {
//             toast.error("Please enter a valid price");
//             setLoading(false);
//             return;
//         }

//         if (isNaN(stock) || stock < 0) {
//             toast.error("Please enter a valid stock quantity");
//             setLoading(false);
//             return;
//         }

//         // Create a clean data object
//         const cleanData = {
//             name: editingProduct.name?.trim() || '',
//             category: categoryId,
//             vendor: vendorId,
//             originalPrice: originalPrice,
//             price: price,
//             stock: stock,
//             description: editingProduct.description?.trim() || '',
//             color: editingProduct.color?.trim() || ''
//         };

//         console.log("✅ DEBUG - Clean data being sent:", cleanData);

//         // Prepare form data
//         const formData = new FormData();
//         Object.entries(cleanData).forEach(([key, value]) => {
//             formData.append(key, value.toString());
//         });

//         // Handle image if changed
//         if (editingProduct.productImg && typeof editingProduct.productImg !== 'string') {
//             formData.append("productImg", editingProduct.productImg);
//         }

//         const data = await updateProduct(editingProduct._id, formData);
        
//         await loadProducts();
//         toast.success("Product updated successfully");
//         setIsModalOpenConfirmEditProduct(false);
//         setEditingProduct(null);

//     } catch (error) {
//         console.error("❌ Error updating product:", error);
//         toast.error(error.message || "Error updating product");
//     } finally {
//         setLoading(false);
//     }
// };
    // const handleConfirmUpdate = async () => {
    //     try {
    //         setLoading(true);

    //         // Prepare form data for update
    //         const formData = new FormData();

    //         // Append all product fields with proper validation
    //         formData.append("name", editingProduct.name || '');
    //         formData.append("category", editingProduct.category?._id || editingProduct.category || '');
    //         formData.append("vendor", editingProduct.vendor?._id || editingProduct.vendor || '');
    //         formData.append("originalPrice", editingProduct.originalPrice ? Number(editingProduct.originalPrice) : 0);
    //         formData.append("price", editingProduct.price ? Number(editingProduct.price) : 0);
    //         formData.append("stock", editingProduct.stock ? Number(editingProduct.stock) : 0);
    //         formData.append("description", editingProduct.description || '');
    //         formData.append("color", editingProduct.color || '');

    //         // Append new image if changed
    //         if (editingProduct.productImg && typeof editingProduct.productImg !== 'string') {
    //             formData.append("productImg", editingProduct.productImg);
    //         }

    //         console.log("Updating product with data:", {
    //             name: editingProduct.name,
    //             category: editingProduct.category?._id || editingProduct.category,
    //             vendor: editingProduct.vendor?._id || editingProduct.vendor,
    //             originalPrice: Number(editingProduct.originalPrice),
    //             price: Number(editingProduct.price),
    //             stock: Number(editingProduct.stock),
    //             description: editingProduct.description,
    //             color: editingProduct.color
    //         });

    //         const data = await updateProduct(editingProduct._id, formData);
    //         console.log("Product updated:", data);

    //         await loadProducts(); // Refresh the products list

    //         toast.success("Product updated successfully");
    //         setIsModalOpenConfirmEditProduct(false);
    //         setEditingProduct(null);

    //     } catch (error) {
    //         console.error("Error updating product:", error);
    //         toast.error(error.message || "Error updating product");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Open confirmation modal
    const handleOpenConfirmModal = () => {
        setIsModalOpenEditProduct(false);
        setIsModalOpenConfirmEditProduct(true);
    };

    /////////////End edit process



   
     const handleDeleteProduct = async (productId) => {
            try {
                const data = await deleteProduct(productId);
                console.log("Product deleted successfully:", data);
                toast.success("Product deleted successfully");
                setIsModalOpenDeleteProduct(false);
                //you're incorrectly updating the state:     setProducts((prevProducts) => [...prevProducts, data.product]);
                setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
            } catch (error) {
                console.error("Error deleting Product:", error);
                toast.error("Error deleting Product");
            }
        };
        

    // const products = [
    //     {
    //         id: 1,
    //         name: "SAMSUNG Galaxy S23 Series AI Phone, Unlocked Android Smartphone, 128GB",
    //         stock: 2500,
    //         price: 3500,
    //         status: "UNLIST",
    //     },
    //     {
    //         id: 2,
    //         name: "SAMSUNG Galaxy S23 Series AI Phone, Unlocked Android Smartphone, 128GB",
    //         stock: 2500,
    //         price: 3500,
    //         status: "UNLIST",
    //     },
    //     {
    //         id: 3,
    //         name: "SAMSUNG Galaxy S23 Series AI Phone, Unlocked Android Smartphone, 128GB",
    //         stock: 0,
    //         price: 3500,
    //         status: "UNLIST",
    //     },
    //     {
    //         id: 4,
    //         name: "SAMSUNG Galaxy S23 Series AI Phone, Unlocked Android Smartphone, 128GB",
    //         stock: 2500,
    //         price: 3500,
    //         status: "LIST",
    //     },
    //     {
    //         id: 5,
    //         name: "SAMSUNG Galaxy S23 Series AI Phone, Unlocked Android Smartphone, 128GB",
    //         stock: 2500,
    //         price: 3500,
    //         status: "UNLIST",
    //     },
    // ];

    // const handleSaveProduct = () => {
    //     console.log("Product saved");
    //     setIsModalOpenAddProduct(false); 
    // };

    return (
        <div className="p-8 w-full">
            <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold">PRODUCT MANAGEMENT</h1>
    <div className="flex gap-2">
        <button 
            className="bg-gradient-to-r from-[#1D0F0F] to-[#972323] text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpenAddProduct(true)}
        >
            + Add Product
        </button>
        <button 
            className="bg-gradient-to-r from-[#1D0F0F] to-[#054421] text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpenAddProduct(true)}
        >
            Import
        </button>
    </div>
</div>

            
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="w-full md:w-72">
                    <Input
                        label="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    />
                </div>
          

            </div>

            <div className="overflow-x-auto mt-10">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4">No</th>
                            <th className="py-2 px-4">Vendor</th>
                            <th className="py-2 px-4">Product Name</th>
                            <th className="py-2 px-4">Category</th>
                            <th className="py-2 px-4">Stock</th>
                            <th className="py-2 px-4">Original price</th>
                            <th className="py-2 px-4">Price</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Color</th>
                            <th className="py-2 px-4">Edit</th>
                            <th className="py-2 px-4">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id || product.id} className="border-t even:bg-blue-gray-50/50">
                                <td className="py-3 px-4 text-center">{index + 1}</td>
                                <td className="py-3 px-4 text-center">
                                    {product.vendor?.name || 'No vendor'}
                                </td>
                                 
                                <td className="py-3 px-4 flex items-center">
                                    <img
                                        src={product.productImg}
                                        alt="product"
                                        className="h-10 w-10 mr-4 rounded"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.png'; // Fallback image
                                        }}
                                    />
                                    {product.name || 'No name'}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    {product.category?.name || 'No category'}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    {product.stock > 0 ? product.stock : <span className="text-red-900 font-semibold">Out of stock</span>}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    ${product.originalPrice ? product.originalPrice.toFixed(2) : '0.00'}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    ${product.price ? product.price.toFixed(2) : '0.00'}
                                </td>
                                <td className="py-3 px-4 text-center cursor-pointer">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${product.status === "LIST"
                                                ? "bg-green-100 text-green-800 border border-green-300"
                                                : product.status === "UNLIST"
                                                    ? "bg-red-100 text-red-800 border border-red-300"
                                                    : "bg-gray-100 text-gray-800 border border-gray-300"
                                            }`}
                                    >
                                        {product.status || "UNKNOWN"}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center">
                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                                            style={{ backgroundColor: product.color || '#ccc' }}
                                        ></div>
                                        <span>{product.color || 'No color'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                                    >
                                        EDIT
                                    </button>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => {
                                            setSelectedProductId(product._id || product.id);
                                            setIsModalOpenDeleteProduct(true);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                                    >
                                        DELETE
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddProductModal
                open={isModalOpenAddProduct}
                setOpen={setIsModalOpenAddProduct}
                saveProduct={handleSaveProduct}
                vendors={vendors}
                onProductAdded={handleProductAdded}
            />

            
            {/* Modal Usage in JSX */}
            <EditProductModal
                open={isModalOpenEditProduct}
                setOpen={setIsModalOpenEditProduct}
                product={editingProduct}
                categories={categories}
                vendors={vendors} // Pass vendors prop
                onFormChange={handleEditFormChange}
                onVendorChange={handleVendorChange} // Add vendor change handler
                onImageChange={handleImageChange}
                onConfirm={handleOpenConfirmModal}
            />

            {/* Confirmation Modal */}
            <ConfirmEditProductModal 
                open={isModalOpenConfirmEditProduct}
                setOpen={setIsModalOpenConfirmEditProduct}
                saveProduct={handleConfirmUpdate}
            />

            <DeleteProductModal
                open={isModalOpenDeleteProduct}
                setOpen={setIsModalOpenDeleteProduct}
                // saveAddress={handleDeleteProduct}
                deleteProduct={() => handleDeleteProduct(selectedProductId)}
                product={products}
            />

        </div>
    );
}
