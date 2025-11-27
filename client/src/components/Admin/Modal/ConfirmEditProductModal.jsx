import { useState } from 'react';
import { Dialog, DialogHeader, Button, DialogBody, DialogFooter } from '@material-tailwind/react';

export function ConfirmEditProductModal({ open, setOpen, saveProduct }) {
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveProduct();
            // The setOpen(false) is handled in the parent component after successful update
        } catch (error) {
            setLoading(false);
            // Error is handled in parent component
        }
    };

    return (
        <Dialog
            open={open}
            handler={() => !loading && setOpen(false)}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.0, y: -100 },
            }}
            className='border-2 border-gray-300'
        >
            <div className='p-6'>
                <DialogHeader>
                    <div className="flex justify-between w-full">
                        <span className="text-xl font-bold">Confirm Update Product</span>
                        <Button
                            variant="text"
                            color="black"
                            onClick={() => !loading && setOpen(false)}
                            className="p-0 text-sm"
                            disabled={loading}
                        >
                            <span className="material-icons text-xl">×</span>
                        </Button>
                    </div>
                </DialogHeader>
                <DialogBody>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Are you sure you want to update this product?
                        </h3>
                        <p className="text-gray-600">
                            This will update the product information including vendor details.
                        </p>
                    </div>
                </DialogBody>
                <DialogFooter className='mt-5 flex justify-between'>
                    <Button
                        variant="text"
                        color="black"
                        onClick={() => !loading && setOpen(false)}
                        className="border-2 border-gray-400 px-6 py-2"
                        disabled={loading}
                    >
                        <span>CANCEL</span>
                    </Button>
                    <Button
                        className='bg-green-900 text-white px-6 py-2 rounded-md'
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="spinner-border animate-spin h-4 w-4 border-t-2 border-white rounded-full" />
                                <span>UPDATING...</span>
                            </div>
                        ) : (
                            <span>YES, UPDATE</span>
                        )}
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}