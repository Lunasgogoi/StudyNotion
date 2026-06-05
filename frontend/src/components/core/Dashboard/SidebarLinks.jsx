// src/components/core/Dashboard/SidebarLink.jsx

import * as Icons from "react-icons/vsc"
import { useDispatch } from 'react-redux'
import { NavLink, matchPath, useLocation } from 'react-router-dom'

const SidebarLink = ({ link, iconName }) => {
    const Icon = Icons[iconName]
    const location = useLocation()
    // eslint-disable-next-line no-unused-vars
    const dispatch = useDispatch()

    // Check if the current route matches the link's path
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
    }

  return (
    <NavLink
        to={link.path}
        className={`relative px-8 py-2 text-sm font-medium transition-all duration-200 ${
            matchRoute(link.path) 
            ? "bg-yellow-800 text-yellow-50" 
            : "bg-opacity-0 text-richblack-300 hover:bg-richblack-700 hover:text-richblack-25"
        }`}
    >
        {/* Yellow Left Border for Active State */}
        <span
            className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
                matchRoute(link.path) ? "opacity-100" : "opacity-0"
            }`}
        ></span>
        
        <div className="flex items-center gap-x-2">
            <Icon className="text-lg" />
            <span>{link.name}</span>
        </div>
    </NavLink>
  )
}

export default SidebarLink