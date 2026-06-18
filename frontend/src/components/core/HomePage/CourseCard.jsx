// src/components/core/HomePage/CourseCard.jsx
// import React from 'react'
import { HiUsers } from "react-icons/hi"
import { ImTree } from "react-icons/im"


const CourseCard = ({ cardData }) => {
    return (
        <div className="flex h-full min-h-[300px] w-full min-w-0 cursor-pointer flex-col justify-between 
                rounded-lg bg-richblack-800 p-6 text-richblack-25 shadow-[0px_10px_20px_rgba(0,0,0,0.4)] 
                transition-all duration-200 hover:scale-[1.03] hover:shadow-[0px_10px_40px_rgba(8,217,214,0.15)]"
        >

            <div className="flex min-w-0 flex-col gap-3">
                <h2 className="break-words text-[20px] font-semibold leading-7">{cardData.heading}</h2>
                <p className="break-words text-[16px] leading-6 text-richblack-400">{cardData.description}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-richblack-600 pt-4 text-richblack-300">
                <div className="flex min-w-0 items-center gap-2">
                    <HiUsers /> {cardData.level}
                </div>
                <div className="flex min-w-0 items-center gap-2">
                    <ImTree /> {cardData.lessonNumber} Lessons
                </div>
            </div>

        </div>
    )
}

export default CourseCard
