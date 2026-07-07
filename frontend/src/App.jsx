import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import OpenRoute from "./components/core/Auth/OpenRoute";
import InstructorRoute from "./components/core/Auth/InstructorRoute";
import AdminRoute from "./components/core/Auth/AdminRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import AddCourse from "./components/core/Dashboard/AddCourse/index";
import MyCourses from "./components/core/Dashboard/MyCourses";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import Instructor from "./components/core/Dashboard/InstructoDashBoard/Instructor";
import Wishlist from "./components/core/Dashboard/Wishlist";
//import { Chart } from "chart.js"
import EditCourse from "./components/core/Dashboard/EditCourse"; // Don't forget to import this!
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Search from "./pages/Search";
import AdminDashboard from "./components/core/Dashboard/Admin/AdminDashboard";


function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">

      <Navbar />

      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<OpenRoute> <Login /> </OpenRoute>} />
        <Route path="/signup" element={<OpenRoute> <Signup /> </OpenRoute>} />
        <Route path="/verify-email" element={<OpenRoute> <VerifyEmail /> </OpenRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="catalog/:categoryName" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/search/:searchQuery" element={<Search />} />

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {/* We will build the VideoDetails component next! */}
          <Route
            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
        </Route>

        {/* Dashboard Routes (Everything inside here gets the Sidebar) */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="/dashboard/cart" element={<Cart />} />
          <Route path="/dashboard/wishlist" element={<Wishlist />} />

          <Route
            path="/dashboard/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Instructor Only Routes */}
          <Route
            path="/dashboard/instructor"
            element={
              <InstructorRoute>
                <Instructor />
              </InstructorRoute>
            }
          />
          <Route
            path="/dashboard/my-courses"
            element={
              <InstructorRoute>
                <MyCourses />
              </InstructorRoute>
            }
          />
          <Route
            path="/dashboard/edit-course/:courseId"
            element={
              <InstructorRoute>
                <EditCourse />
              </InstructorRoute>
            }
          />
          <Route
            path="/dashboard/add-course"
            element={
              <InstructorRoute>
                <AddCourse />
              </InstructorRoute>
            }
          />
        </Route>

      </Routes>
    </div>
  );
}

export default App;
