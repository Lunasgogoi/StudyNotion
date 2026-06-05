import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id)
    console.log("Bought these courses:", courses)
    // TODO: Integrate Razorpay Payment Gateway here
  }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-50">Rs. {total}</p>
      
      <button
        onClick={handleBuyCourse}
        className="w-full justify-center cursor-pointer rounded-md bg-yellow-50 py-3 px-5 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
      >
        Buy Now
      </button>
    </div>
  )
}