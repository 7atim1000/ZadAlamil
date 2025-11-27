import { useState } from "react";
import ProductImage from "../../../assets/images/iPhone1.jpg";
import { Link } from "react-router-dom";
import { WishlistRemove } from "../Modal/removeWishlist";

const WishlistComp = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      title: "Apple iPhone 15 Pro Max",
      storage: "1TB",
      chipset: "A17 Bionic chip",
      color: "Black Titanium",
      price: 2399.0,
    },
    {
      id: 2,
      title: "Apple iPhone 15 Pro Max",
      storage: "1TB",
      chipset: "A17 Bionic chip",
      color: "Black Titanium",
      price: 2399.0,
    },
    {
      id: 3,
      title: "Apple iPhone 15 Pro Max",
      storage: "1TB",
      chipset: "A17 Bionic chip",
      color: "Black Titanium",
      price: 2399.0,
    },
  ]);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (id) => {
    setSelectedItemId(id);
    setOpen(true);
  };

  const removeFromWishlist = () => {
    setWishlist((prev) => prev.filter((item) => item.id !== selectedItemId));
    setOpen(false);
  };

  const moveToCart = (id) => {
    console.log(`Item ${id} moved to cart`);
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className="bg-gray-100 py-12 p-6 ">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-32  md:p-44 ">
        <h1 className="text-3xl font-bold mb-8 text-center">MY WISHLIST</h1>
        <div className="space-y-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg shadow-md md:w-auto"
            >

              <Link to="/product-details">
                <img
                  src={ProductImage}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg mb-4 sm:mb-0"
                />
              </Link>

              <div className="flex-1 sm:ml-4 mb-4 sm:mb-0">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">Storage: {item.storage}</p>
                <p className="text-sm text-gray-500">Chipset: {item.chipset}</p>
                <p className="text-sm text-gray-500">Color: {item.color}</p>
              </div>

              <p className="text-lg font-bold text-red-600 mb-4 sm:mb-0 mr-52 sm:ml-16">
                AED {item.price.toLocaleString()}
              </p>
              <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-col sm:gap-4 justify-center sm:ml-[-89px]">
                <button
                  onClick={() => handleOpen(item.id)}
                  className="w-full sm:w-auto text-red-500 border border-red-500 py-2 px-4 rounded-md hover:bg-red-500 hover:text-white transition"
                >
                  REMOVE
                </button>
                <button
                  onClick={() => moveToCart(item.id)}
                  className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                  MOVE TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WishlistRemove
        open={open}
        setOpen={setOpen}
        removeFromWishlist={removeFromWishlist}
      />
    </section>
  );
};

export default WishlistComp;
