// src/components/core/Auth/PrivateRoute.jsx
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
    // Grab the token from our Redux state
    const { token } = useSelector((state) => state.auth)

    // If the token exists, render the component they asked for (the children)
    if (token !== null) {
        return children
    } 
    // If there is no token, forcefully redirect them to the Login page
    else {
        return <Navigate to="/login" />
    }
}

export default PrivateRoute
