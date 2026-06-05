// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
// eslint-disable-next-line no-unused-vars
import { setStep, setCourse } from '../../../../../slices/courseSlice' // Adjust path as needed
import { HiOutlineCurrencyRupee } from 'react-icons/hi'
import ChipInput from './ChipInput'
import { fetchCourseCategories, createCourse } from '../../../../../services/operations/courseDetailsAPI'
import RequirementField from './RequirementField'
import Upload from './Upload'

export default function CourseInformationForm() {
    const {
        register,
        handleSubmit,
        setValue,
        // eslint-disable-next-line no-unused-vars
        getValues,
        formState: { errors },
    } = useForm()

    // eslint-disable-next-line no-unused-vars
    const dispatch = useDispatch()
    const { course, editCourse } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [courseCategories, setCourseCategories] = useState([])

    // On mount, if we are editing, populate the form
    useEffect(() => {
        // TODO: Fetch categories from backend here and setCourseCategories
        const fetchCategories = async () => {
            const result = await fetchCourseCategories()
            if (result) {
                setCourseCategories(result)
            }
        }
        fetchCategories()


        if (editCourse && course) {
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            // We will set the rest (Tags, Thumbnail, etc.) later
        }
    }, [editCourse, course, setValue])

    const onSubmit = async (data) => {
        console.log("Form Data: ", data)
        
        setLoading(true)

        // Create FormData for file upload
        const formData = new FormData()
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("coursePrice", data.coursePrice)
        formData.append("courseTags", JSON.stringify(data.courseTags))
        formData.append("category", data.courseCategory)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        // Call API to create course
        const result = await createCourse(formData, token)
        
        if (result) {
            dispatch(setCourse(result))
            dispatch(setStep(2))
            toast.success("Course created successfully")
        }

        setLoading(false)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
        >
            {/* Course Title */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseTitle">
                    Course Title <sup className="text-pink-200">*</sup>
                </label>
                <input
                    id="courseTitle"
                    placeholder="Enter Course Title"
                    {...register("courseTitle", { required: true })}
                    className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                />
                {errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course title is required
                    </span>
                )}
            </div>

            {/* Course Description */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
                    Course Short Description <sup className="text-pink-200">*</sup>
                </label>
                <textarea
                    id="courseShortDesc"
                    placeholder="Enter Description"
                    {...register("courseShortDesc", { required: true })}
                    className="min-h-[130px] w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                />
                {errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Description is required
                    </span>
                )}
            </div>

            {/* Course Price */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="coursePrice">
                    Course Price <sup className="text-pink-200">*</sup>
                </label>
                <div className="relative">
                    <input
                        id="coursePrice"
                        placeholder="Enter Course Price"
                        type="number"
                        {...register("coursePrice", {
                            required: true,
                            valueAsNumber: true,
                            pattern: {
                                value: /^(0|[1-9]\d*)(\.\d+)?$/,
                            },
                        })}
                        className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] pl-12 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                    />
                    <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
                </div>
                {errors.coursePrice && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Price is required
                    </span>
                )}
            </div>

            {/* Course Category Dropdown */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseCategory">
                    Course Category <sup className="text-pink-200">*</sup>
                </label>
                <select
                    id="courseCategory"
                    defaultValue=""
                    {...register("courseCategory", { required: true })}
                    className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                >
                    <option value="" disabled>
                        Choose a Category
                    </option>
                    {/* Ensure courseCategories is an array before mapping */}
                    {!loading &&
                        courseCategories?.map((category, index) => (
                            <option key={index} value={category?._id}>
                                {category?.name}
                            </option>
                        ))}
                </select>
                {errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Category is required
                    </span>
                )}
            </div>
            {/* Custom Tags/Chip Input */}
            <ChipInput
                label="Tags"
                name="courseTags"
                placeholder="Enter Tags and press Enter"
                register={register}
                errors={errors}
                setValue={setValue}
            />

            {/* ... your previous code (Title, Desc, Price, Category, Tags) ... */}

            {/* Course Thumbnail Image */}
            <Upload
                name="courseImage"
                label="Course Thumbnail"
                register={register}
                setValue={setValue}
                errors={errors}
            />

            {/* Benefits of the course (Just a standard textarea) */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
                    Benefits of the course <sup className="text-pink-200">*</sup>
                </label>
                <textarea
                    id="courseBenefits"
                    placeholder="Enter benefits of the course"
                    {...register("courseBenefits", { required: true })}
                    className="min-h-[130px] w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                />
                {errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                Benefits of the course is required
                    </span>
                )}
            </div>

            {/* Requirements/Instructions */}
            <RequirementField
                name="courseRequirements"
                label="Requirements/Instructions"
                register={register}
                setValue={setValue}
                errors={errors}
            />

            {/* Next Button */}
            <div className="flex justify-end gap-x-2">
                {editCourse && (
                    <button
                        onClick={() => dispatch(setStep(2))}
                        disabled={loading}
                        className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                    >
                        Continue Without Saving
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900"
                >
                    {editCourse ? "Save Changes" : "Next"}
                </button>
            </div>


        </form>
    )
}
