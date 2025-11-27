import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function EditBannerModal({ open, setOpen, saveBanner, banner, setEditingBanner, existingBanners=[] }) {
    const handleSave = async () => {
        if (!banner.name.trim()) {
            setEditingBanner({
                ...banner,
                errorMessage: "Banner name is required",
            });
            return;
        }
    
        const isDuplicate = existingBanners.some(
            (existingBanner) =>
                existingBanner.name === banner.name && existingBanner._id !== banner._id
        );
    
        if (isDuplicate) {
            setEditingBanner({
                ...banner,
                errorMessage: "This banner name already exists.",
            });
            return;
        }
    
        setEditingBanner({
            ...banner,
            errorMessage: "",
        });
    
        saveBanner(banner);
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
                        <span className="text-xl font-bold">Edit Banner</span>
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
                        <div>
                            <input
                                type="text"
                                value={banner?.name || ""}
                                onChange={(e) =>
                                    setEditingBanner({
                                        ...banner,
                                        name: e.target.value,
                                        errorMessage: "",
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {banner?.errorMessage && (
                                <p className="text-red-500 text-xs mt-1">
                                    {banner.errorMessage}
                                </p>
                            )}
                        </div>

                        <label className="text-lg font-medium">Banner Image</label>
                        <div>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(e) =>
                                    setEditingBanner({
                                        ...banner,
                                        logo: e.target.files[0],
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {banner?.bannerImg && (
                                    <div className="mt-8 w-[100px]">
                                        <img
                                            src={banner.bannerImg}
                                            alt="Banner"
                                            className="object-cover"
                                        />
                                    </div>
                                )}
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
                        <span>UPDATE</span>
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
}

EditBannerModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    saveBanner: PropTypes.func.isRequired,
    banner: PropTypes.object.isRequired,
    setEditingBanner: PropTypes.func.isRequired,
    existingBanners: PropTypes.array.isRequired,
};
