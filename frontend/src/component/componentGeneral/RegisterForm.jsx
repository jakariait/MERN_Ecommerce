import {
  FaUser,
  FaLock,
  FaEyeSlash,
  FaEye,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";


const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center bg-white px-4 mt-20 mb-20 md:m-20">
      <div className="bg-[#EEF5F6] rounded-2xl shadow-md p-8 w-full max-w-md text-center relative">
        {/* Lock Icon */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-indigo-200 to-blue-200 p-4 rounded-full">
            <FaRegEdit className="primaryTextColor text-5xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold m-7">Register Account</h2>

        {/* Form */}
        <form className="space-y-4 text-left">
          {/* Email / Phone */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaUser className="primaryTextColor mr-5 text-2xl " />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
          {/*Email or Phone Number*/}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaEnvelope className="primaryTextColor mr-5 text-2xl " />
            <input
              type="email"
              placeholder="Email or Phone Number"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
          {/* Address */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4">
            <FaHome className="primaryTextColor mr-5 text-2xl " />
            <input
              type="text"
              placeholder="Address"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
          {/* Password */}
          <div className="flex items-center bg-white rounded-md shadow-sm px-4 py-4 relative">
            <FaLock className="primaryTextColor mr-5 text-2xl" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Set Password"
              className={`w-full outline-none ${showPassword ? "text-lg font-bold" : "text-lg"} bg-transparent pr-10 placeholder:text-sm`} // Customize font when password is shown
            />

            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {/* Remember Me & Forgot */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-blue-600" />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="primaryTextColor font-medium hover:underline"
            >
              Forgotten password?
            </a>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-md mt-2 primaryBgColor accentTextColor"
          >
            Register
          </button>
        </form>

        {/* Register */}
        <p className="text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/register">
            <button className="primaryTextColor font-medium hover:underline">
              Sign in
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
