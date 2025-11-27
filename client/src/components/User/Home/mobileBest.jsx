import { useState, useEffect } from 'react';
import { getProductsByCategory } from "../../../Utils/getProductsByCategoryApi";
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

import {useNavigate} from 'react-router-dom';
import { addUserCart } from '../../../Utils/userCartService';


// Separate function only for calculateDiscount
const calculateDiscount = (product) => {
  if (product.originalPrice && product.price) {
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    return `${Math.round(discount)}% OFF`;
  }
  return "SALE";
};

// Base URL for your backend - adjust this to match your actual backend URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL;  


// Helper function to get complete image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.png';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Remove any leading slashes and construct the correct path to uploads folder
  const cleanPath = imagePath.replace(/^\//, ''); // Remove leading slash if exists
  
  // Construct the URL to access images from the uploads folder
  return `${BASE_URL}/uploads/${cleanPath}`;
};

const MobileBestSellers = () => {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Get by category
  const categoryId = '6919cfce2114e4873685792c';
  var user = useSelector((state) => state.user);

  const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      const data = await getProductsByCategory(categoryId, search);
      console.log('Fetched products:', data.products);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const displayedProducts = products.slice(0, 3);

  // Start Add To Cart
  
  const handleAddToCart = async (product) => {
    console.log("1. Function started");
    console.log("Full user state:", user); // This will show the structure

    if (!user?.token) {
      console.log("2. No user token");
      toast.error('Please login or subscribe first');
      return;
    }

    console.log("3. User token exists");

    try {
      // Get user ID from the nested user object
      const userId = user.user?._id; // Access the nested user object

      if (!userId) {
        console.error("No user ID found in user object:", user.user);
        toast.error('User information not found. Please login again.');
        return;
      }

      const productData = {
        user: userId, // Use the correct user ID
        product: product._id,
        category: product.category?._id || product.category,
        price: product.price,
        quantity: 1,
        total: product.price,
        coupon: ""
      };

      console.log("4. Product data prepared:", productData);
      console.log("5. Calling addUserCart API...");

      const result = await addUserCart(productData);

      console.log("6. API call completed, result:", result);

      console.log("7. Navigating to cart");
      navigate('/cart');

      if (result?.success) {
        toast.success('Product added to cart successfully!');
      } else {
        toast.error(result?.message || 'Product might not have been added to cart');
      }

    } catch (error) {
      console.log("9. Error caught:", error);
      console.error("Error:", error);
      navigate('/cart');
      toast.error('Error adding to cart, but redirected to cart page');
    }

    console.log("11. Function completed");
  };
  // End Handle Add To Cart

  return (
    <section className="w-full py-10 px-5 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#972323]">BEST SELLERS</h2>
        <a href="#" className="text-sm font-semibold text-[#972323] hover:underline">
          VIEW ALL &gt;
        </a>
      </div>
      
      <div className="container mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayedProducts.map((product) => {
              const discount = calculateDiscount(product);
              const imageUrl = getImageUrl(product.productImg);
              
              console.log('Image URL:', imageUrl); // Debug the final URL
              
              return (
                <div key={product._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center relative">
                  {/* Discount Badge */}
                  {discount && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-2 py-1 rounded">
                      {discount}
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
                    ♥
                  </button>

                  {/* Product Image with proper URL */}
                
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mt-8">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        console.log('Image failed to load, using placeholder:', imageUrl);
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                  </div>
             
                  
                  {/* Product Info */}
                  <div className="text-start mt-6 w-full">
                    <h3 className="text-gray-700 text-sm font-medium h-12 overflow-hidden">
                      {product.name}
                    </h3>
                    
                    {product.originalPrice ? (
                      <>
                        <p className="text-gray-400 line-through text-sm mt-5">
                          AED {product.originalPrice?.toLocaleString()}
                        </p>
                        <p className="text-black text-lg font-bold">
                          AED {product.price?.toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="text-black text-lg font-bold mt-5">
                        AED {product.price?.toLocaleString()}
                      </p>
                    )}
                    
                    <p className={`text-xs mt-2 ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                  </div>

                  <button 
                    onClick = {()=> handleAddToCart(product)}
                    
                    className="bg-gradient-to-r from-[#1D0F0F] to-[#972323] text-white 
                    font-semibold px-4 py-2 w-full rounded-md hover:bg-[#6f1b1b] mt-10 mb-10
                    disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">No products found in this category</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MobileBestSellers;

// import PropTypes from "prop-types";
// import Img1 from "../../../assets/images/mob1.png";
// import Img2 from "../../../assets/images/mob2.png";
// import Img3 from "../../../assets/images/mob3.png";

// const mobileBestSellersData = [
//   { id: 1, image: Img1, title: "LG UM670H 43\" UHD 4K Commercial Smart TV", price: 10999, oldPrice: 15499, discount: "28% OFF" },
//   { id: 2, image: Img2, title: "LG UM670H 43\" UHD 4K Commercial Smart TV", price: 10999, oldPrice: 15499, discount: "28% OFF" },
//   { id: 3, image: Img3, title: "LG UM670H 43\" UHD 4K Commercial Smart TV", price: 10999, oldPrice: 15499, discount: "28% OFF" },
// ];

// const ProductCard = ({ product }) => {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center relative">

//       <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-2 py-1 rounded">
//         {product.discount}
//       </div>

//       <button className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
//         ♥
//       </button>

//       <img src={product.image} alt={product.title} className="w-full h-48 object-contain" />

//       <div className="text-START mt-6">
//         <h3 className="text-gray-700 text-sm font-medium">{product.title}</h3>
//         <p className="text-gray-400 line-through text-sm mt-5">
//           AED {product.oldPrice.toLocaleString()}
//         </p>
//         <p className="text-black text-lg font-bold">AED {product.price.toLocaleString()}</p>
//       </div>

//       <button className="bg-gradient-to-r from-[#1D0F0F] to-[#972323] text-white font-semibold px-4 py-2 w-full rounded-md hover:bg-[#6f1b1b] mt-10 mb-10">
//         ADD TO CART
//       </button>
//     </div>
//   );
// };

// ProductCard.propTypes = {
//   product: PropTypes.shape({
//     image: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     oldPrice: PropTypes.number.isRequired,
//     discount: PropTypes.string.isRequired,
//   }).isRequired,
// };

// const MobileBestSellers = () => {
//   return (
//     <section className="w-full py-10 px-5 bg-gray-50">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold text-[#972323]">BEST SELLERS</h2>
//           <a href="#" className="text-sm font-semibold text-[#972323] hover:underline">
//             VIEW ALL &gt;
//           </a>
//         </div>
//         <div className="container mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {mobileBestSellersData.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MobileBestSellers;
