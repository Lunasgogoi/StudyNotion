// src/pages/Login.jsx
// import React from 'react'
import Template from '../components/core/Auth/Template'

// Using a placeholder image until you add your own assets!
const loginImg = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

const Login = () => {
  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={loginImg}
      formType="login"
    />
  )
}

export default Login;