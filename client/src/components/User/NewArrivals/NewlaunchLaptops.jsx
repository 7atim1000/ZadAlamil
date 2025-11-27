import PropTypes from "prop-types";

  const ProductCardLaptop = ({ product }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center relative mb-5">
  
        <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-2 py-1 rounded">
          {product.discount}
        </div>
  
        <button className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
          ♥
        </button>
  
        <img src={product.image} alt={product.title} className="w-full h-48 object-contain" />
  
        <div className="text-START mt-6">
          <h3 className="text-gray-700 text-sm font-medium">{product.title}</h3>
          <p className="text-black text-lg font-bold">AED {product.price.toLocaleString()}</p>
        </div>
  
        <button className="bg-gradient-to-r from-[#1D0F0F] to-[#972323] text-white font-semibold px-4 py-2 w-full rounded-md hover:bg-[#6f1b1b] mt-10 mb-10">
          ADD TO CART
        </button>
      </div>
    );
  };
  
  ProductCardLaptop.propTypes = {
    product: PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      oldPrice: PropTypes.number.isRequired,
      discount: PropTypes.string.isRequired,
    }).isRequired,
  };

export default ProductCardLaptop;