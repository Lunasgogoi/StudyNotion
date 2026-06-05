import React from 'react'
import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import PublishCourse from "./PublishCourse"

export default function RenderSteps() {
  // Grab the current step from your Redux store
  const { step } = useSelector((state) => state.course)

  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ]

  return (
    <>
      <div className="relative mb-2 flex w-full justify-center">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            
            {/* Step Circle & Title */}
            <div className="flex flex-col items-center">
              <div
                className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] transition-all duration-200 ${
                  step === item.id
                    ? "border-yellow-50 bg-yellow-900 text-yellow-50" // Active Step
                    : step > item.id
                    ? "bg-yellow-50 text-richblack-900 border-yellow-50" // Completed Step
                    : "border-richblack-700 bg-richblack-800 text-richblack-300" // Upcoming Step
                }`}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  item.id
                )}
              </div>
            </div>

            {/* Dashed Line between circles (Hide on the last item) */}
            {item.id !== steps.length && (
              <div
                className={`h-[calc(34px/2)] w-[33%] border-dashed border-b-2 ${
                  step > item.id ? "border-yellow-50" : "border-richblack-500"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Titles Container (Positioned absolutely or with flex to align under circles) */}
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <div
            className="flex min-w-[130px] flex-col items-center gap-y-2"
            key={item.id}
          >
            <p
              className={`text-sm ${
                step >= item.id ? "text-richblack-5" : "text-richblack-500"
              }`}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* Dynamic Form Rendering */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />} 
    </>
  )
}
