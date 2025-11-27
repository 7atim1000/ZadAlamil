import logo from '../../../assets/images/logo.png';
import { Link } from 'react-router-dom';

const OTPComp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0e0808] to-[#972323] p-2">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="flex-1 flex items-center justify-center bg-red-900 text-white">
          <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Hello, Shopper!</h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Logo"
              className="h-10"
            />
          </div>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <div className="mt-1 relative">
                <input
                  type="number"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2"
                  placeholder="Enter the OTP"
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-blue-900 ">
              <a href="/" className="hover:text-red-900 mt-5">
                Back to Home
              </a>
            </div>

            <Link to='/'>
                <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0e0808] to-[#972323] text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition "
                >
                LOGIN
                </button>
            </Link>
          </form>

          <div className="text-center text-sm font-semibold text-blue-900 mt-4">
            <a href="/login" className="hover:text-red-900">
                Or Login with Email ID
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPComp;