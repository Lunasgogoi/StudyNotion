import { useEffect, useMemo, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { FiClock, FiShield, FiShoppingCart } from "react-icons/fi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"

import { buyCourse } from "../services/operations/studentFeaturesAPI"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai" 
import { addToCart } from "../slices/cartSlice"
import { addToWishlist, removeFromWishlist } from "../slices/wishlistSlice"

import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import GetAvgRating from "../utils/avgRating"
import GetTotalDuration from "../utils/timeDurationFormatter" 
import RatingStars from "../components/common/RatingStars"

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { cart } = useSelector((state) => state.cart) 
  const { wishlist } = useSelector((state) => state.wishlist) 
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { courseId } = useParams()

  const [response, setResponse] = useState(null)
  
  // FIX 2: State to manage which accordion sections are open
  const [isActive, setIsActive] = useState([])

  // 1. Fetch Course Details
  useEffect(() => {
    const getCourseSpecificDetails = async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch {
        console.log("Could not fetch Course Details")
      }
    }
    getCourseSpecificDetails()
  }, [courseId])

  // 2. Calculate Dynamic Ratings and Duration using useMemo
  const { avgReviewCount, totalDuration } = useMemo(() => {
    if (response?.data) {
      const courseDetails = response.data
      // FIX 3: Calculate Average Rating (You did this perfectly!)
      const count = GetAvgRating(courseDetails.ratingsAndReviews)
      const duration = GetTotalDuration(courseDetails.courseContent)

      return { avgReviewCount: count, totalDuration: duration }
    }
    return { avgReviewCount: 0, totalDuration: "" }
  }, [response])

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    toast.error("Please log in to purchase the course")
    navigate("/login")
  }

  // FIX 2: Handlers for the Accordion Dropdowns
  const handleActive = (id) => {
    // If it's already open, remove it from the array. Otherwise, add it.
    setIsActive(
      isActive.includes(id)
        ? isActive.filter((e) => e !== id)
        : isActive.concat([id])
    )
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
    _id: course_id,
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
  const isEnrolled = studentsEnrolled?.includes(user?._id)
  const isInCart = cart.some((item) => item._id === course_id)
  const isWishlisted = wishlist.some((item) => item._id === course_id)

  const purchaseActions = (
    <div className="flex flex-col gap-3">
      {isEnrolled ? (
        <button
          className="rounded-md bg-yellow-50 px-6 py-3.5 font-semibold text-richblack-900 transition-all hover:bg-yellow-100"
          onClick={() => navigate("/dashboard/enrolled-courses")}
        >
          Go to Course
        </button>
      ) : (
        <>
          <button
            className="rounded-md bg-yellow-50 px-6 py-3.5 font-semibold text-richblack-900 shadow-[0_10px_24px_rgba(255,249,112,0.18)] transition-all hover:bg-yellow-100"
            onClick={handleBuyCourse}
          >
            Buy Now
          </button>

          {isInCart ? (
            <button
              onClick={() => navigate("/dashboard/cart")}
              className="flex items-center justify-center gap-2 rounded-md border border-richblack-600 bg-richblack-900 px-6 py-3.5 font-semibold text-richblack-5 transition-all hover:border-richblack-400 hover:bg-richblack-800"
            >
              <FiShoppingCart />
              Go to Cart
            </button>
          ) : (
            <button
              onClick={() => dispatch(addToCart(response.data))}
              className="flex items-center justify-center gap-2 rounded-md border border-richblack-600 bg-richblack-900 px-6 py-3.5 font-semibold text-richblack-5 transition-all hover:border-richblack-400 hover:bg-richblack-800"
            >
              <FiShoppingCart />
              Add to Cart
            </button>
          )}
        </>
      )}

      {!isEnrolled && (
        isWishlisted ? (
          <button
            onClick={() => dispatch(removeFromWishlist(course_id))}
            className="flex items-center justify-center gap-2 rounded-md border border-pink-700 bg-pink-500/10 py-3 text-pink-200 transition-all hover:bg-pink-500/15"
          >
            <AiFillHeart size={20} className="text-pink-200" />
            Remove from Wishlist
          </button>
        ) : (
          <button
            onClick={() => dispatch(addToWishlist(response.data))}
            className="flex items-center justify-center gap-2 rounded-md border border-richblack-600 bg-richblack-700/40 py-3 text-richblack-100 transition-all hover:border-richblack-500 hover:text-richblack-5"
          >
            <AiOutlineHeart size={20} />
            Add to Wishlist
          </button>
        )
      )}
    </div>
  )

  const purchaseCard = (
    <div className="overflow-hidden rounded-lg border border-richblack-600 bg-richblack-800 text-richblack-5 shadow-[0_18px_55px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-video overflow-hidden bg-richblack-700">
        <img
          src={thumbnail}
          alt={courseName}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-richblack-900/75 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-richblack-300">Course price</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-richblack-5">Rs. {price}</p>
          </div>
          <div className="rounded-md border border-yellow-50/30 bg-yellow-50/10 px-3 py-1.5 text-sm font-medium text-yellow-25">
            Best value
          </div>
        </div>

        <div className="mt-5">
          {purchaseActions}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-richblack-700 pt-5 text-sm text-richblack-200 sm:grid-cols-2 lg:grid-cols-1">
          <p className="flex items-center gap-2">
            <FiShield className="text-yellow-25" />
            30-Day Money-Back Guarantee
          </p>
          <p className="flex items-center gap-2">
            <FiClock className="text-yellow-25" />
            Learn at your own pace
          </p>
        </div>
      </div>
    </div>
  )

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
                {ratingsAndReviews?.length > 0 && (
                  <span className="text-yellow-25">{avgReviewCount}</span>
                )}
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>
                  {ratingsAndReviews?.length > 0
                    ? `(${ratingsAndReviews.length} reviews)`
                    : "No reviews yet"}
                </span>
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
      <div className="right-[1rem] top-[84px] mx-auto hidden w-1/3 max-w-[410px] lg:absolute lg:block">
        {purchaseCard}
      </div>

      <div className="mx-auto mt-8 w-11/12 max-w-maxContentTab lg:hidden">
        {purchaseCard}
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
                <div className="flex gap-2 text-richblack-50">
                  <span>{courseContent?.length || 0} section(s)</span>
                  <span>
                    {courseContent?.reduce((acc, sec) => acc + sec?.subSection?.length, 0)} lecture(s)
                  </span>
                  <span>{totalDuration} total length</span>
                </div>
                <div>
                    {/* FIX 2: Collapse All Button now empties the array! */}
                    <button 
                      onClick={() => setIsActive([])}
                      className="text-yellow-25 hover:underline"
                    >
                      Collapse all sections
                    </button>
                </div>
              </div>
            </div>

            {/* FIX 2: Custom Controlled Accordion Mapping */}
            <div className="py-4">
              {courseContent?.map((section, index) => (
                <div key={index} className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
                  
                  {/* Accordion Header */}
                  <div 
                    onClick={() => handleActive(section._id)}
                    className="flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s] hover:bg-richblack-600"
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{section?.sectionName}</p>
                    </div>
                    <div className="flex items-center gap-3 text-yellow-25">
                      <span className="text-[12px]">{section?.subSection?.length || 0} lecture(s)</span>
                    </div>
                  </div>
                  
                  {/* Accordion Body (Only renders if section._id is inside the isActive array) */}
                  <div className={`bg-richblack-900 transition-[height] duration-500 ease-in-out ${isActive.includes(section._id) ? "block" : "hidden"}`}>
                    <div className="px-7 py-4 font-semibold">
                      {section?.subSection?.map((lecture, i) => (
                          <div key={i} className="flex justify-between py-2 border-b border-b-richblack-600 last:border-none">
                              <p className="flex items-center gap-2 text-richblack-50">
                                  <span>▶</span> {lecture?.title}
                              </p>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails
