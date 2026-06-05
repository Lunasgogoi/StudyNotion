import { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai" // Added heart icons
import { addToCart } from "../slices/cartSlice"
import { addToWishlist, removeFromWishlist } from "../slices/wishlistSlice"

import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import GetAvgRating from "../utils/avgRating"
import GetTotalDuration from "../utils/timeDurationFormatter" // The utility we made earlier!
import RatingStars from "../components/common/RatingStars"

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { cart } = useSelector((state) => state.cart) // <-- Add this
  const { wishlist } = useSelector((state) => state.wishlist) // <-- Add this
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { courseId } = useParams()

  const [response, setResponse] = useState(null)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [totalDuration, setTotalDuration] = useState("")

  // 1. Fetch Course Details
  useEffect(() => {
    const getCourseSpecificDetails = async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    }
    getCourseSpecificDetails()
  }, [courseId])

  // 2. Calculate Dynamic Ratings and Duration when data arrives
  useEffect(() => {
    if (response?.data?.courseDetails) {
      const courseDetails = response.data;
      // Calculate Average Rating
      const count = GetAvgRating(courseDetails.ratingsAndReviews)
      setAvgReviewCount(count)

      // Calculate Total Duration
      const duration = GetTotalDuration(courseDetails.courseContent)
      setTotalDuration(duration)
    }
  }, [response])

  const handleBuyCourse = () => {
    if (token) {
      // TODO: Integrate Razorpay Payment Gateway here later!
      toast.success("Payment Gateway integration coming soon!")
      return
    }
    // If not logged in, force them to login first
    toast.error("Please login to buy a course")
    navigate("/login")
  }

  // Show a loading screen while fetching data
  if (!response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner">Loading...</div>
      </div>
    )
  }

 const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingsAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response.data

  return (
    <div className="flex flex-col bg-richblack-900 text-white relative">
      
      {/* ===================== HERO SECTION ===================== */}
      <div className="bg-richblack-800">
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            
            {/* Mobile Thumbnail (Hidden on Desktop) */}
            <div className="relative block max-h-[30rem] lg:hidden">
              <img src={thumbnail} alt="course img" className="aspect-auto w-full rounded-2xl" />
            </div>
            
            <div className="z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5">
              <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">{courseName}</p>
              <p className="text-richblack-200">{courseDescription}</p>
              
              {/* DYNAMIC RATINGS SECTION */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount === 0 ? "N/A" : avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>({ratingsAndReviews?.length || 0} reviews)</span>
                <span>{studentsEnrolled?.length || 0} students enrolled</span>
              </div>
              
              <div>
                <p>Created By {instructor?.firstName} {instructor?.lastName}</p>
              </div>
              
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {new Date(createdAt).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== FLOATING BUY CARD ===================== */}
      {/* ===================== FLOATING BUY CARD ===================== */}
      <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
        <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
          <img src={thumbnail} alt="thumbnail" className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full" />
          
          <div className="px-4">
            <div className="space-x-3 pb-4 text-3xl font-semibold">
              Rs. {price}
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Buy Now Button */}
              <button 
                className="rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all hover:scale-95" 
                onClick={handleBuyCourse}
              >
                Buy Now
              </button>
              
              {/* Dynamic Add / Go to Cart Button */}
              {cart.some((item) => item._id === response.data._id) ? (
                <button 
                  onClick={() => navigate("/dashboard/cart")}
                  className="rounded-md bg-richblack-800 px-6 py-3 font-semibold text-richblack-5 border border-richblack-700 transition-all hover:scale-95 hover:bg-richblack-900" 
                >
                  Go to Cart
                </button>
              ) : (
                <button 
                  onClick={() => dispatch(addToCart(response.data))}
                  className="rounded-md bg-richblack-800 px-6 py-3 font-semibold text-richblack-5 border border-richblack-700 transition-all hover:scale-95 hover:bg-richblack-900" 
                >
                  Add to Cart
                </button>
              )}

              {/* Dynamic Wishlist Button Toggle */}
              {wishlist.some((item) => item._id === response.data._id) ? (
                <button
                  onClick={() => dispatch(removeFromWishlist(response.data._id))}
                  className="flex items-center justify-center gap-2 rounded-md border border-pink-700 bg-transparent py-3 text-pink-200 transition-all hover:scale-95"
                >
                  <AiFillHeart size={20} className="text-pink-200" />
                  Remove from Wishlist
                </button>
              ) : (
                <button
                  onClick={() => dispatch(addToWishlist(response.data))}
                  className="flex items-center justify-center gap-2 rounded-md border border-richblack-600 bg-transparent py-3 text-richblack-100 transition-all hover:scale-95 hover:text-richblack-5"
                >
                  <AiOutlineHeart size={20} />
                  Add to Wishlist
                </button>
              )}
            </div>
            
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>
        </div>
      </div>

      {/* ===================== MAIN CONTENT (LEFT SIDE) ===================== */}
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          
          {/* What You'll Learn */}
          <div className="my-8 border border-richblack-700 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5 text-richblack-50">
              {whatYouWillLearn}
            </div>
          </div>

          {/* Course Content Accordion */}
          <div className="max-w-[830px] mb-12">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>{courseContent?.length || 0} section(s)</span>
                  <span>
                    {courseContent?.reduce((acc, sec) => acc + sec?.subSection?.length, 0)} lecture(s)
                  </span>
                  <span>{totalDuration} total length</span>
                </div>
                <div>
                    <button className="text-yellow-25">Collapse all sections</button>
                </div>
              </div>
            </div>

            {/* Accordion Mapping */}
            <div className="py-4">
              {courseContent?.map((section, index) => (
                <details key={index} className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
                  <summary className="flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{section?.sectionName}</p>
                    </div>
                    <div className="flex items-center gap-3 text-yellow-25">
                      <span className="text-[12px]">{section?.subSection?.length || 0} lecture(s)</span>
                    </div>
                  </summary>
                  
                  {/* Lectures inside the section */}
                  <div className="bg-richblack-900 px-7 py-4 font-semibold">
                    {section?.subSection?.map((lecture, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-b-richblack-600 last:border-none">
                            <p className="flex items-center gap-2 text-richblack-50">
                                <span>▶</span> {lecture?.title}
                            </p>
                        </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails
