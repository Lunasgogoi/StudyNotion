// src/data/dashboard-links.js
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: "Instructor",
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: "Instructor",
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: "Instructor",
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: "User", // <-- Changed to match your current account type
    icon: "VscMortarBoard",
  },
  {
    id: 6,
    name: "Wishlist",
    path: "/dashboard/wishlist",
    type: "User", // <-- Added Wishlist back and changed to User
    icon: "VscHeart",
  },
  {
    id: 7,
    name: "Cart",
    path: "/dashboard/cart",
    type: "User", // <-- Changed to match your current account type
    icon: "VscArchive",
  },
  {
    id: 8,
    name: "About Us",
    path: "/about",
    icon: "VscInfo",
  },
];