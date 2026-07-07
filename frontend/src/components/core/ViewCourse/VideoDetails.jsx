import { useMemo, useRef, useState } from "react"
import { FiCheckCircle, FiChevronLeft, FiChevronRight, FiRotateCcw } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { setCompletedLectures } from "../../../slices/viewCourseSlices"
import { toggleLectureCompletion } from "../../../services/operations/courseDetailsAPI"
import { formatDuration, parseDurationToSeconds } from "../../../utils/courseMetrics"

export default function VideoDetails() {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const playerRef = useRef(null)

  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse)

  const [endedVideoKey, setEndedVideoKey] = useState(null)
  const [loading, setLoading] = useState(false)
  const [metadataDuration, setMetadataDuration] = useState({ key: "", seconds: 0 })

  const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)
  const currentSection = courseSectionData[currentSectionIndex]
  const currentLectureIndex = currentSection?.subSection?.findIndex((data) => data._id === subSectionId) ?? -1

  const videoData = useMemo(() => {
    return currentSection?.subSection?.find((sub) => sub._id === subSectionId) || null
  }, [currentSection, subSectionId])

  const currentVideoKey = `${sectionId}:${subSectionId}`
  const videoEnded = endedVideoKey === currentVideoKey
  const isCompleted = completedLectures?.includes(subSectionId)
  const savedDuration = parseDurationToSeconds(videoData?.timeDuration || videoData?.duration)
  const currentMetadataDuration = metadataDuration.key === currentVideoKey ? metadataDuration.seconds : 0
  const lectureDuration = formatDuration(savedDuration || currentMetadataDuration)

  const isFirstVideo = () => currentSectionIndex === 0 && currentLectureIndex === 0

  const isLastVideo = () => (
    currentSectionIndex === courseSectionData.length - 1 &&
    currentLectureIndex === (currentSection?.subSection?.length || 0) - 1
  )

  const goToNextVideo = () => {
    if (isLastVideo()) return

    if (currentLectureIndex < currentSection.subSection.length - 1) {
      const nextSubSectionId = currentSection.subSection[currentLectureIndex + 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
      return
    }

    const nextSection = courseSectionData[currentSectionIndex + 1]
    const nextSubSectionId = nextSection.subSection[0]._id
    navigate(`/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSubSectionId}`)
  }

  const goToPrevVideo = () => {
    if (isFirstVideo()) return

    if (currentLectureIndex > 0) {
      const prevSubSectionId = currentSection.subSection[currentLectureIndex - 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
      return
    }

    const prevSection = courseSectionData[currentSectionIndex - 1]
    const prevSubSectionId = prevSection.subSection[prevSection.subSection.length - 1]._id
    navigate(`/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubSectionId}`)
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await toggleLectureCompletion(
      { courseId, subsectionId: subSectionId },
      token
    )

    if (res?.success) {
      dispatch(setCompletedLectures(res.data || []))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="overflow-hidden rounded-lg border border-richblack-700 bg-richblack-800 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
        <div className="border-b border-richblack-700 px-5 py-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="min-w-0">
              <p className="text-sm font-medium text-richblack-300">
                {currentSection?.sectionName || "Course lecture"}
              </p>
              <h1 className="mt-1 truncate text-2xl font-semibold text-richblack-5">
                {videoData?.title || courseEntireData?.courseName || "Lecture"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-md border border-richblack-600 bg-richblack-700 px-3 py-1.5 text-richblack-100">
                {currentLectureIndex + 1 > 0 ? `Lecture ${currentLectureIndex + 1}` : "Lecture"}
              </span>
              <span className="rounded-md border border-richblack-600 bg-richblack-700 px-3 py-1.5 text-richblack-100">
                {lectureDuration}
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1.5 rounded-md border border-yellow-50/30 bg-yellow-50/10 px-3 py-1.5 text-yellow-50">
                  <FiCheckCircle />
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative bg-black">
          {!videoData ? (
            <img
              src={courseEntireData?.thumbnail}
              alt="Preview"
              className="aspect-video w-full object-cover"
            />
          ) : (
            <>
              <video
                ref={playerRef}
                className="aspect-video w-full bg-black object-contain"
                controls
                playsInline
                onLoadedMetadata={(event) => setMetadataDuration({
                  key: currentVideoKey,
                  seconds: Math.round(event.currentTarget.duration || 0),
                })}
                onEnded={() => setEndedVideoKey(currentVideoKey)}
                src={videoData?.videoUrl}
              />

              {videoEnded && (
                <div className="absolute inset-0 z-20 grid place-items-center bg-richblack-900/82 px-6 text-center backdrop-blur-sm">
                  <div className="flex max-w-md flex-col items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-full border border-yellow-50/40 bg-yellow-50/10 text-yellow-50">
                      <FiCheckCircle size={26} />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-richblack-5">Lecture finished</p>
                      <p className="mt-1 text-richblack-300">Mark it complete or continue to the next lecture.</p>
                    </div>

                    {!isCompleted && (
                      <button
                        disabled={loading}
                        onClick={handleLectureCompletion}
                        className="rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-colors hover:bg-yellow-100 disabled:opacity-60"
                      >
                        {!loading ? "Mark as Completed" : "Saving..."}
                      </button>
                    )}

                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => {
                          if (playerRef?.current) {
                            playerRef.current.currentTime = 0
                            playerRef.current?.play()
                            setEndedVideoKey(null)
                          }
                        }}
                        className="flex items-center gap-2 rounded-md border border-richblack-500 bg-richblack-800 px-4 py-2 font-semibold text-richblack-5 transition-colors hover:bg-richblack-700"
                      >
                        <FiRotateCcw />
                        Rewatch
                      </button>
                      {!isLastVideo() && (
                        <button
                          onClick={goToNextVideo}
                          className="flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 transition-colors hover:bg-yellow-100"
                        >
                          Next
                          <FiChevronRight />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isFirstVideo()}
              onClick={goToPrevVideo}
              className="flex items-center gap-2 rounded-md border border-richblack-600 px-4 py-2 font-semibold text-richblack-100 transition-colors hover:border-richblack-400 hover:text-richblack-5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft />
              Previous
            </button>
            <button
              type="button"
              disabled={isLastVideo()}
              onClick={goToNextVideo}
              className="flex items-center gap-2 rounded-md border border-richblack-600 px-4 py-2 font-semibold text-richblack-100 transition-colors hover:border-yellow-50 hover:text-yellow-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <FiChevronRight />
            </button>
          </div>

          {!isCompleted ? (
            <button
              type="button"
              disabled={loading || !videoData}
              onClick={handleLectureCompletion}
              className="rounded-md bg-yellow-50 px-5 py-2 font-semibold text-richblack-900 transition-colors hover:bg-yellow-100 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Mark Complete"}
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !videoData}
              onClick={handleLectureCompletion}
              className="rounded-md border border-richblack-600 px-5 py-2 font-semibold text-richblack-100 transition-colors hover:border-richblack-400 hover:text-richblack-5 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Mark Incomplete"}
            </button>
          )}
        </div>
      </div>

      {videoData?.description && (
        <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-5">
          <p className="text-sm font-medium uppercase tracking-wide text-richblack-400">About this lecture</p>
          <p className="mt-3 leading-7 text-richblack-200">{videoData.description}</p>
        </div>
      )}
    </div>
  )
}
