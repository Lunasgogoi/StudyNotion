import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import CourseCard from "../components/core/HomePage/CourseCard"
import { fetchCourseCategories } from "../services/operations/courseDetailsAPI"
import { getCatalogPageData } from "../services/operations/pageAndComponentData"

const Catalog = () => {
  const { categoryName } = useParams()
  const [activeTab, setActiveTab] = useState(1)
  const [categoryId, setCategoryId] = useState("")
  const [catalogPageData, setCatalogPageData] = useState(null)

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetchCourseCategories()
      const category_id = res?.find(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === categoryName
      )?._id

      setCategoryId(category_id)
    }

    getCategories()
  }, [categoryName])

  useEffect(() => {
    const getCategoryDetails = async () => {
      if (categoryId) {
        const res = await getCatalogPageData(categoryId)
        setCatalogPageData(res)
      }
    }

    getCategoryDetails()
  }, [categoryId])

  const selectedCategory = catalogPageData?.data?.selectedCategory
  const visibleCourses = useMemo(() => {
    const courses = [...(selectedCategory?.courses || [])]

    if (activeTab === 2) {
      return courses.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    }

    return courses.sort(
      (a, b) => (b?.studentsEnrolled?.length || 0) - (a?.studentsEnrolled?.length || 0)
    )
  }, [activeTab, selectedCategory?.courses])

  return (
    <div className="text-white">
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            Home / Catalog /{" "}
            <span className="text-yellow-25">
              {selectedCategory?.name || categoryName}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {selectedCategory?.description}
          </p>
        </div>
      </div>

      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <div className="section_heading text-2xl font-bold text-richblack-5 lg:text-3xl">
              Courses to get you started
            </div>
            <p className="mt-2 text-richblack-300">
              {visibleCourses.length} course{visibleCourses.length === 1 ? "" : "s"} available in this catalog
            </p>
          </div>
        </div>

        <div className="my-5 flex border-b border-b-richblack-600 text-sm">
          <button
            type="button"
            className={`px-4 py-2 transition-colors ${activeTab === 1 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50 hover:text-richblack-5"}`}
            onClick={() => setActiveTab(1)}
          >
            Most Popular
          </button>
          <button
            type="button"
            className={`px-4 py-2 transition-colors ${activeTab === 2 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50 hover:text-richblack-5"}`}
            onClick={() => setActiveTab(2)}
          >
            New
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {visibleCourses.length === 0 ? (
            <div className="col-span-full flex min-h-[220px] items-center justify-center rounded-lg border border-richblack-700 bg-richblack-800 px-6 text-center text-xl text-richblack-200">
              No courses found for this category.
            </div>
          ) : (
            visibleCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Catalog
