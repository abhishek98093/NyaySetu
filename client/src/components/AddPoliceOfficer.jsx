import React, { useState } from 'react';
import { uploadToCloudinary } from '../utils/cloudinary';
import { registerPoliceOfficer } from '../apicalls/adminapi';
import { toast } from 'react-toastify';
const AddPoliceOfficer = ({ onClose ,setPoliceList}) => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: 'male',
        phone_number: '',
        email: '',
        aadhaar_number: '',
        address_line1: '',
        address_line2: '',
        town: '',
        district: '',
        state: '',
        pincode: '',
        badge_number: '',
        station_name: '',
        station_code: '',
        station_address: '',
        station_pincode:'',
        rank: '',
        shift_time: '',
        official_email: '',
        emergency_contact: '',
    });


    const [previewImage, setPreviewImage] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadingStatus, setUploadingStatus] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (uploadedFiles.length >= 1) {
            toast.info('You can upload only one file');
            return;
        }

        setFiles([file]);
        setUploadingStatus(['Uploading...']);

        const res = await uploadToCloudinary(file);

        if (res.success) {
            const uploadedFile = {
                url: res.url,
                public_id: res.public_id,
                type: res.resource_type,
            };
            setUploadedFiles([uploadedFile]);
            setPreviewImage(res.url); // Show uploaded image
            setUploadingStatus(['Uploaded']);
            setFormData((prev) => ({
                ...prev,
                profile_picture_url: res.url,
            }));
        } else {
            setUploadingStatus(['Failed']);
            toast.error('Image upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await registerPoliceOfficer(formData);
            if (result.success) {
                toast.success('Officer registered successfully!');
                const officer=result.data;
                setPoliceList((prevList) => [officer, ...prevList]);
                onClose();
            } else {
                toast.error('Try again. Something went wrong.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('An error occurred while submitting the form.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-blue-200 py-10 px-4 flex items-center justify-center overflow-y-auto">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-6xl bg-white shadow-md rounded-xl p-8 space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-900">Police Officer Registration</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-red-500 font-semibold hover:underline"
                    >
                        Close ✕
                    </button>
                </div>

                {/* Profile Image Upload */}
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-400">
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-blue-400 text-lg">No Image</span>
                        )}
                    </div>
                    <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm">
                        Upload Photo
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>

                {/* Personal Info */}
                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                    <div>
                        <label className="block font-medium">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleChange('name')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Date of Birth</label>
                        <input
                            type="date"
                            value={formData.dob}
                            onChange={handleChange('dob')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Gender</label>
                        <select
                            value={formData.gender}
                            onChange={handleChange('gender')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={handleChange('phone_number')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Aadhaar Number</label>
                        <input
                            type="text"
                            value={formData.aadhaar_number}
                            onChange={handleChange('aadhaar_number')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>
                </div>

                {/* Address Info */}
                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                    <div>
                        <label className="block font-medium">Address Line 1</label>
                        <input
                            type="text"
                            value={formData.address_line1}
                            onChange={handleChange('address_line1')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Address Line 2</label>
                        <input
                            type="text"
                            value={formData.address_line2}
                            onChange={handleChange('address_line2')}
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Town</label>
                        <input
                            type="text"
                            value={formData.town}
                            onChange={handleChange('town')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">District</label>
                        <input
                            type="text"
                            value={formData.district}
                            onChange={handleChange('district')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">State</label>
                        <input
                            type="text"
                            value={formData.state}
                            onChange={handleChange('state')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Pincode</label>
                        <input
                            type="text"
                            value={formData.pincode}
                            onChange={handleChange('pincode')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>
                </div>

                {/* Station Info */}
                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                    <div>
                        <label className="block font-medium">Badge Number</label>
                        <input
                            type="text"
                            value={formData.badge_number}
                            onChange={handleChange('badge_number')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Rank</label>
                        <select
                            value={formData.rank}
                            onChange={handleChange('rank')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        >
                            <option value="">Select Rank</option>
                            <option value="Inspector">Inspector</option>
                            <option value="Sub-Inspector">Sub-Inspector</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">Station Name</label>
                        <input
                            type="text"
                            value={formData.station_name}
                            onChange={handleChange('station_name')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Station Code</label>
                        <input
                            type="text"
                            value={formData.station_code}
                            onChange={handleChange('station_code')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block font-medium">Station Address</label>
                        <textarea
                            rows="2"
                            value={formData.station_address}
                            onChange={handleChange('station_address')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block font-medium">Station Pincode</label>
                        <textarea
                            rows="1"
                            value={formData.station_pincode}
                            onChange={handleChange('station_pincode')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>
                </div>

                {/* Other Info */}
                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                    <div>
                        <label className="block font-medium">Shift Time</label>
                        <input
                            type="text"
                            value={formData.shift_time}
                            onChange={handleChange('shift_time')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Official Email</label>
                        <input
                            type="email"
                            value={formData.official_email}
                            onChange={handleChange('official_email')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block font-medium">Emergency Contact</label>
                        <input
                            type="tel"
                            value={formData.emergency_contact}
                            onChange={handleChange('emergency_contact')}
                            required
                            className="w-full mt-1 p-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded-md text-white transition-all duration-200 ${loading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Uploading...' : 'Register Officer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPoliceOfficer;