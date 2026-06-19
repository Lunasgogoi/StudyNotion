import React from 'react'
import Footer from '../components/common/Footer'
import ReviewSlider from '../components/common/ReviewSlider'
import ContactDetails from '../components/ContactPage/ContactDetails'
// Import the form directly, NOT the Section wrapper (this fixes the duplicate headings!)
import ContactUsForm from '../components/ContactPage/ContactUsForm' 

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row mb-20">
        
        {/* Left Side: Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Right Side: Contact Form Container */}
        <div className="lg:w-[60%] border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col shadow-[0px_0px_20px_0px_rgba(255,255,255,0.05)]">
            <h1 className="text-4xl leading-10 font-semibold text-richblack-5">
                Got a Idea? We've got the skills. Let's team up
            </h1>
            <p className="text-richblack-300 mt-2 mb-8">
                Tell us more about yourself and what you're got in mind.
            </p>
            
            {/* Render the Form Inputs right here */}
            <ContactUsForm />
            
        </div>
      </div>

      {/* Reviews Section */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      <Footer />
    </div>
  )
}

export default Contact