import { useState, useEffect } from "react";
import {
  UserCircleIcon,
  TruckIcon,
  HeartIcon,
  MapPinIcon,
  WalletIcon,
  ShoppingBagIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { AddAddressModal } from "../Modal/addAddressModal";
import { EditAddressModal } from "../Modal/editAddressModal";
import { ConfirmEditAddressModal } from "../Modal/editAddressConfirmModal";
import { DeleteAddressModal } from "../Modal/deleteAddressModal";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "../../../Utils/BaseUrl.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { escapeHTML } from "../../../Utils/sanitize.js";
import Loader from "../../Loader/Loader.jsx";

const ProfileComp = () => {
   const [formData, setFormData] = useState({}); 
  const [isEditable, setIsEditable] = useState(false); 
const navigate = useNavigate()
  const [userData, setUserData] = useState({});  
  const [activeTab, setActiveTab] = useState("PROFILE_INFORMATION"); 
  const [isModalOpenAddAddress, setIsModalOpenAddAddress] = useState(false);
  const [isModalOpenEditAddress, setIsModalOpenEditAddress] = useState(false);
  const [isModalOpenConfirmEdit, setIsModalOpenConfirmEdit] = useState(false);
  // const [selectedAddress, setSelectedAddress] = useState("Akhila");
  const [isModalOpenDeleteAddress, setIsModalOpenDeleteAddress] = useState(false);
  const [addresses, setAddresses] = useState([]); 
  const [tempEditAddress, setTempEditAddress] = useState(null);
  const [loading, setLoading] = useState([]);

  var user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('userAccessToken');
      axios.get('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUserData(response.data.profile); 
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [user]);


const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (token) {
      setLoading(true);
      const token = localStorage.getItem("userAccessToken");
      axios
        .get("/api/user/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUserData(response.data.profile);
          setFormData(response.data.profile); 
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setLoading(false);
        });
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleUpdateAddress = (updatedAddress) => {
    setAddresses((prevAddresses) =>
      prevAddresses.map((addr) =>
        addr.name === tempEditAddress.name ? updatedAddress : addr
      )
    );
    setTempEditAddress(null);
    setIsModalOpenConfirmEdit(false);
  };

  const initiateEditAddress = (address) => {
    setTempEditAddress(address);
    setIsModalOpenEditAddress(true);
  };

  // const confirmEditAddress = () => {
  //   setIsModalOpenEditAddress(false);
  //   setIsModalOpenConfirmEdit(true);
  // };

  // const handleSaveAddress = () => {
  //   console.log("Address saved");
  //   setIsModalOpenAddAddress(false); 
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleDeleteAddress = () => {
    console.log("Address deleted");
    setIsModalOpenDeleteAddress(false); 
  };

  const handleUpdateProfile = () => {
    if (isEditable) {
      const sanitizedData = {
        name: escapeHTML(formData.name),
        email: escapeHTML(formData.email),
        phone: escapeHTML(formData.phone),
      };

      const token = localStorage.getItem("userAccessToken");
      axios
        .put(
          "/api/user/update_profile",
          sanitizedData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          if (response.data.success) {
           toast.success("Profile updated!");
            setUserData(sanitizedData); 
            setIsEditable(false); 
          } else {
            toast.error("Try again later!");
          }
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });
    } else {
      setIsEditable(true); 
    }
  };



  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 lg:p-52 md:p-52 p-6">
      {loading ? (
        <Loader />
      ): (
        <>
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white shadow-lg p-6 mb-4 lg:mb-0 lg:block flex justify-between items-center mt-28 lg:mt-0 md:mt-0">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4">
            <span>
              <UserCircleIcon className="w-16 lg:w-24" />
            </span>
          </div>
          <h2 className="text-sm lg:text-lg md:text-lg font-semibold text-gray-800">
            {userData ? escapeHTML(userData.name) : "Loading..."}
          </h2>
          <p className="text-red-900 font-medium text-xs lg:text-sm md:text-sm">
            {userData ? escapeHTML(userData.role) : "Loading..."}
          </p>
        </div>
        <ul className="mt-8 space-y-4 w-full">
          <li>
            <Link to='/myOrders'>
              <button
                onClick={() => setActiveTab("MY_ORDERS")}
                className={`flex items-center text-sm ${
                  activeTab === "MY_ORDERS" ? "text-red-900 font-bold" : "text-gray-700 hover:text-red-900"
                }`}
              >
                <span className="mr-4 w-5">
                  <TruckIcon />
                </span>
                MY ORDERS
              </button>
            </Link>
          </li>
          <li>
            <Link to='/wishlist'>
              <button
                onClick={() => setActiveTab("MY_WISHLIST")}
                className={`flex items-center text-sm ${
                  activeTab === "MY_WISHLIST" ? "text-red-900 font-bold" : "text-gray-700 hover:text-red-900"
                }`}
              >
                <span className="mr-4 w-5">
                  <HeartIcon />
                </span>
                MY WISHLIST
              </button>
            </Link>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("PROFILE_INFORMATION")}
              className={`flex items-center text-sm ${
                activeTab === "PROFILE_INFORMATION" ? "text-red-900 font-bold" : "text-gray-700 hover:text-red-900"
              }`}
            >
              <span className="mr-4 w-5">
                <UserCircleIcon />
              </span>
              PROFILE INFORMATION
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("MANAGE_ADDRESS")}
              className={`flex items-center text-sm ${
                activeTab === "MANAGE_ADDRESS" ? "text-red-900 font-bold" : "text-gray-700 hover:text-red-900"
              }`}
            >
              <span className="mr-4 w-5">
                <MapPinIcon />
              </span>
              MANAGE ADDRESS
            </button>
          </li>
          <li>
            <Link to='/cart'>
              <button
                onClick={() => setActiveTab("MY_CART")}
                className={`flex items-center text-sm ${
                  activeTab === "MY_CART" ? "text-red-900 font-bold" : "text-gray-700 hover:text-red-900"
                }`}
              >
                <span className="mr-4 w-5">
                  <ShoppingBagIcon />
                </span>
                MY CART
              </button>
            </Link>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("MY_WALLET")}
              className={`flex items-center text-sm ${
                activeTab === "MY_WALLET" ? "text-red-900 font-bold" : "text-gray-700 hover:text-red-900"
              }`}
            >
              <span className="mr-4 w-5">
                <WalletIcon />
              </span>
              MY WALLET
            </button>
          </li>
          <li>
            <Link to='/login'>
              <button className="flex items-center text-sm text-gray-700 hover:text-red-900">
                <span className="mr-4 w-5">
                  <ArrowLeftOnRectangleIcon />
                </span>
                LOGOUT
              </button>
            </Link>
          </li>
        </ul>
      </aside>


      <main className="flex-1 p-6 bg-white shadow-lg rounded-lg">
        {activeTab === "PROFILE_INFORMATION" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              PROFILE INFORMATION
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your full name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditable}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditable}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditable}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                  onClick={() => {
                    setIsEditable(false);
                    setFormData(userData); 
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800"
                  onClick={handleUpdateProfile}
                >
                  {isEditable ? "Update" : "Edit"}
                </button>
              </div>
            </form>

          </>
        )}

        {activeTab === "MANAGE_ADDRESS" && (
          <>
            <div className="space-y-4">
              <button
                className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800"
                onClick={() => setIsModalOpenAddAddress(true)}
              >
                + Add Address
              </button>

              {addresses.length > 0 ? (
                addresses.map((address, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <div>
                      <h4 className="text-gray-800">{address.name}</h4>
                      <p className="text-gray-600 text-sm">{address.address}</p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => initiateEditAddress(address)}
                        className="text-gray-800 hover:text-red-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setIsModalOpenDeleteAddress(true)}
                        className="text-gray-800 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No addresses found</p>
              )}
            </div>
          </>
        )}
      </main>
      </>
      )}

      <AddAddressModal isOpen={isModalOpenAddAddress} onClose={() => setIsModalOpenAddAddress(false)} />
      <EditAddressModal isOpen={isModalOpenEditAddress} onClose={() => setIsModalOpenEditAddress(false)} address={tempEditAddress} />
      <ConfirmEditAddressModal isOpen={isModalOpenConfirmEdit} onClose={() => setIsModalOpenConfirmEdit(false)} onConfirm={handleUpdateAddress} />
      <DeleteAddressModal isOpen={isModalOpenDeleteAddress} onClose={() => setIsModalOpenDeleteAddress(false)} onDelete={handleDeleteAddress} />
    </div>
  );
};

export default ProfileComp;