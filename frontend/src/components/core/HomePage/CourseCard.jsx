import React from 'react'
import { HiUsers } from "react-icons/hi"
import { ImTree } from "react-icons/im"
import { Link } from "react-router-dom"

const CourseCard = ({ cardData, course }) => {
    // Determine if we are rendering a Homepage card or a Database course card
    const isHomePageCard = !!cardData;

    const cardContent = (
        <div className={`flex h-full min-h-[300px] w-full min-w-0 cursor-pointer flex-col justify-between 
                rounded-lg bg-richblack-800 p-6 text-richblack-25 shadow-[0px_10px_20px_rgba(0,0,0,0.4)] 
                transition-all duration-200 hover:scale-[1.03] hover:shadow-[0px_10px_40px_rgba(8,217,214,0.15)]`}
        >
            {/* Conditional Thumbnail for DB Courses */}
            {!isHomePageCard && (
                <img 
                    src={course?.thumbnail} 
                    alt={course?.courseName || "course-thumbnail"} 
                    className="mb-4 h-[150px] w-full rounded-md object-cover"
                />
            )}

            <div className="flex min-w-0 flex-col gap-3">
                {/* Dynamically pick the title field */}
                <h2 className="break-words text-[20px] font-semibold leading-7 text-richblack-5">
                    {isHomePageCard ? cardData?.heading : course?.courseName}
                </h2>
                {/* Dynamically pick the description field */}
                <p className="break-words text-[16px] leading-6 text-richblack-400">
                    {isHomePageCard ? cardData?.description : course?.courseDescription}
                </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-richblack-600 pt-4 text-richblack-300">
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
                    <div className="text-yellow-50 font-semibold text-lg">
                        Rs. {course?.price}
                    </div>
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