import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
//import "video-react/dist/video-react.css"
//import { Player, BigPlayButton } from "video-react"
import { setCompletedLectures } from "../../../slices/viewCourseSlices"
import { toggleLectureCompletion } from "../../../services/operations/courseDetailsAPI"

export default function VideoDetails() {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const playerRef = useRef(null)

  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  // Find the exact video object based on the URL params whenever the URL changes
  useEffect(() => {
    if (!courseSectionData.length) return

    const section = courseSectionData.find((sec) => sec._id === sectionId)
    const video = section?.subSection.find((sub) => sub._id === subSectionId)

    if (video) {
      setVideoData(video)
      setVideoEnded(false)
    }
  }, [courseSectionData, sectionId, subSectionId])

  // Helper functions to check boundaries for Next/Prev buttons
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)
    const currentSubSectionIndx = courseSectionData[currentSectionIndx]?.subSection.findIndex((data) => data._id === subSectionId)
    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)
    const noOfSubsections = courseSectionData[currentSectionIndx]?.subSection.length
    const currentSubSectionIndx = courseSectionData[currentSectionIndx]?.subSection.findIndex((data) => data._id === subSectionId)

    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)
    const noOfSubsections = courseSectionData[currentSectionIndx]?.subSection.length
    const currentSubSectionIndx = courseSectionData[currentSectionIndx]?.subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      // Go to next video in the SAME section
      const nextSubSectionId = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx + 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    } else {
      // Go to FIRST video in the NEXT section
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId = courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }
  }

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)
    const currentSubSectionIndx = courseSectionData[currentSectionIndx]?.subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      // Go to previous video in the SAME section
      const prevSubSectionId = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx - 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    } else {
      // Go to LAST video in the PREVIOUS section
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength = courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId = courseSectionData[currentSectionIndx - 1].subSection[prevSubSectionLength - 1]._id
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    // Call the backend to save progress
    const res = await toggleLectureCompletion(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )

    if (res?.success) {
      dispatch(setCompletedLectures(res.data || []))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 text-white my-6">
      {!videoData ? (
        <img
          src={courseEntireData.thumbnail}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <div className="relative border border-richblack-700 rounded-md overflow-hidden">
          <video
            ref={playerRef}
            className="aspect-video w-full bg-richblack-900"
            controls
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          />

          {/* This overlay appears ONLY when the video finishes playing */}
          {videoEnded && (
            <div className="absolute inset-0 z-[100] grid place-content-center bg-richblack-900/80 backdrop-blur-sm gap-y-6">

              {/* Notice the ? added here too! */}
              {!completedLectures?.includes(subSectionId) && (
                <button
                  disabled={loading}
                  onClick={handleLectureCompletion}
                  className="mx-auto rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all hover:scale-95"
                >
                  {!loading ? "Mark as Completed" : "Loading..."}
                </button>
              )}

              <button
                onClick={() => {
                  if (playerRef?.current) {
                    playerRef.current.currentTime = 0
                    playerRef.current?.play()
                    setVideoEnded(false)
                  }
                }}
                className="text-xl font-bold text-richblack-5 hover:underline"
              >
                Rewatch Video
              </button>

              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button onClick={goToPrevVideo} className="rounded-md bg-richblack-800 px-4 py-2 font-semibold text-richblack-5 transition-all hover:bg-richblack-700 hover:scale-95">
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button onClick={goToNextVideo} className="rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 transition-all hover:scale-95">
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Video Title and Description */}
      <h1 className="mt-4 text-3xl font-semibold">
        {videoData?.title}
      </h1>
      <p className="pt-2 pb-6 text-richblack-200">
        {videoData?.description}
      </p>
    </div>
  )
}
