import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadToCloudinary } from '../utils/cloudinary';
import { toast } from 'react-toastify';
import { submitComplaint } from '../apicalls/citizenapi';
import { crimeTypes } from '../safe/safe';
import { useSelector } from 'react-redux';
import LoadingPage from './LoadingPage';

const CreateComplaint = ({ onClose }) => {
  const user = useSelector(state => state.user.user); 
  const queryClient = useQueryClient();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingStatus, setUploadingStatus] = useState([]);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    crime_type: '',
    title: '',
    description: '',
    location_address: '',
    town: '',
    district: '',
    state: '',
    pincode: '',
    crime_datetime: '',
  });

  // ✅ Mutation for complaint submission
  const complaintMutation = useMutation({
  mutationFn: (payload) => submitComplaint(payload),

  onSuccess: (newComplaint) => {
    toast.success('Complaint submitted!');

    // ✅ Update cache directly for ['complaints', user?.user_id]
    queryClient.setQueryData(['complaints', user?.user_id], old => {
      if (!old) return [newComplaint];
      return [newComplaint, ...old];

    });

    onClose(); // close modal or reset form
  },

  onError: (error) => {
    toast.error(error.message || 'Submission failed');
  },

  onSettled: () => {
    setIsSubmitting(false);
  },
});




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);

    if (files.length + newFiles.length > 3) {
      toast.info('You can upload a maximum of 4 files');
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setUploadingStatus((prev) => [...prev, ...newFiles.map(() => 'Uploading...')]);

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const index = files.length + i;

      const res = await uploadToCloudinary(file);

      if (res.success) {
        setUploadedFiles((prev) => [
          ...prev,
          { url: res.url, public_id: res.public_id, type: res.resource_type },
        ]);
        setUploadingStatus((prev) => {
          const updated = [...prev];
          updated[index] = 'Uploaded';
          return updated;
        });
      } else {
        setUploadingStatus((prev) => {
          const updated = [...prev];
          updated[index] = 'Failed';
          return updated;
        });
      }
    }
  };
  if (complaintMutation.isPending) {
    return <LoadingPage status="load" message="Adding complaint, please avoid pressing any key" />;
  }
  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadingStatus((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    for (const key in formData) {
      if (!formData[key]) newErrors[key] = `${key.replace('_', ' ')} is required`;
    }

    if (!crimeTypes.includes(formData.crime_type)) {
      newErrors.crime_type = 'Invalid crime type selected';
    }

    if (uploadedFiles.length === 0) {
      newErrors.proofs = 'At least one file must be uploaded';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      proof_urls: uploadedFiles.map((f) => f.url),
    };

    console.log('Ready to submit complaint:', payload);
    complaintMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Overlay with smooth transition */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container with animation */}
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
        {/* Modal Content */}
        <div
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-white rounded-full p-1 shadow-sm"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">File New Complaint</h2>
            <p className="text-blue-100 text-sm mt-1">Provide details about the incident</p>
          </div>

          {/* Form content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Crime Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Crime Type *</label>
                  <select
                    name="crime_type"
                    value={formData.crime_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border ${errors.crime_type ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                  >
                    <option value="">Select Crime Type</option>
                    {crimeTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.crime_type && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.crime_type}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title (try to give an idea in 3 to 4 words) <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    rows={1}
                    className={`w-full px-4 py-2.5 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                    placeholder="e.g. Theft in parking area"
                  />

                  {errors.title && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                    placeholder="Provide detailed information about the incident..."
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Location Details */}
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Location Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                    <input
                      type="text"
                      name="location_address"
                      value={formData.location_address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border ${errors.location_address ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                    />
                    {errors.location_address && (
                      <p className="mt-1.5 text-sm text-red-600">{errors.location_address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Town/City *</label>
                      <input
                        type="text"
                        name="town"
                        value={formData.town}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.town ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                      />
                      {errors.town && (
                        <p className="mt-1.5 text-sm text-red-600">{errors.town}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">District *</label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                      />
                      {errors.district && (
                        <p className="mt-1.5 text-sm text-red-600">{errors.district}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                      />
                      {errors.state && (
                        <p className="mt-1.5 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                      />
                      {errors.pincode && (
                        <p className="mt-1.5 text-sm text-red-600">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date/Time Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time of Incident *</label>
                  <input
                    type="datetime-local"
                    name="crime_datetime"
                    value={formData.crime_datetime}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border ${errors.crime_datetime ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                  />
                  {errors.crime_datetime && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.crime_datetime}</p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Evidence (Max 3 files)</label>
                  <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">Drag and drop files here</p>
                      <p className="text-xs text-gray-500 mt-1">or click to browse (PDF, DOC, JPG, PNG)</p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                    />
                  </label>

                  {/* File previews with status */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-md ${uploadingStatus[index] === 'Uploaded' ? 'bg-green-100 text-green-600' :
                              uploadingStatus[index] === 'Failed' ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                              <p className={`text-xs ${uploadingStatus[index] === 'Uploaded' ? 'text-green-600' :
                                uploadingStatus[index] === 'Failed' ? 'text-red-600' : 'text-blue-600'
                                }`}>
                                {uploadingStatus[index]}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition duration-150"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.proofs && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.proofs}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Submit Complaint'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;