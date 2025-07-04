import React, { useState } from 'react';
import { QueryClient, useMutation,useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { deleteCriminal } from '../apicalls/policeapi';
import { toast } from 'react-toastify';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';
import UpdateCriminal from './UpdateCriminal';
const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const StarDisplay = ({ star }) => {
  const starColors = [
    'text-red-400',
    'text-red-400',
    'text-red-500',
    'text-red-500',
    'text-red-500',
    'text-red-600'
  ];
  const colorClass = starColors[Math.min(star, 5)] || starColors[0];
  
  return (
    <div className={`text-3xl font-bold ${colorClass} text-center`}>
      {'★'.repeat(star)}{'☆'.repeat(5-star)}
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Confirm Action</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const CriminalCard = ({ criminal }) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading,setLoading]=useState(false);
  const user = useSelector(state => state.user.user);
    const queryClient = useQueryClient();
    const [updateCriminalComponent, setUpdateCriminalComponent] = useState(false);


 

    const deleteCriminalMutation = useMutation({
  mutationFn: deleteCriminal,
  onSuccess: async () => {
    setLoading(true);
    toast.success("Record deleted");

    await queryClient.invalidateQueries(['allMissingAndCriminals', user?.user_id]);

    setLoading(false);
  },
  onError: (err) => {
    toast.error(err?.response?.data?.error || "Error deleting record");
  }
});

    const handleDeleteClick = () => {
  setShowDeleteConfirm(true);
};



  const handleConfirmDelete = () => {
    deleteCriminalMutation.mutate(criminal.criminal_id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };
 if (deleteCriminalMutation.isPending || loading) {
  return <LoadingPage status="load" message="Deleting record, please wait..." />;
}

if (deleteCriminalMutation.isError) {
  return <ErrorPage message={deleteCriminalMutation.error?.message || "Something went wrong"} />;
}

  return (
    <>
    {updateCriminalComponent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 my-8 max-h-[90vh] overflow-y-auto">
      <UpdateCriminal
        criminal={criminal}
        setUpdateCriminalComponent={setUpdateCriminalComponent}
      />
    </div>
  </div>
)}

      
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete ${criminal.name}? This action cannot be undone.`}
      />

      {/* Mobile View (hidden on md+) */}
      <div className="md:hidden bg-white border border-red-200 rounded-lg shadow-sm overflow-hidden mb-4">
        {/* Header */}
        <div className="bg-red-600 text-white p-3 font-bold text-lg text-center">
          WANTED: {criminal.name}
        </div>

        <div className="p-4 flex flex-col gap-4 text-gray-800">
          <div className="flex flex-col items-center">
            <img
              src={criminal.profile_picture_url}
              alt={criminal.name}
              className="w-40 h-40 object-cover rounded-md mx-auto"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/160?text=No+Image';
              }}
            />
            <div className="mt-2">
              <StarDisplay star={criminal.star} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm"><strong>Description:</strong> {criminal.description}</p>
            
            <div>
              <p className="text-sm font-semibold">Last Seen:</p>
              <p className="text-sm pl-2">{criminal.last_seen_location}</p>
              <p className="text-sm pl-2">{formatDateTime(criminal.last_seen_time)}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold">Probable Location:</p>
              <p className="text-sm pl-2">{criminal.probable_location || 'Unknown'}</p>
               <p className="text-sm pl-2">Stn code: {criminal.pincode || 'Unknown'}</p>
            </div>

            <div>
              <p className="text-sm font-semibold">Permanent Address:</p>
              <p className="text-sm pl-2">{criminal.address || 'Unknown'}</p>
              <p className="text-sm pl-2">{criminal.district || 'Unknown district'}</p>
             
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-semibold">Age:</p>
                <p className="text-sm">{criminal.age || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Gender:</p>
                <p className="text-sm">{criminal.gender || 'Unknown'}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm"><strong>Reward:</strong> ₹{criminal.reward_on_information}</p>
            </div>
            <p className="text-sm">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded uppercase ${
                criminal.status === 'wanted' ? 'bg-red-600 text-white' :
                criminal.status === 'arrested' ? 'bg-green-600 text-white' :
                'bg-gray-600 text-white'
              }`}>
                {criminal.status}
              </span>
            </p>
          </div>
        </div>

        <div className="px-4 pb-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowMoreInfo(!showMoreInfo)}
            className={`font-semibold py-2 px-2 rounded-lg transition-colors duration-200 text-sm ${
              showMoreInfo 
                ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {showMoreInfo ? 'Hide' : 'More'}
          </button>
          <button
            onClick={() => setUpdateCriminalComponent(prev=>!prev)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-2 rounded-lg transition-colors duration-200 text-sm"
          >
            Update
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-2 rounded-lg transition-colors duration-200 text-sm col-span-2"
          >
            Delete
          </button>
        </div>

        
      </div>

      {/* Desktop View (hidden on md-) */}
      <div className="hidden md:block bg-white border border-red-200 rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="flex">
          <div className="w-1/3 p-4 flex flex-col items-center">
            <img
              src={criminal.profile_picture_url}
              alt={criminal.name}
              className="w-48 h-48 object-cover rounded-md"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/192?text=No+Image';
              }}
            />
            <div className="mt-4">
              <StarDisplay star={criminal.star} />
            </div>
          </div>

          <div className="w-2/3 p-4 border-l border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-red-700">WANTED: {criminal.name}</h3>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded uppercase ${
                criminal.status === 'wanted' ? 'bg-red-600 text-white' :
                criminal.status === 'arrested' ? 'bg-green-600 text-white' :
                'bg-gray-600 text-white'
              }`}>
                {criminal.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm font-semibold">Description:</p>
                <p className="text-sm">{criminal.description}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Reward:</p>
                <p className="text-sm">₹{criminal.reward_on_information}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Last Seen:</p>
                <p className="text-sm">{criminal.last_seen_location}</p>
                <p className="text-sm">{formatDateTime(criminal.last_seen_time)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Probable Location:</p>
                <p className="text-sm">{criminal.probable_location || 'Unknown'}</p>
                <p className="text-sm">Stn code: {criminal.pincode || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Permanent Address:</p>
                <p className="text-sm">{criminal.address || 'Unknown'}</p>
                <p className="text-sm">District: {criminal.district || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Personal Details:</p>
                <p className="text-sm">Age: {criminal.age || 'Unknown'}</p>
                <p className="text-sm">Gender: {criminal.gender || 'Unknown'}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className={`font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm ${
                  showMoreInfo 
                    ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {showMoreInfo ? 'Hide Details' : 'Show Details'}
              </button>
              <button
                onClick={() => setUpdateCriminalComponent(prev=>!prev)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Update
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default CriminalCard;