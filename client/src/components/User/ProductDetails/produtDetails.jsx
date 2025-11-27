import { useState } from 'react';
import Img1 from '../../../assets/images/iPhone1.jpg';
import Img2 from '../../../assets/images/iPhone2.jpg';
import Img3 from '../../../assets/images/iPhone3.jpg';
import Img4 from '../../../assets/images/iPhone4.jpg';

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(Img1);
  const [selectedStorage, setSelectedStorage] = useState('128 GB');

  const product = {
    title: 'Apple iPhone 13 5G Smartphone 128GB Black',
    model: 'IPHONE 13 PRO MAX 2024',
    colors: ['Black', 'White'],
    storageOptions: [
      { size: '128 GB', price: 3480 },
      { size: '256 GB', price: 4480 },
    ],
    highlights: [
      'Processor: A15 Bionic',
      'Display: 6.1-inch (2532 x 1170)',
      'Camera: Dual 12 MP',
      'Battery: 3095 mAh',
    ],
    specifications: [
      'Processor: A15 Bionic',
      'Display: Super Retina XDR',
      'Storage: Up to 512GB',
      'Battery Life: Up to 19 hours',
      'Color Options: Black, White',
    ],
  };

  return (
    <section className='p-3'>
      <div className="flex p-16 items-center justify-center py-10 p-2 mt-32 md:mt-32 lg:mt-40">
        <div className="w-full mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
            {/* Left Column: Thumbnail Images */}
            <div className="md:col-span-1 lg:col-span-2 flex md:flex-col gap-4 overflow-auto">
              {[Img1, Img2, Img3, Img4].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 md:w-32 md:h-32 lg:w-52 lg:h-36 object-cover border ${
                    selectedImage === img ? 'border-blue-500' : 'border-gray-200'
                  } cursor-pointer`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="md:col-span-2 lg:col-span-5 flex justify-center">
              <img
                src={selectedImage}
                alt="Main product"
                className=" object-cover rounded-lg sm:h-64 sm:w-52 lg:h-[600px] lg:w-[400px]"
              />
            </div>

            {/* Product Information */}
            <div className="md:col-span-3 lg:col-span-5 flex flex-col gap-6">
              <h1 className="text-xl lg:text-2xl font-bold">{product.title}</h1>
              <p className="text-gray-600">Model: {product.model}</p>

              <div className="flex items-center gap-4">
                <p className="font-medium">Color:</p>
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full cursor-pointer ${
                      color === 'Black' ? 'bg-black' : 'bg-white border'
                    }`}
                  ></div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <p className="font-medium">Internal Storage:</p>
                {product.storageOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-md ${
                      selectedStorage === option.size
                        ? 'bg-blue-500 text-white'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedStorage(option.size)}
                  >
                    {option.size} - AED {option.price.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <p className="font-medium">Quantity:</p>
                <select className="border rounded-md p-2">
                  {[1, 2, 3, 4, 5].map((qty) => (
                    <option key={qty} value={qty}>
                      {qty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Product Highlights</h3>
                <ul className="list-disc ml-6 text-gray-600">
                  {product.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Technical Specifications</h3>
                <ul className="list-disc ml-6 text-gray-600">
                  {product.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-lg">
                  Price:{' '}
                  <span className="font-bold text-red-600">
                    AED{' '}
                    {product.storageOptions.find(
                      (option) => option.size === selectedStorage
                    ).price.toLocaleString()}
                  </span>
                </p>
                <button className="bg-gradient-to-r from-[#1D0F0F] to-[#972323] text-white py-2 px-4 rounded-md hover:bg-red-700">
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
