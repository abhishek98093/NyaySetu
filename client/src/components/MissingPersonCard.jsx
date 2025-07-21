
// import React, { useState } from 'react';
// import { QueryClient, useMutation,useQueryClient } from '@tanstack/react-query';
// import { useSelector } from 'react-redux';
// import { deleteMissingPerson } from '../apicalls/policeapi';
// import { toast } from 'react-toastify';
// import LoadingPage from './LoadingPage';
// import ErrorPage from './ErrorPage';
// import UpdateMissing from './UpdateMissing';
// const formatDateTime = (isoString) => {
//   const date = new Date(isoString);
//   return date.toLocaleString('en-IN', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// const StarDisplay = ({ star }) => {
//   const starColors = [
//     'text-red-400',
//     'text-red-400',
//     'text-red-500',
//     'text-red-500',
//     'text-red-500',
//     'text-red-600'
//   ];
//   const colorClass = starColors[Math.min(star, 5)] || starColors[0];
  
//   return (
//     <div className={`text-3xl font-bold ${colorClass} text-center`}>
//       {'★'.repeat(star)}{'☆'.repeat(5-star)}
//     </div>
//   );
// };

// const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
//         <h3 className="text-lg font-bold mb-4">Confirm Action</h3>
//         <p className="mb-6">{message}</p>
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MissingPersonCard = ({ missing, onUpdate }) => { 
//   const [updateMissingComponent,setUpdateMissingComponent]=useState(false);
//   const [showMoreInfo, setShowMoreInfo] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [loading,setLoading]=useState(false);
//   const user = useSelector(state => state.user.user);
//     const queryClient = useQueryClient();
 

//     const deleteMissingMutation = useMutation({
//   mutationFn: deleteMissingPerson,
//   onSuccess: async () => {
//     setLoading(true);
//     toast.success("Record deleted");

//     await queryClient.invalidateQueries(['allMissingAndmissings', user?.user_id]);

//     setLoading(false);
//   },
//   onError: (err) => {
//     toast.error(err?.response?.data?.error || "Error deleting record");
//   }
// });

//     const handleDeleteClick = () => {
//   setShowDeleteConfirm(true);
// };



//   const handleConfirmDelete = () => {
//     deleteMissingMutation.mutate(missing.missing_id);
//     setShowDeleteConfirm(false);
//   };

//   const handleCancelDelete = () => {
//     setShowDeleteConfirm(false);
//   };
//  if (deleteMissingMutation.isPending || loading) {
//   return <LoadingPage status="load" message="Deleting record, please wait..." />;
// }

// if (deleteMissingMutation.isError) {
//   return <ErrorPage message={deleteMissingMutation.error?.message || "Something went wrong"} />;
// }

//   return (
//     <>
//    {updateMissingComponent && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
//     <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 my-8 max-h-[90vh] overflow-y-auto">
//       <UpdateMissing
//         missing={missing}
//         setUpdateMissingComponent={setUpdateMissingComponent}
//       />
//     </div>
//   </div>
// )}


//       <ConfirmationModal
//         isOpen={showDeleteConfirm}
//         onClose={handleCancelDelete}
//         onConfirm={handleConfirmDelete}
//         message={`Are you sure you want to delete ${missing.name}? This action cannot be undone.`}
//       />

//       {/* Mobile View (hidden on md+) */}
//       <div className="md:hidden bg-white border border-red-200 rounded-lg shadow-sm overflow-hidden mb-4">
//         {/* Header */}
//         <div className="bg-green-600 text-white p-3 font-bold text-lg text-center">
//           MISSING: {missing.name}
//         </div>

//         <div className="p-4 flex flex-col gap-4 text-gray-800">
//           <div className="flex flex-col items-center">
//             <img
//               src={missing.profile_picture_url}
//               alt={missing.name}
//               className="w-40 h-40 object-cover rounded-md mx-auto"
//               onError={(e) => {
//                 e.target.src = 'https://via.placeholder.com/160?text=No+Image';
//               }}
//             />
//           </div>

//           <div className="space-y-3">
//             <p className="text-sm"><strong>Description:</strong> {missing.description}</p>
            
//             <div>
//               <p className="text-sm font-semibold">Last Seen:</p>
//               <p className="text-sm pl-2">{missing.last_seen_location}</p>
//               <p className="text-sm pl-2">{formatDateTime(missing.last_seen_time)}</p>
//             </div>
            
//             <div>
//               <p className="text-sm font-semibold">Probable Location:</p>
//               <p className="text-sm pl-2">{missing.probable_location || 'Unknown'}</p>
//                <p className="text-sm pl-2">Stn code: {missing.pincode || 'Unknown'}</p>
//             </div>

//             <div>
//               <p className="text-sm font-semibold">Permanent Address:</p>
//               <p className="text-sm pl-2">{missing.address || 'Unknown'}</p>
//               <p className="text-sm pl-2">{missing.district || 'Unknown district'}</p>
             
//             </div>

//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <p className="text-sm font-semibold">Age:</p>
//                 <p className="text-sm">{missing.age || 'Unknown'}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-semibold">Gender:</p>
//                 <p className="text-sm">{missing.gender || 'Unknown'}</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-sm"><strong>Reward:</strong> ₹{missing.reward_on_information}</p>
//             </div>
//             <p className="text-sm">
//               <span className={`text-xs font-semibold px-2.5 py-0.5 rounded uppercase ${
//   missing.status === 'active' ? 'bg-red-600 text-white' :
//   missing.status === 'found' ? 'bg-green-600 text-white' :
//   'bg-gray-600 text-white'
// }`}>
//   {missing.status}
// </span>



//             </p>
//           </div>
//         </div>

//         <div className="px-4 pb-4 grid grid-cols-2 gap-3">
//           <button
//             onClick={() => setShowMoreInfo(!showMoreInfo)}
//             className={`font-semibold py-2 px-2 rounded-lg transition-colors duration-200 text-sm ${
//               showMoreInfo 
//                 ? 'bg-gray-500 hover:bg-gray-600 text-white' 
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             {showMoreInfo ? 'Hide' : 'More'}
//           </button>
//           <button
//             onClick={() => setUpdateMissingComponent(prev=>!prev)}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-2 rounded-lg transition-colors duration-200 text-sm"
//           >
//             Update
//           </button>
//           <button
//             onClick={handleDeleteClick}
//             className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-2 rounded-lg transition-colors duration-200 text-sm col-span-2"
//           >
//             Delete
//           </button>
//         </div>

        
//       </div>

//       {/* Desktop View (hidden on md-) */}
//       <div className="hidden md:block bg-white border border-red-200 rounded-lg shadow-sm overflow-hidden mb-4">
//         <div className="flex">
//           <div className="w-1/3 p-4 flex flex-col items-center">
//             <img
//               src={missing.profile_picture_url}
//               alt={missing.name}
//               className="w-48 h-48 object-cover rounded-md"
//               onError={(e) => {
//                 e.target.src = 'https://via.placeholder.com/192?text=No+Image';
//               }}
//             />
//             <div className="mt-4">
//               <StarDisplay star={missing.star} />
//             </div>
//           </div>

//           <div className="w-2/3 p-4 border-l border-gray-200">
//             <div className="flex justify-between items-start mb-2">
//               <h3 className="text-xl font-bold text-green-700">MISSING: {missing.name}</h3>

//              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded uppercase ${
//   missing.status === 'active' ? 'bg-red-600 text-white' :
//   missing.status === 'found' ? 'bg-green-600 text-white' :
//   'bg-gray-600 text-white'
// }`}>
//   {missing.status}
// </span>

//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-3">
//               <div>
//                 <p className="text-sm font-semibold">Description:</p>
//                 <p className="text-sm">{missing.description}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-semibold">Reward:</p>
//                 <p className="text-sm">₹{missing.reward_on_information}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-semibold">Last Seen:</p>
//                 <p className="text-sm">{missing.last_seen_location}</p>
//                 <p className="text-sm">{formatDateTime(missing.last_seen_time)}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-semibold">Probable Location:</p>
//                 <p className="text-sm">{missing.probable_location || 'Unknown'}</p>
//                 <p className="text-sm">Stn code: {missing.pincode || 'Unknown'}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-semibold">Permanent Address:</p>
//                 <p className="text-sm">{missing.address || 'Unknown'}</p>
//                 <p className="text-sm">District: {missing.district || 'Unknown'}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-semibold">Personal Details:</p>
//                 <p className="text-sm">Age: {missing.age || 'Unknown'}</p>
//                 <p className="text-sm">Gender: {missing.gender || 'Unknown'}</p>
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3 mt-4">
//               <button
//                 onClick={() => setShowMoreInfo(!showMoreInfo)}
//                 className={`font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm ${
//                   showMoreInfo 
//                     ? 'bg-gray-500 hover:bg-gray-600 text-white' 
//                     : 'bg-blue-600 hover:bg-blue-700 text-white'
//                 }`}
//               >
//                 {showMoreInfo ? 'Hide Details' : 'Show Details'}
//               </button>
//               <button
//                 onClick={() => setUpdateMissingComponent(prev=>!prev)}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
//               >
//                 Update
//               </button>
//               <button
//                 onClick={handleDeleteClick}
//                 className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>
//     </>
//   );
// };

// export default MissingPersonCard;


import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteMissingPerson, getMissingLeads } from '../apicalls/policeapi';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';
import UpdateMissing from './UpdateMissing';
import UploadSignMissing from './UploadSignMissing'; // Needed for citizen reporting

// --- Helper Components (Can be moved to a shared file) ---

const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
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
  const starColors = ['text-yellow-400', 'text-yellow-400', 'text-yellow-500', 'text-yellow-500', 'text-yellow-500', 'text-yellow-600'];
  const colorClass = starColors[Math.min(star, 5)] || starColors[0];
  return (
    <div className={`text-3xl font-bold ${colorClass} text-center`}>
      {'★'.repeat(star)}{'☆'.repeat(5 - star)}
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
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const LeadsModal = ({ isOpen, onClose, leads, isLoading, isError, error }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-green-600 text-white rounded-t-lg">
            <h3 className="text-xl font-bold">Sighting Leads</h3>
            <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl font-bold">&times;</button>
          </div>
          <div className="p-6 overflow-y-auto bg-green-50">
            {isLoading && <LoadingPage message="Fetching leads..." />}
            {isError && <ErrorPage message={error?.response?.data?.error || "Failed to fetch leads."} />}
            {(!isLoading && !isError && leads && leads.length > 0) ? (
              <div className="space-y-4">
                {leads.map((lead, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>Sighting Time:</strong> {formatDateTime(lead.time_of_sighting)}</p>
                        <p><strong>Location:</strong> {`${lead.address || 'N/A'}, ${lead.district || 'N/A'}, ${lead.pincode || 'N/A'}`}</p>
                        <p><strong>Details:</strong> {lead.update_text}</p>
                        <p className="text-xs text-gray-500 pt-2"><strong>Reported by User ID:</strong> {lead.updated_by}</p>
                      </div>
                      <div className="flex items-center justify-center bg-gray-100 rounded-md p-2">
                        {lead.proof_url ? <img src={lead.proof_url} alt="Sighting proof" className="max-w-full max-h-48 rounded-md object-contain" /> : <div className="text-center text-gray-500 text-sm">No proof provided.</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (!isLoading && <p className="text-center text-gray-500">No leads have been reported for this person yet.</p>)}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end">
            <button onClick={onClose} className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Close</button>
          </div>
        </div>
      </div>
    );
};

// --- Main Component ---

const MissingPersonCard = ({ missing }) => {
  const [updateMissingComponent, setUpdateMissingComponent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [showUploadSignMissing, setShowUploadSignMissing] = useState(false);

  const user = useSelector(state => state.user.user);
  const queryClient = useQueryClient();

  const deleteMissingMutation = useMutation({
    mutationFn: deleteMissingPerson,
    onSuccess: () => {
      toast.success("Record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['allMissingAndCriminals', user?.user_id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Error deleting record");
    }
  });

  const {
    data: leadsData,
    isLoading: areLeadsLoading,
    isError: isLeadsError,
    error: leadsError,
  } = useQuery({
    queryKey: ['leads', missing.missing_id],
    queryFn: () => getMissingLeads(missing.missing_id), 
    
    enabled: showLeadsModal, // Fetch only when the modal is open
  });

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => {

    deleteMissingMutation.mutate(missing.missing_id);
    setShowDeleteConfirm(false);
  };

  if (deleteMissingMutation.isPending) return <LoadingPage status="load" message="Deleting record..." />;
  if (deleteMissingMutation.isError) return <ErrorPage message={deleteMissingMutation.error?.message || "Something went wrong"} />;

  return (
    <>
      {/* All Modals */}
      {showUploadSignMissing && <UploadSignMissing missingId={missing.missing_id} onClose={() => setShowUploadSignMissing(false)} />}
      <LeadsModal isOpen={showLeadsModal} onClose={() => setShowLeadsModal(false)} leads={leadsData?.leads || []} isLoading={areLeadsLoading} isError={isLeadsError} error={leadsError} />
      {updateMissingComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 my-8 max-h-[90vh] overflow-y-auto">
            <UpdateMissing missing={missing} setUpdateMissingComponent={setUpdateMissingComponent} />
          </div>
        </div>
      )}
      <ConfirmationModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleConfirmDelete} message={`Are you sure you want to delete ${missing.name}? This action is irreversible.`} />

      {/* Unified Responsive Card Layout */}
      <div className="bg-white border border-green-200 rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 p-4 flex flex-col items-center justify-center bg-gray-50/50">
                <img src={missing.profile_picture_url} alt={missing.name} className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-md shadow-md" onError={(e) => { e.target.src = 'https://via.placeholder.com/192?text=No+Image'; }} />
                <div className="mt-4">
                    <StarDisplay star={missing.star} />
                </div>
            </div>

            <div className="w-full md:w-2/3 p-4 md:border-l md:border-gray-200">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-green-700">MISSING: {missing.name}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded uppercase ${
                        missing.status === 'active' ? 'bg-red-600 text-white' :
                        missing.status === 'found' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                    }`}>
                        {missing.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm text-gray-800">
                    <div>
                        <p className="font-semibold">Description:</p>
                        <p>{missing.description}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Reward:</p>
                        <p>₹{missing.reward_on_information}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Last Seen:</p>
                        <p>{missing.last_seen_location}</p>
                        <p className="text-gray-600">{formatDateTime(missing.last_seen_time)}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Probable Location:</p>
                        <p>{missing.probable_location || 'Unknown'}</p>
                        <p className="text-gray-600">Pincode: {missing.pincode || 'Unknown'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Permanent Address:</p>
                        <p>{missing.address || 'Unknown'}</p>
                        <p className="text-gray-600">District: {missing.district || 'Unknown'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Personal Details:</p>
                        <p>Age: {missing.age || 'Unknown'}</p>
                        <p>Gender: {missing.gender || 'Unknown'}</p>
                    </div>
                </div>

                <div className={`pt-3 border-t border-gray-200 grid gap-2 ${user?.role === 'citizen' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
                    {user?.role === 'citizen' ? (
                        <button onClick={() => setShowUploadSignMissing(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm">
                            ℹ️ Report Information / Sighting
                        </button>
                    ) : (
                        <>
                            <button onClick={() => setShowLeadsModal(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm">
                                View Leads
                            </button>
                            <button onClick={() => setUpdateMissingComponent(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm">
                                Update
                            </button>
                            <button onClick={handleDeleteClick} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm">
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default MissingPersonCard;