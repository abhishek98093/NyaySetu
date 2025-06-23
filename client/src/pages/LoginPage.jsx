import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { sendOtp, verifyOtp, login, resetPassword } from "../apicalls/authapi";
import { toast } from 'react-toastify';
import { getRole } from "../utils/utils";
import { useDispatch } from "react-redux";

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"), // avoids empty strings
});

const forgotSchema = z.object({
    email: z
        .string()
        .email("Invalid email address"),
});


function LoginPage() {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [forgot, setForgot] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpsent, setOtpSent] = useState(false);


    const [showPassword, setShowPassword] = useState(false);


    const [formData, setFormData] = useState({
        email: "",
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

    try {
        const parseResult = forgotSchema.safeParse({ email: formData.email }); // use lowercase "formData"
        if (!parseResult.success) {
            toast.error('Enter a valid email ID');
            return;
        }

        const result = await sendOtp(formData.email);

        if (result.success) {
            setCountdown(30); // make sure countdown logic (setInterval) exists somewhere
            setOtpSent(true);
            toast.success('OTP sent successfully');

            // Automatically enable again after 30 seconds (optional if you're using countdown)
            setTimeout(() => {
                setOtpSent(false);
            }, 30000);
        } else {
            toast.error('Error sending OTP');
        }
    } catch (err) {
        toast.error('Something went wrong while sending OTP');
        console.error(err);
    } finally {
        setLoading(false);
    }
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

   const handlelogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const parseResult = loginSchema.safeParse({
            email: formData.email,
            password: formData.password
        });

        if (!parseResult.success) {
            toast.error('Enter valid email and password');
            setLoading(false);
            return;
        }

        const result = await login(formData,dispatch);

        if (result.success) {
            toast.success('Welcome back');

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
                        toast.error("Invalid role. Redirecting to login.");
                        navigate('/login');
                }
            } else {
                toast.error("No role found. Redirecting to login.");
                navigate('/login');
            }
        } else {
            toast.error(result.message || 'Login failed');
        }

    } catch (err) {
        console.error("Login error:", err);
        toast.error(err.message || 'Error logging in');
    } finally {
        setLoading(false);
    }
};


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const loginData = {
                email: formData.email,
                password: formData.password
            };
            const parseresult = loginSchema.safeParse(loginData);
            if (!parseresult.success) {
                toast.info('enter a valid Email ID');
                return;
            }

            // Check password match
            if (formData.password !== formData.cnfpassword) {
                toast.info('both password must match');
                return;
            }

            // Verify OTP
            const otpResult = await verifyOtp(formData.email, otp);
            if (!otpResult.valid) {
                toast.info('invalid otp , try again');
                return;
            }

            // Prepare and submit data

            const result = await resetPassword(loginData);

            if (result.success) {
            toast.success('Welcome back');

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
                        toast.error("Invalid role. Redirecting to login.");
                        navigate('/login');
                }
            } else {
                toast.error("No role found. Redirecting to login.");
                navigate('/login');
            }
        } else {
            toast.error(result.message || 'Login failed');
        }
        } catch (err) {
            // Handle any errors silently
            console.error("Submission error:", err);
            toast.error(err)
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 mt-20">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-center mb-6">LogIn</h2>



                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

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



                    {<div className='relative grid' >
                        <label className="block text-sm font-medium mb-1">{forgot ? "New passoword" : "password"}</label>
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
                        {!forgot && <button type="button" onClick={(() => setForgot(!forgot))} className='hover:underline justify-self-end text-blue-400' >Forgot Password</button>}
                    </div>}
                    {forgot && <div>
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


                    {forgot && <div className='grid'>
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
                        {forgot && <button type="button" onClick={(() => setForgot(!forgot))} className='hover:underline justify-self-end text-blue-400' >back to Log In</button>}

                    </div>
                    }


                    {forgot && <div className="block text-sm font-medium mb-1">
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
                    </div>}
                    {!forgot && <div className=" text-sm font-medium mb-1">
                        <button
                            onClick={handlelogin}
                            disabled={loading || otpsent}
                            className={`w-full mt-6 text-white py-3 rounded-md font-medium bg-indigo-500 hover:bg-indigo-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            Log In
                        </button>
                    </div>}

                    {forgot && <div className=" block text-sm font-medium mb-1">
                        <button
                            onClick={handleSubmit}
                            type='submit'
                            disabled={loading}
                            className={`w-full bg-indigo-500 mt-6 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Updating' : 'Update and Log In'}
                        </button>
                    </div>}
                </form>
            </div>
        </div>
    );
}

export default LoginPage;