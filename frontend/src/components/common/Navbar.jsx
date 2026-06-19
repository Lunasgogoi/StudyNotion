import { useEffect, useState } from 'react'
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BsChevronDown } from "react-icons/bs"
import { AiOutlineHeart, AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai"

// Import your API connector to fetch categories
import { fetchCourseCategories } from '../../services/operations/courseDetailsAPI'

const Navbar = () => {
    const location = useLocation();
    const [subLinks, setSubLinks] = useState([]);

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim().length > 0) {
            // encodeURIComponent handles special characters and spaces safely
            const encodedQuery = encodeURIComponent(searchQuery.trim());
            navigate(`/search/${encodedQuery}`);
            setSearchQuery("");
        }
    }

    // Fetch Categories for the dropdown on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const result = await fetchCourseCategories();
            if (result) {
                setSubLinks(result);
            }
        }
        fetchCategories();
    }, [])

    const matchRoute = (route, options = {}) => {
        return matchPath({ path: route, ...options }, location.pathname)
    }

    return (
        <div className="flex h-14 items-center justify-center border-b border-richblack-700 bg-richblack-800 transition-all duration-200">
            <div className="grid h-full w-11/12 max-w-maxContent grid-cols-[1fr_auto_1fr] items-center">

                {/* LOGO */}
                <Link to="/" className="justify-self-start">
                    <h2 className="text-white text-2xl font-bold">StudyNotion</h2>
                </Link>

                {/* NAVIGATION LINKS */}
                <nav className="hidden justify-self-center md:flex md:items-center">
                    <ul className="flex items-center gap-x-6 text-richblack-25">

                        {/* Standard Link */}
                        <li className="flex items-center">
                            <Link to="/">
                                <p className={`${matchRoute("/") ? "text-yellow-25" : "text-richblack-25"}`}>Home</p>
                            </Link>
                        </li>

                        {/* ======================================= */}
                        {/* CATALOG DROPDOWN SECTION                */}
                        {/* ======================================= */}
                        <li className="relative flex cursor-pointer items-center gap-1 group">
                            <p className={`${matchRoute("/catalog/:categoryName", { end: false }) ? "text-yellow-25" : "text-richblack-25"}`}>
                                Catalog
                            </p>
                            <BsChevronDown className="text-sm text-richblack-25" />

                            {/* The Hover Menu */}
                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">

                                {/* The little triangle pointer at the top of the box */}
                                <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>

                                {/* Map over backend categories */}
                                {subLinks?.length ? (
                                    subLinks.map((subLink, i) => (
                                        <Link
                                            to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                            key={i}
                                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50 transition-all duration-200"
                                        >
                                            <p className="font-medium">{subLink.name}</p>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-4">No Categories Found</div>
                                )}
                            </div>
                        </li>
                        {/* ======================================= */}

                        {/* Search Bar in Nav */}
                        <li className="flex items-center">
                            <div className="relative">
                                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400 text-lg " />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="h-10 w-[290px] rounded-full border border-richblack-600 bg-richblack-700 py-2 pl-10 pr-4 text-sm text-richblack-100 transition-all duration-200 placeholder:text-richblack-400 focus:border-yellow-50 focus:bg-richblack-800 focus:outline-none"
                                />
                            </div>
                        </li>

                        {/* Contact Us Link */}
                        <li className="flex items-center">
                            <Link to="/contact">
                                <p className={`${matchRoute("/contact") ? "text-yellow-25" : "text-richblack-25"}`}>Contact Us</p>
                            </Link>
                        </li>

                    </ul>
                </nav>

                {/* RIGHT SIDE CONTAINER (Icons and Auth Buttons) */}
                <div className="flex items-center justify-self-end gap-x-4 md:gap-x-6">

                    {/* ----- SHOW WHEN LOGGED IN ----- */}
                    {token !== null && (
                        <div className="flex items-center gap-x-4">
                            {/* Wishlist Icon */}
                            <Link to="/dashboard/wishlist" className="relative">
                                <AiOutlineHeart className="text-2xl text-richblack-100 hover:text-white transition-all duration-200" />
                            </Link>

                            {/* Cart Icon */}
                            <Link to="/dashboard/cart" className="relative">
                                <AiOutlineShoppingCart className="text-2xl text-richblack-100 hover:text-white transition-all duration-200" />
                            </Link>

                            {/* Profile Avatar (Dashboard Link) */}
                            <Link to="/dashboard/my-profile">
                                <div className="flex items-center gap-x-1">
                                    <img
                                        src={user?.image ?? `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName ?? 'User'}`}
                                        alt={`profile-${user?.firstName ?? 'avatar'}`}
                                        className="aspect-square w-[30px] rounded-full object-cover border border-richblack-700"
                                    />
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* ----- SHOW WHEN LOGGED OUT ----- */}
                    {token === null && (
                        <div className="flex items-center gap-x-4">
                            <Link to="/login">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 text-sm hover:bg-richblack-700 transition-all duration-200">
                                    Log in
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 text-sm hover:bg-richblack-700 transition-all duration-200">
                                    Sign up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Navbar
