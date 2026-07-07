import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import CourseTable from "./InstructorCourses/CourseTable"
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"


export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
    }
    fetchCourses()
  }, [token])

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <button
          onClick={() => navigate("/dashboard/add-course")}
          className="flex items-center gap-x-2 rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all hover:scale-95"
        >
          Add Course <VscAdd />
        </button>
      </div>

      {/* Render Table */}
      {courses && <CourseTable courses={courses} setCourses={setCourses} />}
    </div>
  )
}
