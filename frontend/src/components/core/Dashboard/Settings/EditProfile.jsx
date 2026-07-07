import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { updateProfile } from "../../../../services/operations/settingsAPI"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
    const { user } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
            gender: user?.additionalDetails?.gender || "",
            contactNumber: user?.additionalDetails?.contactNumber || "",
            about: user?.additionalDetails?.about || "",
        },
    })

    const submitProfileForm = async (data) => {
        try {
            // Call the API
            dispatch(updateProfile(token, data))
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(submitProfileForm)}>
            {/* 🔥 The Card Container 🔥 */}
            <div className="flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <h2 className="text-lg font-semibold text-richblack-5">
                    Profile Information
                </h2>

                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="firstName" className="text-sm text-richblack-5">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Enter first name"
                            className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                            {...register("firstName", { required: true })}
                        />
                    </div>
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="lastName" className="text-sm text-richblack-5">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Enter last name"
                            className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                            {...register("lastName", { required: true })}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="dateOfBirth" className="text-sm text-richblack-5">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                            {...register("dateOfBirth")}
                        />
                    </div>
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="gender" className="text-sm text-richblack-5">Gender</label>
                        <select
                            name="gender"
                            id="gender"
                            className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                            {...register("gender")}
                        >
                            <option value="" disabled>Choose Gender</option>
                            {genders.map((ele, i) => (
                                <option key={i} value={ele}>{ele}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="contactNumber" className="text-sm text-richblack-5">Contact Number</label>
                        <input
                            type="tel"
                            name="contactNumber"
                            id="contactNumber"
                            placeholder="Enter Contact Number"
                            className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                            {...register("contactNumber")}
                        />
                    </div>
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="about" className="text-sm text-richblack-5">About</label>
                        <input
                            type="text"
                            name="about"
                            id="about"
                            placeholder="Enter Bio Details"
                            className="rounded-md bg-richblack-700 p-3 text-richblack-5 outline-none focus:border-yellow-50 border-[1px] border-transparent"
                            {...register("about")}
                        />
                    </div>
                </div>

                {/* 🔥 Buttons moved INSIDE the card, with a subtle top border 🔥 */}
                <div className="mt-4 flex justify-end gap-3 pt-6 border-t border-richblack-700">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/my-profile")}
                        className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 transition-all duration-200 hover:scale-95 hover:text-richblack-5"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="cursor-pointer rounded-md bg-yellow-50 py-2 px-5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    )
}
