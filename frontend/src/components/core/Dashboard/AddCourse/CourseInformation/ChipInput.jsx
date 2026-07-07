import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [chips, setChips] = useState([])

  // Register the input manually on mount
  useEffect(() => {
    // We register the name of the input with validation
    register(name, { required: true, validate: (value) => value.length > 0 })
    
    // If we are in edit mode, populate the chips from the backend data
    if (editCourse && course?.courseTags) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChips(
        typeof course.courseTags === "string"
          ? JSON.parse(course.courseTags)
          : course.courseTags
      )
    }
  }, [register, name, editCourse, course])

  // Every time the chips array changes, update the react-hook-form value
  useEffect(() => {
    setValue(name, chips)
  }, [chips, name, setValue])

  // Handle User Typing and Pressing Enter or Comma
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      
      const chipValue = event.target.value.trim()
      
      // Add if it's not empty and doesn't already exist
      if (chipValue && !chips.includes(chipValue)) {
        setChips([...chips, chipValue])
        event.target.value = "" // Clear the input
      }
    }
  }

  const handleDeleteChip = (chipIndex) => {
    // Filter out the chip at the clicked index
    setChips(chips.filter((_, index) => index !== chipIndex))
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      {/* Render the created chips */}
      <div className="flex w-full flex-wrap gap-y-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
          >
            {chip}
            <button
              type="button"
              onClick={() => handleDeleteChip(index)}
              className="ml-2 focus:outline-none text-richblack-900 hover:scale-110 transition-all"
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}
      </div>

      {/* The actual Input Field */}
      <input
        id={name}
        type="text"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
      />
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
