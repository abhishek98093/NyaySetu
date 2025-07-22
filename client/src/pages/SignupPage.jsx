import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { sendOtp, verifyOtp, signup } from "../apicalls/authapi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import FloatingBackground from "../components/FloatingBackground";
import { useMutation } from "@tanstack/react-query";
import LoadingPage from "../components/LoadingPage";
import ErrorPage from "../components/ErrorPage";
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dob: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/[0-9]/, "At least one number")
    .regex(/[^a-zA-Z0-9]/, "At least one special character"),
  cnfpassword: z.string(),
}).refine(data => data.password === data.cnfpassword, {
  message: "Passwords do not match",
  path: ["cnfpassword"],
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

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});



function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpsent, setotpsent] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    dob: "",
    phoneNumber: "",
    password: "",
    cnfpassword: "",
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };
const sendOtpMutation = useMutation({
        mutationFn: async ({ email }) => {
            const type = 'signup';

            const parseResult = emailSchema.safeParse({ email });
            if (!parseResult.success) {
                throw new Error('Enter a valid email ID');
            }

            const result = await sendOtp({ email, type }); // throws error if fails
            return result; // success object
        },

        onSuccess: (result) => {
            setotpsent(true);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'password') checkPasswordStrength(value);
    };


    const verifyOtpMutation = useMutation({
        mutationFn: async ({ email, otp, type }) => {
            if (!email || !otp || !type) {
                throw new Error("Email, OTP, and type are required for verification.");
            }

            // 🔥 API function throws on failure
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

    const signupMutation = useMutation({
  mutationFn: async ({ name, email, password, cnfpassword, phoneNumber, dob }) => {
    // ✅ Passwords match check
    if (password !== cnfpassword) {
      throw new Error('Passwords do not match');
    }

    // ✅ Strong password schema validation
    const parseResult = strongPasswordSchema.safeParse({ password, cnfpassword });
    if (!parseResult.success) {
      throw new Error('Password is not strong enough. Must contain uppercase, lowercase, number, special character, and be at least 8 characters long.');
    }

    // ✅ Additional basic validation if needed
    if (!name || !email || !phoneNumber || !dob) {
      throw new Error('All fields are required');
    }

    // ✅ Call your signup API (assuming imported as signup)
    const result = await signup({ name, email, password, cnfpassword,phoneNumber, dob });
    return result;
  },

  onSuccess: (result) => {
    
    dispatch(setUser({
                    user: result.user,
                    policeDetails: result.policeDetails,
                    logedAt: Date.now(),
                }));
                toast.success('Signup successful. Logging you in...');
    const role = result.user?.role;

    // ✅ Navigate based on role
    switch (role) {
      case 'admin':
        navigate('/admindashboard', { replace: true });
        break;
      case 'citizen':
        navigate('/citizendashboard', { replace: true });
        break;
      case 'police':
        navigate('/policedashboard', { replace: true });
        break;
      default:
        toast.error('Invalid role. Redirecting to login.');
        localStorage.removeItem('token');
        navigate('/login');
    }
  },

  onError: (error) => {
    toast.error(error.message || 'Something went wrong during signup');
  },
});


    const handleSendOtp = (e) => {
        e.preventDefault();
        sendOtpMutation.mutate({ email: formData.email });
    };

    

    // ✅ 2. handleVerifyOtp
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        verifyOtpMutation.mutate({
            email: formData.email,
            otp: otp, // using separate otp state
            type: "signup",
        });
    };
    const handleBackToSignup = () => {
        setForgot(false);
        setStep(1);
    };


    const handleSignUp=(e)=>{
        e.preventDefault();
        signupMutation.mutate({
            name:formData.name,
            email:formData.email,
            password:formData.password,
            cnfpassword:formData.cnfpassword,
            phoneNumber:formData.phoneNumber,
            dob:formData.dob,

        })
    }

if(signupMutation.isPending) return <LoadingPage status="load" message="Creating account, please wait" />;
if(signupMutation.isError) return <ErrorPage message={signupMutation.error?.message || "Something went wrong"} />;
 return (
  <div className="relative min-h-screen bg-white overflow-hidden">
    <FloatingBackground />

    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            SignUp 
          </h2>

          <form onSubmit={step === 3 ? handleSignUp : (step === 2 ? handleVerifyOtp : handleSendOtp)} className="space-y-4">
            {step === 1 && (
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="you@example.com"
                  required
                />
                <button
                  type="submit"
                  disabled={sendOtpMutation.isPending || countdown > 0}
                  className="w-full bg-indigo-600 text-white py-2 rounded mt-2"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : sendOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            )}

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


            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
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
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <div className="mt-2 text-xs space-y-1">
                    <p className={passwordStrength.length ? "text-green-600" : "text-gray-500"}>✔ At least 8 characters</p>
                    <p className={passwordStrength.uppercase ? "text-green-600" : "text-gray-500"}>✔ Uppercase letter</p>
                    <p className={passwordStrength.lowercase ? "text-green-600" : "text-gray-500"}>✔ Lowercase letter</p>
                    <p className={passwordStrength.number ? "text-green-600" : "text-gray-500"}>✔ Number</p>
                    <p className={passwordStrength.special ? "text-green-600" : "text-gray-500"}>✔ Special character</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    name="cnfpassword"
                    value={formData.cnfpassword}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full bg-indigo-600 text-white py-2 rounded mt-2"
                >
                  {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </button>
              </>
            )}
          </form>
        </div>
        
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="inline font-semibold text-indigo-600 hover:underline focus:outline-none"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                
    </div>
  </div>
);
}

export default SignupPage