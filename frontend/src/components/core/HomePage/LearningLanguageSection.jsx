// src/components/core/HomePage/LearningLanguageSection.jsx
// import React from 'react'
import HighlightText from './HighlightText'
import Button from './Button'

const LearningLanguageSection = () => {
  const learningCards = [
    {
      title: "Know Your Progress",
      header: "bg-[#9ed3e6]",
      rotation: "lg:-rotate-12",
      overlap: "lg:-mr-18",
      zIndex: "z-0",
      content: "progress",
    },
    {
      title: "Compare With Others",
      header: "bg-[#ffc0cb]",
      rotation: "lg:-rotate-6",
      overlap: "",
      zIndex: "z-10",
      content: "compare",
    },
    {
      title: "Plan Your Lessons",
      header: "bg-[#ffe28a]",
      rotation: "lg:rotate-12",
      overlap: "lg:-ml-18",
      zIndex: "z-0",
      content: "calendar",
    },
  ]

  return (
    <div className="mt-32.5 mb-32 w-11/12 mx-auto max-w-maxContent">
      <div className="flex flex-col gap-5 items-center">
        
        {/* Headings */}
        <div className="text-4xl font-semibold text-center">
            Your swiss knife for
            <HighlightText text={"learning any language"} />
        </div>
        <div className="text-center text-richblack-700 mx-auto text-base font-medium w-[70%]">
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        {/* Overlapping Cards */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0 mt-12 lg:mt-14 w-full min-h-100">
            {learningCards.map((card, index) => (
                <div
                    key={card.title}
                    className={`${card.rotation} ${card.overlap} ${card.zIndex} ${
                        index === 1 ? "lg:translate-y-2" : "lg:translate-y-8"
                    } w-68 sm:w-80 bg-white rounded-sm shadow-[18px_20px_18px_rgba(0,0,0,0.16)] border border-richblack-100 transition-transform duration-200`}
                >
                    <div className={`${card.header} px-5 py-4 rounded-t-sm`}>
                        <h3 className="text-[15px] font-semibold text-richblack-800 capitalize">
                            {card.title}
                        </h3>
                    </div>

                    <div className="min-h-70 p-5 text-richblack-800">
                        {card.content === "progress" && (
                            <div>
                                <div className="flex items-center gap-2 text-2xl font-semibold">
                                    <span className="text-xl">▰</span>
                                    <span>HTML</span>
                                </div>
                                <p className="mt-4 text-sm text-richblack-500">Your Current League</p>
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="border border-richblack-100 rounded-sm p-3">
                                        <p className="text-xl">✨</p>
                                        <p className="mt-6 text-2xl font-semibold">420</p>
                                        <p className="text-sm text-richblack-500">Spin earned</p>
                                    </div>
                                    <div className="border border-richblack-100 rounded-sm p-3">
                                        <p className="text-xl">⌛</p>
                                        <p className="mt-6 text-2xl font-semibold">1254</p>
                                        <p className="text-sm text-richblack-500">minutes in app</p>
                                    </div>
                                </div>
                                <div className="mt-6 h-2 rounded-full bg-richblack-100" />
                            </div>
                        )}

                        {card.content === "compare" && (
                            <div className="space-y-5 pt-4">
                                {["Wade Warren", "Jane Cooper", "Eleanor Pena", "Ralph Edwards"].map((name, listIndex) => (
                                    <div key={name} className="flex items-center gap-3">
                                        <div className={`h-11 w-11 rounded-full flex items-center justify-center text-lg text-white ${
                                            listIndex === 0 ? "bg-blue-500" : listIndex === 1 ? "bg-orange-400" : listIndex === 2 ? "bg-purple-500" : "bg-cyan-500"
                                        }`}>
                                            {name.charAt(0)}
                                        </div>
                                        <p className="text-lg font-medium">{name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {card.content === "calendar" && (
                            <div>
                                <div className="flex items-center justify-between text-richblack-300 text-2xl">
                                    <span>‹</span>
                                    <span>›</span>
                                </div>
                                <p className="text-center text-lg font-medium">December 2022</p>
                                <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs text-richblack-400">
                                    {["M", "T", "W", "T", "F", "S", "S"].map((day, dayIndex) => (
                                        <span key={`${day}-${dayIndex}`}>{day}</span>
                                    ))}
                                    {Array.from({ length: 35 }).map((_, dayIndex) => (
                                        <span
                                            key={dayIndex}
                                            className={`py-1 rounded-full ${
                                                [8, 10, 11, 16, 23].includes(dayIndex)
                                                    ? "bg-[#e8e5ff] text-richblack-700"
                                                    : ""
                                            }`}
                                        >
                                            {dayIndex < 3 ? "" : dayIndex - 2}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Button */}
        <div className="w-fit mx-auto mt-8 lg:mt-4">
            <Button active={true} linkto={"/signup"}>
                <div>Learn More</div>
            </Button>
        </div>

      </div>
    </div>
  )
}

export default LearningLanguageSection
