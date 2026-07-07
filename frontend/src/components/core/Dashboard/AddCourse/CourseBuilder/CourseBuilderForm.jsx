import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice"
import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)

  // Handle Form Submit (Creating or Editing a Section)
  const onSubmit = async (data) => {
    // console.log("Form Data:", data.sectionName)
    
    if (!course?._id) {
      toast.error("Please save course information first")
      return
    }

    setLoading(true)
    const result = editSectionName
      ? await updateSection(data.sectionName, editSectionName, token)
      : await createSection(data.sectionName, course._id, token)
    
    if (result) {
      if (editSectionName) {
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === editSectionName ? result : section
        )
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
        toast.success("Section updated successfully")
      } else {
        dispatch(setCourse(result))
        toast.success("Section created successfully")
      }
      setValue("sectionName", "")
      setEditSectionName(null)
    }
    
    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  const goToNext = () => {
    // Check if course has been created
    if (!course || !course._id) {
      toast.error("Please save course information first")
      dispatch(setStep(1))
      return
    }
    
    // Prevent user from moving forward if they haven't created any sections
    if (!course.courseContent || course.courseContent.length === 0) {
      toast.error("Please add at least one section")
      return
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add at least one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>

        <div className="flex items-end gap-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center border border-yellow-50 bg-transparent cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-yellow-50 transition-all duration-200 hover:bg-yellow-50 hover:text-richblack-900"
          >
            {editSectionName ? "Edit Section Name" : "Create Section"}
            <IoAddCircleOutline size={20} />
          </button>
          
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Nested View (Shows Sections and Lectures) */}
      {/* We only render this if the course has sections */}
      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* Next and Back Buttons */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
        >
          Back
        </button>
        <button
          disabled={loading}
          onClick={goToNext}
          className="flex items-center gap-x-2 rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900"
        >
          Next
          <MdNavigateNext />
        </button>
      </div>
    </div>
  )
}
