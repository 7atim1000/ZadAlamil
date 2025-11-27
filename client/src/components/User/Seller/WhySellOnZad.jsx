import { FaCreativeCommonsZero } from "react-icons/fa6";
import { TiGroup } from "react-icons/ti";
import { MdSupportAgent } from "react-icons/md";

const WhySellOnZad = () => {
  return (
    <section className="bg-white flex items-center justify-center mb-16">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Why Sell on Zad Alamil?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-transparent border-2 shadow-lg rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-800 mb-4"><FaCreativeCommonsZero /></div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Zero Upfront Costs – Start for Free!</h3>
            <p className="text-sm text-gray-600">
              Launch your seller account without any initial payments or subscription fees. Begin listing your products instantly and grow your business with no risk.
            </p>
          </div>

          <div className="bg-transparent border-2 shadow-lg rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-800 mb-4"><TiGroup /></div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Access a Wide Customer Base</h3>
            <p className="text-sm text-gray-600">
              Reach thousands of potential buyers actively searching for quality products. Leverage Zad Alamil&apos;s growing marketplace to expand your sales.
            </p>
          </div>

          <div className="bg-transparent border-2 shadow-lg rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-800 mb-4"><MdSupportAgent /></div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Easy Management and Seller Support</h3>
            <p className="text-sm text-gray-600">
              Our user-friendly dashboard lets you manage inventory, track orders, and monitor sales seamlessly. Plus, enjoy dedicated seller support to help your business thrive.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhySellOnZad;