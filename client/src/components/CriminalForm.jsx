import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addCriminal } from '../apicalls/policeapi';
import { uploadToCloudinary } from '../utils/cloudinary';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';

const FormInput = ({ label, name, type = 'text', value, onChange, required = false, ...props }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...props}
    />
  </div>
);

const CriminalForm = ({ setAddCriminal }) => {
  const user = useSelector(state => state.user.user);
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
  name: '',
  description: '',
  last_seen_location: '',
  last_seen_time: '',
  probable_location: '',
  address: '',
  district: '',
  pincode: '',
  star: '1',
  reward_on_information: '',
  profile_picture_url: '',
  age: '',
  gender: '',
});


  const [imagePreview, setImagePreview] = useState('');

  const addCriminalMutation = useMutation({
    mutationFn: addCriminal,
    onSuccess: () => {
      toast.success('Criminal added successfully');
      queryClient.invalidateQueries(['allMissingAndCriminals', user?.user_id]);
      setAddCriminal(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || 'Error adding criminal');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.info('Uploading image...');
    const res = await uploadToCloudinary(file);

    if (res.success) {
      setFormState(prev => ({
        ...prev,
        profile_picture_url: res.url,
      }));
      toast.success('Image uploaded successfully');
    } else {
      toast.error('Image upload failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formState.profile_picture_url) {
      toast.error("Please upload an image first");
      return;
    }

   const dataToSend = {
  name: formState.name,
  description: formState.description,
  profile_picture_url: formState.profile_picture_url,
  last_seen_location: formState.last_seen_location,
  last_seen_time: formState.last_seen_time,
  probable_location: formState.probable_location,
  address: formState.address,
  district: formState.district,
  pincode: formState.pincode,
  star: parseInt(formState.star),
  reward_on_information: parseInt(formState.reward_on_information) || 0,
  age: formState.age ? parseInt(formState.age) : null,
  gender: formState.gender || null,
};


    addCriminalMutation.mutate(dataToSend);
  };
 if (addCriminalMutation.isPending) {
  return <LoadingPage status="load" message="Listing complaint to the public view page" />;
}

if (addCriminalMutation.isError) {
  return <ErrorPage message={addCriminalMutation.error?.message || "Something went wrong"} />;
}

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative">
      <button
        type="button"
        onClick={() => setAddCriminal(prev => !prev)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
        aria-label="Close form"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Register New Criminal</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <FormInput label="Name" name="name" value={formState.name} onChange={handleChange} required />

        <div>
          <label htmlFor="star" className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
          <select
            id="star"
            name="star"
            value={formState.star}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {[1,2,3,4,5].map(num => (
              <option key={num} value={num}>{num} Star</option>
            ))}
          </select>
        </div>
        <FormInput
  label="Age"
  name="age"
  type="number"
  value={formState.age}
  onChange={handleChange}
  min="0"
  max="150"
/>

<div>
  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
  <select
    id="gender"
    name="gender"
    value={formState.gender}
    onChange={handleChange}
    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value="">Select Gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </select>
</div>


        <div className="md:col-span-2 flex flex-col">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formState.description}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <FormInput label="Last Seen Location" name="last_seen_location" value={formState.last_seen_location} onChange={handleChange} required />
        <FormInput label="Last Seen Time" name="last_seen_time" type="datetime-local" value={formState.last_seen_time} onChange={handleChange} required />

        <FormInput label="District" name="district" value={formState.district} onChange={handleChange} required />
        
        <div className="md:col-span-2">
          <FormInput label="Address" name="address" value={formState.address} onChange={handleChange} />
        </div>

        <div className="md:col-span-2">
          <FormInput label="Probable location pincode/police code" name="pincode" value={formState.pincode} onChange={handleChange} required />

          <FormInput label="Probable Location" name="probable_location" value={formState.probable_location} onChange={handleChange} />
        </div>

        <div>
          <FormInput
            label="Reward on Information (₹)"
            name="reward_on_information"
            type="number"
            value={formState.reward_on_information}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="md:col-span-2 flex flex-col">
          <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
          />
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Profile Preview" className="h-24 w-24 object-cover rounded-lg shadow-sm" />
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 duration-200"
          >
            Submit Criminal Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriminalForm;
