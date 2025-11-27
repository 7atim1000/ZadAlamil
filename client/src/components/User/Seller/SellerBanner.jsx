import ImgBanner from "../../../assets/images/sales.png";

const SellerBanner = () => {
  return (
    <div className="bg-white min-h-[80vh]  py-16 px-8 flex flex-col lg:flex-row items-center justify-between">
      <div className="lg:w-1/2 text-center lg:text-left space-y-6 p-5 mt-28">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Start Selling on <span className="text-red-900">Zad Alamil</span> -<br />
          Build Your Online Store Today!
        </h1>
        <button className="bg-red-900 text-white font-medium px-6 py-3 rounded-md shadow-lg hover:bg-red-800">
          SIGN UP
        </button>
        <p className="text-gray-500 text-sm">
          For a limited time, launch your Zad Alamil seller account with zero cost. Begin listing products and reach millions of buyers today – no initial payments required!
        </p>
      </div>

      <div className="lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0">
        <img
          src={ImgBanner}
          alt="Illustration"
          className="w-96 lg:w-full max-w-sm h-96"
        />
      </div>
    </div>
  )
}

export default SellerBanner;
