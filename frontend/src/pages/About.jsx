// src/pages/About.jsx
//import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import Quote from '../components/core/Aboutpage/Quote'
import StatsComponent from '../components/core/Aboutpage/StatsComponent'
import ContactFormSection from '../components/core/Aboutpage/ContactFormSection'
import LearningGrid from '../components/core/Aboutpage/LearningGrid'
import ReviewSlider from '../components/common/ReviewSlider'
import Footer from '../components/common/Footer'

const About = () => {
    return (
        <div className="mx-auto text-white">

            {/* SECTION 1: HERO */}
            <section className="bg-richblack-700">
                <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
                    <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
                        Driving Innovation in Online Education for a
                        <HighlightText text={"Brighter Future"} />
                        <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
                            StudyNotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
                        </p>
                    </header>

                    {/* 3 Images Side by Side */}
                    <div className="sm:h-17.5 lg:h-37.5"></div>
                    <div className="absolute bottom-0 left-[50%] grid w-full translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" alt="about1" className=" rounded-md" />
                        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" alt="about2" className=" rounded-md" />
                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" alt="about3" className=" rounded-md" /> {/*shadow-[0_0_20px_0] shadow-[#456a9b] */}
                    </div>
                </div>
            </section>

            {/* SECTION 2: QUOTE */}
            <section className="border-b border-richblack-700">
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500 mt-25 lg:mt-37.5">
                    <Quote />
                </div>
            </section>

            {/* SECTION 3: STORY & VISION */}
            <section>
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">

                    {/* Founding Story */}
                    <div className="flex flex-col items-center gap-10 lg:flex-row justify-between mt-20 mb-20">
                        <div className="my-24 flex lg:w-[50%] flex-col gap-10">
                            <h1 className="bg-linear-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                                Our Founding Story
                            </h1>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                            </p>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                            </p>
                        </div>
                        <div className="lg:w-[40%]">
                            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80" alt="Founding Story" className="shadow-[0_0_20px_0] shadow-[#FC6767] rounded-md" />
                        </div>
                    </div>

                    {/* Vision and Mission */}
                    <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between mb-32">
                        <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                            <h1 className="bg-linear-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                                Our Vision
                            </h1>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
                            </p>
                        </div>
                        <div className="my-24 flex lg:w-[40%] flex-col gap-10">
                            <h1 className="bg-linear-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                                Our Mission
                            </h1>
                            <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                                Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                            </p>
                        </div>
                    </div>

                    {/* SECTION 4: STATS */}
                    <StatsComponent />

                    {/* SECTION 5: LEARNING GRID */}
                    <section className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
                        <LearningGrid />
                    </section>

                    {/* SECTION 6: CONTACT FORM */}
                    <section className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
                        <ContactFormSection />
                    </section>

                    {/* SECTION 7: REVIEWS */}
                    <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                        <h1 className="text-center text-4xl font-semibold mt-8">
                            Reviews from other learners
                        </h1>
                        <ReviewSlider />
                    </div>

                    {/* SECTION 8: FOOTER */}
                    <Footer />

                </div>
            </section>

        </div>
    )
}

export default About
