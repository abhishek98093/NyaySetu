
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { sendOtp, verifyOtp, login, resetPassword } from "../apicalls/authapi";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import FloatingBackground from "../components/FloatingBackground";
import { useMutation } from "@tanstack/react-query";
import { setUser } from "../slices/userSlice";
import LoadingPage from "../components/LoadingPage";
import ErrorPage from "../components/ErrorPage";
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

const strongPasswordSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[0-9]/, "Must include a digit")
        .regex(/[^A-Za-z0-9]/, "Must include a special character"),
    cnfpassword: z.string(),
}).refine(data => data.password === data.cnfpassword, {
    message: "Passwords do not match",
    path: ['cnfpassword'],
});

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(0);
    const [forgot, setForgot] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpsent, setOtpSent] = useState(false);
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });


    const checkPasswordStrength = (password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };
        setPasswordStrength(checks);
    };


    const [formData, setFormData] = useState({
        email: "",
        password: "",
        cnfpassword: "",

    });

    const sendOtpMutation = useMutation({
        mutationFn: async ({ email }) => {
            const type = 'reset';

            const parseResult = forgotSchema.safeParse({ email });
            if (!parseResult.success) {
                throw new Error('Enter a valid email ID');
            }

            const result = await sendOtp({ email, type }); // throws error if fails
            return result; // success object
        },

        onSuccess: (result) => {
            setOtpSent(true);
            setCountdown(30); // reset countdown on each send
            toast.success(result.message || 'OTP sent successfully');
            setStep(2);
        },


        onError: (error) => {
            toast.error(error.message || 'Something went wrong while sending OTP');
        },
    });

    useEffect(() => {
        let timer;
        if (otpsent && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown, otpsent]);




    // useEffect(() => {
    //     let timer;

    //     if (otpsent && countdown > 0) {
    //         timer = setInterval(() => {
    //             setCountdown(prev => prev - 1);
    //         }, 1000);

    //     } else if (countdown === 0 && otpsent) {
    //         setOtpSent(false);
    //     }

    //     return () => clearInterval(timer);
    // }, [countdown, otpsent]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'password') checkPasswordStrength(value);
    };



    const loginMutation = useMutation({
        mutationFn: async ({ email, password }) => {
            const parseResult = loginSchema.safeParse({ email, password });
            if (!parseResult.success) {
                throw new Error("Enter valid email and password");
            }

            const result = await login({ email, password });
            return result; // ✅ Return result for onSuccess
        },

        onSuccess: (result) => {
            toast.success( "Welcome back");

            // ✅ Dispatch user to store
            dispatch(setUser({
                user: result.user,
                policeDetails: result.policeDetails,
                logedAt: Date.now(),
            }));

            // ✅ Navigate based on role
            const role = result.user?.role;
            if (role) {
                switch (role) {
                    case "admin":
                        navigate("/admindashboard",{ replace: true });
                        break;
                    case "citizen":
                        navigate("/citizendashboard",{ replace: true });
                        break;
                    case "police":
                        navigate("/policedashboard",{ replace: true });
                        break;
                    default:
                        toast.error("Invalid role. Redirecting to login.");
                        localStorage.removeItem('token');
                        navigate("/login");
                }
            } else {
                toast.error("No role found. Redirecting to login.");
                navigate("/login");
            }
        },

        onError: (error) => {
            toast.error(error.message || "Something went wrong during login");
        },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async ({ email, otp, type }) => {
            if (!email || !otp || !type) {
                throw new Error("Email, OTP, and type are required for verification.");
            }

            // 🔥 API function throws on failure
            console.log('ver');
            const result = await verifyOtp({ email, otp, type });


            return result; // contains otpToken and message
        },

        onSuccess: (data) => {
            toast.success(data.message || "OTP verified successfully.");
            setOtp("");
            setStep(3);
            console.log("Verified OTP token:", data.otpToken);
        },

        onError: (error) => {
            toast.error(error.message || "Something went wrong during OTP verification.");
        },
    });

    const resetPasswordMutation = useMutation({
       
        mutationFn: async ({email,password,cnfpassword}) => {
    if (password !== cnfpassword) {
      throw new Error('Passwords do not match');
    }
    const parseSchemaResult = loginSchema.safeParse({ email, password });
            if (!parseSchemaResult.success) {
                throw new Error('Enter valid email and password');
            }
    const parseResult = strongPasswordSchema.safeParse({ password, cnfpassword });
    if (!parseResult.success) {
      throw new Error('Password is not strong enough. Must contain uppercase, lowercase, number, special character and be at least 8 characters long.');
    }

    const result = await resetPassword({ email, password });
    return result;
  },
        onSuccess: (result) => {
            toast.success( 'Password reset successful. Logging you in...');
            dispatch(setUser({
                user: result.user,
                policeDetails: result.policeDetails,
                logedAt: Date.now(),
            }));

            const role = result.user?.role;

            // ✅ Navigate based on role
            switch (role) {
                case 'admin':
                    navigate('/admindashboard',{ replace: true });
                    break;
                case 'citizen':
                    navigate('/citizendashboard',{ replace: true });
                    break;
                case 'police':
                    navigate('/policedashboard',{ replace: true });
                    break;
                default:
                    toast.error('Invalid role. Redirecting to login.');
                    localStorage.removeItem('token');
                    navigate('/login');
            }
        },

        onError: (error) => {
            toast.error(error.message || 'Something went wrong during password reset');
        },
    });


    const handleSendOtp = (e) => {
        e.preventDefault();
        sendOtpMutation.mutate({ email: formData.email });
    };

    // ✅ 3. handleLogin
    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation.mutate({
            email: formData.email,
            password: formData.password,
        });
    };

    // ✅ 2. handleVerifyOtp
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        verifyOtpMutation.mutate({
            email: formData.email,
            otp: otp, // using separate otp state
            type: "reset",
        });
    };
    const handleBackToLogin = () => {
        setForgot(false);
        setStep(1);
    };


    const handleResetPassword = (e) => {
        e.preventDefault();
        resetPasswordMutation.mutate({
            email: formData.email,
            password: formData.password,
            cnfpassword: formData.cnfpassword,
        });
    };

    if (
        resetPasswordMutation.isPending ||
        verifyOtpMutation.isPending ||
        sendOtpMutation.isPending ||
        loginMutation.isPending
    ) {
        return <LoadingPage status="load" message="Please wait..." />;
    }

    if (
        resetPasswordMutation.isError ||
        verifyOtpMutation.isError ||
        sendOtpMutation.isError ||
        loginMutation.isError
    ) {
        toast.error(resetPasswordMutation.error);
    }


    return (
        <div className="relative min-h-screen bg-white overflow-hidden">
            <FloatingBackground />
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md border border-gray-200">
                    <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
                        {forgot ? 'Reset Password' : 'Welcome Back!'}
                    </h2>
                    <p className="text-center text-gray-500 mb-8">
                        {forgot ? 'Follow the steps to reset your password.' : 'Sign in to continue.'}
                    </p>

                    <form onSubmit={forgot ? handleResetPassword : handleLogin} className="space-y-4">

                        {/* --- LOGIN VIEW --- */}
                        {!forgot && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <div className='relative'>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Password *</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 transition-shadow"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-0 top-7 h-10 px-3 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                    <button type="button" onClick={() => setForgot(true)} className='mt-1 text-sm text-indigo-600 hover:underline float-right'>
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loginMutation.isPending}
                                        className={`w-full text-white py-3 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-300 ${loginMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loginMutation.isPending ? 'Logging In...' : 'Log In'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* --- FORGOT PASSWORD FLOW --- */}
                        {forgot && (
                            <>
                                {/* --- Step 1: Email Input & Send OTP --- */}
                                {step === 1 && (
                                    <div className="grid grid-cols-3 gap-4 items-end">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1 text-gray-600">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendOtp}
                                            disabled={sendOtpMutation.isPending}

                                            type="button"
                                            className={`w-full text-white py-2 rounded-lg font-medium transition-all text-sm bg-indigo-500 hover:bg-indigo-600 hover:shadow-lg ${sendOtpMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {sendOtpMutation.isPending ? '...' : 'Send OTP'}
                                        </button>
                                    </div>
                                )}

                                {/* --- Step 2: OTP Verification --- */}
                                {/* {step === 2 && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-600">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 items-end">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1 text-gray-600">Enter OTP *</label>
                                            <input
                                                type="text"
                                                name="otp"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                                placeholder="123456"
                                                required
                                            />
                                        </div>
                                        <button
                                            onClick={handleVerifyOtp}
                                            disabled={verifyOtpMutation.isPending}
                                            type="button"
                                            className={`w-full text-white py-2 rounded-lg font-medium transition-all text-sm bg-indigo-500 hover:bg-indigo-600 hover:shadow-lg ${verifyOtpMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {verifyOtpMutation.isPending ? '...' : 'Verify OTP'}
                                        </button>
                                    </div>
                                </>
                            )} */}
                                {step === 2 && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-600">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                readOnly
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 items-end">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium mb-1 text-gray-600">Enter OTP *</label>
                                                <input
                                                    type="text"
                                                    name="otp"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                                    placeholder="123456"
                                                    required
                                                />
                                            </div>
                                            <button
                                                onClick={handleVerifyOtp}
                                                disabled={verifyOtpMutation.isPending}
                                                type="button"
                                                className={`w-full text-white py-2 rounded-lg font-medium transition-all text-sm bg-indigo-500 hover:bg-indigo-600 hover:shadow-lg ${verifyOtpMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {verifyOtpMutation.isPending ? '...' : 'Verify OTP'}
                                            </button>
                                        </div>

                                        {/* Countdown Timer or Resend Button */}
                                        {/* <div className="mt-2 text-sm text-gray-600">
                                            {countdown > 0 ? (
                                                <p>Resend OTP in {countdown}s</p>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        sendOtpMutation.mutate({ email: formData.email });
                                                        setCountdown(30); // restart timer
                                                    }}
                                                    className="text-indigo-600 font-medium hover:underline"
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div> */}
                                        <div className="mt-2 text-sm text-gray-600">
                                            <button
                                                onClick={() => {
                                                    sendOtpMutation.mutate(
                                                        { email: formData.email },
                                                        {
                                                            onSuccess: () => setCountdown(30), // Start timer only after OTP is sent successfully
                                                        }
                                                    );
                                                }}
                                                disabled={countdown > 0 || sendOtpMutation.isPending}
                                                className={`font-medium hover:underline ${countdown > 0 || sendOtpMutation.isPending
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-indigo-600'
                                                    }`}
                                            >
                                                {countdown > 0
                                                    ? `Resend OTP in ${countdown}s`
                                                    : sendOtpMutation.isPending
                                                        ? 'Sending...'
                                                        : 'Resend OTP'}
                                            </button>
                                        </div>


                                    </>
                                )}


                                {/* --- Step 3: New Password --- */}
                                {step === 3 && (
                                    // <>
                                    //     <div>
                                    //         <label className="block text-sm font-medium mb-1 text-gray-600">New Password *</label>
                                    //         <input
                                    //             type={showPassword ? 'text' : 'password'}
                                    //             name="password"
                                    //             value={formData.password}
                                    //             onChange={handleChange}
                                    //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    //             placeholder="••••••••"
                                    //             required
                                    //         />
                                    //     </div>
                                    //     <div>
                                    //         <label className="block text-sm font-medium mb-1 text-gray-600">Confirm Password *</label>
                                    //         <input
                                    //             type={showPassword ? 'text' : 'password'}
                                    //             name="cnfpassword"
                                    //             value={formData.cnfpassword}
                                    //             onChange={handleChange}
                                    //             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    //             placeholder="••••••••"
                                    //             required
                                    //         />
                                    //     </div>
                                    //     <div className="pt-2">
                                    //         <button
                                    //             type="submit"
                                    //             disabled={resetPasswordMutation.isPending}
                                    //             className={`w-full text-white py-3 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-300 ${resetPasswordMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    //         >
                                    //             {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                                    //         </button>
                                    //     </div>
                                    // </>
                                    <>
  <div className="relative">
    <label className="block text-sm font-medium mb-1 text-gray-600">New Password *</label>
    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow pr-12"
      placeholder="••••••••"
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(prev => !prev)}
      className="absolute right-0 top-7 h-10 px-3 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
    >
      {showPassword ? 'Hide' : 'Show'}
    </button>

    {formData.password && (
      <div className="mt-2 space-y-1 text-sm">
        <p className={passwordStrength.length ? 'text-green-600' : 'text-gray-500'}>✔ At least 8 characters</p>
        <p className={passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}>✔ Uppercase letter</p>
        <p className={passwordStrength.lowercase ? 'text-green-600' : 'text-gray-500'}>✔ Lowercase letter</p>
        <p className={passwordStrength.number ? 'text-green-600' : 'text-gray-500'}>✔ Number</p>
        <p className={passwordStrength.special ? 'text-green-600' : 'text-gray-500'}>✔ Special character</p>
      </div>
    )}
  </div>

  <div>
    <label className="block text-sm font-medium mb-1 text-gray-600">Confirm Password *</label>
    <input
      type={showPassword ? 'text' : 'password'}
      name="cnfpassword"
      value={formData.cnfpassword}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
      placeholder="••••••••"
      required
    />
  </div>

  <div className="pt-2">
    <button
      type="submit"
      disabled={resetPasswordMutation.isPending}
      className={`w-full text-white py-3 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-300 ${resetPasswordMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
    </button>
  </div>
</>


                                )}

                                {/* Back to Login Button */}
                                <button type="button" onClick={handleBackToLogin} className='w-full text-center pt-2 text-sm text-gray-500 hover:underline'>
                                    Back to Log In
                                </button>
                            </>
                        )}
                    </form>
                </div>

                {!forgot && (
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="inline font-semibold text-indigo-600 hover:underline focus:outline-none"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>


    );
}

export default LoginPage;
