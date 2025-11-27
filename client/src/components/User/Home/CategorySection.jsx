import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { getCategoriesPublic } from "../../../Utils/userCategoryService.js";

import Img1 from '../../../assets/images/camers.png';
import Img2 from '../../../assets/images/gaming.png';
import Img3 from '../../../assets/images/headphones.png';
import Img4 from '../../../assets/images/laptops.png';
import Img5 from '../../../assets/images/mobiles.png';
import Img6 from '../../../assets/images/speakers.png';
import Img7 from '../../../assets/images/wearables.png';

// const categories = [
//     { name: 'Cameras', image: Img1 },
//     { name: 'Gaming', image: Img2 },
//     { name: 'Headphones', image: Img3 },
//     { name: 'Laptops', image: Img4 },
//     { name: 'Mobiles', image: Img5 },
//     { name: 'Speakers', image: Img6 },
//     { name: 'Wearables', image: Img7 }
//   ];
  
const CategorySection = () => {

  const token = localStorage.getItem("userAccessToken");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Public Categories API End Point:-
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        console.log("Fetching categories...");

        let data;

        if (token) {
          // User is logged in - use protected API
          console.log("User is authenticated, using protected API");
          data = await getCategoriesPublic();
        } else {
          // User is not logged in - use public API
          console.log("User is not authenticated, using public API");
          data = await getCategoriesPublic();
        }

        console.log("Categories data received:", data);

        // Make sure we're accessing the right property
        const categoriesArray = data.categories || data || [];

        const mappedCategories = categoriesArray.map((cat) => ({
          categoryName: cat.name,
          categoryId: cat._id,
          categoryImg: cat.categoryImg, // Add this to display images of categories
          status: cat.status?.toUpperCase() === "LIST",
        }));

        console.log("Mapped categories:", mappedCategories);
        setCategories(mappedCategories);

      } catch (error) {
        console.error("Error fetching categories:", error);

        // Safe error message check
        const errorMessage = error?.message || error?.toString() || 'Unknown error';

        // Only show toast for unexpected errors (not auth-related)
        if (!errorMessage.includes("No authentication token") &&
          !errorMessage.includes("invalid or expired") &&
          !errorMessage.includes("Unauthorized")) {
          toast.error("Failed to fetch categories");
        }

        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]); // This will refetch when login status changes

  // To display images 
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;  
  
  // Helper function to get complete image URL
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

  return (
    <section className="py-1 ">
      <h2 className="text-3xl font-bold text-center mb-14">Shop By Category</h2>
      <div className="flex justify-between gap-12 mb-20 px-5">
        
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col items-center cursor-pointer">
            {/* <Link to='/mobiles&tabs'> */}
            {/* <Link to= '/products-category'> */}
            
            <Link to={`/products-category?categoryId=${category.categoryId}`}>
            <div className="w-24 h-24 rounded-full shadow-2xl shadow-black bg-gray-200 flex items-center justify-center">
              <img
                src={getImageUrl(category.categoryImg)}
                alt={category.name}
                className="w-12 h-12 object-contain"
              />
            </div>
            </Link>
            <span className="mt-2 text-lg font-medium">{category.categoryName}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategorySection
