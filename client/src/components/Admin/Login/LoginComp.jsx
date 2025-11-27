import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from '../../../Redux/reducer/authSlice';
import axios from '../../../Utils/BaseUrl';
import { useState } from "react";
import { toast } from "react-hot-toast";

const AdminLoginComp = () => {
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/admin/login", { email, password});
            if(response.data.success) {
                dispatch(login(response.data.token));
                console.log("Token received after login:", response.data.token);
                localStorage.setItem("authToken", response.data.token);
                toast.success("Admin LoggedIn Successfully")
                navigate("/admin/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login Failed. Please try again");
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#6b6868] to-[#972323] px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-md shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">ADMIN LOGIN</h2>
            <form className="space-y-6" onSubmit={handleLogin}>
            <div>
                <label className="block text-sm font-medium mb-2">
                Username
                </label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-red-300" 
                        placeholder="Enter Username" 
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center">
                        <EnvelopeIcon className='w-5 text-gray-600'/>
                    </span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                Password
                </label>
                <div className="relative">
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-red-300" 
                        placeholder="Enter Password" 
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center">
                        <LockClosedIcon className='w-5 text-gray-600'/>
                    </span>
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-900 mb-4 text-center"> {error}</div>
            )}

            <div className="text-right">
                <a href="#" className="text-sm text-blue-900 hover:underline">
                Forgot Password?
                </a>
            </div>

            <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#1D0F0F] to-[#972323] hover:opacity-90 text-white font-bold py-3 rounded-md transition"
            >
                LOGIN
            </button>
            </form>
        </div>
    </div>
  );
};

export default AdminLoginComp;
