import { Link } from 'react-router-dom';
import Logo from '../../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#e0e3e2] text-black py-6 mt-10">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 px-4">
        <div className="flex flex-col justify-start items-start">
          <img src={Logo} alt="Logo" className="w-32 md:w-32" />
          <h1 className="text-lg font-semibold mt-2 ml-4">Zad Alamil</h1>
        </div>

        <div className="flex flex-col justify-start items-start">
          <h3 className="text-xl font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>About Us</li>
            <li>Careers</li>
            <li>Our Services</li>
            <Link to="/seller"><li className='mt-1'>Become a Seller on Zad Alamil</li></Link>
          </ul>
        </div>

        <div className="flex flex-col justify-start items-start">
          <h3 className="text-xl font-semibold mb-3">Shop With Us</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Your Account</li>
            <li>Your Orders</li>
            <li>Shipping & Returns</li>
            <li>Your Addresses</li>
            <li>Your Wishlist</li>
          </ul>
        </div>

        <div className="flex flex-col justify-start items-start">
          <h3 className="text-xl font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Help Center</li>
          </ul>
        </div>

        <div className="flex flex-col justify-start items-start">
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Facebook</li>
            <li>LinkedIn</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

