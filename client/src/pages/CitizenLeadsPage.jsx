import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react'; // Only Plus icon is used here
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getTopContributorsInArea } from '../apicalls/citizenapi';
import { toast } from 'react-toastify';
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';
import CitizenLeadsForm from '../components/CitizenLeadsForm';

const CitizenLeadsPage = () => {
    const [showLeadForm, setShowLeadForm] = useState(false);
    const user = useSelector(state => state.user.user);
    const queryClient = useQueryClient();
    const [leaderBoardData, setLeaderBoardData] = useState([]);

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['localLeaderBoard', user.user_id],
        queryFn: getTopContributorsInArea,
        onError: (err) => {
            toast.error(err || 'Error fetching data, please try after some time');
        },
        cacheTime: 7 * 60 * 60,
        staleTime: 5 * 60 * 60,
        retry: 3
    });

   useEffect(() => {
  if (data && data.data) {
    const transformed = data.data.map(person => ({
      userId: person.user_id,
      name: person.name,
      stars: person.contribution_points,
      profileUrl: person.profile_picture_url
    }));
    setLeaderBoardData(transformed);
  } else {
    setLeaderBoardData([]);
  }
}, [data]);


    const currentUser = leaderBoardData?.find(dummy => dummy.userId === user.user_id) || {
  userId: user.user_id,
  name: user.name,
  stars: 0,
  profileUrl: user.profile_picture_url
};


   const getUserRankAndStars = (currentUserId, leaderboardData, currentUserStars) => {
  let combinedData = [...leaderboardData];
  const userInLeaderboard = combinedData.find(person => person.userId === currentUserId);

  if (userInLeaderboard) {
    currentUserStars = userInLeaderboard.stars;
  } else {
    combinedData.push({
      userId: currentUserId,
      name: user.name,
      stars: currentUserStars,
      profileUrl: user.profile_picture_url
    });
  }

  combinedData.sort((a, b) => b.stars - a.stars);

  const userIndex = combinedData.findIndex(person => person.userId === currentUserId);
  const rank = userIndex !== -1 ? userIndex + 1 : 'N/A';

  return { rank, stars: currentUserStars };
};


    const { rank: currentUserRank, stars: currentUserDisplayStars } = getUserRankAndStars(
        currentUser.user_id,
        leaderBoardData,
        currentUser.stars
    );

    const handleAddLeadClick = () => setShowLeadForm(true);
    const handleCloseLeadForm = () => setShowLeadForm(false);
    if (isPending) {
        return <LoadingPage status={'load'} message={'Fetching LeaderBoard'} />
    }
    if (isError) {
        return <ErrorPage message={'Error in fetching leaderboard, refersh'} />
    }
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
            {/* Header */}
            
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 sm:py-8 rounded-b-xl shadow-md mb-6">
  <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-3 drop-shadow-md">
      Help Us Make Your City Safer
    </h2>
    <p className="text-sm sm:text-base opacity-90 leading-relaxed max-w-2xl mx-auto">
      Your vigilance is crucial. By uploading leads like videos or images of suspicious activities,
      thefts, or individuals, you can provide vital information that significantly aids police investigations
      and ensures justice for our community. <strong>For every lead that directly contributes to solving a case,
      you earn a star!</strong> Your contributions are invaluable in fostering a safer environment for everyone.
    </p>
    <p className="mt-3 text-xs opacity-80">
      No stars are awarded for anonymous reports, as we do not store your identity in such cases.
    </p>
  </div>
</section>



                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {showLeadForm ? (
                        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
                            <CitizenLeadsForm onClose={handleCloseLeadForm} />
                        </div>
                    ) : (
                        <>
                            {/* Leaderboard Section */}
                            <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Top Contributors Leaderboard</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                                                >
                                                    Rank
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Profile & Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                                                >
                                                    Stars
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {leaderBoardData.map((person, index) => (
                                                <tr key={person.userId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex items-center">
                                                            {person.profileUrl ? (
                                                                <img
                                                                    src={person.profileUrl}
                                                                    alt={`${person.name}'s profile`}
                                                                    className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm mr-3"
                                                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/CCCCCC/666666?text=${person.name.charAt(0).toUpperCase()}`; }}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200 shadow-sm mr-3">
                                                                    {person.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            {person.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.721c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                                            </svg>
                                                            {person.stars}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Your Contribution Section */}
                            <section className="mt-8 bg-blue-50 rounded-lg shadow-md p-6 sm:p-8 border border-blue-200">
                                <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">Your Contribution</h3>
                                <div className="flex justify-around items-center text-lg font-medium text-gray-700">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="text-blue-700">{currentUser.name}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Stars</p>
                                        <p className="text-blue-700">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                                <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.721c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                                </svg>
                                                {currentUserDisplayStars}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Rank</p>
                                        <p className="text-blue-700">
                                            {currentUserRank}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Submit Lead to Learn and Contribute Section */}
                            <div className="mt-12 bg-white rounded-lg shadow-md p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
  <h3 className="text-xl font-medium text-gray-900">Submit a lead to learn and contribute!</h3>
  <p className="mt-2 text-gray-500">Click the "Add Lead" button to make your first contribution.</p>
  <button
    onClick={handleAddLeadClick}
    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    Add Lead
  </button>
</div>

                        </>
                    )}
                </div>
            </main>

            {/* Add Lead Button */}
            {!showLeadForm && (
                <button
                    onClick={handleAddLeadClick}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 z-50"
                    aria-label="Add New Lead"
                    title="Add New Lead"
                >
                    <Plus className="h-7 w-7" />
                </button>
            )}

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Citizen Leads. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default CitizenLeadsPage;
