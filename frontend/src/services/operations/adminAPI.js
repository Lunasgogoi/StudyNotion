import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { adminEndpoints } from "../apis"

const getApiErrorMessage = (error, fallback) => (
  error?.response?.data?.message || error?.message || fallback
)

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
})

export const fetchAdminSummary = async (token) => {
  try {
    const response = await apiConnector("GET", adminEndpoints.ADMIN_SUMMARY_API, null, authHeader(token))
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch admin summary")
    }
    return response.data.data
  } catch (error) {
    if (!error.isAuthExpired) {
      toast.error(getApiErrorMessage(error, "Could not fetch admin summary"))
    }
    return null
  }
}

export const fetchAdminUsers = async (token) => {
  try {
    const response = await apiConnector("GET", adminEndpoints.ADMIN_USERS_API, null, authHeader(token))
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch users")
    }
    return response.data.data
  } catch (error) {
    if (!error.isAuthExpired) {
      toast.error(getApiErrorMessage(error, "Could not fetch users"))
    }
    return []
  }
}

export const createAdminUser = async (data, token) => {
  try {
    const response = await apiConnector("POST", adminEndpoints.ADMIN_USERS_API, data, authHeader(token))
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not create user")
    }
    toast.success("User created")
    return response.data.data
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Could not create user"))
    return null
  }
}

export const deleteAdminUser = async (userId, token) => {
  try {
    const response = await apiConnector("DELETE", `${adminEndpoints.ADMIN_USERS_API}/${userId}`, null, authHeader(token))
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not delete user")
    }
    toast.success("User deleted")
    return true
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Could not delete user"))
    return false
  }
}

export const fetchAdminCourses = async (token) => {
  try {
    const response = await apiConnector("GET", adminEndpoints.ADMIN_COURSES_API, null, authHeader(token))
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch courses")
    }
    return response.data.data
  } catch (error) {
    if (!error.isAuthExpired) {
      toast.error(getApiErrorMessage(error, "Could not fetch courses"))
    }
    return []
  }
}

export const createAdminCourse = async (data, token) => {
  try {
    const response = await apiConnector("POST", adminEndpoints.ADMIN_COURSES_API, data, authHeader(token))
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not create course")
    }
    toast.success("Course created")
    return response.data.data
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Could not create course"))
    return null
  }
}

export const deleteAdminCourse = async (courseId, token) => {
  try {
    const response = await apiConnector("DELETE", `${adminEndpoints.ADMIN_COURSES_API}/${courseId}`, null, authHeader(token))
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not delete course")
    }
    toast.success("Course deleted")
    return true
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Could not delete course"))
    return false
  }
}
