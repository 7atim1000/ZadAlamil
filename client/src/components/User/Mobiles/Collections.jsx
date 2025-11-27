import PropTypes from 'prop-types';
import Img1 from '../../../assets/images/mob1.png';
import Img2 from '../../../assets/images/mob2.png';
import Img3 from '../../../assets/images/mob3.png';
import Img4 from '../../../assets/images/mob3.png';
import Img5 from '../../../assets/images/mob3.png';
import Img6 from '../../../assets/images/mob3.png';
import Img7 from '../../../assets/images/mob3.png';
import Img8 from '../../../assets/images/mob3.png';
import Img9 from '../../../assets/images/mob1.png';
import Img10 from '../../../assets/images/mob2.png';
import Img11 from '../../../assets/images/mob3.png';
import Img12 from '../../../assets/images/mob3.png';
import Img13 from '../../../assets/images/mob3.png';
import Img14 from '../../../assets/images/mob3.png';
import Img15 from '../../../assets/images/mob3.png';
import Img16 from '../../../assets/images/mob3.png';
import { Filters } from './Filters';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const collectionData =  [
    { id: 1, image: Img1, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 2, image: Img2, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 3, image: Img3, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 4, image: Img4, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 5, image: Img5, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 6, image: Img6, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 7, image: Img7, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 8, image: Img8, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 9, image: Img9, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 10, image: Img10, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 11, image: Img11, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 12, image: Img12, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 13, image: Img13, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 14, image: Img14, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 15, image: Img15, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
    { id: 16, image: Img16, title: "Samsung Galaxy Z Fold5 |5G| 12GB RAM | ROM 1 TB", price: 6599, oldPrice: 10999, discount: "28% OFF" },
]

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center relative">

      <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-2 py-1 rounded">
        {product.discount}
      </div>

      <button className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
        ♥
      </button>

      <Link to="/product-details"><img src={product.image} alt={product.title} className="w-full h-48 object-contain cursor-pointer" /></Link>

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

const Collections = () => {
    const [showAll, setShowAll] = useState(false);
  const productsToShow = showAll ? collectionData : collectionData.slice(0, 8);
  return (
    <section className="py-1 m-10">
      <h2 className="text-3xl font-bold text-center mb-14">Mobiles & Tablets</h2>

      <div className="w-full mx-auto px-4 flex">
        {/* Filters Section */}
        <aside className="w-1/4 pr-4 border-2">
        <div className="flex justify-between mb-4">
            <h3 className="font-bold text-xl">Filters</h3>
            <h3 className="font-light text-base cursor-pointer">Clear All Filters</h3>
        </div>
          <Filters />
        </aside>



        {/* Products Section */}
        <main className="w-full py-10 px-5 bg-gray-50">
            <div className=" mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsToShow.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {collectionData.length > 8 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="bg-[#1D0F0F] mt-3 text-white font-semibold py-4 px-5 rounded-md hover:bg-[#6f1b1b]"
                >
                  {showAll ? 'Show Less' : 'Show More'}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  )
}

export default Collections
