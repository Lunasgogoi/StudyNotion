import ChangeProfilePicture from "./ChangeProfilePicture"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"
import DeleteAccount from "./DeleteAccount"

export default function Settings() {
  return (
    // 🔥 Added max-width, mx-auto, and padding to center everything neatly
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
      <h1 className="mb-8 text-3xl font-medium text-richblack-5">
        Edit Profile
      </h1>
      
      {/* We use flex-col with a gap to space the cards out perfectly */}
      <div className="flex flex-col gap-10">
        <ChangeProfilePicture />
        <EditProfile />
        <UpdatePassword />
        <DeleteAccount />
      </div>
    </div>
  )
}