import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
// Assuming your endpoints are mapped in apis.js
// GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses"
// GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard"

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      // Replace with your actual endpoint variable from apis.js
      "http://localhost:4000/api/v1/profile/getEnrolledCourses", 
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  toast.dismiss(toastId)
  return result
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      // Replace with your actual endpoint variable from apis.js
      "http://localhost:4000/api/v1/profile/instructorDashboard",
      null,
      { Authorization: `Bearer ${token}` }
    )
    result = response?.data?.courses
  } catch (error) {
    console.log("GET_INSTRUCTOR_API ERROR", error)
    toast.error("Could not Get Instructor Data")
  }
  toast.dismiss(toastId)
  return result
}