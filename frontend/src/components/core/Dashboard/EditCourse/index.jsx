import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import RenderSteps from "../AddCourse/RenderSteps"
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"

export default function EditCourse() {
  const dispatch = useDispatch()
  // Grab the courseId from the URL (which the pen icon sent us to)
  const { courseId } = useParams() 
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true)
      // Fetch the full course details from the backend
      const result = await getFullDetailsOfCourse(courseId, token)
      
      if (result?.courseDetails) {
        // Turn ON edit mode in Redux
        dispatch(setEditCourse(true))
        // Load the fetched data into Redux so the forms pre-fill!
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false)
    }
    
    populateCourseDetails()
  }, [courseId, token, dispatch])

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner">Loading...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      
      <div className="mx-auto max-w-[600px]">
        {course ? (
          // We reuse your AddCourse form components here!
          <RenderSteps /> 
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  )
}