
// src/components/core/Dashboard/Sidebar.jsx

import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { VscSignOut, VscSettingsGear } from 'react-icons/vsc'
import SidebarLink from './SidebarLinks'

const Sidebar = () => {
    const { user, loading: profileLoading } = useSelector((state) => state.profile)
    const { loading: authLoading } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    if (profileLoading || authLoading) {
        return <div className="mt-10 flex justify-center text-white">Loading...</div>
    }

  return (
    <div className="flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10 h-[calc(100vh-3.5rem)]">
        
        <div className="flex flex-col">
            {sidebarLinks.map((link) => {
                // If the link has a specific user type requirement and it doesn't match the user, skip rendering it
                if (link.type && user?.accountType !== link.type) return null

                return (
                    <SidebarLink key={link.id} link={link} iconName={link.icon} />
                )
            })}
        </div>

        {/* Divider Line */}
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>

        {/* Bottom Actions (Settings & Logout) */}
        <div className="flex flex-col">
            <SidebarLink 
                link={{ name: "Settings", path: "/dashboard/settings" }} 
                iconName="VscSettingsGear" 
            />
            
            <button 
                onClick={() => {
                    // Native browser confirmation as a quick safeguard
                    if(window.confirm("Are you sure you want to log out?")) {
                        dispatch(logout(navigate))
                    }
                }}
                className="px-8 py-2 text-sm font-medium text-richblack-300 hover:bg-richblack-700 hover:text-richblack-25 transition-all duration-200 mt-2 text-left"
            >
                <div className="flex items-center gap-x-2">
                    <VscSignOut className="text-lg" />
                    <span>Logout</span>
                </div>
            </button>
        </div>
        
    </div>
  )
}

export default Sidebar
