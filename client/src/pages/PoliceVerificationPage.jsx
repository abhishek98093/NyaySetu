import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingUsersByPincode,updateUserVerificationStatus } from '../apicalls/policeapi';
import { toast } from 'react-toastify';
import ProfileCard from '../components/ProfileCard';
import { useSelector } from 'react-redux';
const PoliceVerificationPage = () => {
    const policeDetails = useSelector(state => state.user.policeDetails);
    const pincode=policeDetails.station_pincode;
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  // FETCH pending users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['pendingUsers', pincode],
    queryFn: () => getPendingUsersByPincode(pincode),
    enabled: !!pincode,
  });

  // UPDATE verification status
  const mutation = useMutation({
    mutationFn: updateUserVerificationStatus,
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries(['pendingUsers', pincode]);
      setSelectedUser(null); // Close if modal open
    },
    onError: (err) => toast.error(err.message || 'Update failed'),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending User Verifications</h1>

      {users?.length === 0 ? (
        <p>No pending users for this pincode.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {users.map((user) => (
  <div
    key={user.user_id}
    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 flex flex-col items-center text-center space-y-4 transition hover:shadow-xl"
  >
    <img
      src={user.profile_picture_url || 'https://via.placeholder.com/100'}
      alt={`${user.name}'s profile`}
      className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
    />
    <div>
      <p className="text-xl font-semibold text-gray-800">{user.name}</p>
      <p className="text-sm text-gray-600">{user.email}</p>
      <p className="text-sm text-gray-500">📞 {user.phone_number}</p>
    </div>
    <div className="flex gap-3 mt-2">
      <button
        onClick={() => setSelectedUser(user)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm shadow-md"
      >
        👁 View
      </button>
      <button
        onClick={() => mutation.mutate({ userId: user.user_id, status: 'verified' })}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm shadow-md"
      >
        ✅ Verify
      </button>
      <button
        onClick={() => mutation.mutate({ userId: user.user_id, status: 'failed' })}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm shadow-md"
      >
        ❌ Reject
      </button>
    </div>
  </div>
))}

        </div>
      )}

      {selectedUser && (
        <ProfileCard user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default PoliceVerificationPage;
