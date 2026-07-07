import { HiUsers } from "react-icons/hi"
import { ImTree } from "react-icons/im"
import { FiBookOpen, FiUser } from "react-icons/fi"
import { Link } from "react-router-dom"
import RatingStars from "../../common/RatingStars"
import GetAvgRating from "../../../utils/avgRating"

const CourseCard = ({ cardData, course }) => {
    // Determine if we are rendering a Homepage card or a Database course card
    const isHomePageCard = !!cardData;

    const reviewsArr = course?.ratingsAndReviews || []
    const ratingCount = reviewsArr.length
    const avgRating = GetAvgRating(reviewsArr)
    const sectionCount = course?.courseContent?.length || 0
    const lessonCount = course?.courseContent?.reduce(
        (total, section) => total + (section?.subSection?.length || 0),
        0
    ) || 0
    const enrolledCount = course?.studentsEnrolled?.length || 0
    const instructorName = `${course?.instructor?.firstName || ""} ${course?.instructor?.lastName || ""}`.trim()
    const categoryName = course?.category?.name || "Course"
    const contentLabel = lessonCount > 0
        ? `${lessonCount} lesson${lessonCount === 1 ? "" : "s"}`
        : `${sectionCount} section${sectionCount === 1 ? "" : "s"}`

    const cardContent = (
        <div className={`group flex h-full min-h-[300px] w-full min-w-0 cursor-pointer flex-col overflow-hidden
                rounded-lg border border-richblack-700 bg-richblack-800 text-richblack-25 shadow-[0px_12px_28px_rgba(0,0,0,0.28)]
                transition-all duration-200 hover:-translate-y-1 hover:border-richblack-500 hover:bg-richblack-700/70 hover:shadow-[0px_18px_45px_rgba(0,0,0,0.36)]`}
        >
            {/* Conditional Thumbnail for DB Courses */}
            {!isHomePageCard && (
                <div className="relative aspect-video w-full overflow-hidden bg-richblack-700">
                    <img
                        src={course?.thumbnail}
                        alt={course?.courseName || "course-thumbnail"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-richblack-900/80 to-transparent" />
                    <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-md border border-richblack-500 bg-richblack-900/80 px-2.5 py-1 text-xs font-medium text-richblack-25 backdrop-blur">
                        {categoryName}
                    </span>
                </div>
            )}

            <div className={`flex min-w-0 flex-1 flex-col ${isHomePageCard ? "p-6" : "p-5"}`}>
                {/* Dynamically pick the title field */}
                <h2 className="break-words text-[20px] font-semibold leading-7 text-richblack-5 transition-colors group-hover:text-yellow-25">
                    {isHomePageCard ? cardData?.heading : course?.courseName}
                </h2>
                {/* Dynamically pick the description field */}
                <p className={`mt-3 break-words text-[15px] leading-6 text-richblack-300 ${!isHomePageCard ? "[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden" : ""}`}>
                    {isHomePageCard ? cardData?.description : course?.courseDescription}
                </p>

                {!isHomePageCard && (
                    <>
                        <div className="mt-4 flex items-center gap-2 text-sm text-richblack-200">
                            <FiUser className="shrink-0 text-richblack-300" />
                            <span className="truncate">{instructorName || "StudyNotion instructor"}</span>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            {ratingCount > 0 && (
                                <span className="text-sm font-semibold text-yellow-25">{avgRating}</span>
                            )}
                            <RatingStars Review_Count={avgRating} Star_Size={18} />
                            <span className="text-sm text-richblack-300">
                                {ratingCount > 0 ? `${ratingCount} rating${ratingCount > 1 ? "s" : ""}` : "No ratings yet"}
                            </span>
                        </div>
                    </>
                )}
            </div>

            <div className={`flex flex-wrap items-center justify-between gap-4 border-t border-richblack-700 text-richblack-300 ${isHomePageCard ? "mx-6 pb-6 pt-4" : "px-5 py-4"}`}>
                {isHomePageCard ? (
                    <>
                        <div className="flex min-w-0 items-center gap-2">
                            <HiUsers /> {cardData?.level}
                        </div>
                        <div className="flex min-w-0 items-center gap-2">
                            <ImTree /> {cardData?.lessonNumber} Lessons
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1.5">
                                <FiBookOpen className="text-richblack-400" />
                                {contentLabel}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <HiUsers className="text-richblack-400" />
                                {enrolledCount} students
                            </span>
                        </div>
                        <div className="text-xl font-semibold text-yellow-50">
                            Rs. {course?.price}
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    // Wrap the card in a React Router Link
    return (
        isHomePageCard ? (
            // Route homepage teasers to the signup page
            <Link to="/signup" className="block h-full"> 
                {cardContent}
            </Link>
        ) : (
            // Route real database courses to their specific detail page
            <Link to={`/courses/${course?._id}`} className="block h-full">
                {cardContent}
            </Link>
        )
    )
}

export default CourseCard
