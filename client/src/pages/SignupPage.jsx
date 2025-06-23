import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { sendOtp, verifyOtp, signup } from "../apicalls/authapi";
import { toast } from 'react-toastify';
import { getRole } from "../utils/utils";
import { useDispatch } from "react-redux";

const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    dob: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),

    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits"),

    email: z
        .string()
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "At least one uppercase letter")
        .regex(/[a-z]/, "At least one lowercase letter")
        .regex(/[0-9]/, "At least one number")
        .regex(/[^a-zA-Z0-9]/, "At least one special character"),
});


function SignupPage() {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [otpsent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);


    const [formData, setFormData] = useState({
        email: "",
        name: "",
        dob: "",
        phoneNumber: "",
        password: "",
        cnfpassword: "",
        // aadhaarNumber: "",
        // role: "citizen",
        // addressLine1: "",
        // addressLine2: "",
        // town: "",
        // district: "",
        // state: "",
        // pincode: ""
    });

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (otpsent) return;
        setLoading(true);

        const result = await sendOtp(formData.email);

        if (result.success) {
            setCountdown(30);
            setOtpSent(true);      // disable button
            setStep(2);
            toast.success('otp sent successfully');

            // enable after 30 seconds
            setTimeout(() => {
                setOtpSent(false);
            }, 30000);
        } else {
            toast.error('errror sending email');
        }

        setLoading(false);
    };
    useEffect(() => {
        let timer;

        if (otpsent && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

        } else if (countdown === 0 && otpsent) {
            setOtpSent(false);
        }

        return () => clearInterval(timer);
    }, [countdown, otpsent]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            signupSchema.parse(formData);
            if (FormData.password != FormData.cnfpassword) {
                toast.info('passwoard should match');
            }
            const otpResult = await verifyOtp(formData.email, otp);

            if (!otpResult.valid) {
                toast.error('invalid otp ');
                setLoading(false);
                return;
            }


            const signupData = {
                name: formData.name,
                email: formData.email,
                dob: formData.dob,
                phoneNumber: formData.phoneNumber,
                password: formData.password
            };

            const result = await signup(signupData,dispatch);

            if (result.success) {
                toast.success('Welcome ');

                const role = getRole();

                if (role) {
                    switch (role) {
                        case 'admin':
                            navigate('/admindashboard');
                            break;
                        case 'citizen':
                            navigate('/citizendashboard');
                            break;
                        case 'police':
                            navigate('/policedashboard');
                            break;
                        default:
                            toast.error("Try signing up again.");
                            navigate('/login');
                    }
                } else {
                    toast.error("try signing up again");
                    navigate('/login');
                }
            } else {
                setLoading(false);
                toast.error(result.message);
            }

        } catch (err) {
            setLoading(false);

            if (err?.errors && err.errors.length > 0) {
                toast.error(err.errors[0].message);
            } else if (err?.response?.data?.message) {
                toast.error(err.response.data.message);
            } else if (err?.message) {
                toast.error(err.message);
            } else {
                toast.error("An unexpected error occurred");
            }

        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 mt-20">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-4xl">
                <h1 className="blocktext-2xl font-bold text-center mb-3">Signup</h1>
                <h4 className="text-center text-blue-400">Enter correct detail as will be needed while verifying profile</h4>

                {/* {alert && (
                    <div className="fixed top-5 right-5 z-50">
                        <AlertBox
                            type={alert.type}
                            title={alert.title}
                            description={alert.description}
                            onClose={() => setAlert(null)}
                        />
                    </div>
                )} */}



                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Full Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number *</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Phone Number"
                            required
                        />
                    </div>

                    {/* <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Aadhaar Number *</label>
            <input 
              type="text" 
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Aadhaar Number" 
              required
            />
          </div> */}

                    <div>
                        <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {step == 2 && <div className='relative'>
                        <label className="block text-sm font-medium mb-1">Password *</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                            placeholder="Password"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-indigo-600 hover:underline"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>}
                    {step == 2 && <div>
                        <label className="block text-sm font-medium mb-1">confirm password *</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="cnfpassword"
                            value={formData.cnfpassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                            placeholder="confirm Password"
                            required
                        />
                    </div>}

                    {/* <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
            <input 
              type="text" 
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Street, Locality" 
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Address Line 2</label>
            <input 
              type="text" 
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Optional" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Town *</label>
            <input 
              type="text" 
              name="town"
              value={formData.town}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">District *</label>
            <input 
              type="text" 
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State *</label>
            <input 
              type="text" 
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pincode *</label>
            <input 
              type="text" 
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              required
            />
          </div> */}
                    {step === 2 && <div>
                        <label className="block text-sm font-medium mb-1">Enter Otp</label>
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Phone Number"
                            required
                        />
                    </div>}

                    <div className="block text-sm font-medium mb-1">
                        <button
                            onClick={handleSendOtp}
                            disabled={loading || otpsent}
                            className={`w-full mt-6 text-white py-3 rounded-md font-medium 
      ${otpsent ? 'bg-indigo-200' : 'bg-indigo-500 hover:bg-indigo-700'} 
      transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {otpsent
                                ? `request OTP after ${countdown} second`
                                : loading
                                    ? 'Sending OTP...'
                                    : 'Send OTP'}
                        </button>
                    </div>

                    {step == 2 && <div className=" block text-sm font-medium mb-1">
                        <button
                            onClick={handleSubmit}
                            type='submit'
                            disabled={loading}
                            className={`w-full bg-indigo-500 mt-6 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating Profile' : 'Create Profile'}
                        </button>
                    </div>}
                </form>
            </div>
        </div>
    );
}

export default SignupPage;