import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export function DeleteProductVendorModal({ open, setOpen, deleteProduct, product }) {
  const handleDelete = async () => {
    try {
      await deleteProduct();
    } catch (error) {
      // Error is handled in the parent component
      console.error('Delete error in modal:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      handler={handleClose}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.0, y: -100 },
      }}
      className='border-2 border-gray-300 max-w-md'
    >
      <div className='p-6'>
        <DialogHeader className="flex flex-col items-center text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
          <Typography variant="h4" color="red" className="text-center">
            Delete Product
          </Typography>
        </DialogHeader>
        
        <DialogBody>
          <div className="text-center mb-6">
            <Typography variant="paragraph" className="text-gray-700 mb-4">
              Are you sure you want to delete this product? This action cannot be undone.
            </Typography>
            
            {product && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  {product.productImg && (
                    <Avatar 
                      src={product.productImg} 
                      alt={product.name}
                      size="lg"
                      className="border border-gray-300"
                    />
                  )}
                  <div className="text-left">
                    <Typography variant="h6" className="font-semibold">
                      {product.name}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Price: AED {product.price}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Stock: {product.stock}
                    </Typography>
                  </div>
                </div>
                {product.description && (
                  <Typography variant="small" color="gray" className="text-left">
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description
                    }
                  </Typography>
                )}
              </div>
            )}
            
            <Typography variant="small" color="red" className="font-semibold mt-4">
              ⚠️ Warning: This will permanently remove the product and cannot be recovered.
            </Typography>
          </div>
        </DialogBody>

        <DialogFooter className='flex justify-between gap-3'>
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={handleClose}
            className="px-6 py-2 flex-1"
          >
            <span>CANCEL</span>
          </Button>
          <Button
            className='bg-red-900 text-white px-6 py-2 flex-1'
            onClick={handleDelete}
          >
            <span>DELETE PRODUCT</span>
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

DeleteProductVendorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired, // Fixed prop name
  product: PropTypes.object, // Added product prop
};
// import { PropTypes } from 'prop-types';
// import {
//   Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
// } from "@material-tailwind/react";

// export function DeleteProductVendorModal({ open, setOpen, saveAddress }) {
//   return (
//     <Dialog
//         open={open}
//         handler={() => setOpen(false)}
//         animate={{
//             mount: { scale: 1, y: 0 },
//             unmount: { scale: 0.0, y: -100 },
//         }}
//         className='border-2 border-gray-300'
//         >
//         <div className='p-6'>
//             <DialogHeader>
//                 <div className="flex justify-between w-full">
//                     <span className="text-xl font-bold">Confirm Delete Product</span>
//                     <Button
//                         variant="text"
//                         color="black"
//                         onClick={() => setOpen(false)}
//                         className="p-0 text-sm"
//                     >
//                         <span className="material-icons">x</span>
//                     </Button>
//                 </div>
//             </DialogHeader>
//             <DialogBody>
//                 <div className="flex justify-between w-full">
//                     <h3>Are you sure you want to delete the product?</h3>
//                 </div>
//             </DialogBody>
//             <DialogFooter className='mt-5 flex justify-between'>
//                 <Button
//                     variant="text"
//                     color="black"
//                     onClick={() => setOpen(false)}
//                     className="border-2 border-black px-6 py-2"
//                 >
//                     <span>CANCEL</span>
//                 </Button>
//                 <Button
//                     className='bg-red-900 text-white px-6 py-2'
//                     onClick={saveAddress}
//                 >
//                     <span>DELETE</span>
//                 </Button>
//             </DialogFooter>
//         </div>
//     </Dialog>
//   );
// }

// DeleteProductVendorModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   setOpen: PropTypes.func.isRequired,
//   saveAddress: PropTypes.func.isRequired,
// };