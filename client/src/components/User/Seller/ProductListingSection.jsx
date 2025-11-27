import { IoDownloadOutline } from "react-icons/io5";

const ProductListingSection = () => {
  return (
    <div>
      <div className="bg-blue-50 py-12 px-6 m-12">
        <div className="w-full mx-auto">
          <h2 className="text-3xl font-bold text-blue-800">Product Listing</h2>
          <p className="text-gray-700 mt-4">
            A listing is the process of registering your product on the Zad Alamil platform, making it available for customers to view and purchase. It involves creating a detailed product page with essential information such as the product title, description, images, pricing, and other relevant details.
          </p>
          <p className="text-gray-700 mt-4">
            A clear and well-prepared listing helps attract customers and drive sales. Providing accurate information and high-quality images can increase your product’s visibility on the platform by up to 15%.
          </p>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-blue-700">
              Listing on Zad Alamil can be done in 2 different ways:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">

              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                  YouTube Video
                </div>
                <h4 className="text-lg font-semibold text-blue-800 mt-4">1. Product Bulk Import Using CSV File</h4>
                <p className="text-gray-600 mt-2">
                  Download a sample CSV file from your Zad Alamil vendor dashboard. Fill out the file and upload it to the platform. This allows you to add multiple products at once, saving time by avoiding manual entry for each product.
                </p>
              </div>

              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                  YouTube Video
                </div>
                <h4 className="text-lg font-semibold text-blue-800 mt-4">2. Product Manual Upload</h4>
                <p className="text-gray-600 mt-2">
                  Upload your products individually using the form.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="w-full mx-auto  py-12 px-12">
          <h2 className="text-3xl font-bold text-black">Packing & Shipping</h2>
            <p className="text-gray-700 mt-4">
            Product packing and shipping are the responsibility of the vendors. Zad Alamil is not involved in order 
            management. Vendors will also receive the shipping fee.
            </p>
            <div className="bg-blue-50 py-12 px-6 m-12">
              <p className="font-semibold flex items-center">
                Don&apos;t know how to proceed? 
                <strong className="text-red-900 ml-5">Beginner&apos;s Guide</strong>
                <IoDownloadOutline className="text-blue-900 font-bold ml-2 -mt-1" />
              </p>
            </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
      <h2 className="text-3xl font-bold text-red-900 ">Still need help registering?</h2>
      
      </div>
      <div  className="flex justify-center items-center text-white font-bold mb-5">
        <button className="bg-red-900 w-32 mt-5 py-3 rounded-lg">CONTACT US</button>
      </div>
    </div>
  );
};

export default ProductListingSection;
