// src/components/core/Auth/OpenRoute.jsx
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const OpenRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth)

    // If they have no token, let them see the Login/Signup page
    if (token === null) {
        return children
    } 
    // If they are already logged in, kick them to the dashboard!
    else {
        return <Navigate to="/dashboard/my-profile" />
    }
}

export default OpenRoute
