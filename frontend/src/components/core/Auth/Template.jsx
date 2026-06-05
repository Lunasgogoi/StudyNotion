// src/components/core/Auth/Template.jsx
import LoginForm from './LoginForm'
import SignupForm from './SignupForm' // Make sure this is uncommented!

const Template = ({ title, description1, description2, image, formType }) => {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:items-center md:gap-y-0 md:gap-x-12">
        
        <div className="mx-auto w-11/12 max-w-112.5 md:mx-0">
          <h1 className="text-[1.875rem] font-semibold leading-9.5 text-richblack-5">
            {title}
          </h1>
          <p className="mt-4 text-[1.125rem] leading-6.5">
            <span className="text-richblack-100">{description1}</span>{" "}
            <span className="font-edu-sa font-bold italic text-blue-100">
              {description2}
            </span>
          </p>

          {/* Render the correct form based on the prop */}
          {formType === "signup" ? (
            <SignupForm /> // Make sure this is no longer commented out!
          ) : (
            <LoginForm />
          )}
        </div>

        <div className="relative mx-auto w-11/12 max-w-112.5 md:mx-0">
          <div className="absolute -top-4 -right-4 z-0 h-full w-full rounded-lg bg-richblack-800"></div>
          <img
            src={image}
            alt="Students learning"
            width={558}
            height={504}
            loading="lazy"
            className="relative z-10 rounded-lg shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]"
          />
        </div>

      </div>
    </div>
  )
}

export default Template;
