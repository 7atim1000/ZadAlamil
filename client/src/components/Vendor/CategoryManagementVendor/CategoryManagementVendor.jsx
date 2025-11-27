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
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { AddCategoryVendorModal } from '../Modal/Category/AddCategoryModalVendor.jsx';
import { EditCategoryVendorModal } from '../Modal/Category/EditCategoryModalVendor.jsx';
import { ConfirmEditCategoryVendorModal } from '../Modal/Category/ConfirmEditCategoryModalVendor.jsx';
import { DeleteCategoryVendorModal } from '../Modal/Category/DeleteCategoryModalVendor.jsx';

import { 
    getVendorCategories, 
    addVendorCategory, 
    updateVendorCategory, 
    deleteVendorCategory 
} from "../../../Utils/vendorCategoriesService";

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

const TABLE_HEAD = ["No", "Category Name", "Status", "Edit", "Delete"];
   
export function CategoryTableVendor() {
    const [isModalOpenAddVendorCategory, setIsModalOpenAddVendorCategory] = useState(false);
    const [isModalOpenEditVendorCategory, setIsModalOpenEditVendorCategory] = useState(false);
    const [isModalOpenConfirmEditVendorCategory, setIsModalOpenConfirmEditVendorCategory] = useState(false);
    const [isModalOpenDeleteVendorCategory, setIsModalOpenDeleteVendorCategory] = useState(false);
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCategories, setTotalCategories] = useState(0);

    const limit = 10;

    const fetchCategories = async (page = 1, search = '', status = 'all') => {
        try {
            setLoading(true);
            const response = await getVendorCategories(page, limit, search, status);
            console.log("Categories response:", response);
            
            if (response.success) {
                setCategories(response.categories || []);
                setTotalPages(response.totalPages || 1);
                setTotalCategories(response.totalCategories || 0);
                setCurrentPage(response.currentPage || 1);
            } else {
                console.error("Failed to fetch categories:", response.message);
                setCategories([]);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSaveVendorCategory = async (categoryData) => {
        try {
            const response = await addVendorCategory(categoryData);
            if (response.success) {
                // Refresh the categories list
                fetchCategories(currentPage, searchTerm, activeTab);
                setIsModalOpenAddVendorCategory(false);
            } else {
                console.error("Failed to add category:", response.message);
                throw new Error(response.message);
            }
            return response;
        } catch (error) {
            console.error("Error adding category:", error);
            throw error;
        }
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsModalOpenEditVendorCategory(true);
    };

    const handleUpdateVendorCategory = async (categoryData) => {
        try {
            if (!selectedCategory) return;
            
            const response = await updateVendorCategory(selectedCategory._id, categoryData);
            if (response.success) {
                // Refresh the categories list
                fetchCategories(currentPage, searchTerm, activeTab);
                setIsModalOpenEditVendorCategory(false);
                setIsModalOpenConfirmEditVendorCategory(true);
                setSelectedCategory(null);
            } else {
                console.error("Failed to update category:", response.message);
                throw new Error(response.message);
            }
            return response;
        } catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    };

    const handleConfirmUpdateVendorCategory = () => {
        console.log("Category updated successfully");
        setIsModalOpenConfirmEditVendorCategory(false);
    };

    const handleDeleteCategory = (category) => {
        setSelectedCategory(category);
        setIsModalOpenDeleteVendorCategory(true);
    };

    const handleDeleteVendorCategory = async () => {
        try {
            if (!selectedCategory) return;
            
            const response = await deleteVendorCategory(selectedCategory._id);
            if (response.success) {
                // Refresh the categories list
                fetchCategories(currentPage, searchTerm, activeTab);
                setIsModalOpenDeleteVendorCategory(false);
                setSelectedCategory(null);
            } else {
                console.error("Failed to delete category:", response.message);
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Debounced search
        setTimeout(() => {
            fetchCategories(1, value, activeTab);
        }, 500);
    };

    const handleTabChange = (value) => {
        setActiveTab(value);
        fetchCategories(1, searchTerm, value);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchCategories(newPage, searchTerm, activeTab);
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
                            Category List
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            {totalCategories} categories found
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button
                            onClick={() => setIsModalOpenAddVendorCategory(true)}
                            className="flex items-center gap-3" 
                            size="sm"
                        >
                            <MdOutlineProductionQuantityLimits className="h-4 w-4" /> Add Category
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
                            Loading categories...
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
                            {categories.length > 0 ? (
                                categories.map((category, index) => {
                                    const isLast = index === categories.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={category._id}>
                                            <td className="py-3 px-4 text-center">
                                                {(currentPage - 1) * limit + index + 1}
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {category.name}
                                                        </Typography>
                                                        {category.sales && (
                                                            <Typography
                                                                variant="small"
                                                                color="gray"
                                                                className="font-normal text-xs"
                                                            >
                                                                Sales: {category.sales}
                                                            </Typography>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <div className="w-max">
                                                    <Chip
                                                        variant="ghost"
                                                        className="w-20 items-center justify-center"
                                                        size="sm"
                                                        value={getStatusValue(category.status)}
                                                        color={getStatusColor(category.status)}
                                                    />
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Tooltip content="Edit Category">
                                                    <IconButton 
                                                        variant="text"
                                                        onClick={() => handleEditCategory(category)}
                                                    >
                                                        <PencilIcon className="h-4 w-4 text-blue-900" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                            <td className={classes}>
                                                <Tooltip content="Delete Category">
                                                    <IconButton 
                                                        variant="text"
                                                        onClick={() => handleDeleteCategory(category)}
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
                                            No categories found
                                        </Typography>
                                        <Typography color="gray" className="mt-2">
                                            {searchTerm || activeTab !== 'all' 
                                                ? 'Try changing your search or filter criteria' 
                                                : 'Get started by adding your first category'
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
            <AddCategoryVendorModal
                open={isModalOpenAddVendorCategory}
                setOpen={setIsModalOpenAddVendorCategory}
                saveCategory={handleSaveVendorCategory}
            />

            <EditCategoryVendorModal
                open={isModalOpenEditVendorCategory}
                setOpen={setIsModalOpenEditVendorCategory}
                saveCategory={handleUpdateVendorCategory}
                category={selectedCategory}
            />
        
            <ConfirmEditCategoryVendorModal
                open={isModalOpenConfirmEditVendorCategory}
                setOpen={setIsModalOpenConfirmEditVendorCategory}
                saveCategory={handleConfirmUpdateVendorCategory} 
            />

            <DeleteCategoryVendorModal
                open={isModalOpenDeleteVendorCategory}
                setOpen={setIsModalOpenDeleteVendorCategory}
                deleteCategory={handleDeleteVendorCategory}
                category={selectedCategory}
            />
        </Card>
    );
}

// import {
//     MagnifyingGlassIcon,
//     ChevronUpDownIcon,
// } from "@heroicons/react/24/outline";
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
//     IconButton,
//     Tooltip,
// } from "@material-tailwind/react";
// import { useState } from "react";
// import { MdOutlineProductionQuantityLimits } from "react-icons/md";
// import { AddCategoryVendorModal } from '../Modal/Category/AddCategoryModalVendor.jsx';
// import { EditCategoryVendorModal } from '../Modal/Category/EditCategoryModalVendor.jsx';
// import { ConfirmEditCategoryVendorModal } from '../Modal/Category/ConfirmEditCategoryModalVendor.jsx';
// import { DeleteCategoryVendorModal } from '../Modal/Category/DeleteCategoryModalVendor.jsx';

// import { getVendorCategories,addVendorCategory, updateVendorCategory, deleteVendorCategory } from "../../../Utils/vendorCategoriesService";

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

// const TABLE_HEAD = ["No", "Category Name", "Status", "Edit", "Delete"];

// const TABLE_ROWS = [
//     {
//         categoryName: "Mobiles & Tablets",
//         status: true,
//     },
//     {
//         categoryName: "TV & Audio",
//         status: true,
//     },
//     {
//         categoryName: "Wearables & Smart watches",
//         status: false,
//     },
//     {
//         categoryName: "Appliances",
//         status: true,
//     },
//     {
//         categoryName: "Personal Care",
//         status: true,
//     },
// ];
   
// export function CategoryTableVendor() {
//     const [isModalOpenAddVendorCategory, setIsModalOpenAddVendorCategory] = useState(false);
//     const [isModalOpenEditVendorCategory, setIsModalOpenEditVendorCategory] = useState(false);
//     const [isModalOpenConfirmEditVendorCategory, setIsModalOpenConfirmEditVendorCategory] = useState(false);
//     const [isModalOpenDeleteVendorCategory, setIsModalOpenDeleteVendorCategory] = useState(false);

//     const handleSaveVendorCategory = () => {
//         console.log("Category saved");
//         setIsModalOpenAddVendorCategory(false); 
//     };

//     const handleUpdateVendorCategory = () => {
//         setIsModalOpenEditVendorCategory(false);
//         setIsModalOpenConfirmEditVendorCategory(true); 
//     };

//     const handleConfirmUpdateVendorCategory = () => {
//         console.log("category updated");
//         setIsModalOpenConfirmEditVendorCategory(false); 
//     };

//     const handleDeleteVendorCategory = () => {
//         console.log("Category deleted");
//         setIsModalOpenDeleteVendorCategory(false); 
//     };
    
//     return (
//         <Card className="h-full w-full">
//             <CardHeader floated={false} shadow={false} className="rounded-none">
//                 <div className="mb-8 flex items-center justify-between gap-8">
//                     <div>
//                         <Typography variant="h5" color="blue-gray">
//                             Category list
//                         </Typography>
//                         <Typography color="gray" className="mt-1 font-normal">
//                             See information about all categories
//                         </Typography>
//                     </div>
//                     <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
//                         <Button
//                             onClick={() => setIsModalOpenAddVendorCategory(true)}
//                             className="flex items-center gap-3" size="sm">
//                             <MdOutlineProductionQuantityLimits  className="h-4 w-4" /> Add Category
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
//                     {TABLE_ROWS.map(
//                         ({ categoryName, status }, index) => {
//                         const isLast = index === TABLE_ROWS.length - 1;
//                         const classes = isLast
//                             ? "p-4"
//                             : "p-4 border-b border-blue-gray-50";
        
//                         return (
//                             <tr key={categoryName}>
//                                 <td className="py-3 px-4 text-center">{index + 1}</td>
//                                 <td className={classes}>
//                                     <div className="flex items-center gap-3">
                                        
//                                         <div className="flex flex-col">
//                                             <Typography
//                                             variant="small"
//                                             color="blue-gray"
//                                             className="font-normal"
//                                             >
//                                             {categoryName}
//                                             </Typography>
                                            
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td className={classes}>
//                                     <div className="w-max">
//                                         <Chip
//                                             variant="ghost"
//                                             className="w-16 items-center justify-center"
//                                             size="sm"
//                                             value={status ? "block" : "unblock"}
//                                             color={status ? "green" : "red"}
//                                         />
//                                     </div>
//                                 </td>

//                                 <td className={classes}>
//                                     <Tooltip content="Edit Category">
//                                         <IconButton variant="text">
//                                             <PencilIcon 
//                                             onClick={() => setIsModalOpenEditVendorCategory(true)}

//                                             className="h-4 w-4 text-blue-900" />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </td>

//                                 <td className={classes}>
//                                     <Tooltip content="Delete Category">
//                                         <IconButton variant="text">
//                                             <TrashIcon 
//                                             onClick={() => setIsModalOpenDeleteVendorCategory(true) }
//                                             className="h-4 w-4 text-red-900" />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </td>
//                             </tr>
//                         );
//                         },
//                     )}
//                     </tbody>
//                     <AddCategoryVendorModal
//                         open={isModalOpenAddVendorCategory}
//                         setOpen={setIsModalOpenAddVendorCategory}
//                         saveCategory={handleSaveVendorCategory}
//                     />

//                     <EditCategoryVendorModal
//                         open={isModalOpenEditVendorCategory}
//                         setOpen={setIsModalOpenEditVendorCategory}
//                         saveCategory={handleUpdateVendorCategory}
//                     />
                
//                     <ConfirmEditCategoryVendorModal
//                         open={isModalOpenConfirmEditVendorCategory}
//                         setOpen={setIsModalOpenConfirmEditVendorCategory}
//                         saveCategory={handleConfirmUpdateVendorCategory} 
//                     />

//                     <DeleteCategoryVendorModal
//                         open={isModalOpenDeleteVendorCategory}
//                         setOpen={setIsModalOpenDeleteVendorCategory}
//                         deleteCategory={handleDeleteVendorCategory}
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