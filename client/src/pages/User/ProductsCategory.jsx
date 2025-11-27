import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProductsByCategory } from "../../Utils/getProductsByCategoryApi";
import { toast } from 'react-hot-toast' ;
import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { addUserCart } from '../../Utils/userCartService';

const ProductsCategory = () => {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const location = useLocation();

  var user = useSelector((state) => state.user);   

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;  

  // Helper function to get complete image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.png';

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const cleanPath = imagePath.replace(/^\//, '');
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  // Calculate discount function
  const calculateDiscount = (product) => {
    if (product.originalPrice && product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return `${Math.round(discount)}% OFF`;
    }
    return "SALE";
  };

  // Add to Cart function
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


  // Get categoryId from URL query parameters
  const getCategoryIdFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('categoryId');
  };

  const fetchProductsByCategory = async (categoryId) => {
    setLoading(true);
    try {
      const data = await getProductsByCategory(categoryId);
      setProducts(data.products || []);
    //setCategoryName(data.category?.name || 'Products'); This expects an object with name property
       setCategoryName(data.category || 'Products'); // and this return and expected string
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const categoryId = getCategoryIdFromUrl();
    if (categoryId) {
      fetchProductsByCategory(categoryId);
    }
  }, [location.search]);

  const categoryId = getCategoryIdFromUrl();

  return (
    <div className="container mx-auto px-4 py-8">
        
      {/* <h1 className="text-3xl font-bold mb-8">
        {categoryName} {categoryId && `(Category: ${categoryId})`}
      </h1> */}

      <div className ='flex gap-2 items-center'>
          <h1 className ='text-lg md:text-3xl text-[#972323]'>{categoryName}</h1>
          <p className ='text-lg'>Products</p>
      </div>
      

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discount = calculateDiscount(product);
            
            return (
                <div key={product._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col relative"> {/* Add relative here */}
                    {/* Discount Badge */}
                    {discount && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-2 py-1 rounded z-10">
                            {discount}
                        </div>
                    )}

                    {/* Product Image */}
                    <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-4 mt-5">
                        <img
                            src={getImageUrl(product.productImg)}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                                e.target.src = '/placeholder-image.png';
                            }}
                        />
                    </div>

                    {/* Rest of your code remains the same */}
                    <div className="flex-grow">
                        <h3 className="text-lg font-semibold mb-2 h-12 overflow-hidden">
                            {product.name}
                        </h3>

                        {/* Price Display */}
                        {product.originalPrice ? (
                            <div className="mb-2">
                                <p className="text-gray-400 line-through text-sm">
                                    AED {product.originalPrice?.toLocaleString()}
                                </p>
                                <p className="text-black text-lg font-bold">
                                    AED {product.price?.toLocaleString()}
                                </p>
                            </div>
                        ) : (
                            <p className="text-black text-lg font-bold mb-2">
                                AED {product.price?.toLocaleString()}
                            </p>
                        )}

                        {/* Stock Status */}
                        <p className={`text-xs mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </p>

                    </div>

                    {/* Add to Cart Button */}
                    <button
                      // onClick={() => handleAddToCart(product)}
                      onClick={() => handleAddToCart(product)}

                        className="bg-gradient-to-r from-[#1D0F0F] to-[#972323] text-white 
                          font-semibold px-4 py-2 w-full rounded-md hover:bg-[#6f1b1b] 
                          disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
          <div className="text-lg text-gray-600">
            {categoryId ? 'No products found in this category' : 'Please select a category'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsCategory;