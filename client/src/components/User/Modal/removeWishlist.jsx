import { PropTypes } from 'prop-types';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function WishlistRemove({ open, setOpen, removeFromWishlist }) {
  return (
    <Dialog
      open={open}
      handler={() => setOpen(false)}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.0, y: -100 },
      }}
      className='border-8 border-gray-300'
    >
      <div className='m-4 border-8 border-dashed border-gray-400'>
      <DialogHeader>
      <div className="flex justify-between w-full m-4">
        <span>Confirm Wishlist Item Removal</span>
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
      <DialogBody className="border-t-2 border-gray-300">
        Are you sure you want to remove this item from your wishlist? This
        action cannot be undone.
      </DialogBody>
      <DialogFooter className='mt-5'>
        <Button
          variant="text"
          color="black"
          onClick={() => setOpen(false)}
          className="mr-4 border-2 border-black"
        >
          <span>Cancel</span>
        </Button>
        <Button className='bg-red-900' onClick={removeFromWishlist}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
      </div>
    </Dialog>
  );
}

WishlistRemove.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  removeFromWishlist: PropTypes.func.isRequired,
};