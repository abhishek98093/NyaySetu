import { useEffect, useState,useRef } from "react"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import PersonnelCard from "../components/PersonnelCard"
import { fetchFilteredPolice,getPolicePersonnelAnalysis } from "../apicalls/adminapi"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddPoliceOfficer from "../components/AddPoliceOfficer";
import { toast } from "react-toastify";
import AdminPersonnelStats from "../components/AdminPersonnelStats";

const AdminPersonnel = () => {
  const [addPolice, setAddPolice] = useState(false);
  const [policeList, setPoliceList] = useState([])
  const [filters, setFilters] = useState({
    rank: "",
    pincode: "",
    gender: "",
    badge_number: "",
    station_code: "",
  })
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [total, setTotal] = useState(0)

  const totalPages = Math.ceil(total / limit)
  const [personnelStats, setPersonnelStats] = useState({
  total_personnel: 0,
  available_for_duty: 0,
  rank_distribution: {},
  status_distribution: {}
});
const[isFilter,setIsFilter]=useState(false);
const [error, setError] = useState(null);

const personnelStatsFetchedAt = useRef(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getPolicePersonnelAnalysis();
      console.log("API Response:", result); // Debug log

      if (!result.success || !result.data) {  // Changed from result.data to result.stats
        throw new Error(result.error || 'No stats received from server');
      }

      localStorage.setItem("personnelStats", JSON.stringify(result.data));
      localStorage.setItem("personnelStatsFetchedAt", Date.now().toString());

      setPersonnelStats(result.data);  // Using result.stats instead of result.data
      personnelStatsFetchedAt.current = Date.now();
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError(err.message || 'Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const now = Date.now();
  const cachedTime = localStorage.getItem("personnelStatsFetchedAt");

  if (cachedTime && now - parseInt(cachedTime, 10) < 5 * 60 * 1000) {
    try {
      const cachedData = localStorage.getItem("personnelStats");
      const parsedData = cachedData ? JSON.parse(cachedData) : null;

      if (parsedData) {
        setPersonnelStats(parsedData);
      }
    } catch (e) {
      console.error("Error parsing localStorage data", e);
    }
  } else {
    fetchData();
  }

  const interval = setInterval(fetchData, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);





  const handleFetch = async () => {
  try {
    setLoading(true);
    setIsFilter(true);
    // Clean & validate filters before sending
    const parsedFilters = {};
    if (filters.gender && ['male', 'female', 'other'].includes(filters.gender.toLowerCase())) {
      parsedFilters.gender = filters.gender.toLowerCase();
    }

    if (filters.rank && ['Inspector', 'Sub-Inspector'].includes(filters.rank)) {
      parsedFilters.rank = filters.rank;
    }

    if (filters.pincode && /^\d{6}$/.test(filters.pincode)) {
      parsedFilters.pincode = filters.pincode;
    }

    if (filters.badge_number && !isNaN(Number(filters.badge_number))) {
      parsedFilters.badge_number = Number(filters.badge_number); // police_id in DB is integer
    }

    if (filters.station_code) {
      parsedFilters.station_code = filters.station_code;
    }

    const result = await fetchFilteredPolice({
      filters: parsedFilters,
      page,
      limit,
    });

    if (result?.success) {
      setPoliceList(result.police);
      setTotal(result.total);
    } else {
      toast.error(result?.message || 'Failed to fetch police data');
      setIsFilter(false);
    }

  } catch (error) {
    console.error('Error fetching police data:', error);
    toast.error('An unexpected error occurred while fetching police list');
    setIsFilter(false);
  } finally {
    setLoading(false);
  }
};




  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = () => {
    setPage(1)
    handleFetch()
  }





  return (
    <div className="min-h-screen bg-gray-50 mt-7 ">
      {/* Header */}
       {addPolice && (
  <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen px-4 py-10">
      <AddPoliceOfficer onClose={() => setAddPolice(false) } setPoliceList={setPoliceList} />
    </div>
  </div>
)}
 
      {!addPolice && <button
      onClick={()=>setAddPolice(true)}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg z-50 flex items-center gap-2"
      aria-label="Add Officer"
    > 
      <PersonAddIcon fontSize="small" />
      Add Officer
    </button>
}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Police Personnel Management</h1>
        </div>
      </div>

      {/* Single Line Filter Bar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-4 h-4" />
              <span className="font-medium text-sm">Filters:</span>
            </div>

            <select
              name="rank"
              value={filters.rank}
              onChange={handleInputChange}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[120px]"
            >
              <option value="">All Ranks</option>
              <option value="Inspector">Inspector</option>
              <option value="Sub-Inspector">Sub-Inspector</option>
            </select>

            <input
              type="text"
              name="pincode"
              value={filters.pincode}
              onChange={handleInputChange}
              placeholder="Pincode"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-24"
            />

            <select
              name="gender"
              value={filters.gender}
              onChange={handleInputChange}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[100px]"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              type="text"
              name="badge_number"
              value={filters.badge_number}
              onChange={handleInputChange}
              placeholder="Badge No."
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-28"
            />

            <input
              type="text"
              name="station_code"
              value={filters.station_code}
              onChange={handleInputChange}
              placeholder="Station Code"
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
            />

            <button
              onClick={loading ? null : handleSearch}
              disabled={loading}
              className={`${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-1.5 rounded-md font-medium transition-colors flex items-center gap-2 text-sm`}
            >
              {loading ? (
                <div className="flex items-center gap-1 ">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
            <button
  type="button"
  onClick={() => {
    setFilters({
      rank: "",
      pincode: "",
      gender: "",
      badge_number: "",
      station_code: "",
    });
    setPage(1);
    setPoliceList([]); // optionally trigger a fetch here if needed
    setIsFilter(false);
  }}
  className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 text-sm"
>
  Clear / Remove
</button>



            {/* Pagination in same line */}
            <div className="flex items-center gap-3 ml-auto">
  <span className="text-sm text-gray-600">
    Page {page} of {totalPages} ({total} total)
  </span>

  <div className="flex items-center gap-1">
    {/* Prev Button */}
    <button
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      disabled={page <= 1}
      className="p-1.5 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>

    {/* Page Input */}
    <input
      type="number"
      value={page}
      onChange={(e) => {
        let newPage = parseInt(e.target.value);
        if (isNaN(newPage) || newPage < 1) newPage = 1;
        if (newPage > totalPages) newPage = totalPages;
        setPage(newPage);
      }}
      className="w-12 text-center text-sm border border-gray-300 rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      min="1"
      max={totalPages}
    />

    {/* Next Button */}
    <button
      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={page >= totalPages}
      className="p-1.5 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
</div>

          </div>
        </div>
      </div>
      {!isFilter && Object.keys(personnelStats).length > 0 &&
    <div className="mt-20 px-4"> {/* adjust mt as per navbar height */}
      <AdminPersonnelStats data={personnelStats} />
    </div>
  
}

      {/* Full Screen Personnel Grid */}
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6 mt-5">
  {policeList.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
      {policeList.map((officer, index) => (
        <div
          key={officer.id || index}
          className="transform hover:scale-[1.02] transition-transform duration-200"
        >
          <PersonnelCard
            policePersonal={officer}
            setPoliceList={setPoliceList}
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        No Personnel Found
      </h3>
      <p className="text-gray-500 max-w-md">
        No police personnel match your current filters. Try adjusting your search criteria or clearing some filters.
      </p>
    </div>
  )}
</div>


    </div>
  )
}

export default AdminPersonnel;
