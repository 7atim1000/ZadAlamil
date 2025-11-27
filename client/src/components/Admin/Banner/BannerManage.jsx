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
import { AddBannerModal } from '../Modal/Banner/AddBannerModal.jsx';
import { EditBannerModal } from '../Modal/Banner/EditBannerModal.jsx';
import { ConfirmEditBannerModal } from '../Modal/Banner/ConfirmEditBannerModal.jsx';
import { DeleteBannerModal } from "../Modal/Banner/DeleteBannerModal.jsx";
import { StatusBannerModal } from "../Modal/Banner/StatusBannerModal.jsx";
import { SiBrandfolder } from "react-icons/si";
import Loader from "../../Loader/Loader.jsx";
import { checkBannerNameExists, createBanner, deleteBanner, fetchBanners, updateBanner, updateBannerStatus } from "../../../Utils/bannerService.js";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const BANNER_STATUS = {
    ALL: "ALL",
    ACTIVATED: "ACTIVATED",
    DEACTIVATED: "DEACTIVATED",
};

const TABS = [
    { label: "All", value: BANNER_STATUS.ALL },
    { label: "Activated", value: BANNER_STATUS.ACTIVATED },
    { label: "Deactivated", value: BANNER_STATUS.DEACTIVATED },
];

const TABLE_HEAD = ["No", "Banner Name", "Banner Image", "Status", "Edit", "Delete"];

export default function BannerTable() {
    const token = useSelector((state) => state.auth.token);
    const [isModalOpenAddBanner, setIsModalOpenAddBanner] = useState(false);
    const [isModalOpenEditBanner, setIsModalOpenEditBanner] = useState(false);
    const [isModalOpenConfirmEditBanner, setIsModalOpenConfirmEditBanner] = useState(false);
    const [isModalOpenDeleteBanner, setIsModalOpenDeleteBanner] = useState(false);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBannerId, setSelectedBannerId] = useState(null); 
    const [isModalOpenStatusBanner, setIsModalOpenStatusBanner] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [editingBanner, setEditingBanner] = useState(null);
    const [filteredBanners, setFilteredBanners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(BANNER_STATUS.ALL);
    const [searchQuery] = useState("");
    const bannersPerPage = 10;

    useEffect(() => {
        const loadBanners = async () => {
            setLoading(true);
            setBanners([]);
            try {
                const statusFilter = selectedStatus === BANNER_STATUS.ALL ? "" : selectedStatus;
                const data = await fetchBanners(currentPage, 10, statusFilter, searchQuery);
                console.log("Fetched banners response:", data);
                setBanners(data.banners);
                setTotalPages(data.totalPages);
                
            } catch (error) {
                console.error("Error loading banners:", error.message);
            } finally {
                setLoading(false);
            }
        };

        loadBanners();
    }, [currentPage, selectedStatus, searchQuery]);

    useEffect(() => {
            let filtered = banners;
        
            if (selectedStatus !== BANNER_STATUS.ALL) {
                filtered = banners.filter((banner) => banner.status === selectedStatus);
            }
        
            if (searchTerm.trim() !== "") {
                filtered = filtered.filter((banner) =>
                    banner.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            setFilteredBanners(filtered);
        }, [banners, searchTerm, selectedStatus]);
        
    
        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleSaveBanner = async (bannerData) => {
        try {
            const data = await createBanner(bannerData);
            toast.success("Banner added successfully");
            setIsModalOpenAddBanner(false);
            setBanners((prevBanners) => [...prevBanners, data.banner]); 
        } catch (error) {
            console.error("Error saving banner:", error);
            toast.error("Error saving banner");
        }
    };
    

    const handleEditBanner = (banner) => {
        setEditingBanner(banner); 
        setIsModalOpenEditBanner(true);
    };

    const handleUpdateBanner = async (banner) => {
        if (!token) {
            console.error("No authentication token found");
            return;
        }
    
        if (banner.name !== editingBanner.name) {
            try {
                const { exists, message } = await checkBannerNameExists(banner.name, token);
                if (exists) {
                    setEditingBanner({ ...banner, errorMessage: message });
                    return;
                }
            } catch (error) {
                console.error("Error validating banner name:", error.message);
                setEditingBanner({ ...banner, errorMessage: error.message });
                return;
            }
        }
    
        setEditingBanner(banner);
        setIsModalOpenEditBanner(false);
        setIsModalOpenConfirmEditBanner(true);
    };
    
    
    const handleConfirmUpdateBanner = async () => {
        try {
            const data = await updateBanner(editingBanner._id, editingBanner); 
            console.log("Banner updated:", data);
            toast.success("Banner updated successfully");
            setBanners((prevBanners) =>
                prevBanners.map((b) =>
                    b._id === editingBanner._id ? { ...b, name: editingBanner.name, logo: editingBanner.logo } : b
                )
            );
            setIsModalOpenConfirmEditBanner(false); 
        } catch (error) {
            console.error("Error updating banner:", error);
        }
    };

    const handleDeleteBanner = async (bannerId) => {
        try {
            const data = await deleteBanner(bannerId);
            console.log("Banner deleted successfully:", data);
            toast.success("Banner deleted successfully");
            setIsModalOpenDeleteBanner(false);
            setBanners((prevBanners) => prevBanners.filter((banner) => banner._id !== bannerId));
        } catch (error) {
            console.error("Error deleting banner:", error);
            toast.error("Error deleting banner");
        }
    };

    const handleStatusBanner = async (banner) => {
        const updatedStatus = banner.status === "ACTIVATED" ? "DEACTIVATED" : "ACTIVATED";
    
        try {
            const result = await updateBannerStatus(banner._id, { status: updatedStatus }, token);
    
            if (result.success) {
                setBanners((prevBanners) =>
                    prevBanners.map((b) =>
                        b._id === banner._id ? { ...b, status: updatedStatus } : b
                    )
                );
                console.log("Banner status updated successfully!");
                toast.success("Banner status updated successfully");
                setIsModalOpenStatusBanner(false);
            } else {
                console.error("Failed to update banner status:", result.message);
            }
        } catch (err) {
            console.error("Error updating banner status:", err);
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
                        Banner list
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all Banners
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button
                            onClick={() => setIsModalOpenAddBanner(true)}
                            className="flex items-center gap-3" size="sm">
                            <SiBrandfolder  className="h-4 w-4" /> Add Banner
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
                        { filteredBanners.length > 0 ? (
                            filteredBanners.map(
                            (banner, index) => {
                                const isLast = index === banners.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                                const startIndex = (currentPage - 1) * bannersPerPage;
                                const rowIndex = startIndex + index + 1;
            
                            return (
                                <tr key={banner._id}>
                                    <td className="py-3 px-4 text-center">{rowIndex}</td>

                                    <td className={classes}>
                                    <div className="flex items-center gap-3 w-10 mt-5">
                                                    
                                        <img 
                                            src={banner.bannerImg} 
                                            alt={banner.name} 
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
                                                {banner.name}
                                                </Typography>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className={classes}>
                                        <div className="w-max">
                                            <Chip
                                                variant="ghost"
                                                className="w-24 items-center justify-center cursor-pointer"
                                                size="sm"
                                                value={banner.status}
                                                color={banner.status === "ACTIVATED" ? "green" : "red"}
                                                onClick={() => {
                                                    setSelectedBanner(banner);
                                                    setIsModalOpenStatusBanner(true);
                                                }}
                                            />
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <Tooltip content="Edit Banner">
                                            <IconButton variant="text">
                                                <PencilIcon 
                                                onClick={() => handleEditBanner(banner)}
                                                className="h-4 w-4 text-blue-900" />
                                            </IconButton>
                                        </Tooltip>
                                    </td>

                                    <td className={classes}>
                                        <Tooltip content="Delete Banner">
                                            <IconButton variant="text">
                                                <TrashIcon 
                                                onClick={() => {
                                                    setSelectedBannerId(banner._id);  
                                                    setIsModalOpenDeleteBanner(true); 
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
                                        No banner to display
                                    </Typography>

                                </td>
                            </tr>
                        )}
                    </tbody>

                    <AddBannerModal
                        open={isModalOpenAddBanner}
                        setOpen={setIsModalOpenAddBanner}
                        saveBanner={handleSaveBanner}
                    />

                    <EditBannerModal
                        open={isModalOpenEditBanner}
                        setOpen={setIsModalOpenEditBanner}
                        saveBanner={handleUpdateBanner} 
                        banner={editingBanner}
                        setEditingBanner={setEditingBanner}
                        existingBanners={banners}
                    />
                
                    <ConfirmEditBannerModal
                        open={isModalOpenConfirmEditBanner}
                        setOpen={setIsModalOpenConfirmEditBanner}
                        saveBanner={handleConfirmUpdateBanner} 
                        banner={editingBanner}
                    />

                    <DeleteBannerModal
                        open={isModalOpenDeleteBanner}
                        setOpen={setIsModalOpenDeleteBanner}
                        deleteBanner={() => handleDeleteBanner(selectedBannerId)} 
                        banner={selectedBanner}
                    />

                    <StatusBannerModal
                        open={isModalOpenStatusBanner}
                        setOpen={setIsModalOpenStatusBanner}
                        banner={selectedBanner}
                        handleStatusChange={handleStatusBanner}
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