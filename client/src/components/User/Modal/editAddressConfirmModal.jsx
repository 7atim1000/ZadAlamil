import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function ConfirmEditAddressModal({ open, setOpen, saveAddress, address }) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    saveAddress();
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
      className='border-2 border-gray-300'
    >
      <div className='p-6'>
        <DialogHeader>
          <div className="flex justify-between w-full">
            <span className="text-xl font-bold">Confirm Address Update</span>
            <Button
              variant="text"
              color="black"
              onClick={handleClose}
              className="p-0 text-sm"
            >
              <span className="material-icons">×</span>
            </Button>
          </div>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to update this address?
            </h3>
            
            {address && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">Updated Address Details:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex">
                    <span className="font-medium w-20">Name:</span>
                    <span>{address.name}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-20">Street:</span>
                    <span className="flex-1">{address.street}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-20">City:</span>
                    <span>{address.city}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-20">Country:</span>
                    <span>{address.country}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-20">ZIP Code:</span>
                    <span>{address.zipCode}</span>
                  </div>
                  {address.locality && (
                    <div className="flex">
                      <span className="font-medium w-20">Locality:</span>
                      <span>{address.locality}</span>
                    </div>
                  )}
                  {address.isDefault && (
                    <div className="flex items-center mt-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                        Default Address
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-3">
              This will update your address information across all your orders.
            </p>
          </div>
        </DialogBody>
        <DialogFooter className='mt-5 flex justify-between'>
          <Button
            variant="text"
            color="black"
            onClick={handleClose}
            className="border-2 border-black px-6 py-2 hover:bg-gray-50 transition-colors"
          >
            <span>NO, CANCEL</span>
          </Button>
          <Button
            className='bg-red-900 text-white px-6 py-2 hover:bg-red-800 transition-colors'
            onClick={handleConfirm}
          >
            <span>YES, UPDATE ADDRESS</span>
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

ConfirmEditAddressModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveAddress: PropTypes.func.isRequired,
  address: PropTypes.object,
};

// import { PropTypes } from 'prop-types';
// import {
//   Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
// } from "@material-tailwind/react";

// export function ConfirmEditAddressModal({ open, setOpen, saveAddress }) {
//   return (
//     <Dialog
//       open={open}
//       handler={() => setOpen(false)}
//       animate={{
//         mount: { scale: 1, y: 0 },
//         unmount: { scale: 0.0, y: -100 },
//       }}
//       className='border-2 border-gray-300'
//     >
//       <div className='p-6'>
//         <DialogHeader>
//           <div className="flex justify-between w-full">
//             <span className="text-xl font-bold">Confirm Update Address</span>
//             <Button
//               variant="text"
//               color="black"
//               onClick={() => setOpen(false)}
//               className="p-0 text-sm"
//             >
//               <span className="material-icons">x</span>
//             </Button>
//           </div>
//         </DialogHeader>
//         <DialogBody>
//         <div className="flex justify-between w-full">
//             <h3>Are you sure you want to update the address?</h3>
//         </div>
//         </DialogBody>
//         <DialogFooter className='mt-5 flex justify-between'>
//           <Button
//             variant="text"
//             color="black"
//             onClick={() => setOpen(false)}
//             className="border-2 border-black px-6 py-2"
//           >
//             <span>NO</span>
//           </Button>
//           <Button
//             className='bg-red-900 text-white px-6 py-2'
//             onClick={saveAddress}
//           >
//             <span>YES</span>
//           </Button>
//         </DialogFooter>
//       </div>
//     </Dialog>
//   );
// }

// ConfirmEditAddressModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   setOpen: PropTypes.func.isRequired,
//   saveAddress: PropTypes.func.isRequired,
// };