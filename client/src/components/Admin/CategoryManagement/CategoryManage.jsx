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
import { useEffect, useState } from "react";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { AddCategoryModal } from '../Modal/Category/AddCategoryModal.jsx';
import { EditCategoryModal } from '../Modal/Category/EditcategoryModal.jsx';
import { ConfirmEditCategoryModal } from '../Modal/Category/ConfirmEditCategoryModal.jsx';
import { DeleteCategoryModal } from '../Modal/Category/DeleteCategoryModal.jsx';
import { addCategory, checkCategoryNacheckCategoryNameExists, deleteCategory, getCategories, updateCategory, updateCategoryStatus } 
from '../../../Utils/categoryService.js';
import { fetchVendors } from '../../../Utils/vendorService.js'; // Import the vendor API
import { toast } from "react-hot-toast";
import Loader from "../../Loader/Loader.jsx";
import { StatusCategoryModal } from '../Modal/Category/StatusCategoryModal.jsx';
import { useNavigate } from 'react-router-dom' ;

const CATEGORY_STATUS = {
    ALL: "ALL",
    LIST: "LIST",
    UNLIST: "UNLIST",
};

const TABS = [
    { label: "All", value: CATEGORY_STATUS.ALL },
    { label: "List", value: CATEGORY_STATUS.LIST },
    { label: "Unlist", value: CATEGORY_STATUS.UNLIST },
];

const TABLE_HEAD = ["No", "Category Image", "Category Name", "Vendor", "Status", "Edit", "Delete"];
   
export default function CategoryTable()  {

    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]); // Add vendors state
    const [isModalOpenAddCategory, setIsModalOpenAddCategory] = useState(false);
    const [isModalOpenEditCategory, setIsModalOpenEditCategory] = useState(false);
    const [isModalOpenConfirmEditCategory, setIsModalOpenConfirmEditCategory] = useState(false);
    const [isModalOpenDeleteCategory, setIsModalOpenDeleteCategory] = useState(false);
    const [isModalOpenStatusCategory, setIsModalOpenStatusCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [vendorsLoading, setVendorsLoading] = useState(false); // Separate loading for vendors
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); 
    const [editingCategory, setEditingCategory] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(CATEGORY_STATUS.ALL);
    const [searchQuery] = useState("");

    const navigate = useNavigate();

    // Fetch vendors function
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

    // Load categories function
    const loadCategories = async () => {
        setLoading(true);
        try {
            const statusFilter = selectedStatus === CATEGORY_STATUS.ALL ? "" : selectedStatus;
            const data = await getCategories(currentPage, 10, statusFilter, searchQuery);

            setCategories(data.categories);
            setTotalPages(data.totalPages);
        
        } catch (error) {
            if (error.message === "Unauthorized: No token found!" ||
                error.message.includes("Unauthorized") ||
                error.message?.includes("401") ||
                error.response?.status === 401) {
                
                toast.error("Please login to access categories");
                navigate('/admin/admin-login');
            } else {
                toast.error(error.message || "Failed to load categories");
            }
        } finally {
            setLoading(false);
        }
    };

    const filterCategories = () => {
        let filtered = categories;

        if (selectedStatus !== CATEGORY_STATUS.ALL) {
            filtered = categories.filter((category) => category.status === selectedStatus);
        }

        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((category) =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredCategories(filtered);
    };

    // useEffect hooks
    useEffect(() => {
        loadCategories();
        loadVendors(); // Load vendors when component mounts
    }, [currentPage, selectedStatus, searchQuery]);

    useEffect(() => {
        filterCategories();
    }, [categories, searchTerm, selectedStatus]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    // Update handleSaveCategory to include vendor selection
    const handleSaveCategory = async (categoryData) => {
         try {
            const data = await addCategory(categoryData);
            console.log("Category created successfully:", data);
            toast.success("Category added successfully")
            setIsModalOpenAddCategory(false);

            // Refresh categories after adding new one
            await loadCategories();
            
            return data; 
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(error.message || "Failed to add category");
            throw error ;
        }
    };
    // This function handles adding the new category to your state
    const handleCategoryAdded = (newCategory) => {
        console.log("New category added:", newCategory);
        setCategories((prevCategories) => [...prevCategories, newCategory]);
    };

    
    // Start Update Process
    const handleEditCategory = (category) => {
        setEditingCategory({...category}); 
        setIsModalOpenEditCategory(true);
    };
    
    // Handle form changes in edit modal
    const handleEditFormChange = (field, value) => {
        setEditingCategory(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    // Handle vendor selection
    const handleVendorChange = (vendorId) => {
        setEditingCategory(prev => ({
            ...prev,
            vendorId: vendorId // Store vendor ID separately
        }));
    };
    
    // Handle file upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditingCategory(prev => ({
                ...prev,
                categoryImg: file
            }));
        }
    };

    // API response structure mismatch backend returns data.data here it was data.category and handle tow parameters(,)
    const handleConfirmUpdateCategory = async () => {
        try {
            setLoading(true);

            // Normalize the category data before sending
            const normalizedCategory = {
                name: editingCategory.name,
                vendorId: editingCategory.vendorId, // Include vendorId
                categoryImg: editingCategory.categoryImg
            };

            const data = await updateCategory(editingCategory._id, normalizedCategory);
            console.log("Category updated:", data);

            if (data.success) {
                // Use the category from response to update state
                setCategories((prevCategories) =>
                    prevCategories.map((cat) =>
                        cat._id === editingCategory._id
                            ? { ...cat, ...data.category } // Use data.category from backend
                            : cat
                    )
                );

                toast.success("Category updated successfully");
                setIsModalOpenConfirmEditCategory(false);
                await loadCategories(); // Refresh to get updated vendor data

                // Reset the editing state
                setEditingCategory(null);
            }
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category");
        } finally {
            setLoading(false);
        }
    };
    
    const handleOpenConfirmModal = () => {
        setIsModalOpenEditCategory(false);
        setIsModalOpenConfirmEditCategory(true);
    };

    // End Update Process

    
    const handleDeleteCategory = async (categoryId) => {
        try {
            const data = await deleteCategory(categoryId);
            console.log("Category deleted successfully:", data);
            toast.success("Category deleted successfully");
            setIsModalOpenDeleteCategory(false);
            setCategories((prevCategories) => prevCategories.filter((category) => category._id !== categoryId));
        } catch (error) {
            console.error("Error deleting Category:", error);
            toast.error("Error deleting Category");
        }
    };
    
  

  
    

    const handleStatusCategory = async (category) => {
        const updatedStatus = category.status === "LIST" ? "UNLIST" : "LIST";
        try {
            const result = await updateCategoryStatus(category._id, { status: updatedStatus });
    
            if (result.success) {
                setCategories((prevCategories) =>
                    prevCategories.map((b) =>
                        b._id === category._id ? { ...b, status: updatedStatus } : b
                    )
                );
                toast.success("Category status updated successfully");
            } else {
                console.error("Failed to update Category status:", result.message);
            }
        } catch (err) {
            console.error("Error updating Category status:", err);
        }
    };
    
      return (
        <Card className="h-full w-full">
            {loading ? (
                <Loader />
            ) : (
                <>
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Category list
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                                See information about all categories
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button
                                onClick={() => setIsModalOpenAddCategory(true)}
                                className="flex items-center gap-3" size="sm">
                                <MdOutlineProductionQuantityLimits  className="h-4 w-4" /> Add Category
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <Tabs value={selectedStatus} className="w-full md:w-max">
                        <TabsHeader>
                            {TABS.map(({ label, value }) => (
                            <Tab key={value} value={value} onClick={() => setSelectedStatus(value)}>
                                &nbsp;&nbsp;{label}&nbsp;&nbsp;
                            </Tab>
                            ))}
                        </TabsHeader>
                        </Tabs>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="w-full md:w-72">
                                <Input
                                    label="Search"
                                    value={searchTerm} 
                                    onChange={handleSearchChange} 
                                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll px-0">
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
                            { filteredCategories.length > 0 ? (
                                filteredCategories.map(
                                    (category, index) => {
                                        const isLast = index === categories.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                                        const startIndex = (currentPage - 1) * categoriesPerPage;
                                        const rowIndex = startIndex + index + 1;
                    
                                    return (
                                        <tr key={category._id}>
                                            <td className="py-3 px-4 text-center">{rowIndex}</td>

                                            <td className={classes}>
                                                <div className="flex items-center gap-3 w-10 mt-5">
                                                    <img 
                                                        src={category.categoryImg} 
                                                        alt={category.name} 
                                                        size="sm" 
                                                        className=" object-cover"
                                                    />
                                                </div>
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
                                                    </div>
                                                </div>
                                            </td>

                                           

                                            <td className={classes}>
                                                <div className="w-max">
                                                    <Chip
                                                        variant="ghost"
                                                        className="w-16 items-center justify-center cursor-pointer"
                                                        size="sm"
                                                        value={category.status}
                                                        color={category.status === "LIST" ? "green" : "red"}
                                                        onClick={() => {
                                                            setSelectedCategory(category);
                                                            setIsModalOpenStatusCategory(true); 
                                                        }}
                                                    />
                                                </div>
                                            </td>
            
                                            <td className={classes}>
                                                <Tooltip content="Edit Category">
                                                    <IconButton variant="text">
                                                        <PencilIcon 
                                                        onClick={() => handleEditCategory(category)}
                                                        className="h-4 w-4 text-blue-900" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
            
                                            <td className={classes}>
                                                <Tooltip content="Delete Category">
                                                    <IconButton variant="text">
                                                        <TrashIcon 
                                                        onClick={() => {
                                                            setSelectedCategoryId(category._id);  
                                                            setIsModalOpenDeleteCategory(true); 
                                                        }}
                                                        className="h-4 w-4 text-red-900" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    );
                                    
                                })
                            ):(
                                <tr>
                                    <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                                        <Typography variant="small" color="red" className="font-medium text-md">
                                            No categories to display
                                        </Typography>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                            {/* Modals */}
                            <AddCategoryModal
                                open={isModalOpenAddCategory}
                                setOpen={setIsModalOpenAddCategory}
                                saveCategory={handleSaveCategory}
                                vendors={vendors}
                                vendorsLoading={vendorsLoading}
                                onCategoryAdded={handleCategoryAdded}
                            />

                              <EditCategoryModal
                                  open={isModalOpenEditCategory}
                                  setOpen={setIsModalOpenEditCategory}
                                  category={editingCategory}
                                  vendors={vendors} // Pass vendors
                                  vendorsLoading={vendorsLoading} // Pass loading state
                                  onFormChange={handleEditFormChange}
                                  onVendorChange={handleVendorChange} // Add vendor handler
                                  onImageChange={handleImageChange}
                                  onConfirm={handleOpenConfirmModal}
                              />

                              <ConfirmEditCategoryModal
                                  open={isModalOpenConfirmEditCategory}
                                  setOpen={setIsModalOpenConfirmEditCategory}
                                  saveCategory={handleConfirmUpdateCategory}
                              />

                        <DeleteCategoryModal
                            open={isModalOpenDeleteCategory}
                            setOpen={setIsModalOpenDeleteCategory}
                            deleteCategory={() => handleDeleteCategory(selectedCategoryId)}
                            category={selectedCategory}
                        />

                        <StatusCategoryModal
                            open={isModalOpenStatusCategory}
                            setOpen={setIsModalOpenStatusCategory}
                            category={selectedCategory}
                            handleStatusChange={handleStatusCategory}
                        />

            
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Page {currentPage}
                    </Typography>
                    <div className="flex gap-2">
                        <Button variant="outlined" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            Previous
                        </Button>
                        <Button variant="outlined" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next
                        </Button>
                    </div>
                </CardFooter>
            </>
            )}
        </Card>
    );
}