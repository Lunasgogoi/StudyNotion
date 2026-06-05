// src/components/core/HomePage/InstructorSection.jsx
// import React from 'react'
import HighlightText from './HighlightText'
import Button from './Button'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className="mt-16 mb-32">
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        
        {/* Left Side: Instructor Image */}
        <div className="w-full lg:w-[50%]">
            <img
                // Placeholder image until you add your custom Cloudinary link to assets.js
                src="https://res.cloudinary.com/dkzrxdwmq/image/upload/v1779824587/pexels-tima-miroshnichenko-5427828_pyfdqc.jpg"
                alt="Instructor"
                // This creates that cool white offset square behind the image!
                className="shadow-[-20px_-20px_0_0_rgba(255,255,255,1)] object-cover h-125 w-full rounded-lg"
            />
        </div>

        {/* Right Side: Text & Call to Action */}
        <div className="w-full lg:w-[50%] flex flex-col gap-10">
            <div className="text-4xl font-semibold w-full lg:w-[50%] text-white">
                Become an
                <HighlightText text={"instructor"} />
            </div>

            <p className="font-medium text-[16px] w-[80%] text-richblack-300">
                Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </p>

            {/* w-fit ensures the button only wraps the text, not the whole screen width */}
            <div className="w-fit">
                <Button active={true} linkto={"/signup"}>
                    <div className="flex flex-row gap-2 items-center">
                        Start Teaching Today
                        <FaArrowRight />
                    </div>
                </Button>
            </div>
        </div>

      </div>
    </div>
  )
}

export default InstructorSection