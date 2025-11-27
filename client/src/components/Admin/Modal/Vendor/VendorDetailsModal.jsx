import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function VendorDetailsModal({ open, setOpen,requestStatusChange, vendorData }) {
    console.log(vendorData, "Vendor Data in Modal");

    const [status, setStatus] = useState("Pending");
    const [showScrollButton, setShowScrollButton] = useState(false);

    const handleSave = async () => {
        if (!vendorData?._id) {
            console.error("Vendor ID not found!");
            return;
        }
        if(vendorData?.status === "APPROVED" || vendorData?.status === "REJECTED") {
            toast.error("Status cannot be changed after approval or rejection.");
            return;
        }
        requestStatusChange(vendorData._id, status);
                setOpen(false); 
    };
    
    useEffect(() => {
        if (vendorData) {
            setStatus(vendorData.status || "Pending"); 
        }
    }, [vendorData]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = document.getElementById("modal-content")?.scrollTop || 0;
            setShowScrollButton(scrollTop > 100);
        };

        const modalContent = document.getElementById("modal-content");
        modalContent?.addEventListener("scroll", handleScroll);

        return () => {
            modalContent?.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        const modalContent = document.getElementById("modal-content");
        if (modalContent) modalContent.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Dialog
            open={open}
            handler={() => setOpen(false)}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.0, y: -100 },
            }}
            className='border-2 border-gray-300 overflow-auto'
        >
            <div className='p-6'>
                <DialogHeader>
                    <div className="flex justify-between w-full">
                        <span className="text-xl font-bold">Vendor Details</span>
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

                <DialogBody id="modal-content" className="max-h-[400px] overflow-y-auto relative">
                    <div className="bg-white p-8">
                        <div className="flex items-center mb-4">
                            <img
                                src={vendorData?.livePhoto}
                                alt={vendorData?.name || "Vendor"}
                                className="w-20 h-20 rounded-full"
                            />
                            <h1 className="ml-4 text-lg font-bold">{vendorData?.name || "N/A"}</h1>
                        </div>

                        <div className="text-sm text-gray-700 space-y-3 mt-10">
                            <p><span className="font-semibold">Name:</span> {vendorData?.name || "N/A"}</p>
                            <p><span className="font-semibold">Trade Name:</span> {vendorData?.tradeName || "N/A"}</p>
                            <p>
                                <span className="font-semibold">Email ID:</span> 
                                <a href={`mailto:${vendorData?.email}`} className="text-blue-500">
                                    {vendorData?.email || "N/A"}
                                </a>
                            </p>
                            <p><span className="font-semibold">National ID/Passport No:</span> {vendorData?.idNumber || "N/A"}</p>
                            <p><span className="font-semibold">Phone:</span> {vendorData?.phone || "N/A"}</p>
                            <p><span className="font-semibold">Address:</span> {vendorData?.address || "N/A"}</p>
                            <p><span className="font-semibold">Description:</span> {vendorData?.description || "N/A"}</p>
                            <p><span className="font-semibold">License No:</span> {vendorData?.licenseNumber || "N/A"}</p>
                            <p><span className="font-semibold">Issue Date:</span> {vendorData?.issuedDate || "N/A"}</p>
                            <p><span className="font-semibold">Expiry Date:</span> {vendorData?.expiryDate || "N/A"}</p>
                            <p><span className="font-semibold">Owners Name:</span> {vendorData?.ownerName || "N/A"}</p>

                           <p>
                            <span className="font-semibold">Status:</span>
                            <select
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)} 
                                className={`ml-2 p-1 border border-gray-300 rounded-md text-sm ${
                                    vendorData?.status === "APPROVED" || vendorData?.status === "REJECTED"
                                    ? "cursor-not-allowed bg-gray-200"
                                    : ""
                                } `}
                                disabled={ vendorData?.status === "APPROVED" || vendorData?.status === "REJECTED"}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="ONGOING">Ongoing</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            </p>

                        </div>
                    </div>
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
                    >
                        <span>SAVE</span>
                    </Button>
                </DialogFooter>

                {showScrollButton && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-5 right-5 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-700"
                    >
                        ↑
                    </button>
                )}
            </div>
        </Dialog>
    );
}

VendorDetailsModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    saveDetails: PropTypes.func.isRequired,
    requestStatusChange: PropTypes.func.isRequired,
    vendorData: PropTypes.object, 
};







