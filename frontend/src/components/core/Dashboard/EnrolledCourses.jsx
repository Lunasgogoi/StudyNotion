import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
// import ProgressBar from "@ramonak/react-progress-bar" // Optional: You can install this for easier progress bars!

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [loading, setLoading] = useState(false)

  // Helper to calculate total duration of a course
const getCourseDuration = (course) => {
    let totalSeconds = 0;
    
    course?.courseContent?.forEach((section) => {
      section?.subSection?.forEach((sub) => {
        // Fallback checks: Sometimes it's saved as timeDuration, sometimes just duration
        const timeAsString = sub.timeDuration || sub.duration || "0";
        const time = parseFloat(timeAsString);
        if (!isNaN(time)) {
          totalSeconds += time;
        }
      });
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (hours > 0) return `${hours}hr ${minutes}min`;
    if (minutes > 0) return `${minutes}min ${seconds}sec`;
    return `${seconds}sec`;
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true)
      try {
        const response = await getUserEnrolledCourses(token)
        // Ensure we are setting an array, even if empty
        setEnrolledCourses(response || [])
      } catch (error) {
        console.log("Unable to Fetch Enrolled Courses")
      }
      setLoading(false)
    }
    fetchEnrolledCourses()
  }, [token])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner">Loading...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
      <div className="text-3xl font-medium text-richblack-5 mb-8">Enrolled Courses</div>

      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner">Loading...</div>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <p className="grid h-[10vh] w-full place-content-center text-xl text-richblack-5">
          You have not enrolled in any courses yet.
          {/* Link back to catalog to encourage shopping */}
          <span
            onClick={() => navigate("/catalog/web-development")} // Adjust route as needed
            className="text-center text-yellow-50 mt-2 cursor-pointer hover:underline text-base"
          >
            Explore Courses
          </span>
        </p>
      ) : (
        <div className="my-8 flex flex-col rounded-t-lg border border-richblack-800 bg-richblack-800">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 px-5 py-3 text-richblack-5">
            <p className="w-[45%] font-medium">Course Name</p>
            <p className="w-1/4 font-medium px-2">Duration</p>
            <p className="flex-1 font-medium px-2">Progress</p>
          </div>

          {/* Course List */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex flex-col md:flex-row items-center border border-richblack-800 hover:bg-richblack-900 transition-all duration-200 ${i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                }`}
              key={i}
            >
              {/* Image & Title - Clicking this navigates to the video player */}
              <div
                className="flex w-full md:w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  // Navigate to the View Course module (we will build this next!)
                  navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold text-richblack-5">{course.courseName}</p>
                  <p className="text-xs text-richblack-300 hidden md:block">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Duration */}
              {/* Duration */}
              <div className="w-full md:w-1/4 px-2 py-3 text-richblack-5 pl-5 md:pl-2">
                {/* Replace the hardcoded "2hr 30mins" with the dynamic function */}
                {getCourseDuration(course)}
              </div>

              {/* Custom Progress Bar */}
              <div className="flex w-full md:w-1/5 flex-col gap-2 px-2 py-3 pl-5 md:pl-2">
                <p className="text-sm font-medium text-richblack-5">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <div className="h-2 w-full max-w-[200px] rounded-full bg-richblack-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${course.progressPercentage === 100
                        ? "bg-caribbeangreen-300"
                        : "bg-blue-200"
                      }`}
                    style={{ width: `${course.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}