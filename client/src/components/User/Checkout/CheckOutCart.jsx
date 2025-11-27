import { useState, useEffect } from 'react' ;

import { AddAddressModal } from '../Modal/addAddressModal';
import { EditAddressModal } from "../Modal/editAddressModal";
import { ConfirmEditAddressModal } from "../Modal/editAddressConfirmModal";
import { DeleteAddressModal } from "../Modal/deleteAddressModal";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import { 
  getAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from "../../../Utils/userAddressService";

import { createUserOrder } from '../../../Utils/userOrderService';
import { getUserCart } from '../../../Utils/userCartService';

const CheckOutCart = () => {
    
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
    const [isModalOpenAddAddress, setIsModalOpenAddAddress] = useState(false);
    const [isModalOpenEditAddress, setIsModalOpenEditAddress] = useState(false);
    const [isModalOpenConfirmEdit, setIsModalOpenConfirmEdit] = useState(false);
    const [isModalOpenDeleteAddress, setIsModalOpenDeleteAddress] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    
    const [addresses, setAddresses] = useState([]);
    const [cartSummary, setCartSummary] = useState({
        items: [],
        subTotal: 0,
        discount: 0,
        total: 0
    });
    
    
    
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    // Load addresses and cart summary data on component mount
    // Load user addresses from API
    const loadAddresses = async () => {
        try {
            setIsLoading(true);
            const result = await getAddresses();

            if (result.success) {
                setAddresses(result.addresses || []);
                // Auto-select default address if exists
                const defaultAddr = result.addresses.find(addr => addr.isDefault);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr._id);
                } else if (result.addresses.length > 0) {
                    setSelectedAddress(result.addresses[0]._id);
                }
            } else {
                toast.error(result.message || 'Failed to load addresses');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to load addresses');
        } finally {
            setIsLoading(false);
        }
    };

    // Load cart summary for order details
    const loadCartSummary = async () => {
        try {
            const result = await getUserCart();

            if (result.success) {
                const cartItems = result.cartItems || [];
                const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const discount = 0; // You can calculate this dynamically
                const total = subTotal - discount;

                setCartSummary({
                    items: cartItems,
                    subTotal,
                    discount,
                    total
                });
            }
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    };
    useEffect(() => {
        loadAddresses();
        loadCartSummary();
    }, []);

    // Address CRUD operations
    const handleSaveAddress = async (newAddressData) => {
        try {
            console.log("Received address data from modal:", newAddressData);

            // Clean and validate the data
            const cleanAddressData = {
                name: String(newAddressData.name || '').trim(),
                street: String(newAddressData.street || '').trim(),
                city: String(newAddressData.city || '').trim(),
                country: String(newAddressData.country || '').trim(),
                zipCode: String(newAddressData.zipCode || '').trim(),
                isDefault: Boolean(newAddressData.isDefault),
                
                district: String(newAddressData.district || '').trim(),
                state: String(newAddressData.state || '').trim(),
                mobileNumber: String(newAddressData.mobileNumber || '').trim(),
            };

            // Validate required fields
            const requiredFields = ['name', 'street', 'city', 'country', 'zipCode', 'mobileNumber'];
            const missingFields = requiredFields.filter(field => !cleanAddressData[field]);

            if (missingFields.length > 0) {
                toast.error(`Please fill in all required fields`);
                return;
            }

            console.log("Sending to API:", cleanAddressData);

            const result = await createAddress(cleanAddressData);

            if (result.success) {
                toast.success('Address added successfully!');
                setIsModalOpenAddAddress(false);
                loadAddresses(); // Reload the addresses list
            } else {
                toast.error(result.message || 'Failed to add address');
            }
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error(error.message || 'Failed to add address');
        }
    };



    // Add new state for updated address data
    const [updatedAddressData, setUpdatedAddressData] = useState(null);
    const [tempEditAddress, setTempEditAddress] = useState(null);

    // Update your edit functions
    const initiateEditAddress = (address) => {
        setTempEditAddress(address); // Store the original address with _id
        setIsModalOpenEditAddress(true);
    };

    const confirmEditAddress = (updatedAddressFormData) => {
        // Store the updated form data separately
        setUpdatedAddressData(updatedAddressFormData);
        setIsModalOpenEditAddress(false);
        setIsModalOpenConfirmEdit(true);
    };

    const handleUpdateAddress = async () => {
        try {
            // Use tempEditAddress._id and updatedAddressData
            if (!tempEditAddress || !tempEditAddress._id) {
                toast.error('Address ID not found');
                return;
            }

            console.log("Updating address ID:", tempEditAddress._id);
            console.log("With data:", updatedAddressData);

            const result = await updateAddress(tempEditAddress._id, updatedAddressData);

            if (result.success) {
                toast.success('Address updated successfully!');
                setTempEditAddress(null);
                setUpdatedAddressData(null);
                setIsModalOpenConfirmEdit(false);
                loadAddresses();
            } else {
                toast.error(result.message || 'Failed to update address');
            }
        } catch (error) {
            console.error("Update address error:", error);
            toast.error(error.message || 'Failed to update address');
        }
    };

    const handleDeleteAddress = async () => {
        try {
            const result = await deleteAddress(tempEditAddress._id);

            if (result.success) {
                toast.success('Address deleted successfully!');
                setIsModalOpenDeleteAddress(false);
                setTempEditAddress(null);
                loadAddresses(); // Reload addresses
            } else {
                toast.error(result.message || 'Failed to delete address');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to delete address');
        }
    };

    const initiateDeleteAddress = (address) => {
        setTempEditAddress(address);
        setIsModalOpenDeleteAddress(true);
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            const result = await setDefaultAddress(addressId);

            if (result.success) {
                toast.success('Default address updated!');
                loadAddresses(); // Reload to get updated defaults
            } else {
                toast.error(result.message || 'Failed to set default address');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to set default address');
        }
    };

    // Create order and proceed to payment
    const handleCreateOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        if (cartSummary.items.length === 0) {
            toast.error('Your cart is empty');
            navigate('/cart');
            return;
        }

        setIsCreatingOrder(true);

        try {
            const selectedAddressData = addresses.find(addr => addr._id === selectedAddress);

            const orderData = {
                shippingAddress: {
                    street: selectedAddressData.street,
                    city: selectedAddressData.city,
                    country: selectedAddressData.country,
                    zipCode: selectedAddressData.zipCode,
                    mobileNumber: selectedAddressData.mobileNumber
                }
            };

            const result = await createUserOrder(orderData);

            if (result.success) {
                toast.success('Order created successfully!');

                if (paymentMethod === "Cash On Delivery") {
                    navigate('/order-confirm', {
                        state: {
                            orderId: result.order._id,
                            paymentMethod: 'cod',
                            totalAmount: result.order.totalAmount
                        }
                    });
                } else {
                    navigate('/payment', {
                        state: {
                            orderId: result.order._id,
                            totalAmount: result.order.totalAmount,
                            paymentMethod: paymentMethod.toLowerCase()
                        }
                    });
                }
            } else {
                toast.error(result.message || 'Failed to create order');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create order');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // Get selected address object
    const getSelectedAddress = () => {
        return addresses.find(addr => addr._id === selectedAddress);
    };


    return (
        <section>
            <div className ='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 mt-10 md:mt-10 lg:mt-10'>
                {/* Left Section */}
                <div className="md:col-span-2 space-y-6">
                    {/* Delivery Address Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

                        {isLoading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Loading addresses...</p>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-gray-500">No addresses found</p>
                                <p className="text-sm text-gray-400">Add your first address to continue</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        className={`flex items-center justify-between p-4 border rounded-lg ${selectedAddress === addr._id
                                                ? "border-red-900 bg-red-50"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        <label className="flex items-start space-x-3 cursor-pointer flex-1">
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={selectedAddress === addr._id}
                                                onChange={() => setSelectedAddress(addr._id)}
                                                className="h-5 w-5 text-red-900 mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{addr.name}</p>
                                                    {addr.isDefault && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1">{addr.street}</p>
                                                <p className="text-gray-500 text-sm">
                                                    {addr.city}, {addr.country} - {addr.mobileNumber}
                                                </p>
                                            </div>
                                        </label>
                                        <div className="space-y-1 md:space-x-2 md:space-y-0 flex flex-col md:flex-row">
                                            <button
                                                className="text-blue-500 hover:underline text-sm"
                                                onClick={() => initiateEditAddress(addr)}
                                            >
                                                Edit
                                            </button>
                                            {!addr.isDefault && (
                                                <button
                                                    className="text-green-600 hover:underline text-sm"
                                                    onClick={() => handleSetDefaultAddress(addr._id)}
                                                >
                                                    Set Default
                                                </button>
                                            )}
                                            <button
                                                className="text-red-900 hover:underline text-sm"
                                                onClick={() => initiateDeleteAddress(addr)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="mt-4 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors"
                            onClick={() => setIsModalOpenAddAddress(true)}
                            disabled={isLoading}
                        >
                            + ADD ADDRESS
                        </button>
                    </div>

                    {/* Payment Options */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Payment Options</h2>
                        <div className="space-y-4">
                            {["Cash On Delivery", "Credit Card", "Debit Card", "Net Banking", "UPI", "Paypal"].map(
                                (method, index) => (
                                    <label key={index} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === method}
                                            onChange={() => setPaymentMethod(method)}
                                            className="h-5 w-5 text-red-900"
                                        />
                                        <span className="text-gray-700">{method}</span>
                                    </label>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section - Dynamic Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Details</h2>
                   
                    {/* Cart Items */}
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                        {cartSummary.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-start border-b pb-2">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        {item.product?.name || 'Product'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Qty: {item.quantity} × AED {item.price}
                                    </p>
                                </div>
                                <span className="text-sm font-medium">
                                    AED {(item.price * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                
                    {/* Order Summary */}
                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sub Total</span>
                            <span className="font-medium">AED {cartSummary.subTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Discounts</span>
                            <span className="text-green-600">- AED {cartSummary.discount.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-2"></div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>AED {cartSummary.total.toLocaleString()}</span>
                        </div>
                    </div>
                    {/* Continue Button */}
                    <button
                        className={`mt-6 w-full px-4 py-3 text-white rounded-lg transition-colors ${isCreatingOrder || addresses.length === 0 || cartSummary.items.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-900 hover:bg-red-800'
                            }`}
                        onClick={handleCreateOrder}
                        disabled={isCreatingOrder || addresses.length === 0 || cartSummary.items.length === 0}
                    >
                        {isCreatingOrder ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating Order...
                            </div>
                        ) : (
                            `CONTINUE TO ${paymentMethod === "Cash On Delivery" ? "CONFIRM" : "PAYMENT"}`
                        )}
                    </button>
                    {/* Validation Messages */}
                    {addresses.length === 0 && (
                        <p className="text-red-600 text-sm mt-2 text-center">
                            Please add an address to continue
                        </p>
                    )}
                    {cartSummary.items.length === 0 && (
                        <p className="text-red-600 text-sm mt-2 text-center">
                            Your cart is empty
                        </p>
                    )}
                
                </div>
            </div>



            {/* Modals Usage - Addresses CURD - Update these to work with the new address structure */}
            <AddAddressModal
                open={isModalOpenAddAddress}
                setOpen={setIsModalOpenAddAddress}
                saveAddress={handleSaveAddress}
            />

            <EditAddressModal
                open={isModalOpenEditAddress}
                setOpen={setIsModalOpenEditAddress}
                saveAddress={confirmEditAddress}  // This receives form data
                initialAddress={tempEditAddress}  // This pre-fills the form
            />

            <ConfirmEditAddressModal
                open={isModalOpenConfirmEdit}
                setOpen={setIsModalOpenConfirmEdit}
                saveAddress={handleUpdateAddress}  // Now just calls the function
                address={tempEditAddress}          // Original address with _id
                updatedData={updatedAddressData}   // New form data
            />

            <DeleteAddressModal
                open={isModalOpenDeleteAddress}
                setOpen={setIsModalOpenDeleteAddress}
                deleteAddress={handleDeleteAddress}
                address={tempEditAddress}
            />
        </section>
    );
};


export default CheckOutCart;