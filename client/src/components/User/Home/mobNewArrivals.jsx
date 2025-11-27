import PropTypes from "prop-types";
import Img1 from "../../../assets/images/mob1.png";
import Img2 from "../../../assets/images/mob2.png";
import Img3 from "../../../assets/images/mob3.png";

const newArrivalsMobData = [
  { id: 1, image: Img1, title: "LG UM670H 43\" UHD 4K Commercial Smart TV", price: 10999, oldPrice: 15499, discount: "28% OFF" },
  { id: 2, image: Img2, title: "LG UM670H 43\" UHD 4K Commercial Smart TV", price: 10999, oldPrice: 15499, discount: "28% OFF" },
  { id: 3, image: Img3, title: "LG UM670H 43\" UHD 4K Commercial Smart TV", price: 10999, oldPrice: 15499, discount: "28% OFF" },
];

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center relative">

      <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-2 py-1 rounded">
        {product.discount}
      </div>

      <button className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
        ♥
      </button>

      <img src={product.image} alt={product.title} className="w-full h-48 object-contain" />

      <div className="text-START mt-6">
        <h3 className="text-gray-700 text-sm font-medium">{product.title}</h3>
        <p className="text-gray-400 line-through text-sm mt-5">
          AED {product.oldPrice.toLocaleString()}
        </p>
        <p className="text-black text-lg font-bold">AED {product.price.toLocaleString()}</p>
      </div>

      <button className="bg-gradient-to-r from-[#1D0F0F] to-[#972323] text-white font-semibold px-4 py-2 w-full rounded-md hover:bg-[#6f1b1b] mt-10 mb-10">
        ADD TO CART
      </button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    oldPrice: PropTypes.number.isRequired,
    discount: PropTypes.string.isRequired,
  }).isRequired,
};

const MobNewArrivals = () => {
  return (
    <section className="w-full py-10 px-5 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#972323]">NEW ARRIVALS</h2>
          <a href="#" className="text-sm font-semibold text-[#972323] hover:underline">
            VIEW ALL &gt;
          </a>
        </div>
        <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {newArrivalsMobData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobNewArrivals;
