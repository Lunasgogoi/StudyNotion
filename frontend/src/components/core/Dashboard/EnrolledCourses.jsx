import { useEffect, useMemo, useState } from "react"
import { FiBookOpen, FiCheckCircle, FiClock, FiPlayCircle } from "react-icons/fi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import {
  formatDuration,
  getCourseDurationInSeconds,
  getTotalLectures,
} from "../../../utils/courseMetrics"

const loadVideoDuration = (videoUrl) => new Promise((resolve) => {
  if (!videoUrl) {
    resolve(0)
    return
  }

  const video = document.createElement("video")
  const timeoutId = window.setTimeout(() => resolve(0), 8000)
  const finish = (duration) => {
    window.clearTimeout(timeoutId)
    resolve(duration)
  }

  video.preload = "metadata"
  video.onloadedmetadata = () => finish(Math.round(video.duration || 0))
  video.onerror = () => finish(0)
  video.src = videoUrl
})

const getFirstLecturePath = (course) => {
  const firstSection = course?.courseContent?.[0]
  const firstLecture = firstSection?.subSection?.[0]

  if (!firstSection?._id || !firstLecture?._id) return null

  return `/view-course/${course?._id}/section/${firstSection._id}/sub-section/${firstLecture._id}`
}

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [durationOverrides, setDurationOverrides] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true)
      try {
        const response = await getUserEnrolledCourses(token)
        setEnrolledCourses(response || [])
      } catch {
        console.log("Unable to Fetch Enrolled Courses")
      }
      setLoading(false)
    }

    fetchEnrolledCourses()
  }, [token])

  useEffect(() => {
    if (!enrolledCourses?.length) return

    let cancelled = false

    const hydrateMissingDurations = async () => {
      const coursesNeedingMetadata = enrolledCourses.filter((course) => {
        const knownDuration = course.totalDurationInSeconds || getCourseDurationInSeconds(course.courseContent)
        return knownDuration === 0 && course.courseContent?.some((section) =>
          section?.subSection?.some((lecture) => lecture?.videoUrl)
        )
      })

      const entries = await Promise.all(coursesNeedingMetadata.map(async (course) => {
        const videoUrls = course.courseContent.flatMap((section) =>
          (section?.subSection || []).map((lecture) => lecture?.videoUrl).filter(Boolean)
        )
        const durations = await Promise.all(videoUrls.map(loadVideoDuration))
        return [course._id, durations.reduce((total, duration) => total + duration, 0)]
      }))

      if (!cancelled && entries.length > 0) {
        setDurationOverrides((prev) => ({
          ...prev,
          ...Object.fromEntries(entries.filter(([, duration]) => duration > 0)),
        }))
      }
    }

    hydrateMissingDurations()

    return () => {
      cancelled = true
    }
  }, [enrolledCourses])

  const coursesWithMetrics = useMemo(() => (
    (enrolledCourses || []).map((course) => {
      const totalLectures = course.totalNoOfLectures ?? getTotalLectures(course.courseContent)
      const completedCount = course.completedLecturesCount ?? course.completedVideos?.length ?? 0
      const progressPercentage = totalLectures > 0
        ? Math.min(100, Math.round(course.progressPercentage ?? ((completedCount / totalLectures) * 100)))
        : 0
      const durationInSeconds = durationOverrides[course._id]
        ?? course.totalDurationInSeconds
        ?? getCourseDurationInSeconds(course.courseContent)

      return {
        ...course,
        totalLectures,
        completedCount,
        progressPercentage,
        durationInSeconds,
        firstLecturePath: getFirstLecturePath(course),
      }
    })
  ), [durationOverrides, enrolledCourses])

  if (loading || !enrolledCourses) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner">Loading...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-11/12 max-w-[1100px] py-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-richblack-5">Enrolled Courses</h1>
        <p className="text-richblack-300">
          Continue learning from your active courses and track lecture progress.
        </p>
      </div>

      {coursesWithMetrics.length === 0 ? (
        <div className="grid min-h-[260px] place-content-center rounded-lg border border-richblack-700 bg-richblack-800 px-6 text-center">
          <p className="text-xl font-semibold text-richblack-5">You have not enrolled in any courses yet.</p>
          <button
            type="button"
            onClick={() => navigate("/catalog/web-development")}
            className="mt-4 rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900"
          >
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-richblack-700 bg-richblack-800">
          <div className="hidden grid-cols-[1.7fr_0.75fr_1fr] gap-6 border-b border-richblack-700 bg-richblack-700 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-richblack-100 md:grid">
            <p>Course</p>
            <p>Duration</p>
            <p>Progress</p>
          </div>

          <div className="divide-y divide-richblack-700">
            {coursesWithMetrics.map((course) => (
              <div
                key={course._id}
                className="grid gap-5 px-5 py-5 transition-colors hover:bg-richblack-900/55 md:grid-cols-[1.7fr_0.75fr_1fr] md:items-center md:px-6"
              >
                <button
                  type="button"
                  disabled={!course.firstLecturePath}
                  onClick={() => course.firstLecturePath && navigate(course.firstLecturePath)}
                  className="flex min-w-0 items-center gap-4 text-left disabled:cursor-not-allowed"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-20 w-24 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-richblack-5">{course.courseName}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-richblack-300">
                      {course.courseDescription}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-richblack-300">
                      <span className="flex items-center gap-1.5">
                        <FiBookOpen />
                        {course.totalLectures} lecture{course.totalLectures === 1 ? "" : "s"}
                      </span>
                      <span className="flex items-center gap-1.5 text-yellow-50">
                        <FiCheckCircle />
                        {course.completedCount} completed
                      </span>
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-2 text-richblack-5">
                  <FiClock className="text-richblack-300" />
                  <span className="font-semibold">{formatDuration(course.durationInSeconds)}</span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-richblack-5">
                      {course.progressPercentage}% complete
                    </p>
                    {course.firstLecturePath && (
                      <button
                        type="button"
                        onClick={() => navigate(course.firstLecturePath)}
                        className="flex items-center gap-1.5 rounded-md border border-richblack-600 px-3 py-1.5 text-sm font-medium text-richblack-100 transition-colors hover:border-yellow-50 hover:text-yellow-50"
                      >
                        <FiPlayCircle />
                        Resume
                      </button>
                    )}
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-richblack-700">
                    <div
                      className="h-full rounded-full bg-yellow-50 transition-all duration-500"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-richblack-300">
                    {course.completedCount} of {course.totalLectures} lectures completed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
