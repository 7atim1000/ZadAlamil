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
import { AddCouponModal } from '../Modal/Coupon/AddCouponModal';
import { EditCouponModal } from '../Modal/Coupon/EditCouponModal';
import { ConfirmEditCouponModal } from '../Modal/Coupon/ConfirmEditCouponModal';
import { DeleteCouponModal } from '../Modal/Coupon/DeleteCouponModal';
import { SiBrandfolder } from "react-icons/si";
import Loader from "../../Loader/Loader.jsx";
import { toast } from "react-hot-toast";
import { StatusCouponModal } from "../Modal/Coupon/StatusCouponModal.jsx";
import { useSelector } from "react-redux";
import { checkCouponNameExists, createCoupon, deleteCoupon, fetchCoupons, updateCoupon, updateCouponStatus } from "../../../Utils/couponService.js";

const COUPON_STATUS = {
    ALL: "ALL",
    LIST: "LIST",
    UNLIST: "UNLIST",
};

const TABS = [
    { label: "All", value: COUPON_STATUS.ALL },
    { label: "List", value: COUPON_STATUS.LIST },
    { label: "Unlist", value: COUPON_STATUS.UNLIST },
];

const TABLE_HEAD = ["No", "Coupon Name", "Status", "Expiry Date","Activity", "Edit", "Delete"];

export default function CouponTable() {
    const token = useSelector((state) => state.auth.token);
    const [isModalOpenAddCoupon, setIsModalOpenAddCoupon] = useState(false);
    const [isModalOpenEditCoupon, setIsModalOpenEditCoupon] = useState(false);
    const [isModalOpenConfirmEditCoupon, setIsModalOpenConfirmEditCoupon] = useState(false);
    const [isModalOpenDeleteCoupon, setIsModalOpenDeleteCoupon] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCouponId, setSelectedCouponId] = useState(null); 
    const [isModalOpenStatusCoupon, setIsModalOpenStatusCoupon] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(COUPON_STATUS.ALL);
    const [searchQuery] = useState("");
    const couponsPerPage = 10;


    useEffect(() => {
        const loadCoupons = async () => {
            setLoading(true);
            try {
                const statusFilter = selectedStatus === COUPON_STATUS.ALL ? "" : selectedStatus;
                const data = await fetchCoupons(currentPage, 10, statusFilter, searchQuery);
                setCoupons(data.coupons);
                setTotalPages(data.totalPages);
                
            } catch (error) {
                console.error("Error loading coupons:", error.message);
            } finally {
                setLoading(false);
            }
        };

        loadCoupons();
    }, [currentPage, selectedStatus, searchQuery]);

    useEffect(() => {
        let filtered = coupons;
    
        if (selectedStatus !== COUPON_STATUS.ALL) {
            filtered = coupons.filter((coupon) => coupon.status === selectedStatus);
        }
    
        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((coupon) =>
                coupon.couponCode && coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase())

            );
        }
        setFilteredCoupons(filtered);
    }, [coupons, searchTerm, selectedStatus]);
    
    
        
    
        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
        };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleSaveCoupon = async (couponData) => {
        console.log(couponData);
        try {
            const data = await createCoupon(couponData);
            console.log("Coupon created successfully:", data);
            toast.success("Coupon added successfully")
            setIsModalOpenAddCoupon(false);
            setCoupons((prevCoupons) => [...prevCoupons, data.coupon]);
        } catch (error) {
            console.error("Error saving coupon:", error);
        }
    };

    const handleEditCoupon = (coupon) => {
        setEditingCoupon(coupon); 
        setIsModalOpenEditCoupon(true);
    };

    const handleUpdateCoupon = async (coupon) => {
        if (!token) {
            console.error("No authentication token found");
            return;
        }
    
        if (coupon.name !== editingCoupon.name) {
            try {
                const { exists, message } = await checkCouponNameExists(coupon.name, token);
                if (exists) {
                    setEditingCoupon({ ...coupon, errorMessage: message }); 
                    return; 
                }
            } catch (error) {
                console.error("Error validating coupon name:", error.message);
                setEditingCoupon({ ...coupon, errorMessage: error.message });
                return;
            }
        }
    
        setEditingCoupon(coupon);
        setIsModalOpenEditCoupon(false);
        setIsModalOpenConfirmEditCoupon(true);
    };
    
    
    const handleConfirmUpdateCoupon = async () => {
        try {
            const data = await updateCoupon(editingCoupon._id, editingCoupon); 
            console.log("Coupon updated:", data);
            toast.success("Coupon updated successfully");
            setCoupons((prevCoupons) =>
                prevCoupons.map((b) =>
                    b._id === editingCoupon._id ? { ...b, couponCode: editingCoupon.couponCode} : b
                )
            );
            setIsModalOpenConfirmEditCoupon(false); 
        } catch (error) {
            console.error("Error updating coupon:", error);
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        try {
            const data = await deleteCoupon(couponId);
            console.log("Coupon deleted successfully:", data);
            toast.success("Coupon deleted successfully");
            setIsModalOpenDeleteCoupon(false);
            setCoupons((prevCoupons) => prevCoupons.filter((coupon) => coupon._id !== couponId));
        } catch (error) {
            console.error("Error deleting coupon:", error);
            toast.error("Error deleting coupon");
        }
    };

    const handleStatusCoupon = async (coupon) => {
        const updatedStatus = coupon.status === "LIST" ? "UNLIST" : "LIST";
    
        try {
            const result = await updateCouponStatus(coupon._id, { status: updatedStatus }, token);
    
            if (result.success) {
                setCoupons((prevCoupons) =>
                    prevCoupons.map((b) =>
                        b._id === coupon._id ? { ...b, status: updatedStatus } : b
                    )
                );
                console.log("Coupon status updated successfully!");
                toast.success("Coupon status updated successfully");
                setIsModalOpenStatusCoupon(false);
            } else {
                console.error("Failed to update coupon status:", result.message);
            }
        } catch (err) {
            console.error("Error updating coupon status:", err);
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
                        Coupon list
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all Coupons
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button
                            onClick={() => setIsModalOpenAddCoupon(true)}
                            className="flex items-center gap-3" size="sm">
                            <SiBrandfolder  className="h-4 w-4" /> Add Coupon
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
                        { filteredCoupons.length > 0 ? (
                            filteredCoupons.map(
                            (coupon, index) => {
                                const isLast = index === coupons.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                                const startIndex = (currentPage - 1) * couponsPerPage;
                                const rowIndex = startIndex + index + 1;
            
                            return (
                                <tr key={coupon._id}>
                                    <td className="py-3 px-4 text-center">{rowIndex}</td>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            
                                            <div className="flex flex-col">
                                                <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                                >
                                                {coupon.couponCode}
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
                                                value={coupon.status}
                                                color={coupon.status === "LIST" ? "green" : "red"}
                                                onClick={() => {
                                                    setSelectedCoupon(coupon);
                                                    setIsModalOpenStatusCoupon(true);
                                                }}
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
                                                {coupon.expiryDate}
                                                </Typography>
                                                
                                            </div>
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <Typography
                                                variant="small"
                                                color={new Date(coupon.expiryDate) > new Date() ? "green":"red"}
                                                className="font-medium"
                                        >
                                            {new Date(coupon.expiryDate) > new Date() ? "Active":"Expired"}
                                        </Typography>
                                    </td>

                                    <td className={classes}>
                                        <Tooltip content="Edit Coupon">
                                            <IconButton variant="text">
                                                <PencilIcon 
                                                onClick={() => handleEditCoupon(coupon)}
                                                className="h-4 w-4 text-blue-900" />
                                            </IconButton>
                                        </Tooltip>
                                    </td>

                                    <td className={classes}>
                                        <Tooltip content="Delete Coupon">
                                            <IconButton variant="text">
                                                <TrashIcon 
                                                onClick={() => {
                                                    setSelectedCouponId(coupon._id);  
                                                    setIsModalOpenDeleteCoupon(true); 
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
                                        No coupons to display
                                    </Typography>

                                </td>
                            </tr>
                        )}
                    </tbody>
                    <AddCouponModal
                        open={isModalOpenAddCoupon}
                        setOpen={setIsModalOpenAddCoupon}
                        saveCoupon={handleSaveCoupon}
                    />

                    <EditCouponModal
                        open={isModalOpenEditCoupon}
                        setOpen={setIsModalOpenEditCoupon}
                        saveCoupon={() => handleUpdateCoupon(editingCoupon)}
                        coupon={editingCoupon}
                        setEditingCoupon={setEditingCoupon}
                        existingCoupons={coupons}
                    />
                
                    <ConfirmEditCouponModal
                        open={isModalOpenConfirmEditCoupon}
                        setOpen={setIsModalOpenConfirmEditCoupon}
                        saveCoupon={handleConfirmUpdateCoupon} 
                        coupon={editingCoupon}
                    />

                    <DeleteCouponModal
                        open={isModalOpenDeleteCoupon}
                        setOpen={setIsModalOpenDeleteCoupon}
                        deleteCoupon={() => handleDeleteCoupon(selectedCouponId)} 
                        coupon={selectedCoupon}
                    />

                    <StatusCouponModal
                        open={isModalOpenStatusCoupon}
                        setOpen={setIsModalOpenStatusCoupon}
                        coupon={selectedCoupon}
                        handleStatusChange={handleStatusCoupon}
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