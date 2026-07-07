import { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { VscAdd, VscBook, VscGraph, VscOrganization, VscTrash } from "react-icons/vsc"
import {
  createAdminCourse,
  createAdminUser,
  deleteAdminCourse,
  deleteAdminUser,
  fetchAdminCourses,
  fetchAdminSummary,
  fetchAdminUsers,
} from "../../../../services/operations/adminAPI"
import { fetchCourseCategories } from "../../../../services/operations/courseDetailsAPI"

const emptyUserForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  accountType: "User",
  contactNumber: "",
}

const emptyCourseForm = {
  courseName: "",
  courseDescription: "",
  whatYouWillLearn: "",
  coursePrice: "",
  courseTags: "",
  instructions: "",
  category: "",
  instructorId: "",
  thumbnailImage: null,
}

const inputClass = "w-full rounded-md border border-richblack-700 bg-richblack-900 px-3 py-2 text-sm text-richblack-5 outline-none focus:border-yellow-50"
const labelClass = "flex flex-col gap-1 text-sm text-richblack-200"
const panelClass = "rounded-md border border-richblack-700 bg-richblack-800 p-5"

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth)
  const [summary, setSummary] = useState(null)
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [userForm, setUserForm] = useState(emptyUserForm)
  const [courseForm, setCourseForm] = useState(emptyCourseForm)

  const instructors = useMemo(
    () => users.filter((user) => user.accountType === "Instructor"),
    [users]
  )

  const loadAdminData = useCallback(async () => {
    setLoading(true)
    const [summaryData, userData, courseData, categoryData] = await Promise.all([
      fetchAdminSummary(token),
      fetchAdminUsers(token),
      fetchAdminCourses(token),
      fetchCourseCategories(),
    ])

    if (summaryData) setSummary(summaryData)
    setUsers(userData)
    setCourses(courseData)
    setCategories(categoryData)
    setLoading(false)
  }, [token])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        loadAdminData()
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [loadAdminData, token])

  const handleUserFormChange = (event) => {
    const { name, value } = event.target
    setUserForm((current) => ({ ...current, [name]: value }))
  }

  const handleCourseFormChange = (event) => {
    const { name, value, files } = event.target
    setCourseForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }))
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()
    const createdUser = await createAdminUser(userForm, token)
    if (createdUser) {
      setUserForm(emptyUserForm)
      await loadAdminData()
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user and related data?")) return
    const deleted = await deleteAdminUser(userId, token)
    if (deleted) {
      await loadAdminData()
    }
  }

  const handleCreateCourse = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    Object.entries(courseForm).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, value)
      }
    })

    const createdCourse = await createAdminCourse(formData, token)
    if (createdCourse) {
      setCourseForm(emptyCourseForm)
      event.target.reset()
      await loadAdminData()
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course, its sections, lectures and enrollments?")) return
    const deleted = await deleteAdminCourse(courseId, token)
    if (deleted) {
      await loadAdminData()
    }
  }

  const statCards = [
    { label: "Users", value: summary?.totalUsers || 0, icon: VscOrganization },
    { label: "Students", value: summary?.totalStudents || 0, icon: VscOrganization },
    { label: "Instructors", value: summary?.totalInstructors || 0, icon: VscOrganization },
    { label: "Courses", value: summary?.totalCourses || 0, icon: VscBook },
    { label: "Revenue", value: `Rs. ${summary?.totalRevenue || 0}`, icon: VscGraph },
  ]

  return (
    <div className="flex flex-col gap-8 text-richblack-5">
      <div>
        <h1 className="text-3xl font-medium">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-richblack-300">
          Manage platform users, instructors, courses and operating metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className={panelClass}>
            <div className="flex items-center justify-between text-richblack-200">
              <span className="text-sm">{label}</span>
              <Icon className="text-xl text-yellow-50" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-richblack-5">{value}</p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="rounded-md border border-richblack-700 bg-richblack-800 p-4 text-sm text-richblack-200">
          Loading admin data...
        </div>
      )}

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Users</h2>
            <p className="text-sm text-richblack-300">Create students or instructors and remove non-admin accounts.</p>
          </div>
          <VscAdd className="text-2xl text-yellow-50" />
        </div>

        <form onSubmit={handleCreateUser} className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className={labelClass}>
            First name
            <input required name="firstName" value={userForm.firstName} onChange={handleUserFormChange} className={inputClass} />
          </label>
          <label className={labelClass}>
            Last name
            <input required name="lastName" value={userForm.lastName} onChange={handleUserFormChange} className={inputClass} />
          </label>
          <label className={labelClass}>
            Email
            <input required type="email" name="email" value={userForm.email} onChange={handleUserFormChange} className={inputClass} />
          </label>
          <label className={labelClass}>
            Password
            <input required type="password" name="password" value={userForm.password} onChange={handleUserFormChange} className={inputClass} />
          </label>
          <label className={labelClass}>
            Role
            <select name="accountType" value={userForm.accountType} onChange={handleUserFormChange} className={inputClass}>
              <option value="User">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
          </label>
          <label className={labelClass}>
            Contact
            <input name="contactNumber" value={userForm.contactNumber} onChange={handleUserFormChange} className={inputClass} />
          </label>
          <button type="submit" className="md:col-span-3 rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900">
            Add User
          </button>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-richblack-700 text-richblack-300">
              <tr>
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Courses</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-richblack-700 text-richblack-100">
                  <td className="py-3">{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.accountType === "User" ? "Student" : user.accountType}</td>
                  <td>{user.courses?.length || 0}</td>
                  <td className="text-right">
                    <button
                      disabled={user.accountType === "Admin"}
                      onClick={() => handleDeleteUser(user._id)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-pink-200 hover:bg-richblack-700 disabled:cursor-not-allowed disabled:text-richblack-500"
                    >
                      <VscTrash /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={panelClass}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Courses</h2>
            <p className="text-sm text-richblack-300">Create courses for instructors and remove courses from the platform.</p>
          </div>
          <VscBook className="text-2xl text-yellow-50" />
        </div>

        <form onSubmit={handleCreateCourse} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className={labelClass}>
            Course name
            <input required name="courseName" value={courseForm.courseName} onChange={handleCourseFormChange} className={inputClass} />
          </label>
          <label className={labelClass}>
            Price
            <input required type="number" min="0" name="coursePrice" value={courseForm.coursePrice} onChange={handleCourseFormChange} className={inputClass} />
          </label>
          <label className={labelClass}>
            Instructor
            <select required name="instructorId" value={courseForm.instructorId} onChange={handleCourseFormChange} className={inputClass}>
              <option value="">Select instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.firstName} {instructor.lastName}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Category
            <select required name="category" value={courseForm.category} onChange={handleCourseFormChange} className={inputClass}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Short description
            <textarea required name="courseDescription" value={courseForm.courseDescription} onChange={handleCourseFormChange} className={inputClass} rows={2} />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            What students will learn
            <textarea required name="whatYouWillLearn" value={courseForm.whatYouWillLearn} onChange={handleCourseFormChange} className={inputClass} rows={2} />
          </label>
          <label className={labelClass}>
            Tags
            <input required name="courseTags" value={courseForm.courseTags} onChange={handleCourseFormChange} placeholder="react, frontend, javascript" className={inputClass} />
          </label>
          <label className={labelClass}>
            Instructions
            <input name="instructions" value={courseForm.instructions} onChange={handleCourseFormChange} placeholder="Laptop, internet" className={inputClass} />
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Thumbnail
            <input required type="file" accept="image/*" name="thumbnailImage" onChange={handleCourseFormChange} className={inputClass} />
          </label>
          <button type="submit" className="md:col-span-2 rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900">
            Add Course
          </button>
        </form>

        <div className="mt-6 grid grid-cols-1 gap-4">
          {courses.map((course) => (
            <div key={course._id} className="flex flex-col gap-4 rounded-md border border-richblack-700 bg-richblack-900 p-4 md:flex-row md:items-center">
              <img src={course.thumbnail} alt={course.courseName} className="h-24 w-full rounded-md object-cover md:w-36" />
              <div className="flex-1">
                <p className="font-semibold text-richblack-5">{course.courseName}</p>
                <p className="mt-1 text-sm text-richblack-300">
                  {course.instructor?.firstName} {course.instructor?.lastName} · {course.category?.name || "No category"}
                </p>
                <p className="mt-1 text-sm text-yellow-50">Rs. {course.price}</p>
              </div>
              <button
                onClick={() => handleDeleteCourse(course._id)}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-pink-200 px-3 py-2 text-sm text-pink-200 hover:bg-richblack-700"
              >
                <VscTrash /> Remove
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
