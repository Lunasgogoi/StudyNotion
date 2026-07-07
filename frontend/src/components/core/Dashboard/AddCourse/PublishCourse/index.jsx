import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { resetCourseState, setCourse, setStep } from "../../../../../slices/courseSlice"
import { editCourse } from "../../../../../services/operations/courseDetailsAPI"

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)

  // When the component mounts, check if the course is already published
  useEffect(() => {
    if (course?.status === "Published") {
      setValue("public", true)
    }
  }, [course, setValue])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const handleCoursePublish = async () => {
    if (!course?._id) return

    // Check if the user actually changed the status or just clicked save without doing anything
    if (
      (course?.status === "Published" && getValues("public") === true) ||
      ((course?.status || "Draft") === "Draft" && getValues("public") === false)
    ) {
      // No changes made, just go to the courses page
      goToCourses()
      return
    }

    // If changes were made, construct the data for the API
    const formData = new FormData()
    const courseStatus = getValues("public") ? "Published" : "Draft"
    formData.append("status", courseStatus)

    setLoading(true)
    const result = await editCourse(formData, course._id, token)
    setLoading(false)

    if (result) {
      dispatch(setCourse(result))
      goToCourses()
    }
  }

  const onSubmit = () => {
    handleCoursePublish()
  }

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8 flex items-center gap-x-3">
          <input
            type="checkbox"
            id="public"
            {...register("public")}
            className="h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
          />
          <label htmlFor="public" className="cursor-pointer text-lg text-richblack-400">
            Make this course as public
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-x-3">
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          
          <button
            disabled={loading}
            className="rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
