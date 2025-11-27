import { useState, useEffect } from 'react';
// import ProductImage from '../../../assets/images/iPhone1.jpg';
import { Link } from 'react-router-dom';
import { CartRemoval } from '../Modal/cartRemoval';
import { toast } from 'react-hot-toast';
import { MdDelete } from "react-icons/md";

import { getUserCart, updateCartItem, removeCartItem, clearUserCart } from '../../../Utils/userCartService';

const ShoppingCart = () => {
   // const [cartItems, setCartItems] = useState([
  //   {
  //     id: 1,
  //     title: 'Apple iPhone 15 Pro Max',
  //     storage: '1TB',
  //     chipset: 'A17 Bionic chip',
  //     color: 'Black Titanium',
  //     price: 1899.0,
  //     originalPrice: 2099.0,
  //     quantity: 1,
  //   },
  //   {
  //     id: 2,
  //     title: 'Apple iPhone 15 Pro Max',
  //     storage: '1TB',
  //     chipset: 'A17 Bionic chip',
  //     color: 'Black Titanium',
  //     price: 1899.0,
  //     originalPrice: 2099.0,
  //     quantity: 1,
  //   },
  // ]);

  // const [coupon, setCoupon] = useState('');
  // const discount = 200; 

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch cart from Api endPoint 
//   const fetchCartData = async () => {
//     setLoading(true);
//     try {
//         const result = await getUserCart();
//         console.log("Full API response:", result);
//         console.log("cartItems type:", typeof result.cartItems);
//         console.log("cartItems value:", result.cartItems);
        
//         if (result.success && Array.isArray(result.cartItems)) {
//             setCartItems(result.cartItems);
//         } else {
//             console.error("cartItems is not an array:", result.cartItems);
//             setCartItems([]); // Set empty array as fallback
//             toast.error('Failed to load cart data');
//         }
//     } catch (error) {
//         console.error("Error in fetchCartData:", error);
//         setCartItems([]); // Set empty array on error
//         toast.error(error.message || 'Failed to load cart');
//     } finally {
//         setLoading(false);
//     }
// };
  const fetchCartData = async () => {
    setLoading(true);
    try {
      const result = await getUserCart();
      if (result.success) {
        setCartItems(result.cartItems || []);
      } else {
        toast.error(result.message || 'Failed to load cart');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Update quantity 
  const updateQuantity = async (id, type) => {
    try {
      const item = cartItems.find(item => item._id === id);
      if (!item) return;

      const newQuantity = type === 'increment' ? item.quantity + 1 : Math.max(1, item.quantity - 1);

      const result = await updateCartItem(id, newQuantity);

      if (result.success) {
        // Update local state
        setCartItems(prev =>
          prev.map(item =>
            item._id === id
              ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
              : item
          )
        );
      } else {
        toast.error(result.message || 'Failed to update quantity');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

   // Remove item with API call
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  const removeFromCart = async () => {
    try {
      const result = await removeCartItem(selectedItemId);
      
      if (result.success) {
        setCartItems(prev => prev.filter(item => item._id !== selectedItemId));
        setOpen(false);
        toast.success('Item removed from cart');
      } else {
        toast.error(result.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    try {
      const result = await clearUserCart();
      
      if (result.success) {
        setCartItems([]);
        toast.success('Cart cleared successfully');
      } else {
        toast.error(result.message || 'Failed to clear cart');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to clear cart');
    }
  };

  // Remove all
  const handleOpenCartRemovalModal = (id) => {
    setSelectedItemId(id);
    setOpen(true);
  };

  // Calculate totals from real data
  const subTotal = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => {
      // Also check if item has price and quantity
      const itemPrice = Number(item.price) || 0;
      const itemQuantity = Number(item.quantity) || 0;
      return total + (itemPrice * itemQuantity);
    }, 0)
    : 0;

  const discount = 0;
  const total = Math.max(0, subTotal - discount);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading cart...</div>;
  }
  
  // // Calculate totals
  // const subTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  // const total = subTotal - discount;

  // const [selectedItemId, setSelectedItemId] = useState(null);
  
  // const handleOpenCartRemovalModal = (id) => {
  //   setSelectedItemId(id);
  //   setOpen(true);
  // };

  // const removeFromCart = () => {
  //   setCartItems((prev) => prev.filter((item) => item.id !== selectedItemId));
  //   setOpen(false);
  // };

  return (
    <section>
      <div className="p-4 h-screen overflow-y-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-32 md:mt-32 lg:mt-40">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Shopping Cart</h1>
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button>
              )}
            </div>

            <div className="space-y-6">
              
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                  <Link to="/">
                    <button className="mt-4 bg-red-900 text-white py-2 px-4 rounded-md hover:bg-red-700">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                   
                  <div key={item._id} className="bg-white flex items-center gap-6 p-4 border rounded-lg">
                    <Link to={`/product-details/${item.product?._id}`}>
                      <img
                        src={item.product?.productImg}
                        alt={item.product?.name}
                        className="w-24 h-24 object-cover rounded-lg m-4"
                      />
                    </Link>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{item.product?.name}</h2>
                      <p className="text-sm text-gray-500">Category: {item.category?.name}</p>
                      <p className="text-sm text-gray-500">Price: AED {item.price}</p>
                      <div className="flex items-center gap-4 mt-2">
                        {/* <button className="text-sm text-blue-500">Save</button> */}
                        <button
                          onClick={() => handleOpenCartRemovalModal(item._id)}
                          className="text-sm text-red-900"
                        >
                          Remove <MdDelete className ='inline w-6 h-6'/>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-red-900 font-bold">AED {(item.price * item.quantity).toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 flex items-center justify-center border rounded"
                          onClick={() => updateQuantity(item._id, 'decrement')}
                        >
                          -
                        </button>
                        <p>{item.quantity}</p>
                        <button
                          className="w-8 h-8 flex items-center justify-center border rounded"
                          onClick={() => updateQuantity(item._id, 'increment')}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <Link to='/'>
                <button className="mt-6 bg-red-900 text-white py-2 px-4 rounded-md hover:bg-red-700">
                  Continue Shopping
                </button>
              </Link>
            )}
          </div>

          {/* Order Summary - Only show if cart has items */}
          {cartItems.length > 0 && (
            <div>
              <div className="p-6 border rounded-lg space-y-6">
                {/* Coupon section */}
                <div>
                  <h2 className="text-lg font-semibold">Coupon</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      className="border p-2 flex-1 rounded"
                    />
                    <button className="bg-red-900 text-white py-2 px-4 rounded-md hover:bg-red-700">
                      APPLY
                    </button>
                  </div>
                </div>

                {/* Order summary */}
                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                  <div className="flex justify-between text-gray-600">
                    <p>Sub Total</p>
                    <p>AED {subTotal.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <p>Discounts</p>
                    <p>- AED {discount.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>AED {total.toLocaleString()}</p>
                  </div>
                </div>

                <Link to='/checkout'>
                  <button className="bg-red-900 text-white py-2 px-4 w-full rounded-md hover:bg-red-700 mt-5">
                    CHECKOUT
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <CartRemoval
        open={open}
        setOpen={setOpen}
        removeFromWishlist={removeFromCart}
      />
    
    </section>
  );
};

export default ShoppingCart;




// ADD TO CART → Only adds to cart (temporary)

// CHECKOUT → Just navigates to checkout page

// CONTINUE → Creates order + clears cart + goes to payment
