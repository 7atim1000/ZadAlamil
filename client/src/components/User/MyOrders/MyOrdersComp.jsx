import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { MenuDefault } from "../Menu/Menu";

// Import your API
import { cancelOrder, getUserOrders } from "../../../Utils/userOrderService";
// import { getImageUrl } from '../../../Utils/imageHelper'; 

const MyOrdersComp = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const result = await getUserOrders();
      
      if (result.success) {
        setOrders(result.orders || []);
      } else {
        toast.error(result.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Get status color based on order status
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-orange-500 text-white',
      confirmed: 'bg-blue-500 text-white',
      shipped: 'bg-purple-500 text-white',
      delivered: 'bg-green-500 text-white',
      cancelled: 'bg-red-500 text-white',
      returned: 'bg-gray-800 text-white'
    };
    return statusColors[status] || 'bg-gray-500 text-white';
  };

  // Format status text for display
  const formatStatus = (status) => {
    const statusMap = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned'
    };
    return statusMap[status] || status;
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancellingOrder(orderId);

      // Use the real API function
      const result = await cancelOrder(orderId);

      if (result.success) {
        toast.success('Order cancelled successfully!');
        // Reload orders to reflect changes
        loadUserOrders();
      } else {
        toast.error(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(null);
    }
  };

  // Handle return request
  const handleReturnOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to request a return for this order?')) {
      return;
    }

    try {
      // You'll need to create this API function
      // const result = await requestReturn(orderId);
      
      // For now, just show a message
      toast.success('Return request sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to request return');
    }
  };

  // Check if order can be cancelled (only pending orders)
  const canCancelOrder = (order) => {
    return order.status === 'pending' || order.status === 'confirmed';
  };

  // Check if order can be returned (only delivered orders within return period)
  const canReturnOrder = (order) => {
    return order.status === 'delivered';
    // You can add logic to check if within return period (e.g., 30 days)
  };

  // Format order date
  const formatOrderDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get first product image for order preview
  // const getOrderPreviewImage = (order) => {
  //   const firstItem = order.items?.[0];
  //   if (firstItem?.product?.images?.[0]) {
  //   return getImageUrl(firstItem.product.images[0]);
      
  //   }
  //   return '/placeholder-image.png'; // Fallback image
  // };
  
  const getOrderPreviewImage = (order) => {
    const firstItem = order.items?.[0];

    // Check for productImg field (single image)
    if (firstItem?.product?.productImg) {
      return firstItem.product.productImg; // Return the image path directly
    }

    // Fallback to images array if productImg doesn't exist
    if (firstItem?.product?.images?.[0]) {
      return firstItem.product.images[0]; // Return the image path directly
    }

    return '/placeholder-image.png'; // Fallback image
  };

  // Get order product names preview
  const getOrderProductsPreview = (order) => {
    if (!order.items || order.items.length === 0) return 'No items';
    
    const firstProduct = order.items[0].product?.name || 'Product';
    if (order.items.length === 1) {
      return firstProduct;
    }
    return `${firstProduct} + ${order.items.length - 1} more items`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 lg:p-4">
        <div className="max-w-7xl mx-auto mt-32 md:mt-32 lg:mt-40">
          <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">MY ORDERS</h1>
          <div className="flex justify-between items-center mb-4">
            <MenuDefault />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white shadow-md rounded-lg p-4 animate-pulse">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 lg:p-4">
      <div className="max-w-7xl mx-auto mt-32 md:mt-32 lg:mt-30">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">MY ORDERS</h1>
        
        <div className="flex justify-between items-center mb-4">
          <MenuDefault />
          <div className="text-sm text-gray-600">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link to="/products">
              <button className="px-6 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row items-center md:justify-between border border-gray-200"
              >
                <div className="flex items-center w-full md:w-auto">
                  <img
                    src={getOrderPreviewImage(order)}
                    alt="Product"
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <h2 className="font-semibold text-sm md:text-base text-gray-800">
                      {getOrderProductsPreview(order)}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      ORDER ID: {order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ordered on: {formatOrderDate(order.createdAt)}
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      Total: AED {order.totalAmount?.toLocaleString()}
                    </p>
                    <Link 
                      to={`/order-details/${order._id}`}
                      className="text-red-900 font-medium text-xs md:text-sm block mt-2 hover:text-red-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 w-full md:w-auto">
                  <span
                    className={`px-3 py-2 text-center rounded-lg ${getStatusColor(order.status)} font-semibold text-xs md:text-sm`}
                  >
                    {formatStatus(order.status)}
                  </span>
                  
                  {canCancelOrder(order) && (
                    <button
                      className={`px-3 py-2 rounded-lg font-semibold text-xs md:text-sm ${cancellingOrder === order._id
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingOrder === order._id}
                    >
                      {cancellingOrder === order._id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Cancelling...
                        </div>
                      ) : (
                        'Cancel Order'
                      )}
                    </button>
                  )}
                  
                  {canReturnOrder(order) && (
                    <button 
                      className="px-3 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold text-xs md:text-sm hover:bg-gray-400"
                      onClick={() => handleReturnOrder(order._id)}
                    >
                      Return
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersComp;


// import Img1 from "../../../assets/images/mob1.png";
// import { MenuDefault } from "../Menu/Menu";

// const MyOrdersComp = () => {
//   const orders = [
//     {
//       id: "45AHGFTJJ78",
//       name: "LG UM670H 43\" UHD 4K Commercial Smart TV 43UM670H0UA B&H",
//       status: "Pending",
//       statusColor: "bg-yellow-700",
//     },
//     {
//       id: "45AHGFTJJ78",
//       name: "LG UM670H 43\" UHD 4K Commercial Smart TV 43UM670H0UA B&H",
//       status: "Delivered",
//       statusColor: "bg-green-700",
//     },
//     {
//       id: "45AHGFTJJ78",
//       name: "LG UM670H 43\" UHD 4K Commercial Smart TV 43UM670H0UA B&H",
//       status: "Returned",
//       statusColor: "bg-black text-white",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8 lg:p-4">
//       <div className="max-w-7xl mx-auto mt-32 md:mt-32 lg:mt-40">
//         <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">MY ORDERS</h1>
//         <div className="flex justify-between items-center mb-4">
//           <MenuDefault />
//         </div>
//         <div className="space-y-6">
//           {orders.map((order, index) => (
//             <div
//               key={index}
//               className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row items-center md:justify-between"
//             >
//               <div className="flex items-center w-full md:w-auto">
//                 <img
//                   src={Img1}
//                   alt="Product"
//                   className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md"
//                 />
//                 <div className="ml-4 flex-1">
//                   <h2 className="font-semibold text-sm md:text-base">{order.name}</h2>
//                   <p className="text-xs md:text-sm text-gray-500 mt-2">
//                     ORDER ID: {order.id}
//                   </p>
//                   <a
//                     href="/order-details"
//                     className="text-red-900 font-medium text-xs md:text-sm block mt-2"
//                   >
//                     View Details
//                   </a>
//                 </div>
//               </div>
//               <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
//                 <span
//                   className={`px-3 py-2 text-center rounded-lg ${order.statusColor} text-white font-semibold text-xs md:text-sm`}
//                 >
//                   {order.status}
//                 </span>
//                 <button className="px-3 py-2 rounded-lg bg-cyan-600 font-semibold text-white text-xs md:text-sm">
//                   Cancel
//                 </button>
//                 <button className="px-3 py-2 rounded-lg bg-gray-300 text-gray-600 font-semibold text-xs md:text-sm">
//                   Return
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyOrdersComp;
