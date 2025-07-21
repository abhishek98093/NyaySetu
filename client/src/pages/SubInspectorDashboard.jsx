import { useState,useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import ProfileCard from '../components/ProfileCard';
import UserProfileCard from '../components/UserProfileCard';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getPoliceComplaints } from '../apicalls/policeapi';
import { toast } from 'react-toastify';
import dayjs from "dayjs"; // install via npm install dayjs
import LoadingPage from '../components/LoadingPage';
import ErrorPage from '../components/ErrorPage';
const SubInspectorDashboard = () => {
    const user = useSelector(state => state.user.user);

    const { data, isPending, isError, error } = useQuery({
  queryKey: ['stationComplaints', user?.user_id],
  queryFn: () => getPoliceComplaints(),
  onSuccess: (data) => {
    toast.success('Data fetched successfully');
  },
  onError: (err) => {
    toast.error(err?.response?.data?.message || err.message || "Error fetching data");
  },
  cacheTime: 5 * 60 * 1000,     // 5 minutes
  staleTime: 5 * 60 * 1000,     // 5 minutes
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchInterval: false,
  retry: 3,  // ✅ Retry only up to 3 times on failure
});

  
      const [pendingComplaints, setPendingComplaints] = useState([]);
  const [inProgressComplaints, setInProgressComplaints] = useState([]);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [rejectedComplaints, setRejectedComplaints] = useState([]);
  const [totalOfficers,setTotalOfficers]=useState(0);
  
 const [monthlyCounts, setMonthlyCounts] = useState(Array(12).fill(0)); 

  useEffect(() => {
    if (data?.complaints) {
      // Reset state
      setPendingComplaints([]);
      setInProgressComplaints([]);
      setResolvedComplaints([]);
      setRejectedComplaints([]);
      const monthTemp = Array(12).fill(0);

      data.complaints.forEach((complaint) => {
        // Categorize by status
        switch (complaint.status.toLowerCase()) {
          case "pending":
            setPendingComplaints((prev) => [...prev, complaint]);
            break;
          case "in-progress":
            setInProgressComplaints((prev) => [...prev, complaint]);
            break;
          case "resolved":
            setResolvedComplaints((prev) => [...prev, complaint]);
            break;
          case "rejected":
            setRejectedComplaints((prev) => [...prev, complaint]);
            break;
          default:
            break;
        }

        // Categorize by month
        const monthIndex = dayjs(complaint.created_at).month(); // 0 - Jan, 11 - Dec
        monthTemp[monthIndex]++;
      });

      setMonthlyCounts(monthTemp);
      setTotalOfficers(data.subInspectors.length);
    }
  }, [data]);


  const activityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Complaints',
        data: monthlyCounts,
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const solvedCount = resolvedComplaints.length;
const pendingCount = pendingComplaints.length;
const progressCount = inProgressComplaints.length;
const rejectedCount = rejectedComplaints.length;

const solvedData = {
  labels: ['Resolved', 'Pending', 'In Progress', 'Rejected'],
  datasets: [
    {
      data: [solvedCount, pendingCount, progressCount, rejectedCount],
      backgroundColor: ['#10b981', '#facc15', '#3b82f6', '#ef4444'],
    },
  ],
};

    if(isPending){
       return  <LoadingPage status={'load'} message={'The complaints is being fetched , please wait'} />
    }
    if(isError){
        return <ErrorPage />
    }
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-16">

      <div className="max-w-7xl mx-auto">
        {/* ✅ Station Heading */}

        <div className="flex flex-col lg:flex-row gap-6">
          <UserProfileCard />

          {/* Right Column - Stats (2/3) */}
          <div className="w-full lg:w-2/3 space-y-6">
          <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Assigned Statistics</h1>
          <p className="text-gray-600">Overview of complaints and performance</p>
        </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-yellow-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-yellow-600 text-sm font-medium">Active Complaints</h3>
                <p className="text-2xl font-bold text-yellow-800">{progressCount + pendingCount}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-blue-600 text-sm font-medium">In Progress</h3>
                <p className="text-2xl font-bold text-blue-800">{progressCount}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-green-600 text-sm font-medium">Resolved</h3>
                <p className="text-2xl font-bold text-green-800">{solvedCount}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-red-600 text-sm font-medium">Rejected</h3>
                <p className="text-2xl font-bold text-red-800">{rejectedCount}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-red-600 text-sm font-medium">Total Officers</h3>
                <p className="text-2xl font-bold text-red-800">{totalOfficers}</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h3>
              <div className="h-64">
                <Bar
                  data={activityData}
                  options={{
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Case Status</h3>
                <div className="h-48">
                  <Doughnut
                    data={solvedData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              {/* <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Case #2456 resolved</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New case submitted</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-yellow-100 p-1 rounded-full mr-3">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Case #2451 requires attention</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </li>
                </ul>
              </div> */}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SubInspectorDashboard;
