import React, { useState } from 'react';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '../utils/cloudinary';
import { submitVerification } from '../apicalls/citizenapi/api';

const ProfileCard = ({ onClose, user ,setUser}) => {
    const formSchema = z.object({
        dob: z.string().min(1, "Date of birth is required"),
        gender: z.enum(["male", "female", "other"]),
        phone_number: z.string()
            .min(10, "Phone number must be 10 digits")
            .max(10, "Phone number must be 10 digits")
            .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
        aadhaar_number: z.string()
            .transform(val => val.replace(/\D/g, '')) // Remove non-digits
            .refine(val => val.length === 12, {
                message: "Aadhaar must be exactly 12 digits",
            })
            .refine(val => /^[2-9]/.test(val), {
                message: "Aadhaar must start with digit 2-9",
            }),
        address_line1: z.string().min(5, "Address too short"),
        address_line2: z.string().optional(),
        town: z.string().min(2, "Town name too short"),
        district: z.string().min(2, "District name too short"),
        state: z.string().min(2, "State name too short"),
        pincode: z.string()
            .length(6, "Pincode must be 6 digits")
            .regex(/^\d+$/, "Only numbers allowed"),
        aadhaar_front_url: z.string().min(1, "Aadhaar front image is required").optional(),
        aadhaar_back_url: z.string().min(1, "Aadhaar back image is required").optional(),
        profile_picture_url: z.string().min(1, "Profile picture is required").optional()
    });

    const [formData, setFormData] = useState({
        dob: user.dob ? user.dob.split('T')[0] : '',
        gender: user.gender || '',
        phone_number: user.phone_number || '',
        aadhaar_number: user.aadhaar_number || '',
        address_line1: user.address_line1 || '',
        address_line2: user.address_line2 || '',
        town: user.town || '',
        district: user.district || '',
        state: user.state || '',
        pincode: user.pincode || '',
        aadhaar_front_url: user.aadhaar_front_url || '',
        aadhaar_back_url: user.aadhaar_back_url || '',
        profile_picture_url: user.profile_picture_url || ''
    });

    const [aadhaarFrontFile, setAadhaarFrontFile] = useState(null);
    const [aadhaarBackFile, setAadhaarBackFile] = useState(null);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const needsVerification = ['unverified', 'failed'].includes(user.verification_status);
    const isVerified = user.verification_status === 'verified';
    const isPending = user.verification_status === 'pending';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear validation error when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e, setFile, fieldName) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.match('image.*')) {
                toast.error("Please upload an image file");
                return;
            }
            setFile(file);
            if (validationErrors[fieldName]) {
                setValidationErrors(prev => ({ ...prev, [fieldName]: null }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First check if files are selected (basic validation)
            if (!profilePicFile && !formData.profile_picture_url) {
                toast.error("Profile picture is required");
                setValidationErrors(prev => ({ ...prev, profile_picture_url: "Profile picture is required" }));
                return;
            }
            if (!aadhaarFrontFile && !formData.aadhaar_front_url) {
                toast.error("Aadhaar front image is required");
                setValidationErrors(prev => ({ ...prev, aadhaar_front_url: "Aadhaar front image is required" }));
                return;
            }
            if (!aadhaarBackFile && !formData.aadhaar_back_url) {
                toast.error("Aadhaar back image is required");
                setValidationErrors(prev => ({ ...prev, aadhaar_back_url: "Aadhaar back image is required" }));
                return;
            }

            // Upload files to Cloudinary first
            const uploadPromises = [];
            const updatedData = { ...formData };

            if (profilePicFile) {
                uploadPromises.push(
                    uploadToCloudinary(profilePicFile).then((result) => {
                        updatedData.profile_picture_url = result.url;
                    })
                );
            }

            if (aadhaarFrontFile) {
                uploadPromises.push(
                    uploadToCloudinary(aadhaarFrontFile).then((result) => {
                        updatedData.aadhaar_front_url = result.url;
                    })
                );
            }

            if (aadhaarBackFile) {
                uploadPromises.push(
                    uploadToCloudinary(aadhaarBackFile).then((result) => {
                        updatedData.aadhaar_back_url = result.url;
                    })
                );
            }

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);

            // Now validate the complete data with URLs
            const validationResult = formSchema.safeParse(updatedData);

            if (!validationResult.success) {
                const errors = {};
                validationResult.error.errors.forEach((err) => {
                    const field = err.path[0];
                    errors[field] = err.message;
                    toast.error(`${field.replace(/_/g, ' ')}: ${err.message}`);
                });
                setValidationErrors(errors);
                return;
            }

            // Submit the verification with updated data
            const result = await submitVerification({
                ...updatedData,
                user_id: user.user_id,
            });

            if (result.success) {
                toast.success("Profile submitted for verification");
                toast.info("This process usually takes 4 to 5 hours");
                toast.info("If it takes longer than that, please contact support");
                setUser(result.user);
                onClose();
            } else {
                toast.error(result.message || "Error updating details, please try again later");
            }
        } catch (error) {
            console.error("Error submitting verification:", error);
            toast.error(error.message || "Failed to submit verification");
        } finally {
            setLoading(false);
        }
    };
    return (
       <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
  <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

     {needsVerification ? (
                    // Verification Form
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-center text-red-600">
                            {user.verification_status === 'failed'
                                ? 'Verification Failed - Please correct your details'
                                : 'Complete Your Profile Verification'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={user.name}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth*</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${validationErrors.dob ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {validationErrors.dob && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.dob}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gender*</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${validationErrors.gender ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {validationErrors.gender && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.gender}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {validationErrors.phone_number && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.phone_number}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Aadhaar Number*</label>
                                    <input
                                        type="text"
                                        name="aadhaar_number"
                                        value={formData.aadhaar_number}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${validationErrors.aadhaar_number ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {validationErrors.aadhaar_number && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.aadhaar_number}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address Line 1*</label>
                                    <input
                                        type="text"
                                        name="address_line1"
                                        value={formData.address_line1}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${validationErrors.address_line1 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {validationErrors.address_line1 && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.address_line1}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                                    <input
                                        type="text"
                                        name="address_line2"
                                        value={formData.address_line2}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Town/City*</label>
                                    <input
                                        type="text"
                                        name="town"
                                        value={formData.town}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${validationErrors.town ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {validationErrors.town && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.town}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">District*</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${validationErrors.district ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {validationErrors.district && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.district}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State*</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${validationErrors.state ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {validationErrors.state && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pincode*</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${validationErrors.pincode ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {validationErrors.pincode && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.pincode}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Profile Picture*</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setProfilePicFile, 'profile_picture_url')}
                                        className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${validationErrors.profile_picture_url ? 'border-red-500' : ''
                                            }`}
                                    />
                                    {validationErrors.profile_picture_url && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.profile_picture_url}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Aadhaar Front*</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setAadhaarFrontFile, 'aadhaar_front_url')}
                                        className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${validationErrors.aadhaar_front_url ? 'border-red-500' : ''
                                            }`}
                                        required
                                    />
                                    {validationErrors.aadhaar_front_url && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.aadhaar_front_url}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Aadhaar Back*</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setAadhaarBackFile, 'aadhaar_back_url')}
                                        className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${validationErrors.aadhaar_back_url ? 'border-red-500' : ''
                                            }`}
                                        required
                                    />
                                    {validationErrors.aadhaar_back_url && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.aadhaar_back_url}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit for Verification'}
                                </button>
                            </div>
                        </form>
                    </div>
                )  : (
      // Enhanced Profile View
      <div className="space-y-6">
        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0 relative">
            <img
              src={user.profile_picture_url || "./src/assets/no-profile-pic.png"}
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
              onError={(e) => {
                e.target.src = "./src/assets/no-profile-pic.png";
              }}
            />
            <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${isVerified ? 'bg-green-100 text-green-800' : isPending ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {user.verification_status.toUpperCase()}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{user.phone_number}</span>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">{user.dob ? new Date(user.dob).toISOString().split('T')[0] : 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{user.gender || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aadhaar Number</p>
              <p className="font-medium">{user.aadhaar_number || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aadhaar Verified</p>
              <p className={`font-medium ${user.aadhaar_verified ? 'text-green-600' : 'text-red-600'}`}>
                {user.aadhaar_verified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Address
          </h3>
          
          <div className="space-y-1">
            <p className="font-medium">{user.address_line1}</p>
            {user.address_line2 && <p className="font-medium">{user.address_line2}</p>}
            <p className="font-medium">{user.town}, {user.district}</p>
            <p className="font-medium">{user.state} - {user.pincode}</p>
            <p className="font-medium">{user.country}</p>
          </div>
        </div>

        {/* Aadhaar Images Section */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Aadhaar Documents
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Front Side</p>
              <img
                src={user.aadhaar_front_url || "https://via.placeholder.com/300x180?text=Front+Side"}
                alt="Aadhaar Front"
                className="w-full h-auto max-h-48 object-contain rounded-lg border border-gray-200"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Back Side</p>
              <img
                src={user.aadhaar_back_url || "https://via.placeholder.com/300x180?text=Back+Side"}
                alt="Aadhaar Back"
                className="w-full h-auto max-h-48 object-contain rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
    )};
export default ProfileCard;