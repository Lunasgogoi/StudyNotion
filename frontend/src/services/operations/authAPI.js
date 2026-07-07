// src/services/operations/authAPI.js
import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"
import { setUser } from "../../slices/profileSlice"
import { clearCartState, loadCartForUser } from "../../slices/cartSlice"
import { clearWishlistState, loadWishlistForUser } from "../../slices/wishlistSlice"

const { SENDOTP_API, SIGNUP_API, LOGIN_API } = endpoints

// 1. Send OTP Function
export function sendOtp(email, navigate) {

  return async (dispatch) => {

    const toastId = toast.loading("Sending OTP...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })

      console.log("SENDOTP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error(error?.response?.data?.message || "Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// 2. Sign Up Function
export function signUp(
  accountType, firstName, lastName, email, password, confirmPassword, otp, navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating Account...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType, firstName, lastName, email, password, confirmPassword, otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error(error?.response?.data?.message || "Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// 3. Login Function
export function login(email, password, navigate) {

  return async (dispatch) => {

    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email, password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      
      // Save the token to the Redux Store
      dispatch(setToken(response.data.token))
      dispatch(setUser(response.data.user))
      
      // Save it to localStorage so the user stays logged in after a refresh
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      dispatch(loadCartForUser(response.data.user))
      dispatch(loadWishlistForUser(response.data.user))
      
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error(error?.response?.data?.message || "Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

//logout
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    
    // 🔥 WIPE THE CART AND WISHLIST 🔥
    dispatch(clearCartState())
    dispatch(clearWishlistState())

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}
