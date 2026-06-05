// src/components/core/HomePage/ExploreMore.jsx
import { useState, useEffect } from 'react'
//import { HomePageExplore } from '../../../data/homepage-explore'
import HighlightText from './HighlightText'
import CourseCard from './CourseCard'
import { fetchCourseCategories } from '../../../services/operations/courseDetailsAPI'

// const tabsName = [
//     "Free", "New to coding", "Most popular", "Skills paths", "Career paths"
// ]

const getRandomCourses = (courseList = [], limit = 3) => {
    return [...courseList]
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)
}

const ExploreMore = () => {
    // State to keep track of the active tab
    const [categories, setCategories] = useState([])
    const [currentTab, setCurrentTab] = useState("")
    const [courses, setCourses] = useState([])


    useEffect(() => {
        const getCategories = async () => {
            const res = await fetchCourseCategories();

            if (res?.length > 0) {
                setCategories(res); // Store full category objects
                setCurrentTab(res[0].name); // Set first tab as active
                setCourses(getRandomCourses(res[0].courses)); // Load up to 3 random courses
            }
        }
        getCategories();
    }, [])

    // Function to handle tab clicks
    const setMyCards = (categoryName) => {
        setCurrentTab(categoryName);

        // Find the category the user clicked on
        const selectedCategory = categories.find((category) => category.name === categoryName);

        // Update the courses array with up to 3 random courses from that category
        setCourses(getRandomCourses(selectedCategory?.courses));
    }

    return (
    <div className="relative w-full">
        {/* Headings */}
        <div className="text-4xl font-semibold text-center text-white">
            Unlock the <HighlightText text={"Power of Code"} />
        </div>
        <p className="text-center text-richblack-300 text-[16px] mt-3">
            Learn to Build Anything You Can Imagine
        </p>

        {/* Dynamic Tab Background Pill */}
        <div className="mt-5 flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100 px-1 py-1 w-fit mx-auto shadow-[0px_1.5px_rgba(255,255,255,0.25)] flex-wrap justify-center">
            
            {/* Map over our fetched categories instead of hardcoded names */}
            {categories.map((category, index) => {
                return (
                    <div
                        className={`text-[16px] flex flex-row items-center gap-2 
                        ${currentTab === category.name ? "bg-richblack-900 text-richblack-5 font-medium" : "text-richblack-200"} 
                        rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                        key={index}
                        onClick={() => setMyCards(category.name)}
                    >
                        {category.name}
                    </div>
                )
            })}
        </div>

        {/* Dynamic Course Cards Array */}
        <div className="mt-10 grid w-full grid-cols-1 gap-6 px-3 text-black sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:px-0">
            
            {courses?.length > 0 ? (
                courses.map((course, index) => (
                    // We need to map our backend course names to your CourseCard props!
                    <CourseCard 
                        key={index} 
                        cardData={{
                            heading: course?.courseName, 
                            description: course?.courseDescription,
                            level: course?.difficulty || "Beginner", // Assuming you have a difficulty field
                            lessonNumber: course?.courseContent?.length || 0 // Count the sections/lessons
                        }} 
                    />
                ))
            ) : (
                <div className="mx-auto rounded-md bg-richblack-800 p-4 text-xl text-white sm:col-span-2 lg:col-span-3">
                    No courses found for this category yet!
                </div>
            )}
            
        </div>
    </div>
  )
}

export default ExploreMore
