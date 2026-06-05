// src/components/core/Auth/InstructorRoute.jsx
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const InstructorRoute = ({ children }) => {
    // Grab the user data from our Redux profile slice
    const { user } = useSelector((state) => state.profile)

    // If they exist AND they are an Instructor, let them in!
    if (user !== null && user?.accountType === "Instructor") {
        return children
    } 
    // Otherwise, kick them back to the general dashboard
    else {
        return <Navigate to="/dashboard/my-profile" />
    }
}

export default InstructorRoute
