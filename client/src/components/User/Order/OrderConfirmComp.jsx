import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

// Import your APIs
import { getOrderById } from '../../../Utils/userOrderService'; 
import { getAddresses } from '../../../Utils/userAddressService';

// Import images
import Img1 from '../../../assets/images/orderTick.png';
import Img2 from '../../../assets/images/order.png';

const OrderConfirmComp = () => {
  const [order, setOrder] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Get order ID from navigation state or URL params
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    } else {
      toast.error('Order information not found');
      navigate('/');
    }
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      
      // Load order details
      const orderResult = await getOrderById(orderId);
      
      if (orderResult.success) {
        setOrder(orderResult.order);
        
        // Load addresses to find the delivery address
        const addressResult = await getAddresses();
        
        if (addressResult.success) {
          setAddresses(addressResult.addresses);
          
          // Find the address used in the order
          // This assumes your order has shippingAddress fields that match address fields
          const orderAddress = orderResult.order.shippingAddress;
          if (orderAddress) {
            // Try to find matching address in user's addresses
            const matchedAddress = addressResult.addresses.find(addr => 
              addr.street === orderAddress.street && 
              addr.city === orderAddress.city &&
              addr.zipCode === orderAddress.zipCode
            );
            
            if (matchedAddress) {
              setDeliveryAddress(matchedAddress);
            } else {
              // Use the order's shipping address directly
              setDeliveryAddress({
                name: user?.user?.name || 'Customer',
                street: orderAddress.street,
                city: orderAddress.city,
                country: orderAddress.country,
                zipCode: orderAddress.zipCode
              });
            }
          }
        }
      } else {
        toast.error(orderResult.message || 'Failed to load order details');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      toast.error('Failed to load order information');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  // Format date for delivery estimate
  const getDeliveryDate = () => {
    if (!order?.createdAt) return '3-5 business days';
    
    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5); // Add 5 days for delivery
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format order number
  const formatOrderNumber = (orderId) => {
    return orderId ? `#${orderId.slice(-8).toUpperCase()}` : 'Loading...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-900 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8 text-center">
          <h2 className="text-xl font-bold text-red-900">Order Not Found</h2>
          <p className="text-gray-600 mt-2">We couldn't find your order details.</p>
          <Link to="/orders">
            <button className="mt-4 px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800">
              View My Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl">
        {/* Order Confirmation Header */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className="flex justify-center items-center w-24 h-24 md:w-32 md:h-32 mx-auto">
            <img
              src={Img1}
              alt="Order Confirmed Illustration"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-green-900">ORDER CONFIRMED</h2>
          <p className="text-gray-600 mt-2">
            Your order <span className="font-semibold">{formatOrderNumber(order._id)}</span> is confirmed. 
            You will receive an order confirmation email/SMS shortly with the expected delivery date for your items.
          </p>
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
            <p className="text-green-800 text-sm">
              <span className="font-semibold">Expected Delivery:</span> {getDeliveryDate()}
            </p>
          </div>
        </div>

        {/* Order Summary and Delivery Info */}
        <div className="p-6 flex flex-col md:flex-row items-center gap-6 mt-5">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            {/* Order Items Preview */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600">Items:</p>
              <div className="mt-2 space-y-2">
                {order.items?.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="text-gray-700">
                      <div className="font-medium">
                        {item.product?.name || `Item ${index + 1}`} × {item.quantity}
                      </div>

                      {/* Vendor Information */}
                      {item.product?.vendor && (
                        <p className="text-xs text-gray-500 mt-1">
                          Sold by: <span className="font-medium">{item.product.vendor.name}</span>
                        </p>
                      )}

                    </div>
                    <span className="font-medium">{item.total?.toLocaleString()} AED</span>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t pt-2 mb-4">
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>AED {order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <h3 className="text-sm font-medium text-gray-500 mt-4">Delivering to:</h3>
            {deliveryAddress ? (
              <div className="mt-2">
                <p className="text-base font-semibold">
                  {deliveryAddress.name} 
                  {user?.user?.phone && ` | ${user.user.phone}`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {deliveryAddress.street}, {deliveryAddress.city}, {deliveryAddress.country} - {deliveryAddress.zipCode}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Loading address...</p>
            )}

            {/* Payment Method */}
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Payment Method:</span>{' '}
                {location.state?.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                 location.state?.paymentMethod?.charAt(0).toUpperCase() + location.state?.paymentMethod?.slice(1) || 'Credit Card'}
              </p>
            </div>

            <Link to={`/order-details/${order._id}`}>
              <button className="mt-4 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors">
                VIEW ORDER DETAILS
              </button>
            </Link>
          </div>
          
          {/* Delivery Illustration */}
          <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
            <img
              src={Img2}
              alt="Delivery Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to='/'>
            <button className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              CONTINUE SHOPPING
            </button>
          </Link>
          <Link to='/my-orders'>
            <button className="w-full sm:w-auto px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors">
              VIEW ALL ORDERS
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmComp;


// import Img1 from '../../../assets/images/orderTick.png';
// import Img2 from '../../../assets/images/order.png';
// import { Link } from 'react-router-dom';

// const OrderConfirmComp = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl">
//         <div className="p-6 text-center border-b border-gray-200">
//           <div className="flex justify-center items-center w-24 h-24 md:w-32 md:h-32 mx-auto">
//             <img
//               src={Img1}
//               alt="Order Confirmed Illustration"
//               className="w-full h-full object-contain"
//             />
//           </div>
//           <h2 className="text-xl font-bold text-green-900">ORDER CONFIRMED</h2>
//           <p className="text-gray-600 mt-2">
//             Your order is confirmed. You will receive an order confirmation email/SMS shortly with the expected delivery date for your items.
//           </p>
//         </div>

//         <div className="p-6 flex flex-col md:flex-row items-center gap-4 mt-5">
//           <div className="flex-grow">
//             <h3 className="text-sm font-medium text-gray-500">Delivering to:</h3>
//             <p className="text-base font-semibold">Akhila Vijayan | +91 8848965432</p>
//             <p className="text-sm text-gray-600">
//               Kurumasseri House, Thrissur, PO, Kerala-680551
//             </p>
//             <Link to='/order-details'>
//               <button className="mt-4 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800">
//                 ORDER DETAILS
//               </button>
//             </Link>
//           </div>
//           <div className="w-24 h-24 md:w-32 md:h-32">
//             <img
//               src={Img2}
//               alt="Delivery Illustration"
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>

//         <div className="mt-5 p-4 border-t border-gray-200 flex justify-between items-center">
//           <Link to='/'>
//             <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
//               CONTINUE SHOPPING
//             </button>
//           </Link>
//           <Link to='/myOrders'>
//             <button className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800">
//               VIEW ORDERS
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmComp;
