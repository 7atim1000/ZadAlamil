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
import { AddBrandModal } from '../Modal/Brand/AddBrandModal.jsx';
import { EditBrandModal } from '../Modal/Brand/EditBrandModal.jsx';
import { ConfirmEditBrandModal } from '../Modal/Brand/ConfirmEdirBrandModal.jsx';
import { DeleteBrandModal } from '../Modal/Brand/DeleteBrandModal.jsx';
import { SiBrandfolder } from "react-icons/si";
import { checkBrandNameExists, createBrand, deleteBrand, fetchBrands, updateBrand, updateBrandStatus } from "../../../Utils/brandService.js";
import Loader from "../../Loader/Loader.jsx";
import { toast } from "react-hot-toast";
import { StatusBrandModal } from "../Modal/Brand/StatusBrandModal.jsx";
import { useSelector } from "react-redux";

const BRAND_STATUS = {
    ALL: "ALL",
    LIST: "LIST",
    UNLIST: "UNLIST"
};

const TABS = [
    { label: "All", value: BRAND_STATUS.ALL},
    { label: "List", value: BRAND_STATUS.LIST},
    { label: "Unlist", value: BRAND_STATUS.UNLIST},
]

const TABLE_HEAD = ["No", "Brand Logo","Brand Name", "Status", "Edit", "Delete"];

export default function BrandTable() {
    const token = useSelector((state) => state.auth.token);
    const [isModalOpenAddBrand, setIsModalOpenAddBrand] = useState(false);
    const [isModalOpenEditBrand, setIsModalOpenEditBrand] = useState(false);
    const [isModalOpenConfirmEditBrand, setIsModalOpenConfirmEditBrand] = useState(false);
    const [isModalOpenDeleteBrand, setIsModalOpenDeleteBrand] = useState(false);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBrandId, setSelectedBrandId] = useState(null); 
    const [isModalOpenStatusBrand, setIsModalOpenStatusBrand] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [editingBrand, setEditingBrand] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(BRAND_STATUS.ALL);
    const [searchQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBrands, setFilteredBrands] = useState([]);


    useEffect(() => {
        const loadBrands = async () => {
            setLoading(true);
            try {
                const statusFilter = selectedStatus === BRAND_STATUS.ALL ? "" : selectedStatus;
                const data = await fetchBrands(currentPage, 10, statusFilter, searchQuery);
                setBrands(data.brands);
                setTotalPages(data.totalPages);
                
            } catch (error) {
                console.error("Error loading brands:", error.message);
            } finally {
                setLoading(false);
            }
        };

        loadBrands();
    }, [currentPage, selectedStatus, searchQuery]);

    useEffect (() => {
        let filtered = brands;

        if(selectedStatus !== BRAND_STATUS.ALL) {
            filtered = brands.filter((brand) => brand.status === selectedStatus);
        }

        if(searchTerm.trim() !== "") {
            filtered = filtered.filter((brand) => 
                brand.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredBrands(filtered);
    }, [brands, searchTerm, selectedStatus]);

    const handleSearchChnage = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleSaveBrand = async (brandData) => {
        try {
            const data = await createBrand(brandData);
            console.log("Brand created successfully:", data);
            toast.success("Brand added successfully")
            setIsModalOpenAddBrand(false);
            setBrands((prevBrands) => [...prevBrands, data.brand]);
        } catch (error) {
            console.error("Error saving brand:", error);
        }
    };

    const handleEditBrand = (brand) => {
        setEditingBrand(brand); 
        setIsModalOpenEditBrand(true);
    };

    // const handleUpdateBrand = async (brand) => {
    //         if (!token) {
    //             console.error("No authentication token found");
    //             return;
    //         }
        
    //         if (brand.name !== editingBrand.name) {
    //             try {
    //                 const { exists, message } = await checkBrandNameExists(brand.name, token);
    //                 if (exists) {
    //                     setEditingBrand({ ...brand, errorMessage: message });
    //                     return;
    //                 }
    //             } catch (error) {
    //                 console.error("Error validating brand name:", error.message);
    //                 setEditingBrand({ ...brand, errorMessage: error.message });
    //                 return;
    //             }
    //         }
        
    //         setEditingBrand(brand);
    //         setIsModalOpenEditBrand(false);
    //         setIsModalOpenConfirmEditBrand(true);
    //     };

    const handleUpdateBrand = async (brand) => {
        if (!token) {
            console.error("No authentication token found");
            return;
        }
    
        if (brand.name !== editingBrand.name) {
            try {
                const { exists, message } = await checkBrandNameExists(brand.name, token);
                if (exists) {
                    setEditingBrand({ ...brand, errorMessage: message }); // Set error message
                    return; // Stop further execution
                }
            } catch (error) {
                console.error("Error validating brand name:", error.message);
                setEditingBrand({ ...brand, errorMessage: error.message });
                return;
            }
        }
    
        setEditingBrand(brand);
        setIsModalOpenEditBrand(false);
        setIsModalOpenConfirmEditBrand(true);
    };
    
    
    const handleConfirmUpdateBrand = async () => {
        try {
            const data = await updateBrand(editingBrand._id, editingBrand); 
            console.log("Brand updated:", data);
            toast.success("Brand updated successfully");
            setBrands((prevBrands) =>
                prevBrands.map((b) =>
                    b._id === editingBrand._id ? { ...b, name: editingBrand.name, logo: editingBrand.logo } : b
                )
            );
            setIsModalOpenConfirmEditBrand(false); 
        } catch (error) {
            console.error("Error updating brand:", error);
            //toast.error("Failed to update brand");
        }
    };

    const handleDeleteBrand = async (brandId) => {
        try {
            const data = await deleteBrand(brandId);
            console.log("Brand deleted successfully:", data);
            toast.success("Brand deleted successfully");
            setIsModalOpenDeleteBrand(false);
            setBrands((prevBrands) => prevBrands.filter((brand) => brand._id !== brandId));
        } catch (error) {
            console.error("Error deleting brand:", error);
            toast.error("Error deleting brand");
        }
    };

    const handleStatusBrand = async (brand) => {
        const updatedStatus = brand.status === "LIST" ? "UNLIST" : "LIST";
    
        try {
            const result = await updateBrandStatus(brand._id, { status: updatedStatus }, token);
    
            if (result.success) {
                setBrands((prevBrands) =>
                    prevBrands.map((b) =>
                        b._id === brand._id ? { ...b, status: updatedStatus } : b
                    )
                );
                console.log("Brand status updated successfully!");
                toast.success("Brand status updated successfully");
                setIsModalOpenStatusBrand(false);
            } else {
                console.error("Failed to update brand status:", result.message);
            }
        } catch (err) {
            console.error("Error updating brand status:", err);
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
                        Brand list
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all Brands
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button
                            onClick={() => setIsModalOpenAddBrand(true)}
                            className="flex items-center gap-3" size="sm">
                            <SiBrandfolder  className="h-4 w-4" /> Add Brand
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
                    <div className="w-full md:w-72">
                        <Input
                            label="Search"
                            value={searchTerm}
                            onChange={handleSearchChnage}
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        />
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
                        { filteredBrands.length > 0 ? (
                            filteredBrands.map(
                            (brand, index) => {
                                const listingNumber = (currentPage - 1) * 10 + index + 1;
                                const isLast = index === brands.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
            
                            return (
                                <tr key={brand._id}>
                                    <td className="py-3 px-4 text-center">{listingNumber}</td>

                                    <td className={classes}>
                                        <div className="flex  items-center gap-3">
                                        <img 
                                            src={brand.logo} 
                                            alt={brand.name} 
                                            size="sm" 
                                            className="w-[90px] h-[20px] object-cover"
                                        />
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <div className="flex  items-center gap-3">
                                        
                                            <div className="flex flex-col">
                                                <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                                >
                                                {brand.name}
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
                                                value={brand.status}
                                                color={brand.status === "LIST" ? "green" : "red"}
                                                onClick={() => {
                                                    setSelectedBrand(brand);
                                                    setIsModalOpenStatusBrand(true);
                                                }}
                                            />
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <Tooltip content="Edit Brand">
                                            <IconButton variant="text">
                                                <PencilIcon 
                                                onClick={() => handleEditBrand(brand)}
                                                className="h-4 w-4 text-blue-900" />
                                            </IconButton>
                                        </Tooltip>
                                    </td>

                                    <td className={classes}>
                                        <Tooltip content="Delete Brand">
                                            <IconButton variant="text">
                                                <TrashIcon 
                                                onClick={() => {
                                                    setSelectedBrandId(brand._id);  
                                                    setIsModalOpenDeleteBrand(true); 
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
                                        No brands to display
                                    </Typography>

                                </td>
                            </tr>
                        )}
                    </tbody>
                    <AddBrandModal
                        open={isModalOpenAddBrand}
                        setOpen={setIsModalOpenAddBrand}
                        saveBrand={handleSaveBrand}
                    />

                    <EditBrandModal
                        open={isModalOpenEditBrand}
                        setOpen={setIsModalOpenEditBrand}
                        saveBrand={() => handleUpdateBrand(editingBrand)}
                        brand={editingBrand}
                        setEditingBrand={setEditingBrand}
                        existingBrands={brands}
                    />
                
                    <ConfirmEditBrandModal
                        open={isModalOpenConfirmEditBrand}
                        setOpen={setIsModalOpenConfirmEditBrand}
                        saveBrand={handleConfirmUpdateBrand} 
                        brand={editingBrand}
                    />

                    <DeleteBrandModal
                        open={isModalOpenDeleteBrand}
                        setOpen={setIsModalOpenDeleteBrand}
                        deleteBrand={() => handleDeleteBrand(selectedBrandId)} 
                        brand={selectedBrand}
                    />

                    <StatusBrandModal
                        open={isModalOpenStatusBrand}
                        setOpen={setIsModalOpenStatusBrand}
                        brand={selectedBrand}
                        handleStatusChange={handleStatusBrand}
                    />

                </table>
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