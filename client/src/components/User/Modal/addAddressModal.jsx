import { PropTypes } from 'prop-types';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function AddAddressModal({ open, setOpen, saveAddress }) {
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    country: '',
    zipCode: '',
    locality: '',
    district: '',
    state: '',
    mobileNumber: '',
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the data to match your backend schema
    const addressData = {
      name: formData.name,
      street: formData.street || formData.address, // Use street or address field
      city: formData.city,
      country: formData.country,
      zipCode: formData.zipCode,
      isDefault: formData.isDefault,
      
      mobileNumber: formData.mobileNumber,
      state: formData.state,
      district: formData.district


    };

    console.log("Submitting address data:", addressData);
    saveAddress(addressData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      street: '',
      city: '',
      country: '',
      zipCode: '',
      locality: '',
      district: '',
      state: '',
      mobileNumber: '',
      isDefault: false
    });
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
            <span className="text-xl font-bold">Add Address</span>
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ZIP Code */}
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              
              {/* Mobile Number */}
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number with code"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Locality */}
            <input
              type="text"
              name="locality"
              placeholder="Locality"
              value={formData.locality}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            {/* Street Address */}
            <textarea
              name="street"
              placeholder="Full Address (Street, Building, Area)"
              value={formData.street}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              
              {/* District */}
              <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State */}
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              
              {/* Country */}
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Default Address Checkbox */}
            <label className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-900 focus:ring-red-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>
          </form>
        </DialogBody>
        <DialogFooter className='mt-5 flex justify-between'>
          <Button
            variant="text"
            color="black"
            onClick={handleClose}
            className="border-2 border-black px-6 py-2"
          >
            <span>CANCEL</span>
          </Button>
          <Button
            className='bg-red-900 text-white px-6 py-2'
            onClick={handleSubmit}
          >
            <span>SAVE</span>
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

AddAddressModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  saveAddress: PropTypes.func.isRequired,
};

// import { PropTypes } from 'prop-types';
// import {
//   Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
// } from "@material-tailwind/react";

// export function AddAddressModal({ open, setOpen, saveAddress }) {
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
//             <span className="text-xl font-bold">Add Address</span>
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
//           <form className="space-y-4">
//             <input
//               type="text"
//               placeholder="Full Name"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//             />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 placeholder="Pin Code"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Mobile Number with code"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//             </div>
//             <input
//               type="text"
//               placeholder="Locality"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//             />
//             <input
//               type="text"
//               placeholder="Address"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//             />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 placeholder="District"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//               <input
//                 type="text"
//                 placeholder="State"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//               />
//             </div>
//           </form>
//         </DialogBody>
//         <DialogFooter className='mt-5 flex justify-between'>
//           <Button
//             variant="text"
//             color="black"
//             onClick={() => setOpen(false)}
//             className="border-2 border-black px-6 py-2"
//           >
//             <span>CANCEL</span>
//           </Button>
//           <Button
//             className='bg-red-900 text-white px-6 py-2'
//             onClick={saveAddress}
//           >
//             <span>SAVE</span>
//           </Button>
//         </DialogFooter>
//       </div>
//     </Dialog>
//   );
// }

// AddAddressModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   setOpen: PropTypes.func.isRequired,
//   saveAddress: PropTypes.func.isRequired,
// };