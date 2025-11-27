import {  useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import axios from "../../../Utils/BaseUrl.js";
import { useState } from "react";
import {  toast } from "react-hot-toast";

const SignupComp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {

    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required...";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }
    return newErrors;

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log(formData)
    try {
      const response = await axios.post("/api/user/signup", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.mobile,
      });
      console.log(response,"this is the signup response...>>>>")
      if (response.status === 201) {
        toast.success("signup successfully")
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;

        if (errorMessage === "Email is already used.") {
          setErrors({ api: "This email is already associated with another account." });
        } else if (errorMessage === "Mobile number is already used.") {
          setErrors({ api: "This mobile number is already associated with another account." });
        } else {
          setErrors({ api: "Signup failed. Please try again!" });
        }
      } else {
        setErrors({ api: "An unexpected error occurred." });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0e0808] to-[#972323] p-2">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="flex-1 flex items-center justify-center bg-red-900 text-white">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-4">WELCOME</h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-10" />
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-900 focus:border-red-900 p-2"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Re-Enter Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-900 focus:border-red-900 p-2"
                placeholder="Re-Enter your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile No.</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
            </div>

            {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0e0808] to-[#972323] text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              SIGNUP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupComp;
