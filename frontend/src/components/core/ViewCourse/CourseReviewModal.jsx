import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { FaStar } from "react-icons/fa" // Using standard FontAwesome stars
import { useSelector } from "react-redux"
// import { createRating } from "../../../services/operations/courseDetailsAPI" 
import { createRating } from "../../../services/operations/courseDetailsAPI"
import { toast } from "react-hot-toast" // Added toast for better error handling

export default function CourseReviewModal({ setReviewModal }) {
    const { user } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const { courseEntireData } = useSelector((state) => state.viewCourse)

    // State for our custom star rating
    const [currentRating, setCurrentRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        setValue("courseExperience", "")
        setValue("courseRating", 0)
    }, [setValue])

    const onSubmit = async (data) => {
        // Prevent submission if they haven't selected a star rating
        if (currentRating === 0) {
            toast.error("Please select a star rating!")
            return
        }

        // Call the backend API
        const success = await createRating(
            {
                courseId: courseEntireData._id,
                rating: currentRating,
                review: data.courseExperience
            },
            token
        )

        // Only close the modal if the backend successfully saved the review
        if (success) {
            setReviewModal(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-richblack-900/60 backdrop-blur-sm">
            {/* Replaced 'bg-white bg-opacity-10' with 'bg-richblack-900/60' for a darker, softer overlay */}
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">

                {/* Modal Header */}
                <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                    <p className="text-xl font-semibold text-richblack-5">Add Review</p>
                    <button onClick={() => setReviewModal(false)}>
                        <RxCross2 className="text-2xl text-richblack-5 hover:text-richblack-25" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="flex items-center justify-center gap-x-4">
                        <img src={user?.image} alt="user" className="aspect-square w-[50px] rounded-full object-cover" />
                        <div>
                            <p className="font-semibold text-richblack-5">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-richblack-5">Posting Publicly</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col items-center">

                        {/* 🔥 Custom Interactive Star Rating 🔥 */}
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1
                                return (
                                    <button
                                        type="button"
                                        key={starValue}
                                        className={`transition-all duration-200 ${starValue <= (hoverRating || currentRating)
                                                ? "text-yellow-50"
                                                : "text-richblack-400"
                                            }`}
                                        onClick={() => {
                                            setCurrentRating(starValue)
                                            setValue("courseRating", starValue)
                                        }}
                                        onMouseEnter={() => setHoverRating(starValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        <FaStar size={28} />
                                    </button>
                                )
                            })}
                        </div>

                        <div className="flex w-11/12 flex-col space-y-2 mt-6">
                            <label className="text-sm text-richblack-5" htmlFor="courseExperience">
                                Add Your Experience <sup className="text-pink-200">*</sup>
                            </label>
                            <textarea
                                id="courseExperience"
                                placeholder="Add Your Experience here"
                                {...register("courseExperience", { required: true })}
                                className="form-style min-h-[130px] w-full rounded-md bg-richblack-700 p-3 text-richblack-5"
                            />
                            {errors.courseExperience && <span className="text-pink-200 text-xs">Please add your experience</span>}
                        </div>

                        <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                            <button
                                type="button"
                                onClick={() => setReviewModal(false)}
                                className="rounded-md bg-richblack-300 py-2 px-4 font-semibold text-richblack-900 transition-all hover:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-yellow-50 py-2 px-4 font-semibold text-richblack-900 transition-all hover:scale-95"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    </div >
  )
}