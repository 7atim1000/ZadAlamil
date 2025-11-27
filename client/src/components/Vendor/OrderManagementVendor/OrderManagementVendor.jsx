import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Typography,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Input,
    Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

import { useState, useEffect } from 'react';
import { getVendorOrders } from "../../../Utils/vendorOrdersService";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom' ;

const TABS = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Delivered",
        value: "delivered",
    },
    {
        label: "Pending",
        value: "pending",
    },
    {
        label: "Cancelled",
        value: "cancelled",
    },
    {
        label: "Confirmed",
        value: "confirmed",
    },
    {
        label: "Shipped",
        value: "shipped",
    },
];

const TABLE_HEAD = ["No", "Order ID", "Customer", "Items", "Status", "Date", "Total", "Payment", "Details"];

export function OrderVendorTable() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    
    const navigate = useNavigate();
    const loadVendorOrders = async () => {
        try {
            setLoading(true);

            // Check if vendor token exists
            const vendorToken = localStorage.getItem("vendorToken");
            if (!vendorToken) {
                toast.error("Please login as vendor first");
                navigate('/vendor-login');
                return;
            }

            // Convert 'all' to empty string for API
            const status = selectedStatus === 'all' ? '' : selectedStatus;
            const result = await getVendorOrders(currentPage, 10, status);

            if (result.success) {
                setOrders(result.orders || []);
                setTotalPages(result.totalPages || 1);
            } else {
                // Handle specific API errors
                if (result.message?.includes('Unauthorized') || result.message?.includes('token')) {
                    toast.error("Session expired. Please login again.");
                    localStorage.removeItem("vendorToken");
                    navigate('/vendor/vendor-login');
                } else {
                    toast.error(result.message || 'Failed to load orders');
                }
            }
        } catch (error) {
            console.error('Load vendor orders error:', error);

            // Handle specific error cases
            if (error.message?.includes('Unauthorized') || error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                localStorage.removeItem("vendorToken");
                navigate('/vendor/vendor-login');
            } else if (error.response?.status === 403) {
                toast.error("Access denied. Vendor privileges required.");
                navigate('/vendor/vendor-login');
            } else {
                toast.error(error.message || 'Failed to load orders');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVendorOrders();
    }, [currentPage, selectedStatus]);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        const statusColors = {
            pending: "blue",
            confirmed: "light-blue", 
            shipped: "purple",
            delivered: "green",
            cancelled: "red",
            packing: "orange"
        };
        return statusColors[status] || "blue-gray";
    };

    // Get payment status color
    const getPaymentColor = (paymentStatus) => {
        return paymentStatus === 'paid' ? 'green' : 'red';
    };

    // Filter orders based on search
    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        
        const searchLower = searchQuery.toLowerCase();
        return (
            order._id.toLowerCase().includes(searchLower) ||
            order.user?.name?.toLowerCase().includes(searchLower) ||
            order.items?.some(item => 
                item.product?.name?.toLowerCase().includes(searchLower)
            )
        );
    });

    // Get items preview text
    const getItemsPreview = (order) => {
        if (!order.items || order.items.length === 0) return 'No items';
        
        const firstItem = order.items[0].product?.name || 'Product';
        if (order.items.length === 1) {
            return firstItem;
        }
        return `${firstItem} + ${order.items.length - 1} more`;
    };

    const handleTabChange = (value) => {
        setSelectedStatus(value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            All Orders
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all orders
                        </Typography>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Tabs value={selectedStatus} className="w-full md:w-max">
                        <TabsHeader>
                            {TABS.map(({ label, value }) => (
                                <Tab 
                                    key={value} 
                                    value={value}
                                    onClick={() => handleTabChange(value)}
                                >
                                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-72">
                        <Input
                            label="Search by Order ID, Customer, or Product"
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <Typography className="ml-2">Loading orders...</Typography>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-8">
                        <Typography color="gray" className="font-normal">
                            {searchQuery ? 'No orders found matching your search' : 'No orders found'}
                        </Typography>
                    </div>
                ) : (
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order, index) => {
                                const isLast = index === filteredOrders.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={order._id}>
                                        <td className="py-3 px-4 text-center">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-bold"
                                                    >
                                                        {order._id.slice(-8).toUpperCase()}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {order.user?.name || 'Customer'}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    color="gray"
                                                    className="font-normal text-xs"
                                                >
                                                    {order.user?.email}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {getItemsPreview(order)}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    color="gray"
                                                    className="font-normal text-xs"
                                                >
                                                    {order.items?.length} items
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="w-max">
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-24 text-center capitalize"
                                                    value={order.status}
                                                    color={getStatusColor(order.status)}
                                                />
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {formatDate(order.createdAt)}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal font-semibold"
                                            >
                                                AED {order.totalAmount?.toLocaleString()}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="w-max">
                                                <Chip
                                                    variant="filled"
                                                    size="md"
                                                    value={order.paymentStatus === "paid" ? "paid" : "pending"}
                                                    color={getPaymentColor(order.paymentStatus)}
                                                    className="w-20 items-center justify-center cursor-pointer capitalize"
                                                />
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Link to={`/vendor/order-details/${order._id}`}>
                                                <button 
                                                    className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page {currentPage} of {totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button 
                        variant="outlined" 
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button 
                        variant="outlined" 
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}



// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
// import {
//     Card,
//     CardHeader,
//     Typography,
//     CardBody,
//     Chip,
//     CardFooter,
//     Tabs,
//     TabsHeader,
//     Tab,
//     Input,
//     Button,
//   } from "@material-tailwind/react";
// import { Link } from "react-router-dom";

// import { useState, useEffect } from 'react';
// import { getVendorOrders } from "../../../Utils/vendorOrdersService";
// import { toast } from 'react-hot-toast' ;

//   const TABS = [
//     {
//         label: "All",
//         value: "all",
//     },
//     {
//         label: "Delivered",
//         value: "delivered",
//     },
//     {
//         label: "Pending",
//         value: "pending",
//     },
//     {
//         label: "Cancelled",
//         value: "cancelled",
//     },
//     {
//         label: "OnTransit",
//         value: "onTransit",
//     },
//     {
//         label: "Packing",
//         value: "packing",
//     },
// ];

   
// const TABLE_HEAD = ["No", "Order ID", "Item", "Fullfillment", "Date", "Total","Payment", "Details"];

// const [orders, setOrders] = useState([]);
// const [stats, setStats] = useState(null);
// const [loading, setLoading] = useState(true);
// const [currentPage, setCurrentPage] = useState(1);
// const [totalPages, setTotalPages] = useState(1);
// const [selectedStatus, setSelectedStatus] = useState('');
   
// // const TABLE_ROWS = [
// //     {
// //       orderId: "TFY8779HHJ8",
// //       item: "iPhone",
// //       fullfillment: "delivered",
// //       total: "6529.00",
// //       payment: "paid",
// //       date: "23/04/18",
// //     },
// //     {
// //       orderId: "TFY8779HHJ8",
// //       item: "iPhone",
// //       fullfillment: "packing",
// //       total: "6529.00",
// //       payment: "paid",
// //       date: "23/04/18",
// //     },
// //     {
// //       orderId: "TFY8779HHJ8",
// //       item: "iPhone",
// //       fullfillment: "cancelled",
// //       total: "6529.00",
// //       payment: "unpaid",
// //       date: "23/04/18",
// //     },
// //     {
// //       orderId: "TFY8779HHJ8",
// //       item: "iPhone",
// //       fullfillment: "pending",
// //       total: "6529.00",
// //       payment: "unpaid",
// //       date: "23/04/18",
// //     },
// //     {
// //       orderId: "TFY8779HHJ8",
// //       item: "iPhone",
// //       fullfillment: "pending",
// //       total: "6529.00",
// //       payment: "unpaid",
// //       date: "23/04/18",
// //     },
// // ];
   
// export function OrderVendorTable() {
//     return (
//         <Card className="h-full w-full">
//             <CardHeader floated={false} shadow={false} className="rounded-none">
//                 <div className="mb-8 flex items-center justify-between gap-8">
//                     <div>
//                         <Typography variant="h5" color="blue-gray">
//                         All Orders
//                         </Typography>
//                         <Typography color="gray" className="mt-1 font-normal">
//                         See information about all orders
//                     </Typography>
//                     </div>
//                 </div>
//                 <div className="flex flex-col items-center justify-between gap-4 md:flex-row"></div>
//                 <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
//                     <Tabs value="all" className="w-full md:w-max">
//                         <TabsHeader>
//                             {TABS.map(({ label, value }) => (
//                             <Tab key={value} value={value}>
//                                 &nbsp;&nbsp;{label}&nbsp;&nbsp;
//                             </Tab>
//                             ))}
//                         </TabsHeader>
//                     </Tabs>
//                     <div className="w-full md:w-72">
//                         <Input
//                             label="Search"
//                             icon={<MagnifyingGlassIcon className="h-5 w-5" />}
//                         />
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardBody className="overflow-scroll px-0">
//                 <table className="mt-4 w-full min-w-max table-auto text-left">
//                 <thead>
//                     <tr>
//                     {TABLE_HEAD.map((head) => (
//                         <th
//                         key={head}
//                         className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
//                         >
//                         <Typography
//                             variant="small"
//                             color="blue-gray"
//                             className="font-normal leading-none opacity-70"
//                         >
//                             {head}
//                         </Typography>
//                         </th>
//                     ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {TABLE_ROWS.map(
//                     ({  orderId, item,fullfillment, payment, date, total }, index) => {
//                         const isLast = index === TABLE_ROWS.length - 1;
//                         const classes = isLast
//                         ? "p-4"
//                         : "p-4 border-b border-blue-gray-50";
        
//                         return (
//                         <tr key={orderId}>
//                             <td className="py-3 px-4 text-center">{index + 1}</td>
//                             <td className={classes}>
//                             <div className="flex items-center gap-3">
//                                 <div className="flex flex-col">
//                                 <Typography
//                                     variant="small"
//                                     color="blue-gray"
//                                     className="font-bold"
//                                 >
//                                     {orderId}
//                                 </Typography>
//                                 </div>
//                             </div>
//                             </td>
//                             <td className={classes}>
//                             <div className="flex flex-col">
//                                 <Typography
//                                 variant="small"
//                                 color="blue-gray"
//                                 className="font-normal"
//                                 >
//                                 {item}
//                                 </Typography>
//                             </div>
//                             </td>
                            
//                             <td className={classes}>
//                                 <div className="w-max">
//                                     <Chip
//                                     variant="ghost"
//                                     size="sm"
//                                     className="w-24 text-center"
//                                     value={fullfillment}
//                                     color={
//                                         fullfillment === "delivered"
//                                         ? "green"
//                                         : fullfillment === "cancelled"
//                                         ? "red"
//                                         : fullfillment === "packing"
//                                         ? "orange"
//                                         : fullfillment === "pending"
//                                         ? "blue"
//                                         : "blue-gray"
//                                     }
//                                     />
//                                 </div>
//                             </td>

//                             <td className={classes}>
//                             <Typography
//                                 variant="small"
//                                 color="blue-gray"
//                                 className="font-normal"
//                             >
//                                 {date}
//                             </Typography>
//                             </td>

//                             <td className={classes}>
//                             <Typography
//                                 variant="small"
//                                 color="blue-gray"
//                                 className="font-normal"
//                             >
//                                 {total}
//                             </Typography>
//                             </td>

//                             <td className={classes}>
//                             <div className="w-max">
//                                 <Chip
//                                 variant="filled"
//                                 size="md"
//                                 value={payment === "paid" ? "paid" : "unpaid"}
//                                 color={payment === "paid" ? "green" : "red"}
//                                 className="w-20 items-center justify-center cursor-pointer"
//                                 />
//                             </div>
//                             </td>

//                             <td className={classes}>
//                                 <Link to='/vendor/vendor-orderDetails'>
//                                     <button 
//                                         className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-900">
//                                             View Details
//                                     </button>
//                                 </Link>
//                             </td>
                            
//                         </tr>
//                         );
//                     },
//                     )}
//                 </tbody>
//                 </table>
//             </CardBody>
//             <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
//                 <Typography variant="small" color="blue-gray" className="font-normal">
//                     Page 1 of 10
//                 </Typography>
//                 <div className="flex gap-2">
//                     <Button variant="outlined" size="sm">
//                     Previous
//                     </Button>
//                     <Button variant="outlined" size="sm">
//                     Next
//                     </Button>
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// }