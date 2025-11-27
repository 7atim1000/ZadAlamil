import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdDownload } from "react-icons/md";


import { AddProductVendorModal } from '../Modal/Product/AddProductModalVendor.jsx';
import { EditProductVendorModal } from '../Modal/Product/EditProductModalVendor.jsx';
import { ConfirmEditProductVendorModal } from '../Modal/Product/ConfirmEditProductModalVendor.jsx';
import { DeleteProductVendorModal } from '../Modal/Product/DeleteProductModalVendor.jsx';

import { useEffect, useState } from "react";
import { 
    getVendorProducts, 
    addVendorProduct, 
    updateVendorProduct, 
    deleteVendorProduct 
} from "../../../Utils/vendorProductsServices";

import { toast } from 'react-hot-toast';


const TABS = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "List",
        value: "LIST",
    },
    {
        label: "Unlist",
        value: "UNLIST",
    },
];

const TABLE_HEAD = ["No", "Product",  "Stock", "Price", "Status", "Edit", "Delete"];
   
export function ProductTableVendor() {
    const [isModalOpenAddVendorProduct, setIsModalOpenAddVendorProduct] = useState(false);
    const [isModalOpenEditVendorProduct, setIsModalOpenEditVendorProduct] = useState(false);
    const [isModalOpenConfirmEditVendorProduct, setIsModalOpenConfirmEditVendorProduct] = useState(false);
    const [isModalOpenDeleteVendorProduct, setIsModalOpenDeleteVendorProduct] = useState(false);
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

     

    const limit = 10;


    const fetchProducts = async (page = 1, search = '', status = 'all') => {
        try {
            setLoading(true);
            const response = await getVendorProducts(page, limit, search, status);
            console.log("Products response:", response);
            
            if (response.success) {
                setProducts(response.products || []);
                setTotalPages(response.totalPages || 1);
                setTotalProducts(response.totalProducts || 0);
                setCurrentPage(response.currentPage || 1);
            } else {
                console.error("Failed to fetch products:", response.message);
                setProducts([]);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    
    }, []);

    ////////////////// Adding Process
    const handleProductAdded = (newProduct) => {
        console.log("New Product added:", newProduct);
        setProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    const handleSaveVendorProduct = async (productData) => {
        try {
            const response = await addVendorProduct(productData);
            if (response.success) {
                // Refresh the products list
                fetchProducts(currentPage, searchTerm, activeTab);
                setIsModalOpenAddVendorProduct(false);
            } else {
                console.error("Failed to add product:", response.message);
                throw new Error(response.message);
            }
            return response;
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    };

    /////////////////////// Edit Process
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsModalOpenEditVendorProduct(true);
    };

    const handleUpdateVendorProduct = async (productData) => { // Changed from formData to productData
        try {
            if (!selectedProduct) return;

            console.log("Updating vendor product with data:", productData);

            // Use JSON data directly (no FormData)
            const response = await updateVendorProduct(selectedProduct._id, productData);

            if (response.success) {
                // Refresh the products list
                fetchProducts(currentPage, searchTerm, activeTab);
                setIsModalOpenEditVendorProduct(false);
                setIsModalOpenConfirmEditVendorProduct(true);
                setSelectedProduct(null);
                return response;
            } else {
                console.error("Failed to update product:", response.message);
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    };

    const handleConfirmUpdateVendorProduct = () => {
        console.log("Product updated successfully");
        setIsModalOpenConfirmEditVendorProduct(false);
        // You might want to add a toast notification here
        toast.success("Product updated successfully");
    };

    // Delete Process

    const handleDeleteProduct = (product) => {
        setSelectedProduct(product);
        setIsModalOpenDeleteVendorProduct(true);
    };

    const handleDeleteVendorProduct = async () => {
        try {
            if (!selectedProduct) return;

            console.log('Deleting product:', selectedProduct._id);
            const response = await deleteVendorProduct(selectedProduct._id);

            if (response.success) {
                console.log('Product deleted successfully');
                // Refresh the products list
                fetchProducts(currentPage, searchTerm, activeTab);
                setIsModalOpenDeleteVendorProduct(false);
                setSelectedProduct(null);

                // Optional: Show success message
                // You can add a toast notification here
            } else {
                console.error("Failed to delete product:", response.message);
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            
            throw error; // Re-throw to handle in modal if needed
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Debounce search - wait 500ms after user stops typing
        setTimeout(() => {
            fetchProducts(1, value, activeTab);
        }, 500);
    };

    const handleTabChange = (value) => {
        setActiveTab(value);
        fetchProducts(1, searchTerm, value);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchProducts(newPage, searchTerm, activeTab);
        }
    };

    const getStatusColor = (status) => {
        return status === 'LIST' ? 'green' : 'red';
    };

    const getStatusValue = (status) => {
        return status === 'LIST' ? 'Listed' : 'Unlisted';
    };

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Product List
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            {totalProducts} products found
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button variant="outlined" className="flex items-center gap-3" size="sm">
                            <MdDownload className="h-4 w-4" /> Download Sample CSV
                        </Button>
                        <Button className="bg-red-900" size="sm">
                            Import CSV
                        </Button>
                        <Button 
                            onClick={() => setIsModalOpenAddVendorProduct(true)}
                            className="flex items-center gap-3" 
                            size="sm"
                        >
                            <MdOutlineProductionQuantityLimits className="h-4 w-4" /> Add Product
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Tabs value={activeTab} className="w-full md:w-max">
                        <TabsHeader>
                            {TABS.map(({ label, value }) => (
                                <Tab 
                                    key={value} 
                                    value={value}
                                    onClick={() => handleTabChange(value)}
                                >
                                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-72">
                        <Input
                            label="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Typography variant="h6" color="blue-gray">
                            Loading products...
                        </Typography>
                    </div>
                ) : (
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head, index) => (
                                    <th
                                        key={head}
                                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                        >
                                            {head}{" "}
                                            {index !== TABLE_HEAD.length - 1 && (
                                                <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                            )}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product, index) => {
                                    const isLast = index === products.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={product._id}>
                                            <td className="py-3 px-4 text-center">
                                                {(currentPage - 1) * limit + index + 1}
                                            </td>
                                            
                                        
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <Avatar 
                                                        src={product.productImg} 
                                                        alt={product.name}
                                                        size="md"
                                                        className="border border-blue-gray-50"
                                                    />
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {product.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal opacity-70"
                                                        >
                                                            {product.category?.name || 'No Category'}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color={product.stock === 0 ? "red" : "blue-gray"}
                                                        className="font-normal"
                                                    >
                                                        {product.stock > 0 ? product.stock : "Out of Stock"}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        AED {product.price}
                                                    </Typography>
                                                    {product.originalPrice > product.price && (
                                                        <Typography
                                                            variant="small"
                                                            color="red"
                                                            className="font-normal line-through"
                                                        >
                                                            AED {product.originalPrice}
                                                        </Typography>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="w-max">
                                                    <Chip
                                                        variant="ghost"
                                                        className="w-20 items-center justify-center"
                                                        size="sm"
                                                        value={getStatusValue(product.status)}
                                                        color={getStatusColor(product.status)}
                                                    />
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Tooltip content="Edit Product">
                                                    <IconButton 
                                                        variant="text"
                                                        onClick={() => handleEditProduct(product)}
                                                    >
                                                        <PencilIcon className="h-4 w-4 text-blue-900" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                            <td className={classes}>
                                                <Tooltip content="Delete Product">
                                                    <IconButton 
                                                        variant="text"
                                                        onClick={() => handleDeleteProduct(product)}
                                                    >
                                                        <TrashIcon className="h-4 w-4 text-red-900" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={TABLE_HEAD.length} className="p-8 text-center">
                                        <Typography variant="h6" color="blue-gray">
                                            No products found
                                        </Typography>
                                        <Typography color="gray" className="mt-2">
                                            {searchTerm || activeTab !== 'all' 
                                                ? 'Try changing your search or filter criteria' 
                                                : 'Get started by adding your first product'
                                            }
                                        </Typography>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page {currentPage} of {totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button 
                        variant="outlined" 
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </Button>
                    <Button 
                        variant="outlined" 
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            </CardFooter>

            {/* Modals */}
            <AddProductVendorModal
                open={isModalOpenAddVendorProduct}
                setOpen={setIsModalOpenAddVendorProduct}
                saveProduct={handleSaveVendorProduct}
                onProductAdded={handleProductAdded}
            />

           
            <EditProductVendorModal
                open={isModalOpenEditVendorProduct}
                setOpen={setIsModalOpenEditVendorProduct}
                saveProduct={handleUpdateVendorProduct}
                product={selectedProduct}
            />

            <ConfirmEditProductVendorModal
                open={isModalOpenConfirmEditVendorProduct}
                setOpen={setIsModalOpenConfirmEditVendorProduct}
                saveProduct={handleConfirmUpdateVendorProduct}
            />

            <DeleteProductVendorModal
                open={isModalOpenDeleteVendorProduct}
                setOpen={setIsModalOpenDeleteVendorProduct}
                deleteProduct={handleDeleteVendorProduct}
                product={selectedProduct}
            />
        </Card>
    );
}

// import {
//     MagnifyingGlassIcon,
//     ChevronUpDownIcon,
//   } from "@heroicons/react/24/outline";
// import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
// import {
//     Card,
//     CardHeader,
//     Input,
//     Typography,
//     Button,
//     CardBody,
//     Chip,
//     CardFooter,
//     Tabs,
//     TabsHeader,
//     Tab,
//     Avatar,
//     IconButton,
//     Tooltip,
// } from "@material-tailwind/react";
// import { MdOutlineProductionQuantityLimits } from "react-icons/md";
// import { MdDownload } from "react-icons/md";

// import { AddProductVendorModal } from '../Modal/Product/AddProductModalVendor.jsx';
// import { EditProductVendorModal } from '../Modal/Product/EditProductModalVendor.jsx';
// import { ConfirmEditProductVendorModal } from '../Modal/Product/ConfirmEditProductModalVendor.jsx';
// import { DeleteProductVendorModal } from '../Modal/Product/DeleteProductModalVendor.jsx';

// import { useEffect, useState } from "react";
// import { addProduct, getProducts } from "../../../Utils/vendorProductService.js";

// const TABS = [
//     {
//         label: "All",
//         value: "all",
//     },
//     {
//         label: "List",
//         value: "list",
//     },
//     {
//         label: "Unlist",
//         value: "unlist",
//     },
// ];

// const TABLE_HEAD = ["No", "Product Name", "Stock", "Price", "Status", "Edit", "Delete"];
   
// export function ProductTableVendor() {
//     const [isModalOpenAddVendorProduct, setIsModalOpenAddVendorProduct] = useState(false);
//     const [isModalOpenEditVendorProduct, setIsModalOpenEditVendorProduct] = useState(false);
//     const [isModalOpenConfirmEditVendorProduct, setIsModalOpenConfirmEditVendorProduct] = useState(false);
//     const [isModalOpenDeleteVendorProduct, setIsModalOpenDeleteVendorProduct] = useState(false);
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const data = await getProducts();
//                 console.log("pro::", data);
                
//                 setProducts(data?.data || []);
//             } catch (error) {
//                 console.error("Failed to fetch products:", error);
//             }
//         };
//         fetchProducts();
//     }, [])

//     const handleSaveVendorProduct = async(productData) => {
//         try {
//             const response = await addProduct(productData);
//             if(response?.success) {
//                 setProducts([...products, response.data]);
//                 setIsModalOpenAddVendorProduct(false); 
//             } else {
//                 console.error("Failed to add product:", response?.message);
//             }
//         } catch (error) {
//             console.error("Error adding product:", error);
//         }
//     };

//     const handleUpdateVendorProduct = () => {
//         setIsModalOpenEditVendorProduct(false);
//         setIsModalOpenConfirmEditVendorProduct(true); 
//     };

//     const handleConfirmUpdateVendorProduct = () => {
//         console.log("Product updated");
//         setIsModalOpenConfirmEditVendorProduct(false); 
//     };

//     const handleDeleteVendorProduct = () => {
//         console.log("Product deleted");
//         setIsModalOpenDeleteVendorProduct(false); 
//     };
    
//     return (
//         <Card className="h-full w-full">
//             <CardHeader floated={false} shadow={false} className="rounded-none">
//                 <div className="mb-8 flex items-center justify-between gap-8">
//                     <div>
//                         <Typography variant="h5" color="blue-gray">
//                             Product list
//                         </Typography>
//                         <Typography color="gray" className="mt-1 font-normal">
//                             See information about all products
//                         </Typography>
//                     </div>
//                     <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
//                         <Button variant="outlined" className="flex items-center gap-3" size="sm">
//                             <MdDownload  className="h-4 w-4" /> Download Sample CSV
//                         </Button>
//                         <Button className="bg-red-900" size="sm">
//                             Import CSV
//                         </Button>
//                         <Button 
//                         onClick={() => setIsModalOpenAddVendorProduct(true)}
//                         className="flex items-center gap-3" size="sm">
//                             <MdOutlineProductionQuantityLimits  className="h-4 w-4" /> Add Product
//                         </Button>
//                     </div>
//                 </div>
//                 <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
//                     <Tabs value="all" className="w-full md:w-max">
//                     <TabsHeader>
//                         {TABS.map(({ label, value }) => (
//                         <Tab key={value} value={value}>
//                             &nbsp;&nbsp;{label}&nbsp;&nbsp;
//                         </Tab>
//                         ))}
//                     </TabsHeader>
//                     </Tabs>
//                     <div className="w-full md:w-72">
//                         <Input
//                             label="Search"
//                             icon={<MagnifyingGlassIcon className="h-5 w-5" />}
//                         />
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardBody className="overflow-scroll px-0">
//                 <table className="mt-4 w-full min-w-max table-auto text-left">
//                     <thead>
//                     <tr>
//                         {TABLE_HEAD.map((head, index) => (
//                         <th
//                             key={head}
//                             className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
//                         >
//                             <Typography
//                             variant="small"
//                             color="blue-gray"
//                             className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
//                             >
//                             {head}{" "}
//                             {index !== TABLE_HEAD.length - 1 && (
//                                 <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
//                             )}
//                             </Typography>
//                         </th>
//                         ))}
//                     </tr>
//                     </thead>
//                     <tbody>
//                         { products.length > 0 ? (
//                             products.map((product, index) => {
//                         const isLast = index === products.length - 1;
//                         const classes = isLast
//                             ? "p-4"
//                             : "p-4 border-b border-blue-gray-50";
        
//                         return (
//                             <tr key={product._id}>
//                                 <td className="py-3 px-4 text-center">{index + 1}</td>
//                                 <td className={classes}>
//                                     <div className="flex items-center gap-2">
//                                     {product.images?.slice(0, 4).map((image, imgIndex) => (
//                                         <Avatar key={imgIndex} src={image} alt={`Product ${imgIndex}`} size="sm" />
//                                     ))}
//                                         <div className="flex flex-col">
//                                             <Typography
//                                             variant="small"
//                                             color="blue-gray"
//                                             className="font-normal"
//                                             >
//                                             {product.title}
//                                             </Typography>
                                            
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td className={classes}>
//                                     <div className="flex flex-col">
//                                         <Typography
//                                         variant="small"
//                                         color={product.stock === 0 ? "red" : "blue-gray"}
//                                         className="font-normal"
//                                         >
//                                         {product.stock > 0 ? product.stock : " Out of Stock"}
//                                         </Typography>
//                                     </div>
//                                 </td>

//                                 <td className={classes}>
//                                     <div className="flex flex-col">
//                                         <Typography
//                                             variant="small"
//                                             color="blue-gray"
//                                             className="font-normal"
//                                         >
//                                             {product.price}
//                                         </Typography>
//                                     </div>
//                                 </td>
//                                 <td className={classes}>
//                                     <div className="w-max">
//                                         <Chip
//                                             variant="ghost"
//                                             className="w-16 items-center justify-center"
//                                             size="sm"
//                                             value={product.status ? "list" : "unlist"}
//                                             color={product.status ? "green" : "red"}
//                                         />
//                                     </div>
//                                 </td>

//                                 <td className={classes}>
//                                     <Tooltip content="Edit Product">
//                                         <IconButton variant="text">
//                                             <PencilIcon
//                                                 onClick={() => setIsModalOpenEditVendorProduct(true)}
//                                                 className="h-4 w-4 text-blue-900" />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </td>

//                                 <td className={classes}>
//                                     <Tooltip content="Delete Product">
//                                         <IconButton variant="text">
//                                             <TrashIcon
//                                                 onClick={() => setIsModalOpenDeleteVendorProduct(true) }
//                                                 className="h-4 w-4 text-red-900" />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </td>
//                             </tr>
//                         );
//                         })
//                     ):(
//                         <tr>
//                             <td colSpan="5">No products available</td>
//                         </tr>
//                     )}
//                     </tbody>
                    
//                     <AddProductVendorModal
//                         open={isModalOpenAddVendorProduct}
//                         setOpen={setIsModalOpenAddVendorProduct}
//                         saveProduct={handleSaveVendorProduct}
//                     />

//                     <EditProductVendorModal
//                         open={isModalOpenEditVendorProduct}
//                         setOpen={setIsModalOpenEditVendorProduct}
//                         saveProduct={handleUpdateVendorProduct}
//                     />
                
//                     <ConfirmEditProductVendorModal
//                         open={isModalOpenConfirmEditVendorProduct}
//                         setOpen={setIsModalOpenConfirmEditVendorProduct}
//                         saveProduct={handleConfirmUpdateVendorProduct} 
//                     />

//                     <DeleteProductVendorModal
//                         open={isModalOpenDeleteVendorProduct}
//                         setOpen={setIsModalOpenDeleteVendorProduct}
//                         saveAddress={handleDeleteVendorProduct}
//                     />
                    
//                 </table>
//             </CardBody>
//             <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
//                 <Typography variant="small" color="blue-gray" className="font-normal">
//                     Page 1 of 10
//                 </Typography>
//                 <div className="flex gap-2">
//                     <Button variant="outlined" size="sm">
//                     Previous
//                     </Button>
//                     <Button variant="outlined" size="sm">
//                     Next
//                     </Button>
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// }