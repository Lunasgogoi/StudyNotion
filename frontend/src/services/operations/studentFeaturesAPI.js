import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png" // Make sure you have a logo image here, or remove this line
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
import { paymentEndpoints } from "../apis";


// Load the Razorpay SDK script dynamically
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try {
        // 1. Load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            toast.error("Razorpay SDK failed to load");
            toast.dismiss(toastId);
            return;
        }

        // 2. Initiate the order on your backend
        const orderResponse = await apiConnector("POST", paymentEndpoints.CAPTURE_PAYMENT_API,
            { courses },
            { Authorization: `Bearer ${token}` }
        );

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        // 3. Configure the Razorpay Modal
        const options = {
            key: razorpayKey,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name: "StudyNotion",
            description: "Thank You for Purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: userDetails.email,
            },
            // 4. What happens when payment is successful?
            handler: function (response) {
                // Send successful payment details back to the server to verify signature and enroll student
                verifyPayment({ ...response, courses }, token, navigate, dispatch);
            }
        };

        // 5. Open the modal
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Oops, payment failed");
            console.log(response.error);
        });

    } catch (error) {
        console.log("PAYMENT API ERROR.....", error);
        // Now it will display the specific error message your backend sent!
        toast.error(error.message || "Could not make Payment");
    }
    toast.dismiss(toastId);
}

// Helper function to verify payment on your backend
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector("POST", paymentEndpoints.VERIFY_PAYMENT_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment successful, you are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());

    } catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}
