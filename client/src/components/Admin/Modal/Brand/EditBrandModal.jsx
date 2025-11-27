import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function EditBrandModal({ open, setOpen, saveBrand, brand, setEditingBrand, existingBrands=[] }) {
    const handleSave = () => {
        if (!brand.name.trim()) {
            setEditingBrand({
                ...brand,
                errorMessage: "Brand name is required",
            });
            return;
        }
        const isDuplicate = existingBrands.some(
            (existingBrand) =>
                existingBrand.name === brand.name && existingBrand._id !== brand._id
        );
    
        if (isDuplicate) {
            setEditingBrand({
                ...brand,
                errorMessage: "This brand name already exists.",
            });
            return;
        }
    
        setEditingBrand({
            ...brand,
            errorMessage: "",
        });
    
        saveBrand(brand);
    };     
    
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            const imgUrl = URL.createObjectURL(file);
            setEditingBrand({
                ...brand,
                logo: imgUrl,
            })
        }
    }

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
                        <span className="text-xl font-bold">Edit Brand</span>
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
                            value={brand?.name || ""}
                                onChange={(e) =>
                                    setEditingBrand({
                                        ...brand,
                                        name: e.target.value,
                                        errorMessage: "",
                                    })
                                }
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />

                            {brand?.errorMessage && (
                                <p className="text-red-500 text-xs mt-1">
                                    {brand.errorMessage}
                                </p>
                            )}
                    </div>
                    <label className="text-sm font-medium mt-4">Logo (PNG, JPG, JPEG)</label>
                        <div>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(e) => handleLogoChange(e)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {brand?.logo && (
                                <div className='mt-8 w-[100px]'>
                                    <img
                                        src={brand.logo}
                                        alt='Brand'
                                        className='object-cover'
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

EditBrandModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    saveBrand: PropTypes.func.isRequired,
    brand: PropTypes.object.isRequired,
    setEditingBrand: PropTypes.func.isRequired, 
    existingBrands: PropTypes.array.isRequired,
};
