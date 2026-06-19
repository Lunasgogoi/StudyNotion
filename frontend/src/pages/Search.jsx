import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
    <div className="mx-auto mt-20 mb-20 w-11/12 max-w-maxContent text-white">
      <h1 className="mb-8 text-3xl font-semibold">
        Search Results for: <span className="text-yellow-50">{decodedQuery}</span>
      </h1>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center text-xl text-richblack-200">
            Loading...
        </div>
      ) : searchResults?.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center text-xl text-richblack-200">
          <p>No courses found matching your criteria.</p>
          <p className="mt-2 text-sm">Try a different keyword!</p>
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