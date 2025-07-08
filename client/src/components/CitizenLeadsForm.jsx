// import React, { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { uploadToCloudinary } from '../utils/cloudinary';
// import { toast } from 'react-toastify';
// import { submitLead } from '../apicalls/citizenapi'; // ✅ Ensure this is implemented
// import { leadTitles } from '../safe/safe'; // ✅ Your titles list
// import { useSelector } from 'react-redux';
// import LoadingPage from './LoadingPage';

// const CitizenLeadsForm = ({ onClose }) => {
//   const user = useSelector(state => state.user.user);
//   const queryClient = useQueryClient();

//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [uploadingStatus, setUploadingStatus] = useState([]);
//   const [files, setFiles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     incident_datetime: '', // ✅ added
//     location_address: '',
//     town: '',
//     district: '',
//     state: '',
//     pincode: '',
//     country: 'India',
//     anonymous: false,
//   });
//   const leadMutation = useMutation({
//     mutationFn: (payload) => submitLead(payload),

//     onSuccess: () => {
//       toast.success('Lead submitted!');
//       queryClient.invalidateQueries(['leads']);
//       onClose();
//     },

//     onError: (error) => {
//       toast.error(error.message || 'Submission failed');
//     },

//     onSettled: () => {
//       setIsSubmitting(false);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleFileChange = async (e) => {
//     const newFiles = Array.from(e.target.files);

//     if (files.length + newFiles.length > 3) {
//       toast.info('You can upload a maximum of 3 files');
//       return;
//     }

//     setFiles((prev) => [...prev, ...newFiles]);
//     setUploadingStatus((prev) => [...prev, ...newFiles.map(() => 'Uploading...')]);

//     for (let i = 0; i < newFiles.length; i++) {
//       const file = newFiles[i];
//       const index = files.length + i;

//       const res = await uploadToCloudinary(file);

//       if (res.success) {
//         setUploadedFiles((prev) => [
//           ...prev,
//           { url: res.url, public_id: res.public_id, type: res.resource_type },
//         ]);
//         setUploadingStatus((prev) => {
//           const updated = [...prev];
//           updated[index] = 'Uploaded';
//           return updated;
//         });
//       } else {
//         setUploadingStatus((prev) => {
//           const updated = [...prev];
//           updated[index] = 'Failed';
//           return updated;
//         });
//       }
//     }
//   };

//   const handleRemoveFile = (index) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//     setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
//     setUploadingStatus((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const newErrors = {};
//     for (const key in formData) {
//       if (key !== 'anonymous' && !formData[key]) newErrors[key] = `${key.replace('_', ' ')} is required`;
//     }

//     if (uploadedFiles.length === 0) {
//       newErrors.media_urls = 'At least one file must be uploaded';
//     }

//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) {
//       setIsSubmitting(false);
//       return;
//     }

//     const payload = {
//       ...formData,
//       media_urls: uploadedFiles.reduce((acc, file, idx) => {
//         acc[`media${idx + 1}`] = file.url;
//         return acc;
//       }, {}),
//     };

//     console.log('Submitting lead:', payload);
//     leadMutation.mutate(payload);
//   };

//   if (leadMutation.isPending) {
//     return <LoadingPage status="load" message="Adding lead, please wait" />;
//   }

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
//       <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

//       <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
//         <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 shadow-sm"
//             aria-label="Close"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>

//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//             <h2 className="text-2xl font-bold text-white">Submit New Lead</h2>
//             <p className="text-blue-100 text-sm mt-1">Provide details about what you observed</p>
//           </div>

//           <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
//             <form onSubmit={handleSubmit} className="space-y-6">

//               {/* Title Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
//                 <select
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2.5 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`}
//                 >
//                   <option value="">Select Title</option>
//                   {leadTitles.map((title, index) => (
//                     <option key={index} value={title}>{title}</option>
//                   ))}
//                 </select>
//                 {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>}
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   rows={3}
//                   className={`w-full px-4 py-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`}
//                   placeholder="Describe what you saw in detail..."
//                 ></textarea>
//                 {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>}
//               </div>

//               {/* Anonymous Checkbox */}
//               <div className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   name="anonymous"
//                   checked={formData.anonymous}
//                   onChange={handleChange}
//                   className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                 />
//                 <label className="block text-sm font-medium text-gray-700">Submit anonymously</label>
//               </div>

//               {/* Location Fields */}
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   name="location_address"
//                   value={formData.location_address}
//                   onChange={handleChange}
//                   placeholder="Full address"
//                   className={`w-full px-4 py-2.5 border ${errors.location_address ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`}
//                 />
//                 {errors.location_address && <p className="mt-1.5 text-sm text-red-600">{errors.location_address}</p>}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <input type="text" name="town" value={formData.town} onChange={handleChange} placeholder="Town/City"
//                     className={`w-full px-4 py-2.5 border ${errors.town ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`} />
//                   {errors.town && <p className="mt-1.5 text-sm text-red-600">{errors.town}</p>}

//                   <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District"
//                     className={`w-full px-4 py-2.5 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`} />
//                   {errors.district && <p className="mt-1.5 text-sm text-red-600">{errors.district}</p>}

//                   <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State"
//                     className={`w-full px-4 py-2.5 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`} />
//                   {errors.state && <p className="mt-1.5 text-sm text-red-600">{errors.state}</p>}

//                   <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode"
//                     className={`w-full px-4 py-2.5 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`} />
//                   {errors.pincode && <p className="mt-1.5 text-sm text-red-600">{errors.pincode}</p>}
//                 </div>
{/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date and Time of Incident *</label>
                <input
                  type="datetime-local"
                  name="incident_datetime"
                  value={formData.incident_datetime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.incident_datetime ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`}
                />
                {errors.incident_datetime && <p className="mt-1.5 text-sm text-red-600">{errors.incident_datetime}</p>}
              </div> */}

//                 {/* Country - prefilled */}
//                 <input
//                   type="text"
//                   name="country"
//                   value={formData.country}
//                   readOnly
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-gray-100"
//                 />
//               </div>

//               {/* Media Upload */}
//               {/* Keep your existing file upload code here unchanged */}

//               {/* Submit Button */}
//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none"
//                 >
//                   {isSubmitting ? 'Submitting...' : 'Submit Lead'}
//                 </button>
//               </div>

//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CitizenLeadsForm;

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadToCloudinary } from '../utils/cloudinary';
import { toast } from 'react-toastify';
import { submitLead } from '../apicalls/citizenapi';
import { leadTitles } from '../safe/safe';
import { useSelector } from 'react-redux';
import LoadingPage from './LoadingPage';

const CitizenLeadsForm = ({ onClose }) => {
  const user = useSelector(state => state.user.user);
  const queryClient = useQueryClient();

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingStatus, setUploadingStatus] = useState([]);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incident_datetime: '',
    location_address: '',
    town: '',
    district: '',
    state: '',
    pincode: '',
    country: 'India',
    anonymous: false,
  });

  const leadMutation = useMutation({
    mutationFn: (payload) => submitLead(payload),
    onSuccess: () => {
      toast.success('Lead submitted!');
      queryClient.invalidateQueries(['leads']);
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Submission failed');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // const handleFileChange = async (e) => {
  //   const newFiles = Array.from(e.target.files);

  //   if (files.length + newFiles.length > 3) {
  //     toast.info('You can upload a maximum of 3 files');
  //     return;
  //   }

  //   setFiles((prev) => [...prev, ...newFiles]);
  //   setUploadingStatus((prev) => [...prev, ...newFiles.map(() => 'Uploading...')]);

  //   for (let i = 0; i < newFiles.length; i++) {
  //     const file = newFiles[i];
  //     const index = files.length + i;

  //     try {
  //       const res = await uploadToCloudinary(file);
  //       if (res.success) {
  //         setUploadedFiles((prev) => [
  //           ...prev,
  //           { url: res.url, public_id: res.public_id, type: res.resource_type },
  //         ]);
  //         setUploadingStatus((prev) => {
  //           const updated = [...prev];
  //           updated[index] = 'Uploaded';
  //           return updated;
  //         });
  //       } else {
  //         throw new Error('Upload failed');
  //       }
  //     } catch (error) {
  //       setUploadingStatus((prev) => {
  //         const updated = [...prev];
  //         updated[index] = 'Failed';
  //         return updated;
  //       });
  //       toast.error(`Failed to upload ${file.name}`);
  //     }
  //   }
  // };


    const handleFileChange = async (e) => {
  const selectedFiles = Array.from(e.target.files);

  if (files.length + selectedFiles.length > 3) {
    toast.info('You can upload a maximum of 3 files');
    return;
  }

  for (const file of selectedFiles) {
    // Add file and set status to uploading
    setFiles((prev) => [...prev, file]);
    setUploadingStatus((prev) => [...prev, 'Uploading...']);

    const index = files.length; // files.length is old length, but this works as we append one by one

    try {
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
        throw new Error('Upload failed');
      }
    } catch (error) {
      setUploadingStatus((prev) => {
        const updated = [...prev];
        updated[index] = 'Failed';
        return updated;
      });
      toast.error(`Failed to upload ${file.name}`);
    }
  }
};

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
      if (key !== 'anonymous' && !formData[key]) newErrors[key] = `${key.replace('_', ' ')} is required`;
    }

    if (uploadedFiles.length === 0) {
      newErrors.media_urls = 'At least one file must be uploaded';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      media_urls: uploadedFiles.reduce((acc, file, idx) => {
        acc[`media${idx + 1}`] = file.url;
        return acc;
      }, {}),
    };

    console.log('Submitting lead:', payload);
    leadMutation.mutate(payload);
  };

  if (leadMutation.isPending) {
    return <LoadingPage status="load" message="Adding lead, please wait" />;
  }
  const isUploading = uploadingStatus.some(status => status === 'Uploading...');


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 shadow-sm"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Submit New Lead</h2>
            <p className="text-blue-100 text-sm mt-1">Provide details about what you observed</p>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`}
                >
                  <option value="">Select Title</option>
                  {leadTitles.map((title, index) => (
                    <option key={index} value={title}>{title}</option>
                  ))}
                </select>
                {errors.title && <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`}
                  placeholder="Describe what you saw in detail..."
                ></textarea>
                {errors.description && <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Incident Datetime */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date and Time of Incident *</label>
                <input
                  type="datetime-local"
                  name="incident_datetime"
                  value={formData.incident_datetime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors.incident_datetime ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`}
                />
                {errors.incident_datetime && <p className="mt-1.5 text-sm text-red-600">{errors.incident_datetime}</p>}
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Evidence (Max 3 files) *</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="sr-only"
                          accept="image/*,video/*,.pdf,.doc,.docx"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF, DOC up to 10MB</p>
                  </div>
                </div>
                {errors.media_urls && <p className="mt-1.5 text-sm text-red-600">{errors.media_urls}</p>}

                {/* Uploaded files list */}
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="truncate">{file.name}</span>
                        <span className={`text-xs ${uploadingStatus[index] === 'Uploaded' ? 'text-green-500' : uploadingStatus[index] === 'Failed' ? 'text-red-500' : 'text-gray-500'}`}>
                          ({uploadingStatus[index]})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="block text-sm font-medium text-gray-700">Submit anonymously</label>
              </div>

              {/* Location Fields */}
              <div className="space-y-4">
                <input
                  type="text"
                  name="location_address"
                  value={formData.location_address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className={`w-full px-4 py-2.5 border ${errors.location_address ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`}
                />
                {errors.location_address && <p className="mt-1.5 text-sm text-red-600">{errors.location_address}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="town" value={formData.town} onChange={handleChange} placeholder="Town/City"
                    className={`w-full px-4 py-2.5 border ${errors.town ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`} />
                  {errors.town && <p className="mt-1.5 text-sm text-red-600">{errors.town}</p>}

                  <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District"
                    className={`w-full px-4 py-2.5 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`} />
                  {errors.district && <p className="mt-1.5 text-sm text-red-600">{errors.district}</p>}

                  <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State"
                    className={`w-full px-4 py-2.5 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`} />
                  {errors.state && <p className="mt-1.5 text-sm text-red-600">{errors.state}</p>}

                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode"
                    className={`w-full px-4 py-2.5 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none`} />
                  {errors.pincode && <p className="mt-1.5 text-sm text-red-600">{errors.pincode}</p>}
                </div>

                {/* Country - prefilled */}
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-gray-100"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
  type="submit"
  disabled={isSubmitting || isUploading}
  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSubmitting ? 'Submitting...' : isUploading ? 'Uploading Files...' : 'Submit Lead'}
</button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenLeadsForm;