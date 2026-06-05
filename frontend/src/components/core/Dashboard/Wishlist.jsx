import { useDispatch, useSelector } from "react-redux"
import { RiDeleteBin6Line } from "react-icons/ri"
import { BsCartPlus } from "react-icons/bs"
import { removeFromWishlist } from "../../../slices/wishlistSlice"
import { addToCart } from "../../../slices/cartSlice"

export default function Wishlist() {
  // Grab the real wishlist array directly from Redux
  const { wishlist } = useSelector((state) => state.wishlist)
  const dispatch = useDispatch()

  // This function handles the combo-move: Add to Cart, then Delete from Wishlist
  const handleMoveToCart = (course) => {
    dispatch(addToCart(course))
    dispatch(removeFromWishlist(course._id))
  }

  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
      <h1 className="mb-8 text-3xl font-medium text-richblack-5">Your Wishlist</h1>

      {/* Check the length of the real Redux array */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {wishlist.map((course) => (
            <div key={course._id} className="flex flex-col gap-2 rounded-xl border border-richblack-800 bg-richblack-800 p-4 transition-all hover:scale-[1.02]">
              <img 
                src={course?.thumbnail} 
                alt={course?.courseName} 
                className="h-[200px] w-full rounded-lg object-cover"
              />
              <div className="mt-2 flex flex-col gap-1">
                <p className="text-lg font-semibold text-richblack-5">{course?.courseName}</p>
                <p className="text-sm text-richblack-300">
                  {/* Safely chaining instructor names in case they are missing */}
                  {course?.instructor?.firstName} {course?.instructor?.lastName}
                </p>
                <p className="mt-2 text-xl font-bold text-yellow-50">Rs. {course?.price}</p>
              </div>

              <div className="mt-4 flex gap-3">
                {/* Hooked up the Move to Cart function */}
                <button 
                  onClick={() => handleMoveToCart(course)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-yellow-50 py-2 font-semibold text-richblack-900 transition-all hover:scale-95"
                >
                  <BsCartPlus size={20} />
                  Move to Cart
                </button>
                
                {/* Hooked up the raw remove action */}
                <button 
                  onClick={() => dispatch(removeFromWishlist(course._id))}
                  className="flex items-center justify-center rounded-md border border-richblack-600 bg-richblack-700 p-3 text-pink-200 transition-all hover:bg-richblack-900 hover:scale-95"
                  title="Remove from Wishlist"
                >
                  <RiDeleteBin6Line size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-14 flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold text-richblack-100">Your wishlist is empty</p>
          <p className="mt-2 text-richblack-300">Found a course you like? Save it here for later!</p>
        </div>
      )}
    </div>
  )
}