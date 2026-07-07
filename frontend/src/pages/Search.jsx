import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiSearch } from "react-icons/fi"
import { apiConnector } from '../services/apiConnector'
import { courseEndpoints } from '../services/apis' 
import CourseCard from '../components/core/HomePage/CourseCard'

const Search = () => {
  // Grab the query from the URL
  const { searchQuery } = useParams() 
  
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  // Decode the parameter to turn safe URL text back into readable text
  const decodedQuery = decodeURIComponent(searchQuery || "");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      try {
        const res = await apiConnector("POST", courseEndpoints.SEARCH_COURSES_API, {
          searchQuery: decodedQuery
        })
        
        if(res?.data?.success) {
           setSearchResults(res.data.data)
        }
      } catch (error) {
        console.error("Error fetching search results:", error)
      }
      setLoading(false)
    }

    if(decodedQuery) {
       fetchSearchResults()
    }
  }, [decodedQuery])

  return (
    <div className="mx-auto my-12 w-11/12 max-w-maxContent text-white">
      <div className="mb-8 flex flex-col gap-3 border-b border-richblack-700 pb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-richblack-300">
          Course search
        </p>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold text-richblack-5">
              Results for <span className="text-yellow-50">"{decodedQuery}"</span>
            </h1>
            <p className="mt-2 text-richblack-300">
              {loading ? "Finding matching courses..." : `${searchResults.length} course${searchResults.length === 1 ? "" : "s"} found`}
            </p>
          </div>

          {!loading && searchResults.length > 0 && (
            <div className="rounded-md border border-richblack-700 bg-richblack-800 px-4 py-2 text-sm text-richblack-200">
              Sorted by relevance
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-[390px] animate-pulse rounded-lg border border-richblack-700 bg-richblack-800">
              <div className="aspect-video rounded-t-lg bg-richblack-700" />
              <div className="space-y-4 p-5">
                <div className="h-5 w-3/4 rounded bg-richblack-700" />
                <div className="h-4 w-full rounded bg-richblack-700" />
                <div className="h-4 w-2/3 rounded bg-richblack-700" />
                <div className="h-8 w-1/2 rounded bg-richblack-700" />
              </div>
            </div>
          ))}
        </div>
      ) : searchResults?.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-richblack-700 bg-richblack-800 px-6 text-center">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-full border border-richblack-600 bg-richblack-700 text-richblack-200">
            <FiSearch size={24} />
          </div>
          <p className="text-2xl font-semibold text-richblack-5">No courses found</p>
          <p className="mt-2 max-w-md text-richblack-300">
            Try a broader keyword, check spelling, or search by a technology like React, Python, or design.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {searchResults?.map((course) => (
            // Ensure we use the database _id as the key to prevent rendering glitches
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Search
