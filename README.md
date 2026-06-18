# 🎓 StudyNotion - EdTech Learning Platform

StudyNotion is a fully functional EdTech platform that enables users to create, consume, and rate educational content. Built with the MERN stack, it features distinct role-based dashboards, secure payment integrations, and a seamless video learning environment.

## 🚀 Live Demo
*(Insert your deployed frontend link here, e.g., https://studynotion-lunas.vercel.app)*

## ✨ Key Features

### For Students
* **Seamless Video Learning:** Custom-built native HTML5 video player with continuous playback, section navigation, and persistent progress tracking.
* **Shopping Cart & Wishlist:** Redux-powered state management for saving courses, ensuring data persists across sessions.
* **Secure Checkout:** Integrated Razorpay payment gateway with server-side signature verification for safe course enrollment.
* **Course Reviews:** Interactive, custom-built star rating system allowing students to leave detailed feedback on completed courses.
* **Dynamic Dashboards:** Real-time progress bars and dynamic course duration calculations based on enrolled content.

### For Instructors
* **Course Creation:** Upload course thumbnails and video lectures directly via Cloudinary integration.
* **Content Management:** Organize courses into structured sections and sub-sections (lectures).
* **Instructor Dashboard:** View metrics on student enrollments and total revenue generated.

### Architecture & Security
* **Role-Based Access Control (RBAC):** Secure routing and protected endpoints for `Student`, `Instructor`, and `Admin` account types.
* **Authentication:** JWT-based authentication with secure, HTTP-only cookie parsing.
* **Media Management:** Cloudinary integration for optimized image and video delivery.

## 🛠️ Tech Stack

**Frontend**
* React.js (v19 compatible)
* Redux Toolkit (State Management)
* Tailwind CSS (Styling)
* React Router DOM (Routing)
* React Hook Form (Form handling)

**Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Database & ORM)
* JSON Web Tokens (JWT) & Bcrypt (Security)
* Razorpay API (Payments)
* Cloudinary API (Media Hosting)

## 💻 Getting Started

### Prerequisites
* Node.js installed on your machine
* A MongoDB URI (Atlas or local)
* Cloudinary and Razorpay accounts for API keys

### Installation

**1. Clone the repository:**
```bash
git clone [https://github.com/yourusername/studynotion.git](https://github.com/yourusername/studynotion.git)
cd studynotion
```

**2. Setup the backend:**
```bash
cd server
npm install

```
  Create a .env file in the server directory with the following variables:
```bash
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

**3. Setup the Frontend:**

Open a new terminal window:

```bash

cd frontend
npm install
```

Create a .env file in the frontend directory:

```bash
REACT_APP_BASE_URL=http://localhost:4000/api/v1
```

Start the React development server:

```bash
npm start
```

## 📂 Folder Structure Highlights

* /server/controllers - Contains business logic for course progress, payments, and authentication.

* /server/models - Mongoose schemas defining Users, Courses, Sections, and Reviews.

* /frontend/src/slices - Redux slices managing global state for the Cart, Wishlist, and Video Player tracking.

* /frontend/src/components/core/ViewCourse - The core learning environment containing the sidebar navigation and native video player.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

Built by Lunas Gogoi - B.Tech CSE @ NIT_SILCHAR
