import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom' // <-- Cleaned up imports and added Link

// Import the service functions
import { fetchCourseCategories } from '../services/operations/courseDetailsAPI'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import GetAvgRating from '../utils/avgRating'
import RatingStars from "../components/common/RatingStars"

const Catalog = () => {
  const { categoryName } = useParams()
  const [activeTab, setActiveTab] = useState(1)
  const [categoryId, setCategoryId] = useState("")
  const [catalogPageData, setCatalogPageData] = useState(null)

  // 1. Fetch all categories and find the ID of the one in the URL
  useEffect(() => {
    const getCategories = async () => {
      const res = await fetchCourseCategories()

      // Find the category that matches the URL param (e.g., "web-development")
      const category_id = res?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === categoryName
      )[0]?._id

      setCategoryId(category_id)
    }
    getCategories()
  }, [categoryName])

  // 2. Once we have the Category ID, fetch the specific Catalog Page Data
  useEffect(() => {
    const getCategoryDetails = async () => {
      if (categoryId) {
        const res = await getCatalogPageData(categoryId)
        console.log("CATALOG PAGE DATA:", res)
        setCatalogPageData(res)
      }
    }
    getCategoryDetails()
  }, [categoryId])

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            Home / Catalog / <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name || categoryName}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading text-2xl font-bold text-richblack-5 lg:text-3xl">
          Courses to get you started
        </div>

        {/* Tabs */}
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 cursor-pointer ${activeTab === 1 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50"}`}
            onClick={() => setActiveTab(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 cursor-pointer ${activeTab === 2 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50"}`}
            onClick={() => setActiveTab(2)}
          >
            New
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {catalogPageData?.data?.selectedCategory?.courses?.length === 0 ? (
            <p className="text-xl text-richblack-200">No courses found for this category.</p>
          ) : (
            catalogPageData?.data?.selectedCategory?.courses?.map((course, index) => {

              // 🔥 Safely check for both spelling variations
              const reviewsArr = course?.ratingsAndReviews || []
              const ratingCount = reviewsArr.length
              const avgReviewCount = GetAvgRating(reviewsArr)

              return (
                /* 🔥 The Link tag is now wrapping the card, making the whole thing clickable 🔥 */
                <Link to={`/courses/${course._id}`} key={index}>
                  <div className="flex flex-col gap-2 cursor-pointer hover:scale-[1.02] transition-all duration-200">
                    <img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="h-[250px] w-full rounded-xl object-cover"
                    />
                    <p className="text-xl text-richblack-5 mt-2">{course?.courseName}</p>
                    <p className="text-sm text-richblack-50">
                      {course?.instructor?.firstName} {course?.instructor?.lastName}
                    </p>

                    {/* DYNAMIC RATING SECTION */}
                    <div className="flex items-center gap-2">
                      {ratingCount > 0 && (
                        <span className="text-yellow-5">{avgReviewCount}</span>
                      )}
                      <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
                      <span className="text-richblack-400">
                        {ratingCount > 0 ? `${ratingCount} Ratings` : "No ratings yet"}
                      </span>
                    </div>

                    <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Catalog
