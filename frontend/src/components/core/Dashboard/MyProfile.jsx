// src/components/core/Dashboard/MyProfile.jsx

import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RiEditBoxLine } from "react-icons/ri"
import Button from '../HomePage/Button'

const MyProfile = () => {
    // Grab the user data from Redux state
    const { user } = useSelector((state) => state.profile)
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate()

  return (
    <div className="text-white w-full flex flex-col gap-10">
        
        <h1 className="text-3xl font-medium text-richblack-5 mb-4">
            My Profile
        </h1>

        {/* SECTION 1: Profile Header */}
        <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_0_20px_0_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-x-4">
                <img 
                    src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`} 
                    alt={`profile-${user?.firstName}`}
                    className="aspect-square w-[78px] rounded-full object-cover shadow-sm"
                />
                <div className="space-y-1">
                    <p className="text-lg font-semibold text-richblack-5">
                        {user?.firstName + " " + user?.lastName}
                    </p>
                    <p className="text-sm text-richblack-300">
                        {user?.email}
                    </p>
                </div>
            </div>
            {/* Reusing your Button Component! */}
            <Button active={true} linkto={"/dashboard/settings"}>
                <div className="flex items-center gap-2">
                    Edit <RiEditBoxLine />
                </div>
            </Button>
        </div>

        {/* SECTION 2: About */}
        <div className="flex flex-col gap-y-5 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_0_20px_0_rgba(0,0,0,0.2)]">
            <div className="flex w-full items-center justify-between">
                <p className="text-lg font-semibold text-richblack-5">About</p>
                <Button active={true} linkto={"/dashboard/settings"}>
                    <div className="flex items-center gap-2">
                        Edit <RiEditBoxLine />
                    </div>
                </Button>
            </div>
            <p className={`${user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"} text-sm font-medium`}>
                {user?.additionalDetails?.about ?? "Write Something About Yourself"}
            </p>
        </div>

        {/* SECTION 3: Personal Details */}
        <div className="flex flex-col gap-y-5 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_0_20px_0_rgba(0,0,0,0.2)]">
            <div className="flex w-full items-center justify-between">
                <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
                <Button active={true} linkto={"/dashboard/settings"}>
                    <div className="flex items-center gap-2">
                        Edit <RiEditBoxLine />
                    </div>
                </Button>
            </div>

            {/* CSS Grid for perfectly aligned text columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 max-w-[500px] mt-4">
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-richblack-400">First Name</p>
                    <p className="text-sm font-medium text-richblack-5">{user?.firstName}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-richblack-400">Last Name</p>
                    <p className="text-sm font-medium text-richblack-5">{user?.lastName}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-richblack-400">Email</p>
                    <p className="text-sm font-medium text-richblack-5">{user?.email}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-richblack-400">Phone Number</p>
                    <p className="text-sm font-medium text-richblack-5">{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-richblack-400">Gender</p>
                    <p className="text-sm font-medium text-richblack-5">{user?.additionalDetails?.gender ?? "Add Gender"}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-richblack-400">Date Of Birth</p>
                    <p className="text-sm font-medium text-richblack-5">{user?.additionalDetails?.dateOfBirth ?? "Add Date Of Birth"}</p>
                </div>
            </div>
        </div>

    </div>
  )
}

export default MyProfile