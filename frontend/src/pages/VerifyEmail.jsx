// src/pages/VerifyEmail.jsx
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";

const VerifyEmail = () => {
    const [otp, setOtp] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Pulling the temporarily saved data from Redux!
    const { signupData } = useSelector((state) => state.auth);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log("OTP to be verified: ", otp);

        const {
            accountType, firstName, lastName, email, password, confirmPassword
        } = signupData;

        // Send the final massive payload to the backend
        dispatch(
            signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate)
        );
    };

    return (
        <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
            <div className="max-w-125 p-4 lg:p-8">

                <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-9.5">
                    Verify Email
                </h1>

                <p className="text-[1.125rem] leading-6.5 my-4 text-richblack-100">
                    A verification code has been sent to your email. Enter the code below.
                </p>

                <form onSubmit={handleOnSubmit}>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => (
                            <input
                                {...props}
                                placeholder="-"
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className="w-12 lg:w-15 border-0 bg-richblack-800 rounded-lg text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50 mx-1"
                            />
                        )}
                    />

                    <button
                        type="submit"
                        className="w-full bg-yellow-50 py-3 px-3 rounded-lg mt-6 font-medium text-richblack-900 transition-all duration-200 hover:scale-95"
                    >
                        Verify Email
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    {/* Back to Login Link */}
                    <Link to="/login">
                        <p className="text-richblack-5 flex items-center gap-x-2 transition-all duration-200 hover:text-richblack-100">
                            <BiArrowBack /> Back To Login
                        </p>
                    </Link>

                    {/* Resend OTP Button */}
                    <button
                        className="flex items-center text-blue-100 gap-x-2 transition-all duration-200 hover:text-blue-50"
                        onClick={() => console.log("Trigger Resend OTP API")}
                    >
                        <RxCountdownTimer />
                        Resend it
                    </button>
                </div>

            </div>
        </div>
    );
};

export default VerifyEmail;
