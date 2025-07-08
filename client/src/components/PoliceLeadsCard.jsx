import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { awardStar } from '../apicalls/policeapi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// const MediaViewer = ({ mediaUrl, index }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   if (!mediaUrl) {
//     return (
//       <div className="w-full aspect-square sm:aspect-video flex items-center justify-center text-2xl sm:text-3xl text-gray-500 bg-gray-200 rounded">
//         📸
//       </div>
//     );
//   }

//   if (mediaUrl.match(/\.(jpeg|jpg|gif|png)$/i)) {
//     return (
//       <>
//         <div className="w-full border border-blue-200 rounded overflow-hidden bg-gray-100 cursor-pointer group">
//           <img 
//             src={mediaUrl} 
//             alt={`Lead Media ${index + 1}`} 
//             className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-200" 
//             onClick={() => setIsModalOpen(true)}
//           />
//           <div className="p-2 text-center">
//             <span className="text-xs text-blue-800">(Click to enlarge)</span>
//           </div>
//         </div>
        
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
//             <div className="relative max-w-4xl max-h-full">
//               <img 
//                 src={mediaUrl} 
//                 alt={`Lead Media ${index + 1}`} 
//                 className="max-w-full max-h-full object-contain"
//               />
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}
//       </>
//     );
//   }

//   if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
//     return (
//       <div className="w-full border border-blue-200 rounded overflow-hidden bg-gray-100">
//         <video 
//           controls 
//           src={mediaUrl} 
//           className="w-full h-32 sm:h-40 md:h-48 object-cover"
//         >
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full aspect-square sm:aspect-video flex items-center justify-center text-2xl sm:text-3xl text-gray-500 bg-gray-200 rounded">
//       ❓
//     </div>
//   );
// };
const MediaViewer = ({ mediaUrl, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!mediaUrl) {
    return (
      <div className="w-full aspect-square sm:aspect-video flex items-center justify-center text-2xl sm:text-3xl text-gray-500 bg-gray-200 rounded">
        📸
      </div>
    );
  }

  if (mediaUrl.match(/\.(jpeg|jpg|gif|png)$/i)) {
    return (
      <>
        <div className="w-full border border-blue-200 rounded overflow-hidden bg-gray-100 cursor-pointer group">
          <img 
            src={mediaUrl} 
            alt={`Lead Media ${index + 1}`} 
            className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-200" 
            onClick={() => setIsModalOpen(true)}
          />
          <div className="p-2 text-center">
            <span className="text-xs text-blue-800">(Click to enlarge)</span>
          </div>
        </div>
        
        {/* Modal for enlarged image */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
            <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <img 
                src={mediaUrl} 
                alt={`Lead Media ${index + 1}`} 
                className="max-w-full max-h-full object-contain"
              />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
    return (
      <>
        <div className="w-full border border-blue-200 rounded overflow-hidden bg-gray-100 cursor-pointer group">
          <video 
            src={mediaUrl} 
            className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            Your browser does not support the video tag.
          </video>
          <div className="p-2 text-center">
            <span className="text-xs text-blue-800">(Click to enlarge)</span>
          </div>
        </div>
        
        {/* Modal for enlarged video */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
            <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <video 
                controls 
                src={mediaUrl} 
                className="max-w-full max-h-full object-contain"
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="w-full aspect-square sm:aspect-video flex items-center justify-center text-2xl sm:text-3xl text-gray-500 bg-gray-200 rounded">
      ❓
    </div>
  );
};
const PoliceLeadsCard = ({ lead }) => {
  const [showAllMedia, setShowAllMedia] = useState(false);
  const user = useSelector(state => state.user.user);

  const mediaUrls = lead.media_urls ? Object.values(lead.media_urls) : [];
  const isUserInLead = lead.user_id;

  const mediaToShow = showAllMedia ? mediaUrls : mediaUrls.slice(0, 3);
  const hasMoreMedia = mediaUrls.length > 3;

  const getCompleteLocation = () => {
  const locationParts = [];

  if (lead.location_address) {
    locationParts.push(lead.location_address);
  }
  if (lead.town) locationParts.push(lead.town);
  if (lead.district) locationParts.push(lead.district);
  if (lead.state) locationParts.push(lead.state);
  if (lead.pincode) locationParts.push(lead.pincode);

  return locationParts.join(', ') || 'Location not specified';
};
   
   const awardStarMutation = useMutation({
  mutationFn: ({ user_id }) => awardStar({ user_id }),

  onSuccess: (data) => {
    toast.success(data.message || 'Star awarded successfully');
  },

  onError: (error) => {
    console.error('Award star error:', error);
    toast.error(
      error.response?.data?.error || 'Failed to award star. Please try again.'
    );
  },
});

const handleAwardStar = () => {
  awardStarMutation.mutate({ user_id: lead.user_id });
};


  return (
    <div className="bg-white border-2 border-blue-900 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      
      {/* Title */}
      <div className="mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-blue-900">
          {lead.title}
        </h3>
      </div>

      {/* Location */}
      <div className="mb-3">
        <div className="flex items-start gap-2 text-gray-700 break-words text-sm sm:text-base">
          <strong className="text-blue-800">📍 Location:</strong>
          <span className="flex-1">{getCompleteLocation()}</span>
        </div>
      </div>

      {/* Description */}
      {lead.description && (
        <p className="text-gray-700 mb-3 text-sm sm:text-base line-clamp-3">
          {lead.description}
        </p>
      )}

      {/* Details */}
      <div className="space-y-1 mb-4 text-sm">
        <p className="flex flex-col sm:flex-row sm:items-center">
          <strong className="text-blue-800 mr-2">Incident:</strong>
          <span className="text-gray-700">
            {new Date(lead.incident_datetime).toLocaleString()}
          </span>
        </p>
        <p className="flex flex-col sm:flex-row sm:items-center">
          <strong className="text-blue-800 mr-2">Reported By:</strong>
          <span className={`text-sm px-2 py-1 rounded ${lead.anonymous ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
            {lead.anonymous ? 'Anonymous' : 'Known'}
          </span>
        </p>
      </div>

      {/* Media Section */}
      <div className="space-y-3 mb-4">
        {mediaUrls.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mediaToShow.map((url, i) => (
                <MediaViewer key={i} mediaUrl={url} index={i} />
              ))}
            </div>

            {hasMoreMedia && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllMedia(!showAllMedia)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  {showAllMedia ? 'Show Less' : `Show ${mediaUrls.length - 3} More`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-2xl text-gray-500 bg-gray-200 rounded">
            <div className="text-center">
              <div className="text-3xl mb-2">📸</div>
              <div className="text-sm">No media available</div>
            </div>
          </div>
        )}
      </div>

      

      {/* Award Star Button */}
      {isUserInLead && (
        <div className="flex justify-center">
  <button
    onClick={handleAwardStar}
    disabled={awardStarMutation.isPending}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    title="Award Star"
  >
    {awardStarMutation.isPending ? 'Awarding ' : '⭐ Award Star'}
  </button>
</div>

      )}
    </div>
  );
};

export default PoliceLeadsCard;
