import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import { TrashIcon } from "@heroicons/react/24/solid";
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
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import { deleteVendor, fetchVendors, updateVendorStatus } from "../../../Utils/vendorService.js";
import { DeleteAprovedVendorModal } from "../Modal/ApprovedVendor/DeleteApprovedVendorModal.jsx";
import { StatusAprovedVendorModal } from "../Modal/ApprovedVendor/StatusAproveVendorModal.jsx";
   
const TABS = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Blocked",
      value: "blocked",
    },
    {
      label: "Unblocked",
      value: "unblocked",
    },
];
   
const TABLE_HEAD = ["No", "Vendor", "Email", "Status", "Phone Number", "Delete"];
   
export function ApprovedVendorTable() {
    const [isModalOpenDeleteVendor, setIsModalOpenDeleteVendor] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpenStatusVendor, setIsModalOpenStatusVendor] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);

    useEffect(() => {
        const loadVendors = async () => {
            setLoading(true);
            setVendors([]);
            try {
                const data = await fetchVendors(currentPage, 5);
                if(data.length === 0) {
                    setError("No vendors availbale");
                } else{
                    setVendors(data.vendors);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                if (error.message.includes("Unauthorized")) {
                    toast.error(error.message);
                } else {
                    toast.error("Failed to load vendors. Please try again.");
                    setLoading(false);
                }
            } finally {
                setLoading(false);
            }
        };
        loadVendors();
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleDeleteVendor = async (vendor) => {
        if (!vendor || !vendor._id) {
            console.error("Invalid vendor object:", vendor);
            return;
        }
        try {
            await deleteVendor(vendor._id);
            setVendors((prevVendors) => prevVendors.filter((u) => u._id !== vendor._id));
            toast.success("Vendor deleted successfully");
        } catch (error) {
            toast.error("Failed to delete vendor");
            console.error(error);
        } finally {
            setIsModalOpenDeleteVendor(false);
        }
    };

    const handleStatusVendor = async (vendor) => {
            const updatedStatus = vendor.status === "UNBLOCKED" ? "BLOCKED" : "UNBLOCKED";
        
            try {
                const result = await updateVendorStatus(vendor._id, { status: updatedStatus });
        
                if (result.success) {
                    setVendors((prevVendors) =>
                        prevVendors.map((b) =>
                            b._id === vendor._id ? { ...b, status: updatedStatus } : b
                        )
                    );
                    console.log("Vendor status updated successfully!");
                    toast.success("Vendor status updated successfully");
                    setIsModalOpenStatusVendor(false);
                } else {
                    console.error("Failed to update vendor status:", result.message);
                }
            } catch (err) {
                console.error("Error updating vendor status:", err);
            }
        };
        
    return (
        <Card className="h-full w-full ">
            {loading ? (
                <Loader />
            ) : error ? (
                <tr>
                    <td colSpan="6" className="text-center">{error}</td>
                </tr>
            ) : (
                <>
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Approved Vendor&apos;s Management
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all vendors
                        </Typography>
                    </div>
                </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <Tabs value={selectedTab} onChange={setSelectedTab} className="w-full md:w-max">
                    <TabsHeader>
                        {TABS.map(({ label, value }) => (
                        <Tab key={value} value={value}>
                            &nbsp;&nbsp;{label}&nbsp;&nbsp;
                        </Tab>
                        ))}
                    </TabsHeader>
                </Tabs>
                <div className="w-full md:w-72">
                    <Input
                        label="Search"
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
                                        {vendors?.map((vendor, index) => {
                                            const isLast = index === vendors.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";
                                            const userIndex = (currentPage - 1) * 10 + index + 1;

                                            return (
                                                <tr key={vendor._id}>
                                                    <td className="py-3 px-4 text-center">{userIndex}</td>
                                                    <td className={classes}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-normal"
                                                                >
                                                                    {vendor.name}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {vendor.email}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="w-max">
                                                            <Chip
                                                                variant="ghost"
                                                                size="sm"
                                                                value={vendor.status}
                                                                color={vendor.status === "UNBLOCKED" ? "green" : "red"}
                                                                onClick={() => {
                                                                    setSelectedVendor(vendor);
                                                                    setIsModalOpenStatusVendor(true);
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {vendor.phone}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Tooltip content="Delete Vendor">
                                                            <IconButton
                                                                onClick={() => {
                                                                    setSelectedVendor(vendor);
                                                                    setIsModalOpenDeleteVendor(true);
                                                                }}
                                                                variant="text"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {/* Show empty state when vendors is empty or undefined */}
                                        {!vendors?.length && (
                                            <tr>
                                                <td colSpan={TABLE_HEAD.length} className="text-center p-4">
                                                    <Typography variant="small" color="red" className="font-medium text-md">
                                                        No vendor to display
                                                    </Typography>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                    
                    {/* <tbody>
                        { vendors.length > 0 ? (
                            vendors.map((vendor, index)  => {
                            const isLast = index === vendors.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";
                                const userIndex = (currentPage - 1) * 10 + index + 1;
            
                            return (
                                <tr key={vendor._id}>
                                <td className="py-3 px-4 text-center">{userIndex}</td>
                                <td className={classes}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                            >
                                            {vendor.name}
                                            </Typography>
                                        </div>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="flex flex-col">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {vendor.email}
                                        </Typography>
                                    </div>
                                </td>
                                <td className={classes}>
                                    <div className="w-max">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={vendor.status}
                                            color={vendor.status === "UNBLOCKED" ? "green" : "red"}
                                            onClick={() => {
                                                setSelectedVendor(vendor);
                                                setIsModalOpenStatusVendor(true);
                                            }}
                                        />
                                    </div>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {vendor.phone}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Tooltip content="Delete Vendor">
                                    <IconButton 
                                        onClick={() => {
                                            setSelectedVendor(vendor);
                                            setIsModalOpenDeleteVendor(true);
                                        }}
                                        variant="text"
                                    >
                                        <TrashIcon className="h-4 w-4" />
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
                                        No vendor to display
                                    </Typography>
                                </td>
                            </tr>
                        )}
                        
                    </tbody> */}
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

            <DeleteAprovedVendorModal
                open={isModalOpenDeleteVendor}
                setOpen={setIsModalOpenDeleteVendor}
                deleteVendor={() => handleDeleteVendor(selectedVendor)} 
                vendor={selectedVendor}
            />

            <StatusAprovedVendorModal
                open={isModalOpenStatusVendor}
                setOpen={setIsModalOpenStatusVendor}
                vendor={selectedVendor}
                handleStatusChange={handleStatusVendor}
            />
      </Card>
    );
}