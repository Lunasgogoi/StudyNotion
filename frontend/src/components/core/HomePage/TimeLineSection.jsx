// src/components/core/HomePage/TimelineSection.jsx
// import React from 'react'
import { assets } from "../../../data/assets";

// We will use standard emojis/text as placeholders until you add your SVG icons to assets.js!
const timeline = [
    {
        Logo: "🏅",
        heading: "Leadership",
        Description: "Fully committed to the success company",
    },
    {
        Logo: "🎓",
        heading: "Responsibility",
        Description: "Students will always be our top priority",
    },
    {
        Logo: "💎",
        heading: "Flexibility",
        Description: "The ability to switch is an important skills",
    },
    {
        Logo: "👨‍💻",
        heading: "Solve the problem",
        Description: "Code your way to a solution",
    },
];

const TimelineSection = () => {
    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-15 items-center">

                {/* Left Part: The Timeline List */}
                <div className="w-full lg:w-[45%] flex flex-col gap-5">
                    {timeline.map((element, index) => {
                        return (
                            <div className="flex flex-row gap-6" key={index}>
                                {/* Icon Box */}
                                <div className="w-12.5 h-12.5 bg-white flex items-center justify-center rounded-full shadow-[#00000012] shadow-[0_0_62px_0]">
                                    <div className="text-2xl">{element.Logo}</div>
                                </div>

                                {/* Text Content */}
                                <div>
                                    <h2 className="font-semibold text-[18px]">{element.heading}</h2>
                                    <p className="text-base text-richblack-700">{element.Description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Part: Image and Overlapping Green Box */}
                <div className="relative mt-10 lg:mt-0 w-fit">

                    {/* Main Image */}
                    <img
                        src={assets.white_section_1}
                        alt="timelineImage"
                        className="
            object-cover
            h-100
            w-maxContentTab
            rounded-lg
            shadow-[15px_15px_30px_rgba(0,0,0,.5)]
        "
                    />

                    {/* Overlapping Green Box */}
                    <div className="absolute bg-emerald-700 flex flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md">

                        {/* Years Experience */}
                        <div className="flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7">
                            <p className="text-3xl font-bold">10</p>
                            <p className="text-caribbeangreen-300 text-sm w-18.75">
                                Years of Experience
                            </p>
                        </div>

                        {/* Types of Courses */}
                        <div className="flex gap-5 items-center px-7">
                            <p className="text-3xl font-bold">250</p>
                            <p className="text-caribbeangreen-300 text-sm w-18.75">
                                Types of Courses
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default TimelineSection;
