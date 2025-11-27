/*
The issue is that your DeleteAddressModal is expecting a prop called saveAddress but you're passing deleteAddress. Let's fix this:
*/
import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function DeleteAddressModal({ open, setOpen, deleteAddress, address }) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteAddress();
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
            <span className="text-xl font-bold">Confirm Delete Address</span>
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
              Are you sure you want to delete this address?
            </h3>
            
            {address && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">Address to be deleted:</h4>
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
                </div>
              </div>
            )}
            
            <p className="text-sm text-red-600 font-medium mt-3">
              ⚠️ This action cannot be undone. All orders using this address will need to be updated.
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
            <span>CANCEL</span>
          </Button>
          <Button
            className='bg-red-900 text-white px-6 py-2 hover:bg-red-800 transition-colors'
            onClick={handleDelete}
          >
            <span>DELETE ADDRESS</span>
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

DeleteAddressModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  deleteAddress: PropTypes.func.isRequired,
  address: PropTypes.object,
};