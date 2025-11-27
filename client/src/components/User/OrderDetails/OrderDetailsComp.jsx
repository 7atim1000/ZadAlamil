import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { UserCircleIcon, TruckIcon, MapPinIcon } from "@heroicons/react/24/solid";

// Import your APIs
import { getOrderById } from '../../../Utils/userOrderService';
// import { getImageUrl } from '../../../Utils/imageHelper'; // Your image URL helper

const OrderDetailsComp = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    } else {
      toast.error('Order ID not found');
      navigate('/orders');
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const result = await getOrderById(orderId);
      
      if (result.success) {
        setOrder(result.order);
      } else {
        toast.error(result.message || 'Failed to load order details');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  // Format order status with colors
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'text-white bg-orange-500',
      confirmed: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return order?.items?.reduce((sum, item) => sum + item.total, 0) || 0;
  };

  // Calculate shipping cost (you can make this dynamic too)
  const getShippingCost = () => {
    // You can add shipping logic based on order value, vendor, etc.
    return 0; // Free shipping for now
  };

  if (loading) {
    return (
      <section className="p-4">
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-2 mt-32">
          <div className="bg-white shadow-lg rounded-lg max-w-5xl w-full p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-900 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading order details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="p-4">
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-2 mt-32">
          <div className="bg-white shadow-lg rounded-lg max-w-5xl w-full p-8 text-center">
            <h2 className="text-xl font-bold text-red-900">Order Not Found</h2>
            <p className="text-gray-600 mt-2">We couldn't find the order details.</p>
            <Link to="/orders">
              <button className="mt-4 px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800">
                Back to Orders
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const subtotal = calculateSubtotal();
  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;

  return (
    <section className="p-4">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-2 mt-32 md:mt-32 lg:mt-30">
        <div className="bg-white shadow-lg rounded-lg max-w-5xl min-w-2xl w-full">
          {/* Order Header */}
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-red-900">ORDER DETAILS</h2>
              <p className="text-xs font-thin text-gray-800">
                Details for the Order ID: {order._id}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Placed on: {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status?.toUpperCase()}
              </span>
              <button className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 w-44">
                Download Invoice
              </button>
            </div>
          </div>

          {/* Customer and Order Info */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-200">
            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5 text-gray-500" />
                Customer
              </h3>
              <p className="text-gray-800 font-semibold">
                {order.user?.name || 'Customer'}
              </p>
              <p className="text-gray-600 text-sm">
                {order.user?.email}
              </p>
              {order.user?.phone && (
                <p className="text-gray-600 text-sm">{order.user.phone}</p>
              )}
              <Link to="/profile" className="text-red-900 text-sm mt-2 block">
                View Profile
              </Link>
            </div>

            {/* Order Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-[#0ea5e9]" />
                Order Info
              </h3>    
              <p className="text-gray-800 text-sm">
                Payment: {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </p>
              <p className="text-gray-800 text-sm">
                Payment Method: {order.paymentMethod || 'Credit Card'}
              </p>
              <p className="text-gray-800 text-sm">
                Items: {order.items?.length || 0}
              </p>
            </div>

            {/* Deliver To */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-green-600" />
                Deliver To
              </h3>
              <p className="text-gray-800 font-semibold">
                {order.shippingAddress?.recipientName || order.user?.name}
              </p>
              <p className="text-gray-600 text-sm">
                {order.shippingAddress?.street}
              </p>
              <p className="text-gray-600 text-sm">
                {order.shippingAddress?.city}, {order.shippingAddress?.country} - {order.shippingAddress?.zipCode}
              </p>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="p-6">
            <table className="w-full border-collapse border border-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 p-2">Product</th>
                  <th className="border border-gray-200 p-2">Vendor</th>
                  <th className="border border-gray-200 p-2">Image</th>
                  <th className="border border-gray-200 p-2">Unit Price</th>
                  <th className="border border-gray-200 p-2">Quantity</th>
                  <th className="border border-gray-200 p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 p-2">
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        {item.product?.category && (
                          <p className="text-xs text-gray-500">{item.product.category.name}</p>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-200 p-2">
                      {item.product?.vendor ? (
                        <div>
                          <p className="text-sm font-medium">{item.product.vendor.companyName}</p>
                          <p className="text-xs text-gray-500">{item.product.vendor.name}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No vendor</span>
                      )}
                    </td>
                    <td className="border border-gray-200 p-2">
                      <Link to={`/product-details/${item.product?._id}`}>
                        <img 
                          // src={getImageUrl(item.product?.images?.[0])}
                          src= {item.product?.productImg} 
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded cursor-pointer"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.png';
                          }}
                        />
                      </Link>
                    </td>
                    <td className="border border-gray-200 p-2">
                      AED {item.price?.toLocaleString()}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-200 p-2 font-semibold">
                      AED {item.total?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="5" className="border border-gray-200 p-2 font-semibold">
                    Subtotal:
                  </td>
                  <td className="border border-gray-200 p-2">
                    AED {subtotal.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan="5" className="border border-gray-200 p-2 font-semibold">
                    Shipping Cost:
                  </td>
                  <td className="border border-gray-200 p-2">
                    AED {shippingCost.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td colSpan="5" className="border border-gray-200 p-2 font-semibold">
                    TOTAL:
                  </td>
                  <td className="border font-bold border-gray-200 p-2 text-red-900">
                    AED {total.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Order Timeline (Optional) */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetailsComp;

// import { UserCircleIcon } from "@heroicons/react/24/solid";
// import { TruckIcon } from "@heroicons/react/24/solid";
// import { MapPinIcon } from "@heroicons/react/24/solid";
// import Img1 from '../../../assets/images/mob1.png';
// import { Link } from "react-router-dom";

// const OrderDetailsComp = () => {
//     return (
//         <section className="p-4">
//       <div className="min-h-screen bg-gray-100 flex flex-col items-center p-2 mt-32 md:mt-32 lg:mt-40">
//         <div className="bg-white shadow-lg rounded-lg  max-w-5xl min-w-2xl">
//           <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//             <div className="flex flex-col">
//             <h2 className="text-lg font-semibold text-red-900">ORDER DETAILS</h2>
//             <p className="text-xs font-thin text-gray-800">Details for the Order ID: 675GHG756HG88</p>
//             </div>
            
//             <button className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 w-44">
//               Download Invoice
//             </button>
//           </div>
  
//           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200">
//             {/* Customer Info */}
//             <div>
//                 <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
//                 <UserCircleIcon className="w-5 h-5 text-gray-500" />
//                 Customer
//                 </h3>
//                 <p className="text-gray-800 font-semibold">Akhila Vijayan</p>
//                 <p className="text-gray-600 text-sm">+9718877451252</p>
//                 <a href="/profile" className="text-red-900 text-sm mt-2 block">
//                     View Profile
//                 </a>
//             </div>
  
//             {/* Order Info */}
//             <div>
//                 <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
//                     <TruckIcon className="w-5 h-5 text-gray-500" />
//                     Order Info
//                 </h3>    
//               <p className="text-gray-800 text-sm">Shipping Forgo Express</p>
//               <p className="text-gray-800 text-sm">Pay method: Razor Pay</p>
//               <p className="text-gray-800 text-sm">Status: Placed</p>
//             </div>
  
//             {/* Deliver To */}
//             <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
//                 <MapPinIcon className="w-5 h-5 text-gray-500" />
//                 Deliver To
//             </h3>
//               <p className="text-gray-800 font-semibold">Athira Vijayan</p>
//               <p className="text-gray-600 text-sm">
//                 Address: Kunnumveettil House, Thodupuzha PO, PIN: 685581
//               </p>
//             </div>
//           </div>
  
//           {/* Table Section */}
//           <div className="p-6">
//             <table className="w-full border-collapse border border-gray-200 text-left">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="border border-gray-200 p-2">Product</th>
//                   <th className="border border-gray-200 p-2">Image</th>
//                   <th className="border border-gray-200 p-2">Unit Price</th>
//                   <th className="border border-gray-200 p-2">Quantity</th>
//                   <th className="border border-gray-200 p-2">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="border border-gray-200 p-2">
//                   Samsung Galaxy Z Fold5
//                   </td>
//                   <td className="border border-gray-200 p-2 w-10 h-10 cursor-pointer">
//                   <Link to='/product-details'><img src={Img1} /></Link>
//                   </td>
//                   <td className="border border-gray-200 p-2">AED 3400</td>
//                   <td className="border border-gray-200 p-2">2</td>
//                   <td className="border border-gray-200 p-2">AED 6800</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-gray-200 p-2">
//                   Samsung Galaxy Z Fold5
//                   </td>
//                   <td className="border border-gray-200 p-2 w-10 h-10 cursor-pointer">
//                     <Link to='/product-details'><img src={Img1} /></Link>
//                   </td>
//                   <td className="border border-gray-200 p-2">AED 3400</td>
//                   <td className="border border-gray-200 p-2">2</td>
//                   <td className="border border-gray-200 p-2">AED 6800</td>
//                 </tr>
//               </tbody>
//               <tfoot className="bg-gray-50">
//                 <tr>
//                   <td colSpan="4" className="border border-gray-200 p-2 font-semibold">
//                     Subtotal:
//                   </td>
//                   <td className="border border-gray-200 p-2">AED 13600</td>
//                 </tr>
//                 <tr>
//                   <td colSpan="4" className="border border-gray-200 p-2 font-semibold">
//                     Shipping Cost:
//                   </td>
//                   <td className="border border-gray-200 p-2">AED 0.00</td>
//                 </tr>
//                 <tr>
//                   <td colSpan="4" className="border border-gray-200 p-2 font-semibold">
//                     TOTAL:
//                   </td>
//                   <td className="border font-bold border-gray-200 p-2 text-red-900">
//                     AED 13600
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       </div>
//       </section>
//     );
//   };
  
//   export default OrderDetailsComp;


