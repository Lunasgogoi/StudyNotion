// src/components/core/Auth/LoginForm.jsx
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux' // We will use this when hooking up Axios
import { login } from '../../../services/operations/authAPI' // The login function we will create in authAPI.js

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  // Handle input changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle form submission
  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data to be sent to backend:", formData);
    
    // Dispatch the login action to our API connector!
    dispatch(login(email, password, navigate));
  }

  return (
    <form onSubmit={handleOnSubmit} className="mt-6 flex w-full flex-col gap-y-4">

      {/* Email Input */}
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="w-full rounded-lg bg-richblack-800 p-3 text-richblack-5 shadow-[0_1px_0_rgba(255,255,255,0.1)] outline-none focus:outline-yellow-50"
        />
      </label>

      {/* Password Input */}
      <label className="relative w-full">
        <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input className="w-full rounded-lg bg-richblack-800 p-3 text-richblack-5 placeholder:text-richblack-400 shadow-[0_1px_0_rgba(255,255,255,0.1)] outline-none focus:outline-yellow-50"
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
        />
        {/* Toggle Password Visibility Icon */}
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-9.5 z-10 cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>

        {/* Forgot Password Link */}
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100 hover:text-blue-50">
            Forgot Password?
          </p>
        </Link>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-6 rounded-lg bg-yellow-50 py-2 px-3 font-medium text-richblack-900 transition-all duration-200 hover:scale-95"
      >
        Sign In
      </button>

    </form>
  )
}

export default LoginForm;
