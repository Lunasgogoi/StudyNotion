import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import { setCourse } from "../../../../../slices/courseSlice"
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI"
import Upload from "../CourseInformation/Upload" // Reusing the drag-and-drop component!

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [view, edit, modalData, setValue])

  const isFormUpdated = () => {
    const currentValues = getValues()
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true
    }
    return false
  }

  const handleEditSubsection = async (data) => {
    const formData = new FormData()
    formData.append("subSectionId", modalData._id)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("timeDuration", modalData.timeDuration || "0")

    if (data.lectureVideo && data.lectureVideo !== modalData.videoUrl) {
      formData.append("video", data.lectureVideo)
    }

    setLoading(true)
    const result = await updateSubSection(formData, token)

    if (result) {
      const updatedCourseContent = course.courseContent.map((section) => {
        if (section._id !== modalData.sectionId) return section

        return {
          ...section,
          subSection: section.subSection.map((subSection) =>
            subSection._id === result._id ? result : subSection
          ),
        }
      })

      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
      toast.success("Lecture updated successfully")
      setModalData(null)
    }

    setLoading(false)
  }

  const onSubmit = async (data) => {
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        await handleEditSubsection(data)
      }
      return
    }

    if (!data.lectureVideo) {
      toast.error("Lecture video is required")
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("timeDuration", "0")
    formData.append("video", data.lectureVideo)

    setLoading(true)
    const result = await createSubSection(formData, token)

    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )

      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
      toast.success("Lecture added successfully")
      setModalData(null)
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Video Upload (Note: You may need to tweak your Upload component to accept video files!) */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            required={!edit}
            video={true} 
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="min-h-[130px] w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>

          {!view && (
            <div className="flex justify-end">
              <button
                disabled={loading}
                className="rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900"
              >
                {loading ? "Loading..." : edit ? "Save Changes" : "Save"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
