import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  // TODO: Replace with real API call to fetch enrolled courses
  const [enrolledCourses, setEnrolledCourses] = useState(null)

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const response = await getUserEnrolledCourses(token);
        // Assuming the backend returns an array of courses
        setEnrolledCourses(response);
      } catch (error) {
        console.log("Unable to Fetch Enrolled Courses");
      }
    };
    getEnrolledCourses();
  }, []);

  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>

      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner">Loading...</div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
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
              className={`flex items-center border border-richblack-800 hover:bg-richblack-900 transition-all duration-200 ${i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                }`}
              key={i}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => navigate(`/view-course/${course?._id}/section/sub-section`)}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold text-richblack-5">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              <div className="w-1/4 px-2 py-3 text-richblack-5">
                {/* TODO: Add dynamic duration */}
                2hr 30mins
              </div>

              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p className="text-sm font-medium text-richblack-5">
                  Progress: {course.progressPercentage || 0}%
                </p>
                {/* Custom Progress Bar */}
                <div className="h-2 w-full rounded-full bg-richblack-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${course.progressPercentage === 100 ? "bg-caribbeangreen-300" : "bg-blue-200"
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