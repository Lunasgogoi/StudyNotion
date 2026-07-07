import { useMemo, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { FiCheckCircle, FiCircle, FiPlayCircle } from "react-icons/fi"
import { IoIosArrowBack } from "react-icons/io"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toggleLectureCompletion } from "../../../services/operations/courseDetailsAPI"
import { setCompletedLectures } from "../../../slices/viewCourseSlices"
import { formatDuration, parseDurationToSeconds } from "../../../utils/courseMetrics"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [manualActiveStatus, setManualActiveStatus] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const { token } = useSelector((state) => state.auth)

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  const progressPercentage = useMemo(() => {
    if (!totalNoOfLectures) return 0
    return Math.min(100, Math.round((completedLectures.length / totalNoOfLectures) * 100))
  }, [completedLectures.length, totalNoOfLectures])

  const currentSectionId = useMemo(() => {
    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)
    return courseSectionData?.[currentSectionIndx]?._id || ""
  }, [courseSectionData, sectionId])

  const activeStatus = manualActiveStatus?.path === location.pathname
    ? manualActiveStatus.sectionId
    : currentSectionId

  const handleLectureToggle = async (event, topicId) => {
    event.stopPropagation()

    const response = await toggleLectureCompletion(
      { courseId: courseEntireData?._id, subsectionId: topicId },
      token
    )

    if (response?.success) {
      dispatch(setCompletedLectures(response.data || []))
    }
  }

  return (
    <aside className="flex h-[calc(100vh-3.5rem)] w-[340px] max-w-[380px] shrink-0 flex-col border-r border-richblack-700 bg-richblack-800">
      <div className="border-b border-richblack-700 p-5">
        <div className="flex w-full items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="grid h-11 w-11 place-items-center rounded-full border border-richblack-600 bg-richblack-700 text-richblack-100 transition-colors hover:border-yellow-50 hover:text-yellow-50"
            title="Back to enrolled courses"
          >
            <IoIosArrowBack size={28} />
          </button>
          <button
            type="button"
            onClick={() => setReviewModal(true)}
            className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 transition-colors hover:bg-yellow-100"
          >
            Add Review
          </button>
        </div>

        <div className="mt-5">
          <p className="line-clamp-2 text-xl font-semibold leading-7 text-richblack-5">
            {courseEntireData?.courseName}
          </p>
          <div className="mt-3 flex items-center justify-between text-sm text-richblack-300">
            <span>{completedLectures?.length || 0} / {totalNoOfLectures || 0} lectures</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-richblack-700">
            <div
              className="h-full rounded-full bg-yellow-50 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {courseSectionData.map((section, index) => {
          const sectionDuration = (section?.subSection || []).reduce(
            (total, lecture) => total + parseDurationToSeconds(lecture?.timeDuration || lecture?.duration),
            0
          )

          return (
            <div className="border-b border-richblack-700 text-sm text-richblack-5" key={section._id || index}>
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 bg-richblack-800 px-5 py-4 text-left transition-colors hover:bg-richblack-700"
                onClick={() => setManualActiveStatus({
                  path: location.pathname,
                  sectionId: activeStatus === section?._id ? "" : section?._id,
                })}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{section?.sectionName}</p>
                  <p className="mt-1 text-xs text-richblack-400">
                    {section?.subSection?.length || 0} lecture{section?.subSection?.length === 1 ? "" : "s"} - {formatDuration(sectionDuration)}
                  </p>
                </div>
                <span className={`${activeStatus === section?._id ? "rotate-180" : "rotate-0"} mt-1 transition-transform duration-300`}>
                  <BsChevronDown />
                </span>
              </button>

              {activeStatus === section?._id && (
                <div className="bg-richblack-900/35 py-1">
                  {section.subSection.map((topic, i) => {
                    const isActive = subSectionId === topic._id
                    const isCompleted = completedLectures?.includes(topic?._id)

                    return (
                      <button
                        type="button"
                        className={`flex w-full items-start gap-3 px-5 py-3 text-left transition-colors ${
                          isActive
                            ? "bg-yellow-50 text-richblack-900"
                            : "text-richblack-100 hover:bg-richblack-700"
                        }`}
                        key={topic._id || i}
                        onClick={() => {
                          navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`)
                        }}
                      >
                        <span
                          role="checkbox"
                          aria-checked={isCompleted}
                          tabIndex={0}
                          onClick={(event) => handleLectureToggle(event, topic?._id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              handleLectureToggle(event, topic?._id)
                            }
                          }}
                          className={`mt-0.5 shrink-0 ${isCompleted ? "text-yellow-50" : isActive ? "text-richblack-700" : "text-richblack-400"}`}
                        >
                          {isCompleted ? <FiCheckCircle size={18} /> : <FiCircle size={18} />}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-start gap-2">
                            {isActive && <FiPlayCircle className="mt-0.5 shrink-0" />}
                            <span className="line-clamp-2 font-medium">{topic.title}</span>
                          </span>
                          <span className={`mt-1 block text-xs ${isActive ? "text-richblack-700" : "text-richblack-400"}`}>
                            {formatDuration(parseDurationToSeconds(topic?.timeDuration || topic?.duration))}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
