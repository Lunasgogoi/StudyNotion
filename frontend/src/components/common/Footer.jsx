// src/components/common/Footer.jsx
//import React from 'react'
import { FooterLink2 } from '../../data/footer-links'
import { Link } from 'react-router-dom'
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa"

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        
        <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-richblack-700">
            {/* Left Section (Hardcoded company info) */}
            <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
                <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
                    <h1 className="text-richblack-50 font-semibold text-[16px]">StudyNotion</h1>
                    <div className="flex flex-col gap-2">
                        <Link to={"/about"}>About</Link>
                        <Link to={"/careers"}>Careers</Link>
                        <Link to={"/affiliates"}>Affiliates</Link>
                    </div>
                    <div className="flex gap-3 text-lg">
                        <FaFacebook /> <FaGoogle /> <FaTwitter /> <FaYoutube />
                    </div>
                </div>
            </div>

            {/* Right Section (Mapped from Data File) */}
            <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
                {FooterLink2.map((ele, i) => {
                    return (
                        <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <h1 className="text-richblack-50 font-semibold text-[16px] mb-3">
                                {ele.title}
                            </h1>
                            <div className="flex flex-col gap-2">
                                {ele.links.map((link, index) => {
                                    return (
                                        <Link key={index} to={link.link} className="hover:text-richblack-50 transition-all duration-200">
                                            {link.title}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
