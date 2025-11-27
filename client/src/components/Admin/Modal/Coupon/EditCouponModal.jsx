import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function EditCouponModal({ open, setOpen, saveCoupon, coupon, setEditingCoupon, existingCoupons=[] }) {
    const handleSave = () => {
        if (!coupon.couponCode.trim()) {
            setEditingCoupon({
                ...coupon,
                errorMessage: "Coupon name is required",
            });
            return;
        }
        const isDuplicate = existingCoupons.some(
            (existingCoupon) =>
                existingCoupon.couponCode === coupon.couponCode && existingCoupon._id !== coupon._id
        );
    
        if (isDuplicate) {
            setEditingCoupon({
                ...coupon,
                errorMessage: "This coupon name already exists.",
            });
            return;
        }
    
        setEditingCoupon({
            ...coupon,
            errorMessage: "",
        });
    
        saveCoupon(coupon);
    }; 
    return (
        <Dialog
            open={open}
            handler={() => setOpen(false)}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.0, y: -100 },
            }}
            className='border-2 border-gray-300'
            >
            <div className='p-6'>
                <DialogHeader>
                    <div className="flex justify-between w-full">
                        <span className="text-xl font-bold">Add Coupon</span>
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
                <form className="items-center">
                    <label className="text-sm font-medium">Coupon Code</label>
                    <div className='mb-5'>
                        <input
                            type="text"
                            value={coupon?.couponCode || ""}
                            onChange={(e) => setEditingCoupon({
                                ...coupon,
                                couponCode: e.target.value,
                                errorMessage: "",
                            })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
    
                    <label className="text-sm font-medium">Discount Amount</label>
                    <div className='mb-5'>
                        <input
                            type='number'
                            value={coupon?.discountAmount || ""}
                            onChange={(e) => setEditingCoupon ({
                                ...coupon,
                                discountAmount: e.target.value,
                                errorMessage: "",
                            })
                        }
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
    
                    <label className="text-sm font-medium">Description</label>
                    <div className='mb-5'>
                        <input
                            type="text"
                            value={coupon?.description || ""}
                            onChange={(e) => setEditingCoupon({
                                ...coupon,
                                description: e.target.value,
                                errorMessage: "",
                            })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
    
                    <label className="text-sm font-medium">Expiry Date</label>
                    <div >
                        <input
                            type='date'
                            placeholder="Expiry Date"
                            value={coupon?.expiryDate ? new Date(coupon.expiryDate).toISOString().split("T")[0] : ""}  
                            onChange={(e) => setEditingCoupon({
                                ...coupon,
                                expiryDate: e.target.value,
                                errorMessage: "",
                            })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
    
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
                    >
                        <span>SAVE</span>
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

EditCouponModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    saveCoupon: PropTypes.func.isRequired,
    coupon: PropTypes.object.isRequired,
    setEditingCoupon: PropTypes.func.isRequired, 
    existingCoupons: PropTypes.array.isRequired,
};
