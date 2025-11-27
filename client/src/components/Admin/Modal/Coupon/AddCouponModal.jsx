import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useEffect, useState } from 'react';
import moment from 'moment';

export function AddCouponModal({ open, setOpen, saveCoupon }) {
    const [couponCode, setCouponCode] = useState(""); 
    const [description, setDescription] = useState("");
    const [discountAmount, setDiscountAmount] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timezone, setTimezone] = useState("");

    useEffect(() => {
            if (open) {
                setCouponCode(""); 
                setDescription("");
                setDiscountAmount("");
                setExpiryDate("");
                setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
                setError("");
            }
        }, [open]);

        const handleSubmit = () => {
            if (!couponCode || !description || !discountAmount || !expiryDate || !timezone ) {
                setError("Please provide all details");
                return;
            }
            if(Number(discountAmount) <=0) {
                setError("Discount amount must be greater than 0")
            }

            const localExpiryDate = moment.utc(expiryDate).local().format('YYYY-MM-DD');

            const couponData = {
                couponCode,
                description,
                discountAmount: Number(discountAmount),
                expiryDate: localExpiryDate,
                userTimezone: timezone,
            }

            setLoading(true); 
            saveCoupon(couponData)
            .finally(() => {
                setLoading(false);
            });
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
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon Code"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <label className="text-sm font-medium">Discount Amount</label>
                <div className='mb-5'>
                    <input
                        type='number'
                        placeholder="Discount"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <label className="text-sm font-medium">Description</label>
                <div className='mb-5'>
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <label className="text-sm font-medium">Expiry Date</label>
                <div >
                    <input
                        type='date'
                        placeholder="Expiry Date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                {error && (
                    <p className='text-red-900 text-xs mt-2'>{error}</p>
                )}

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
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                            <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                        ) : (
                            <span>SAVE</span>
                        )}
                </Button>
            </DialogFooter>
        </div>
    </Dialog>
  );
}

AddCouponModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveCoupon: PropTypes.func.isRequired,
};
