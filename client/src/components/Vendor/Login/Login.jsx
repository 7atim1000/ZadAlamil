import { useNavigate } from 'react-router-dom';
import Img1 from '../../../assets/images/vendorLog.png';
import { vendorLogin } from '../../../Redux/reducer/authVendorSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { toast } from "react-hot-toast";

const VendorLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        if(!email.trim() || !password.trim()) {
            setError("Email and password are required");
            return;
        }
        try {
            const resultAction = await dispatch(vendorLogin({ email, password}));

            if(vendorLogin.fulfilled.match(resultAction)) {
                toast.success("Vendor LoggedIn Successfully")
                navigate('/vendor/vendor-dashboard');
            } else {
                setError(resultAction.payload?.message || "Login failed. Please try again")
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login Failed. Please try again");
        }

    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-900 to-gray-800">
            <div className="flex flex-wrap bg-white rounded-lg shadow-lg w-full max-w-4xl">

                <div className="w-full lg:w-1/2 flex justify-center items-center p-8 bg-red-100">
                    <img
                        src={Img1}
                        alt="Store Cart"
                        className="w-full max-w-xs"
                    />
                </div>

                <div className="w-full lg:w-1/2 p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        VENDOR LOGIN
                    </h1>
                    
                    <form className='space-y-6' onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email ID:</label>
                            <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-100">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Email ID"
                                    className="w-full bg-transparent outline-none"
                                />
                                <span className="text-gray-500 ml-2">
                                    <i className="fas fa-envelope"></i>
                                </span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Password:</label>
                            <div className="flex items-center border rounded-lg px-4 py-2 bg-gray-100">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password"
                                    className="w-full bg-transparent outline-none"
                                />
                                <span className="text-gray-500 ml-2">
                                    <i className="fas fa-lock"></i>
                                </span>
                            </div>
                        </div>
                        { error && (
                            <div className='text-red-900 text-sm mb-4 text-center'>{error}</div>
                        )}
                        <button
                            type="submit"
                            className="w-full py-2 bg-red-900 text-white rounded-lg hover:bg-red-800"
                        >
                            LOGIN
                        </button>
                        <p className="text-center mt-4 text-gray-600">
                            Or Login with Mobile No.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VendorLogin;
