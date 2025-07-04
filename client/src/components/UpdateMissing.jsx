import React, { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMissingPerson } from '../apicalls/policeapi';
import { useSelector } from 'react-redux';

const FormInput = ({ label, name, value, onChange, type = 'text', required = false, min }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

const UpdateMissing = ({ missing, setUpdateMissingComponent }) => {
  const user = useSelector(state => state.user.user);
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    probable_location: missing?.probable_location || '',
    pincode: missing?.pincode || '',
    last_seen_location: missing?.last_seen_location || '',
    last_seen_time: missing?.last_seen_time ? missing.last_seen_time.slice(0, 16) : '',
    description: missing?.description || '',
    reward_on_information: missing?.reward_on_information || 0,
    status: missing?.status || 'active',
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const updateMissingMutation = useMutation({
    mutationFn: ({ id, data }) => updateMissingPerson({ id, data }),

    onSuccess: async () => {
      try {
        setLoading(true);
        toast.success('Record updated successfully');
        await queryClient.invalidateQueries(['allMissingAndCriminals', user?.user_id]);
      } catch (err) {
        console.error('Error invalidating queries:', err);
        toast.error('Failed to refresh data');
      } finally {
        setLoading(false);
        setUpdateMissingComponent(false);
      }
    },
    onError: (err) => {
      console.error('Update failed:', err);
      toast.error(err?.response?.data?.error || 'Error updating record');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const updatedData = {
        probable_location: formState.probable_location,
        pincode: formState.pincode,
        last_seen_location: formState.last_seen_location,
        last_seen_time: formState.last_seen_time,
        description: formState.description,
        reward_on_information: parseInt(formState.reward_on_information) || 0,
        status: formState.status,
      };

      updateMissingMutation.mutate({ id: missing.missing_id, data: updatedData });

    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error.message || 'Failed to update details.');
      toast.error(error.message || 'Failed to update details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (updateMissingMutation.isPending || loading) {
    return <LoadingPage status="load" message="Updating record, please wait..." />;
  }

  if (updateMissingMutation.isError) {
    return <ErrorPage message={updateMissingMutation.error?.message || 'Something went wrong'} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 font-inter">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        Update Missing Person
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <FormInput
          label="Probable Location"
          name="probable_location"
          value={formState.probable_location}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Probable pincode/stationcode"
          name="pincode"
          value={formState.pincode}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Last Seen Location"
          name="last_seen_location"
          value={formState.last_seen_location}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Last Seen Time"
          name="last_seen_time"
          type="datetime-local"
          value={formState.last_seen_time}
          onChange={handleChange}
          required
        />

        <div className="sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formState.description}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <FormInput
          label="Reward on Information (₹)"
          name="reward_on_information"
          type="number"
          value={formState.reward_on_information}
          onChange={handleChange}
          min="0"
        />

        <div className="sm:col-span-2">
          <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="active">Active</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={() => setUpdateMissingComponent(false)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMissing;
