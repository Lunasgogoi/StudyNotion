// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa"
import HighlightText from '../components/core/HomePage/HighlightText'
import Button from '../components/core/HomePage/Button'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import { assets } from '../data/assets'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import ReviewSlider from '../components/common/ReviewSlider'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer'

const Home = () => {
  return (
    <div>
      {/* SECTION 1: HERO */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white mt-16">

        {/* Become an Instructor Badge */}
        <Link to="/signup">
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-1.25 transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Heading */}
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with
          <HighlightText text="Coding Skills" />
        </div>

        {/* Sub-Heading */}
        <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row gap-7 mt-8">
          <Button active={true} linkto={"/catalog/web-development"}>
            Learn More
          </Button>
          <Button active={false} linkto={"/contact"}>
            Book a Demo
          </Button>
        </div>

        {/* Video Player */}
        <div className="relative mx-auto my-10 w-8/12 max-w-6xl">

          {/* Cyan Glow */}
          <div className="absolute -inset-4 bg-cyan-400 opacity-30 blur-3xl rounded-xl"></div>

          {/* White Shadow Border */}
          <div className="absolute top-4 left-4 w-full h-full bg-white rounded-xl"></div>

          {/* Video */}
          <video
            className="relative z-10 block w-full rounded-xl object-cover"
            muted
            loop
            autoPlay
            playsInline
          >
            <source src={assets.heroVideo} type="video/mp4" />
          </video>

        </div>

        <div className="w-full mt-24">
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className='text-4xl font-semibold'>
                Unlock your
                <HighlightText text={"coding potential"} />
                {" "}with our online courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            cta1={{
              btnText: "Try it yourself",
              linkto: "/signup",
              active: true,
            }}
            cta2={{
              btnText: "Learn more",
              linkto: "/about",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title><link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two/">Two</a><a href="three/">Three</a>\n</nav>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={<div className="absolute top-[-20%] left-[-10%] w-full h-full bg-linear-to-br from-[#8A2BE2] via-[#FFA500] to-[#F8F8FF] opacity-20 blur-3xl rounded-full"></div>}
          />
        </div>

        <div className="w-full">
          <CodeBlocks
            position={"lg:flex-row-reverse"} // <-- Flips the layout!
            heading={
              <div className='text-4xl font-semibold'>
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            cta1={{
              btnText: "Continue Lesson",
              linkto: "/dashboard/enrolled-courses",
              active: true,
            }}
            cta2={{
              btnText: "Learn more",
              linkto: "/about",
              active: false,
            }}
            codeblock={`import React from 'react';\nimport Button from './Button';\n\nconst App = () => {\n  return (\n    <div>\n      <h1>Hello World</h1>\n      <Button text="Click Me" />\n    </div>\n  );\n}\nexport default App;`}
            codeColor={"text-blue-100"}
            backgroundGradient={<div className="absolute top-[-20%] right-[-10%] w-full h-full bg-linear-to-br from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] opacity-20 blur-3xl rounded-full"></div>}
          />
        </div>

        <ExploreMore />

      </div>



      {/* light backgound sections */}

      <div className="bg-stone-100 text-richblack-700">

        {/* The slanted background pattern (Optional, but looks great) */}
        <div className="homepage_bg h-77.5 w-full mt-20 text-white flex justify-center items-center">

          <div className="flex flex-row gap-7 mt-20">

            <Button active={true} linkto={"/catalog/web-development"}>
              <div className="flex items-center gap-2 caret-amber-400">
                Explore Full Catalog
                <FaArrowRight />
              </div>
            </Button>
            <Button active={false} linkto={"/about"}>
              <div>
                Learn More
              </div>
            </Button>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 mt-32 pb-25">

          {/* The Header Row */}
          <div className="flex flex-col lg:flex-row gap-5 mb-10 -mt-25">
            <div className="text-4xl font-semibold w-full lg:w-[45%]">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col gap-10 w-full lg:w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
              </div>
              <Button active={true} linkto={"/about"}>
                <div>Learn more</div>
              </Button>
            </div>
          </div>

          {/* Our Brand New Timeline Component! */}
          <TimelineSection />

          <LearningLanguageSection />
        </div>

      </div>

      <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white pb-20">

        {/* Instructor Section */}
        <InstructorSection />

        {/* Review Slider Placeholder */}
        <h2 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h2>
        <ReviewSlider />

      </div>

      <Footer />

    </div>


  )
}

export default Home;
