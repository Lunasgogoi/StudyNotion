import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import ConfirmationModal from "../../../common/ConfirmationModal"

// Import your functions
import { deleteCourse, fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import GetTotalDuration from "../../../../utils/timeDurationFormatter" 

export default function CourseTable({ courses, setCourses }) {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)

  // The Delete Handler
  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  // Formatting date helper
  const formatFriendlyDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "long", day: "numeric" }
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", options) + " | " + date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <table className="rounded-xl border border-richblack-800 w-full">
        <thead>
          <tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </th>
            <th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </th>
            <th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </th>
            <th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {!courses || courses?.length === 0 ? (
            <tr>
              <td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
              </td>
            </tr>
          ) : (
            courses?.map((course) => (
              <tr
                key={course._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
                {/* Course Info Column */}
                <td className="flex flex-1 gap-x-4">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course?.courseName}
                    </p>
                    
                    {/* CRITICAL CRASH FIX: Safely render the description */}
                    <p className="text-xs text-richblack-300">
                      {course?.courseDescription?.length > 30
                        ? course.courseDescription.substring(0, 30) + "..."
                        : course?.courseDescription}
                    </p>
                    
                    <p className="text-[12px] text-white">
                      Created: {formatFriendlyDate(course?.createdAt)}
                    </p>
                    
                    {course?.status === "Draft" ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        Published
                      </p>
                    )}
                  </div>
                </td>

                {/* Dynamic Duration Column */}
                <td className="text-sm font-medium text-richblack-100">
                  {GetTotalDuration(course?.courseContent)}
                </td>
                
                {/* Price Column */}
                <td className="text-sm font-medium text-richblack-100">
                  ₹{course?.price}
                </td>
                
                {/* Actions Column */}
                <td className="text-sm font-medium text-richblack-100 ">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2: "All the data related to this course will be deleted.",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}