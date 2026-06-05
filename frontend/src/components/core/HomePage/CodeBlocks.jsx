// src/components/core/HomePage/CodeBlocks.jsx
// import React from 'react'
import Button from './Button'
import { FaArrowRight } from "react-icons/fa"
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({
    position, heading, subheading, cta1, cta2, codeblock, backgroundGradient, codeColor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}>
      
      {/* Section 1: Text and Buttons (Takes up 50% width on Desktop) */}
      <div className="w-full lg:w-[50%] flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 font-bold text-base md:w-[85%] -mt-3">
          {subheading}
        </div>

        <div className="flex gap-7 mt-7">
          <Button active={cta1.active} linkto={cta1.linkto}>
            <div className="flex gap-2 items-center">
              {cta1.btnText}
              <FaArrowRight />
            </div>
          </Button>

          <Button active={cta2.active} linkto={cta2.linkto}>
              {cta2.btnText}
          </Button>
        </div>
      </div>

      {/* Section 2: Code Editor Animation */}
      <div className="h-fit flex flex-row text-[10px] sm:text-sm leading-4.5 sm:leading-6 relative w-full lg:w-[47%] border border-richblack-700 bg-richblack-800/30 p-4 rounded-xl"> 
        
        {/* Background Glowing Gradient */}
        {backgroundGradient}

        {/* Line Numbers */}
        <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
          <p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p><p>10</p><p>11</p>
        </div>

        {/* Typing Animation Block */}
        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
          <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>

    </div>
  )
}

export default CodeBlocks