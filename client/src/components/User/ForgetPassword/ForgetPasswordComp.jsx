import logo from '../../../assets/images/logo.png';
import { Link } from 'react-router-dom';

const ForgotPasswordNumberComp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0e0808] to-[#972323] p-2">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="flex-1 flex items-center justify-center bg-red-900 text-white">
          <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">DONT MISS OUT!</h1>
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
                Mobile No.
              </label>
              <div className="mt-1 relative">
                <input
                  type="phone"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2"
                  placeholder="Enter your registered mobile number"
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-blue-900">
              <a href="/" className="hover:text-red-900 mt-5">
                Back to Home
              </a>
            </div>

            <Link to='/forgot-OTP-number'>
                <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0e0808] to-[#972323] text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition "
                >
                Send OTP
                </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordNumberComp;