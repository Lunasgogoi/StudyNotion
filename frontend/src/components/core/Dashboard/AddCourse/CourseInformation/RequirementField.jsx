import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementField({
  name,
  label,
  register,
  setValue,
  errors,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])

  useEffect(() => {
    register(name, { required: true, validate: (value) => value.length > 0 })
    if (editCourse && course?.instructions) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequirementsList(
        typeof course.instructions === "string"
          ? JSON.parse(course.instructions)
          : course.instructions
      )
    }
  }, [register, name, editCourse, course])

  useEffect(() => {
    setValue(name, requirementsList)
  }, [requirementsList, setValue, name])

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementsList([...requirementsList, requirement])
      setRequirement("")
    }
  }

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList]
    updatedRequirements.splice(index, 1)
    setRequirementsList(updatedRequirements)
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Enter requirements or instructions"
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>
      
      {/* List of Added Requirements */}
      {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((req, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{req}</span>
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 hover:text-richblack-5"
                onClick={() => handleRemoveRequirement(index)}
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}