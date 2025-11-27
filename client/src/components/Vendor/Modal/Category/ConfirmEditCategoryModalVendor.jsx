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

export function ConfirmEditCategoryVendorModal({ open, setOpen, saveCategory }) {
  const handleConfirm = () => {
    setOpen(false);
    if (saveCategory) {
      saveCategory();
    }
  };

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
      <div className='p-6 text-center'>
        <DialogHeader className="justify-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <Typography variant="h4" color="green" className="text-center">
            Success!
          </Typography>
        </DialogHeader>
        
        <DialogBody>
          <Typography variant="paragraph" className="text-gray-700 mb-4">
            Category has been updated successfully.
          </Typography>
        </DialogBody>

        <DialogFooter className='flex justify-center'>
          <Button
            className='bg-green-900 text-white px-8 py-2 rounded-md'
            onClick={handleConfirm}
          >
            <span>OK</span>
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

ConfirmEditCategoryVendorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveCategory: PropTypes.func,
};