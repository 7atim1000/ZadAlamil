import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useEffect, useState } from 'react';

export function AddBannerModal({ open, setOpen, saveBanner }) {

    const [bannerName, setBannerName] = useState('');
    const [bannerImg, setBannerImg] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); 
    const [imgPreview, setImgPreview] = useState(null);

    useEffect(() => {
            if (open) {
                setBannerName(""); 
                setBannerImg(null);
            setImgPreview(null);
                setError("");
            }
        }, [open]);

    const handleBannerImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (validImageTypes.includes(file.type)) {
                setBannerImg(file);
                setImgPreview(URL.createObjectURL(file));
                setError(""); 
            } else {
                setBannerImg(null);
                setImgPreview(null);
                setError("Invalid file type. Only PNG, JPG, and JPEG are allowed.");
            }
        }
    };

    const handleSave = () => {
        if (!bannerName || !bannerImg) {
            setError("Please provide both banner name and image.");
            return;
        }
        const formData = new FormData();
        formData.append("name", bannerName);
        formData.append("bannerImg", bannerImg);
        setLoading(true); 
        saveBanner(formData)
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
                    <span className="text-xl font-bold">Add Banner</span>
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

                <label className="text-lg font-medium">Banner Text</label>
                <div className='mb-6'>
                    <input
                        type="text"
                        name= "name"
                        placeholder="Banner name"
                        value={bannerName}
                                onChange={(e) => setBannerName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <label className="text-lg font-medium">Banner Image</label>
                <div>
                <input
                    type="file"
                    onChange={handleBannerImageChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                { imgPreview && (
                    <div className='mt-4'>
                        <img
                            src={imgPreview}
                            alt="Image Preview"
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
                    onClick={handleSave}
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

AddBannerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveBanner: PropTypes.func.isRequired,
};
