import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import axios from "../../../Utils/BaseUrl.js";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setTokens,setUserDetails } from "../../../Redux/reducer/userReducer.js";
import { useDispatch } from "react-redux";

const LoginComp = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", server: "" });
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const message = location.state?.message; 


  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("/api/user/login", formData);

        if (response.data.message === "Invalid email or password.") {
          setErrors((prev) => ({
            ...prev,
            server: "Invalid email or password.",
          }));
        } else {
          setErrors({ email: "", password: "", server: "" });

          console.log(response.data,"this is the response...>")

        var token = response.data.token
        var user = response.data.user
        localStorage.setItem("userAccessToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch(setUserDetails(response.data.user));
        console.log(response.data.user,"userdata");
        dispatch(setTokens(response.data.token));
        console.log(response.data.token, "token");

        toast.success("loggedIn successfully")
        navigate("/");
        }
      } catch (error) {
        console.log(error)
        setErrors((prev) => ({
          ...prev,
          server: "Invalid Credentials. Please try again.",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0e0808] to-[#972323] p-2">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="flex-1 flex items-center justify-center bg-red-900 text-white">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-4">LET&apos;S EXPLORE</h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-10" />
          </div>

          { message && (
            <p className="text-red-900 text-center mb-4 font-medium">{message}</p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2`}
                  placeholder="Enter your email"
                />
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <EnvelopeIcon className="w-5 text-gray-600" />
                </span>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-red-900 focus:border-red-900 p-2`}
                  placeholder="Enter your password"
                />
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <LockClosedIcon className="w-5 text-gray-600" />
                </span>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {errors.server && (
              <div className="text-red-500 text-xs mt-2">
                {errors.server}
              </div>
            )}

            <div className="flex justify-between text-sm text-blue-900">
              <Link to="/signup" className="hover:text-red-900">
                New User? Sign Up
              </Link>
              <Link to="/forgot-password" className="hover:text-red-900">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0e0808] to-[#972323] text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition mt-5"
            >
              LOGIN
            </button>
          </form>

          <div className="text-center text-sm font-semibold text-blue-900 mt-4">
            <Link to="/numberLogin" className="hover:text-red-900">
              Or Login with Mobile Number
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComp;
