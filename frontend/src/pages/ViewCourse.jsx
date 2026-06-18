import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlices"

// We will build these two components in the next step!
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"


export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)

  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      // Fetch the course details based on the URL parameter
      const courseData = await getFullDetailsOfCourse(courseId, token)
      if (!courseData?.courseDetails) return
      
      // Load all the data into our new Redux Slice
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos || []))
      
      // Calculate total lectures
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    }
    setCourseSpecificDetails()
  }, [courseId, token, dispatch])

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      
      {/* 1. The Left Sidebar (List of videos) */}
      <VideoDetailsSidebar setReviewModal={setReviewModal} />
      
      {/* 2. The Right Side (The actual Video Player) */}
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto bg-richblack-900">
        <div className="mx-6">
          {/* <Outlet /> renders whatever video matches the current URL */}
          <Outlet /> 
        </div>
      </div>
      
      {/* 3. The Review Modal (Pops up when they click 'Add Review') */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
      
    </div>
  )
}
