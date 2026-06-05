import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { changePassword } from "../../../../services/operations/settingsAPI"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    // 1. Frontend Validation: Check if passwords match
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New Passwords do not match!")
      return
    }

    try {
      // 2. Call the API
      // We map the data here just in case your backend expects "confirmNewPassword"
      await changePassword(token, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)}>
      <div className="flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
        
        {/* ROW 1: Current Password */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="oldPassword" className="text-sm text-richblack-5">Current Password</label>
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter Current Password"
              className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
              {...register("oldPassword", { required: true })}
            />
            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showOldPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />}
            </span>
            {errors.oldPassword && (
              <span className="-mt-1 text-[12px] text-pink-200">Please enter your current password.</span>
            )}
          </div>
        </div>

        {/* ROW 2: New Password & Confirm Password */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="newPassword" className="text-sm text-richblack-5">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
              className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
              {...register("newPassword", { required: true })}
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showNewPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />}
            </span>
            {errors.newPassword && (
              <span className="-mt-1 text-[12px] text-pink-200">Please enter a new password.</span>
            )}
          </div>

          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="confirmPassword" className="text-sm text-richblack-5">Confirm New Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm New Password"
              className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
              {...register("confirmPassword", { required: true })}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />}
            </span>
            {errors.confirmPassword && (
              <span className="-mt-1 text-[12px] text-pink-200">Please confirm your new password.</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-3 pt-6 border-t border-richblack-700">
          <button
            onClick={() => navigate("/dashboard/my-profile")}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 transition-all duration-200 hover:scale-95 hover:text-richblack-5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-yellow-50 py-2 px-5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
          >
            Update Password
          </button>
        </div>
      </div>
    </form>
  )
}