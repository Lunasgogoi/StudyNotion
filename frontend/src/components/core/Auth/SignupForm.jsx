// src/components/core/Auth/SignupForm.jsx
import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import Tab from "../../common/Tab"

import { useDispatch } from "react-redux"
import { setSignupData } from "../../../slices/authSlice"
import { sendOtp } from "../../../services/operations/authAPI"


const SignupForm = () => {
  const navigate = useNavigate()

  // State for the form
  const [accountType, setAccountType] = useState("User")
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { firstName, lastName, email, password, confirmPassword } = formData

  // Handle input fields
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const dispatch = useDispatch()


  // Handle form submission
  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const signupData = {
      ...formData,
      accountType,
    }

    console.log("Signup Data to go to OTP page: ", signupData)
    
    // 1. Save the user's details to the Redux store temporarily
    dispatch(setSignupData(signupData))

    // 2. Call the API to send the OTP to their email
    dispatch(sendOtp(formData.email, navigate))
  }

  // Data for our reusable Tab component
  const tabData = [
    { id: 1, tabName: "Student", type: "User" },
    { id: 2, tabName: "Instructor", type: "Instructor" },
  ]

  return (
    <div>
      {/* Tab Switcher */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className="flex gap-x-4">
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="w-full rounded-lg bg-richblack-800 p-3 text-richblack-5 shadow-[0_1px_0_rgba(255,255,255,0.1)] outline-none focus:outline-yellow-50"
            />
          </label>
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="w-full rounded-lg bg-richblack-800 p-3 text-richblack-5 shadow-[0_1px_0_rgba(255,255,255,0.1)] outline-none focus:outline-yellow-50"
            />
          </label>
        </div>

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

        <div className="flex gap-x-4">
          <label className="relative w-full">
            <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="w-full rounded-lg bg-richblack-800 p-3 pr-10 text-richblack-5 shadow-[0_1px_0_rgba(255,255,255,0.1)] outline-none focus:outline-yellow-50"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9.5 z-10 cursor-pointer"
            >
              {showPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />}
            </span>
          </label>
          <label className="relative w-full">
            <p className="mb-1 text-[0.875rem] leading-5.5 text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="w-full rounded-lg bg-richblack-800 p-3 pr-10 text-richblack-5 shadow-[0_1px_0_rgba(255,255,255,0.1)] outline-none focus:outline-yellow-50"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-9.5 z-10 cursor-pointer"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />}
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-lg bg-yellow-50 py-2 px-3 font-medium text-richblack-900 transition-all duration-200 hover:scale-95"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default SignupForm
