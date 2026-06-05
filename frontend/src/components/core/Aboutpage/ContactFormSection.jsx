// src/components/core/AboutPage/ContactFormSection.jsx
///import React from 'react'

const ContactFormSection = () => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-4 mb-32">
        <h1 className="text-center text-4xl font-semibold text-richblack-5">
            Get in Touch
        </h1>
        <p className="text-center text-richblack-300 mt-2">
            We'd love to here for you, Please fill out this form.
        </p>

        <form className="flex flex-col gap-7 mt-10 w-full md:w-125">
            {/* First & Last Name */}
            <div className="flex flex-col md:flex-row gap-5">
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="firstname" className="text-[14px] text-richblack-5">First Name</label>
                    <input type="text" name="firstname" id="firstname" placeholder="Enter first name" 
                        className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-3 border-b border-richblack-300 focus:outline-none" 
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="lastname" className="text-[14px] text-richblack-5">Last Name</label>
                    <input type="text" name="lastname" id="lastname" placeholder="Enter last name" 
                        className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-3 border-b border-richblack-300 focus:outline-none" 
                    />
                </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[14px] text-richblack-5">Email Address</label>
                <input type="email" name="email" id="email" placeholder="Enter email address" 
                    className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-3 border-b border-richblack-300 focus:outline-none" 
                />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
                <label htmlFor="phonenumber" className="text-[14px] text-richblack-5">Phone Number</label>
                <div className="flex gap-5">
                    <div className="flex flex-col w-20">
                        <select name="dropdown" id="dropdown" className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-3.5 border-b border-richblack-300 focus:outline-none cursor-pointer">
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+61">+61</option>
                        </select>
                    </div>
                    <div className="flex w-full flex-col">
                        <input type="tel" name="phonenumber" id="phonenumber" placeholder="12345 67890" 
                            className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-3 border-b border-richblack-300 focus:outline-none" 
                        />
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[14px] text-richblack-5">Message</label>
                <textarea name="message" id="message" cols="30" rows="5" placeholder="Enter your message here" 
                    className="bg-richblack-800 rounded-lg text-richblack-5 w-full p-3 border-b border-richblack-300 focus:outline-none resize-none" 
                />
            </div>

            {/* Button */}
            <button type="submit" className="rounded-md bg-yellow-50 px-6 py-3 text-center text-[16px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none mt-4">
                Send Message
            </button>
        </form>

    </div>
  )
}

export default ContactFormSection