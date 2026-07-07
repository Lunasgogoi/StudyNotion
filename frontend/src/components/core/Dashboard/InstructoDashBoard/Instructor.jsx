import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import InstructorChart from "./InstructorChart"
import { getInstructorData } from "../../../../services/operations/profileAPI"
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"


export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)

      if (instructorApiData?.length) {
        setInstructorData(instructorApiData)
      }
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    }
    getCourseDataWithStats()
  }, [token])

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0)
  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0)

  if (loading) {
    return <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center"><div className="spinner">Loading...</div></div>
  }

  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10 text-white">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>

      {courses.length > 0 ? (
        <div>
          {/* Top Row: Chart & Stats */}
          <div className="my-6 flex flex-col gap-6 lg:flex-row">
            {instructorData && <InstructorChart courses={instructorData} />}

            {/* Stats Sidebar */}
            <div className="flex min-w-[250px] flex-col rounded-md border border-richblack-800 bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5 mb-4">Statistics</p>

              <div className="mt-4 flex flex-col gap-5">
                <div>
                  <p className="text-sm text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-5">{courses.length}</p>
                </div>
                <div>
                  <p className="text-sm text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-5">{totalStudents}</p>
                </div>
                <div>
                  <p className="text-sm text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-yellow-50">Rs. {totalAmount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Recent Courses */}
          <div className="rounded-md border border-richblack-800 bg-richblack-800 p-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50 hover:underline">View All</p>
              </Link>
            </div>

            <div className="my-4 flex flex-col items-start gap-6 lg:flex-row">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="w-full lg:w-1/3">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[160px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-5">{course.courseName}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">{course.studentsEnrolled.length} students</p>
                      <p className="text-xs font-medium text-richblack-300">|</p>
                      <p className="text-xs font-medium text-richblack-300">Rs. {course.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center justify-center rounded-md border border-richblack-800 bg-richblack-800 p-10">
          <p className="text-2xl font-bold text-richblack-5">You have not created any courses yet</p>
          <Link to="/dashboard/add-course">
            <p className="mt-3 text-lg font-semibold text-yellow-50 hover:underline">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}
