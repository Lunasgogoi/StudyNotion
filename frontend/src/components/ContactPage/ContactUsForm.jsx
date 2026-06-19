import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../services/apiConnector"
// Make sure this endpoint is defined in your apis.js file!
import { contactusEndpoint } from "../../services/apis" 

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
]

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm()

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ email: "", firstname: "", lastname: "", message: "", phoneNo: "" })
    }
  }, [reset, isSubmitSuccessful])

  const submitContactForm = async (data) => {
    const toastId = toast.loading("Sending your message...")
    setLoading(true)
    try {
      // Sends data to your backend
      const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, {
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        phoneNo: `${data.countrycode} ${data.phoneNo}`,
        message: data.message,
      })

      if (response?.data?.success) {
        toast.success("Message sent successfully!")
      }
    } catch (error) {
      console.log("CONTACT US API ERROR:", error)
      toast.error("Could not send message. Please try again.")
    }
    setLoading(false)
    toast.dismiss(toastId)
  }

  const inputStyle = "rounded-lg bg-richblack-800 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0_rgba(255,255,255,0.18)] outline-none focus:bg-richblack-700 transition-all duration-200"

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="text-[14px] text-richblack-5">First Name</label>
          <input type="text" id="firstname" placeholder="Enter first name" className={inputStyle} {...register("firstname", { required: true })} />
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="text-[14px] text-richblack-5">Last Name</label>
          <input type="text" id="lastname" placeholder="Enter last name" className={inputStyle} {...register("lastname")} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-[14px] text-richblack-5">Email Address</label>
        <input type="email" id="email" placeholder="Enter email address" className={inputStyle} {...register("email", { required: true })} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="text-[14px] text-richblack-5">Phone Number</label>
        <div className="flex gap-5">
          <select id="dropdown" className={`w-[90px] cursor-pointer ${inputStyle}`} {...register("countrycode", { required: true })}>
            {countryCodes.map((ele, i) => (
              <option key={i} value={ele.code}>{ele.code} - {ele.country}</option>
            ))}
          </select>
          <input type="number" id="phonenumber" placeholder="12345 67890" className={`w-[calc(100%-110px)] ${inputStyle}`} {...register("phoneNo", { required: true, maxLength: 12, minLength: 10 })} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-[14px] text-richblack-5">Message</label>
        <textarea id="message" cols="30" rows="7" placeholder="Enter your message here" className={inputStyle} {...register("message", { required: true })} />
      </div>

      <button disabled={loading} type="submit" className="mt-6 rounded-[8px] bg-yellow-50 px-6 py-3 text-center text-[16px] font-bold text-black transition-all duration-200 hover:scale-95 disabled:opacity-50">
        Send Message
      </button>
    </form>
  )
}

export default ContactUsForm