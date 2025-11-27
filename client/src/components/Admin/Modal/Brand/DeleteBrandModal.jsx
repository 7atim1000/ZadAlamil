import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from 'react';

export function DeleteBrandModal({ open, setOpen, deleteBrand }) {
    const [loading, setLoading] = useState(false); 

    const handleDelete = () => {
        setLoading(true); 
        deleteBrand()
        .finally(() => {
            setLoading(false);
            setOpen(false); 
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
                        <span className="text-xl font-bold">Confirm Delete Brand</span>
                        <Button
                            variant="text"
                            color="black"
                            onClick={() => setOpen(false)}
                            className="p-0 text-sm"
                        >
                            <span className="material-icons">x</span>
                        </Button>
                    </div>
                </DialogHeader>
                <DialogBody>
                    <div className="flex justify-between w-full">
                        <h3>Are you sure you want to delete the Brand?</h3>
                    </div>
                </DialogBody>
                <DialogFooter className='mt-5 flex justify-between'>
                    <Button
                        variant="text"
                        color="black"
                        onClick={() => setOpen(false)}
                        className="border-2 border-black px-6 py-2"
                    >
                        <span>CANCEL</span>
                    </Button>
                    <Button
                        className='bg-red-900 text-white px-6 py-2'
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                            ) : (
                            <span>DELETE</span>
                        )}
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

DeleteBrandModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  deleteBrand: PropTypes.func.isRequired,
  brand: PropTypes.shape({
    name: PropTypes.string.isRequired,
    }).isRequired,
};