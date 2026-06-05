import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { settingsEndpoints } from "../apis"
import { setUser } from "../../slices/profileSlice"
import { logout } from "./authAPI" // Assuming you have a logout function in authAPI

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

// ==========================================
// UPDATE PROFILE PICTURE
// ==========================================
export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Display Picture Updated Successfully")
      
      // Update the Redux store & Local Storage with the new image URL
      dispatch(setUser(response.data.data))
      localStorage.setItem("user", JSON.stringify(response.data.data))
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API ERROR............", error)
      toast.error("Could Not Update Display Picture")
    }
    toast.dismiss(toastId)
  }
}

// ==========================================
// UPDATE PROFILE INFO
// ==========================================
// Inside updateProfile function in settingsAPI.js:

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE_PROFILE_API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      
      // Look at your console! What is the user object called? 
      // It is usually response.data.data or response.data.updatedUserDetails
      const updatedUser = response.data.updatedUserDetails || response.data.data || response.data.profile;

      dispatch(setUser(updatedUser))
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}

// ==========================================
// CHANGE PASSWORD
// ==========================================
export async function changePassword(token, formData) {
  const toastId = toast.loading("Updating...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API ERROR............", error)
    toast.error(error.response.data.message || "Could Not Change Password")
  }
  toast.dismiss(toastId)
}

// ==========================================
// DELETE ACCOUNT
// ==========================================
export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting Account...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      
      toast.success("Account Deleted Successfully")
      // Log the user out, clear local storage, and kick them to the homepage
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}