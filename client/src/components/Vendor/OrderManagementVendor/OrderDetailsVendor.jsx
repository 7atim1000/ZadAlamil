// Use dynamic data instead of hardcoded values
// The issue is likely that your route path doesn't match. You're navigating to /vendor/order-details/${order._id} but your component expects the parameter to be orderId.

import { useState, useEffect } from "react";
import { UserCircleIcon, TruckIcon, MapPinIcon } from "@heroicons/react/24/solid";
import Img1 from '../../../assets/images/mob1.png';
import { Link, useParams } from "react-router-dom";
import { getVendorOrderById } from "../../../Utils/vendorOrdersService";

const OrderDetailsVendor = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Fetching order with ID:", orderId);

        const response = await getVendorOrderById(orderId);
        console.log("📦 Full API response:", response);

        if (response.success && response.order) {
          console.log("✅ Order found:", response.order);
          console.log("📊 Items array:", response.order.items);
          console.log("🔢 Items length:", response.order.items?.length);

          // Check if we have the original items before filtering
          if (response.order.originalItems) {
            console.log("🛒 Original items (before filtering):", response.order.originalItems);
            console.log("🔢 Original items length:", response.order.originalItems.length);
          }

          setOrder(response.order);
        } else {
          console.log("API returned success but no order data");
          throw new Error(response.message || "Failed to fetch order");
        }
      } catch (err) {
        console.error(" Failed to fetch order:", err);
        setError(err.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">Loading order details...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="text-xl font-semibold text-red-600 mb-4">Error: {error}</div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-900 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    // If no order data
    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">No order data found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
                    <div className="p-8 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-red-900">ORDER DETAILS</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Details for Order ID: <span className="font-mono">{order._id || "N/A"}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Order Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors font-medium">
                                Download Invoice
                            </button>
                        </div>
                    </div>

                    {/* Customer & Order Info Section */}
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                                <UserCircleIcon className="w-6 h-6 text-gray-600" />
                                Customer Information
                            </h3>
                            <div className="space-y-2">
                                <p className="text-gray-900 font-medium text-lg">
                                    {order.user?.name || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    📞 {order.user?.phone || "N/A"}
                                </p>
                                <p className="text-gray-600">
                                    ✉️ {order.user?.email || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                                <TruckIcon className="w-6 h-6 text-gray-600" />
                                Order Information
                            </h3>    
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    <span className="font-medium">Payment Status:</span> 
                                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                                        order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : "N/A"}
                                    </span>
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Order Status:</span> 
                                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Processing"}
                                    </span>
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                                <MapPinIcon className="w-6 h-6 text-gray-600" />
                                Delivery Address
                            </h3>
                            <div className="space-y-2">
                                <p className="text-gray-900 font-medium">
                                    {order.shippingAddress?.recipientName || order.user?.name || "N/A"}
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {order.shippingAddress?.street || order.shippingAddress?.address || "Address not specified"}
                                </p>
                                {order.shippingAddress?.city && (
                                    <p className="text-gray-600">
                                        {order.shippingAddress.city}
                                        {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                                        {order.shippingAddress.postalCode && ` - ${order.shippingAddress.postalCode}`}
                                    </p>
                                )}
                                <p className="text-gray-600">
                                    📞 {order.shippingAddress?.mobileNumber || order.user?.phone || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-8 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {order.items?.length || 0} item(s) from your store
                        </p>
                    </div>
                    
                    <div className="p-8">
                        {order.items && order.items.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Product</th>
                                            <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Image</th>
                                            <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Unit Price</th>
                                            <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Quantity</th>
                                            <th className="border border-gray-200 p-4 text-left font-semibold text-gray-700">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="border border-gray-200 p-4 font-medium text-gray-900">
                                                    {item.product?.name || "Product Name"}
                                                </td>
                                                <td className="border border-gray-200 p-4">
                                                    <Link 
                                                        to={`/product-details/${item.product?._id}`}
                                                        className="inline-block"
                                                    >
                                                        <img 
                                                            src={item.product?.images?.[0] || item.product?.productImg || Img1} 
                                                            alt={item.product?.name}
                                                            className="w-12 h-12 object-cover rounded border border-gray-200"
                                                        />
                                                    </Link>
                                                </td>
                                                <td className="border border-gray-200 p-4 text-gray-700">
                                                    AED {item.price || item.product?.price || "0"}
                                                </td>
                                                <td className="border border-gray-200 p-4 text-gray-700">
                                                    {item.quantity || "0"}
                                                </td>
                                                <td className="border border-gray-200 p-4 font-semibold text-gray-900">
                                                    AED {item.totalPrice || (item.price * item.quantity) || "0"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="4" className="border border-gray-200 p-4 font-semibold text-right text-gray-700">
                                                Subtotal:
                                            </td>
                                            <td className="border border-gray-200 p-4 font-semibold text-gray-900">
                                                AED {order.totalAmount || "0"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4" className="border border-gray-200 p-4 font-semibold text-right text-gray-700">
                                                Shipping Cost:
                                            </td>
                                            <td className="border border-gray-200 p-4 font-semibold text-gray-900">
                                                AED {order.shippingCost || "0.00"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4" className="border border-gray-200 p-4 font-semibold text-right text-gray-700">
                                                TOTAL:
                                            </td>
                                            <td className="border border-gray-200 p-4 font-bold text-lg text-red-900">
                                                AED {order.totalAmount || "0"}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Items Found</h3>
                                <p className="text-gray-500">
                                    This order doesn't contain any products from your store.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsVendor;


    // useEffect(() => {
    //     const fetchOrderDetails = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);
    //             console.log("Fetching order with ID:", orderId); // Debug log
    //             const orderData = await getVendorOrderById(orderId);
    //             console.log("Order data received:", orderData); // Debug log
    //             setOrder(orderData);
    //         } catch (err) {
    //             console.error("Failed to fetch order:", err);
    //             setError(err.message || "Failed to fetch order details");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (orderId) {
    //         fetchOrderDetails();
    //     } else {
    //         setError("No order ID provided");
    //         setLoading(false);
    //     }
    // }, [orderId]);

    // // Debug: Check what's in the order data
    // useEffect(() => {
    //     if (order) {
    //         console.log("Current order state:", order);
    //     }
    // }, [order]);

   




// import { UserCircleIcon } from "@heroicons/react/24/solid";
// import { TruckIcon } from "@heroicons/react/24/solid";
// import { MapPinIcon } from "@heroicons/react/24/solid";
// import Img1 from '../../../assets/images/mob1.png';
// import { Link } from "react-router-dom";

// const OrderDetailsVendor = () => {
//     return (
//         <section className="p-4">
//       <div className="min-h-screen bg-white flex flex-col items-center p-2 ">
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
//             <div>
//                 <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
//                 <UserCircleIcon className="w-5 h-5 text-gray-500" />
//                 Customer
//                 </h3>
//                 <p className="text-gray-800 font-semibold">Akhila Vijayan</p>
//                 <p className="text-gray-600 text-sm">+9718877451252</p>
//             </div>
  
//             <div>
//                 <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
//                     <TruckIcon className="w-5 h-5 text-gray-500" />
//                     Order Info
//                 </h3>    
//               <p className="text-gray-800 text-sm">Shipping Forgo Express</p>
//               <p className="text-gray-800 text-sm">Pay method: Razor Pay</p>
//               <p className="text-gray-800 text-sm">Status: Placed</p>
//             </div>
  
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
  
//   export default OrderDetailsVendor;


