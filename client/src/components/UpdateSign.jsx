import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '../utils/cloudinary';
import { submitSighting } from '../apicalls/citizenapi';
import LoadingPage from './LoadingPage';

const UpdateSign = ({ criminalId, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const queryClient = useQueryClient();

  // --- All your existing logic is preserved ---
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    district: '',
    pincode: '',
    datetime: '',
  });

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingStatus, setUploadingStatus] = useState([]);
  const [errors, setErrors] = useState({});

  const sightingMutation = useMutation({
    mutationFn: submitSighting,
    onSuccess: () => {
      toast.success('Sighting submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['allMissingAndCriminals', user?.user_id] });
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Failed to submit sighting.');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > 3) {
      toast.warn('You can upload up to 3 files.');
      return;
    }

    const currentFileCount = files.length;
    setFiles((prev) => [...prev, ...newFiles]);
    setUploadingStatus((prev) => [...prev, ...newFiles.map(() => 'Uploading...')]);

    for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const uploadIndex = currentFileCount + i; // Correct index for async updates
        try {
            const res = await uploadToCloudinary(file);
            if (res.success) {
                setUploadedFiles((prev) => [
                    ...prev,
                    { url: res.url, public_id: res.public_id, type: res.resource_type },
                ]);
                setUploadingStatus((prevStatus) => {
                    const updated = [...prevStatus];
                    updated[uploadIndex] = 'Uploaded';
                    return updated;
                });
            } else throw new Error('Upload failed');
        } catch (err) {
            setUploadingStatus((prevStatus) => {
                const updated = [...prevStatus];
                updated[uploadIndex] = 'Failed';
                return updated;
            });
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
    const newErrors = {};
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'A valid 6-digit pincode is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.datetime) newErrors.datetime = 'Date and time of sighting is required';
    if (!formData.description) newErrors.description = 'A brief description is required';
    if (uploadedFiles.length === 0) newErrors.proofs = 'Please upload at least one proof file';
    if (uploadingStatus.includes('Uploading...')) {
      toast.info('Please wait for files to finish uploading.');
      return;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
        type: 'criminal',
        ref_id: criminalId,
        update_text: formData.description,
        proof_url: uploadedFiles[0].url, // Assuming you want the first one, or adjust as needed
        address: formData.address,
        district: formData.district,
        pincode: formData.pincode,
        time_of_sighting: formData.datetime,
    };
    sightingMutation.mutate(payload);
  };

  if (sightingMutation.isPending) {
    return <LoadingPage status="load" message="Submitting your report..." />;
  }

  // --- Fixed JSX with Modal structure and improved CSS ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Report a Sighting</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Modal Body with Overflow */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What did you see? Include details like clothing, activity, etc." className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required rows="3"/>
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} placeholder="House No, Street, Area" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                    {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <input name="district" value={formData.district} onChange={handleChange} placeholder="e.g., Mumbai" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                    {errors.district && <p className="text-sm text-red-600 mt-1">{errors.district}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit pincode" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required maxLength={6} />
                    {errors.pincode && <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time of Sighting</label>
                    <input name="datetime" type="datetime-local" value={formData.datetime} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500" required />
                    {errors.datetime && <p className="text-sm text-red-600 mt-1">{errors.datetime}</p>}
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Proof (Image/Video)</label>
              <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
              {errors.proofs && <p className="text-sm text-red-600 mt-1">{errors.proofs}</p>}
            </div>

            {files.length > 0 && <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                  <span className="text-sm font-medium text-gray-800 truncate w-2/3">{file.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${uploadingStatus[index] === 'Uploaded' ? 'text-green-600' : uploadingStatus[index] === 'Failed' ? 'text-red-600' : 'text-blue-600'}`}>{uploadingStatus[index]}</span>
                    <button type="button" onClick={() => handleRemoveFile(index)} className="text-sm text-red-500 hover:text-red-700 font-semibold">Remove</button>
                  </div>
                </div>
              ))}
            </div>}
            
            {/* Modal Footer with Submit Button */}
            <div className="flex justify-end pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">
                Cancel
              </button>
              <button type="submit" disabled={uploadingStatus.includes('Uploading...') || sightingMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Sighting
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSign;