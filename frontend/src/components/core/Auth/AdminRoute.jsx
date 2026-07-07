import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.profile)

  if (user !== null && user?.accountType === "Admin") {
    return children
  }

  return <Navigate to="/dashboard/my-profile" />
}

export default AdminRoute
