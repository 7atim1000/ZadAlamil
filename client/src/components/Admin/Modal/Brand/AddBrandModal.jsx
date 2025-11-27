import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useEffect, useState } from 'react';

export function AddBrandModal({ open, setOpen, saveBrand }) {
    const [brandName, setBrandName] = useState(""); 
    const [logo, setLogo] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); 
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        if (open) {
            setBrandName(""); 
            setLogoPreview(null);
            setError("");
        }
    }, [open]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (validImageTypes.includes(file.type)) {
                setLogo(file);
                setLogoPreview(URL.createObjectURL(file));
                setError(""); 
            } else {
                setLogo(null);
                setLogoPreview(null);
                setError("Invalid file type. Only PNG, JPG, and JPEG are allowed.");
            }
        }
    };

    const handleSubmit = () => {
        if (!brandName.trim() || !logo) {
            setError("Please provide both brand name and logo.");
            return;
        }
        const formData = new FormData();
        formData.append("name", brandName);
        formData.append("logo", logo);
        setLoading(true); 
        saveBrand(formData)
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
                        <span className="text-xl font-bold">Add Brand</span>
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
                    <label className="text-sm font-medium">Brand Name</label>
                    <div>
                        <input
                            type="text"
                            placeholder="Brand Name"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                        />
                    </div>

                    <label className="text-sm font-medium mt-4">Logo (PNG, JPG, JPEG)</label>
                        <div>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        { logoPreview && (
                            <div className='mt-4'>
                                <img
                                    src={logoPreview}
                                    alt='Logo Preview'
                                    className='w-20 rounded-lg'
                                />

                            </div>
                        )}

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

AddBrandModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveBrand: PropTypes.func.isRequired,
};
