import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export function ConfirmEditProductVendorModal({ open, setOpen, saveProduct }) {
  return (
    <Dialog
      open={open}
      handler={() => setOpen(false)}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.0, y: -100 },
      }}
      className='border-2 border-gray-300 max-w-md'
    >
      <div className='p-6'>
        <DialogHeader className="flex items-start justify-between">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
          <Typography variant="h4" color="green" className="text-center">
            Success!
          </Typography>
        </DialogHeader>
        
        <DialogBody>
          <Typography variant="paragraph" className="text-gray-700 mb-4 text-center">
            Product has been updated successfully.
          </Typography>
        </DialogBody>

        <DialogFooter className='flex justify-center'>
          <Button
            className='bg-green-900 text-white px-8 py-2 rounded-md text-center'
            onClick={() => {
              setOpen(false);
              if (saveProduct) saveProduct();
            }}
          >
            <span>OK</span>
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

ConfirmEditProductVendorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveProduct: PropTypes.func,
};

// import { PropTypes } from 'prop-types';
// import {
//   Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
// } from "@material-tailwind/react";

// export function ConfirmEditProductVendorModal({ open, setOpen, saveProduct }) {
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
//                     <span className="text-xl font-bold">Confirm Update Product</span>
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
//                     <h3>Are you sure you want to update the product?</h3>
//                 </div>
//             </DialogBody>
//             <DialogFooter className='mt-5 flex justify-between'>
//                 <Button
//                     variant="text"
//                     color="black"
//                     onClick={() => setOpen(false)}
//                     className="border-2 border-black px-6 py-2"
//                 >
//                     <span>NO</span>
//                 </Button>
//                 <Button
//                     className='bg-green-900 text-white px-6 py-2'
//                     onClick={saveProduct}
//                 >
//                     <span>YES</span>
//                 </Button>
//             </DialogFooter>
//         </div>
//     </Dialog>
//   );
// }

// ConfirmEditProductVendorModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   setOpen: PropTypes.func.isRequired,
//   saveProduct: PropTypes.func.isRequired,
// };