// src/services/operations/courseDetailsAPI.js
import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { courseEndpoints, ratingsEndpoints } from "../apis"

const { COURSE_CATEGORIES_API } = courseEndpoints
const { GET_ALL_INSTRUCTOR_COURSES_API } = courseEndpoints
const { CREATE_SECTION_API } = courseEndpoints
const { CREATE_COURSE_API } = courseEndpoints
const { CREATE_SUBSECTION_API } = courseEndpoints

const getApiErrorMessage = (error, fallback) => (
  error?.response?.data?.message || error?.message || fallback
)

// Fetch all categories (e.g., Python, Web Dev, Data Science)
export const fetchCourseCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_CATEGORY_API ERROR............", error)
    if (!error.isAuthExpired) {
      toast.error(getApiErrorMessage(error, "Could not fetch categories"))
    }
  }
  return result
}

export const fetchInstructorCourses = async (token) => {
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("INSTRUCTOR COURSES API RESPONSE............", response)
    
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    if (!error.isAuthExpired) {
      toast.error(getApiErrorMessage(error, "Could not fetch instructor courses"))
    }
  }
  return result
}

export const createSection = async (sectionName, courseId, token) => {
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      CREATE_SECTION_API,
      {
        sectionName,
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }
    result = response?.data?.updatedCourse
  } catch (error) {
    console.log("CREATE_SECTION_API ERROR............", error)
    if (!error.isAuthExpired) {
      toast.error(getApiErrorMessage(error, "Could not create section"))
    }
  }
  return result
}

export const createSubSection = async (formData, token) => {
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      CREATE_SUBSECTION_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response?.data?.success) {
      throw new Error("Could Not Create Lecture")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE_SUBSECTION_API ERROR............", error)
    if (!error.isAuthExpired) {
      toast.error(getApiErrorMessage(error, "Could not create lecture"))
    }
  }
  return result
}

export const createCourse = async (courseData, token) => {
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      CREATE_COURSE_API,
      courseData,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    
    if (!response?.data?.success) {
      throw new Error("Could Not Create Course")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE_COURSE_API ERROR............", error)
    if (!error.isAuthExpired) {
      toast.error(getApiErrorMessage(error, "Could not create course"))
    }
  }
  return result
}

export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      courseEndpoints.COURSE_DETAILS_API,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("GET_FULL_DETAILS_OF_COURSE_API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Fetch Course Details")
    }

    result = {
      ...response.data,
      courseDetails: response.data.data,
    }
  } catch (error) {
    console.log("GET_FULL_DETAILS_OF_COURSE_API ERROR............", error)
    if (!error.isAuthExpired) {
      toast.error(getApiErrorMessage(error, "Could not fetch course details"))
    }
  }
  toast.dismiss(toastId)
  return result
}


export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Deleting...")
  try {
    const response = await apiConnector("DELETE", courseEndpoints.DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
}

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector("POST", courseEndpoints.COURSE_DETAILS_API, {
      courseId,
    })
    console.log("COURSE_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  return result
}


// ... existing imports and functions

export const markLectureAsComplete = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "POST", 
      courseEndpoints.UPDATE_COURSE_PROGRESS_API,
      data, 
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API ERROR............", error)
    toast.error(getApiErrorMessage(error, "Could not update lecture progress"))
    result = false
  }
  toast.dismiss(toastId)
  return result
}

export const createRating = async (data, token) => {
  const toastId = toast.loading("Saving review...")
  let result = false
  try {
    const response = await apiConnector(
      "POST",
      ratingsEndpoints.CREATE_RATING_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not create rating")
    }

    toast.success(response.data.message || "Review saved")
    result = true
  } catch (error) {
    console.log("CREATE_RATING_API ERROR............", error)
    toast.error(getApiErrorMessage(error, "Could not save review"))
  }
  toast.dismiss(toastId)
  return result
}

