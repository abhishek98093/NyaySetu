import { useEffect, useState } from "react"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import PersonnelCard from "../components/PersonnelCard"
import { fetchFilteredPolice } from "../apicalls/adminapi"

const AdminPersonnel = () => {
  const [policeList, setPoliceList] = useState([])
  const [filters, setFilters] = useState({
    rank: "",
    pincode: "",
    gender: "",
    badge_number: "",
    station_code: "",
  })
  const [loading,setLoading]=useState(false);

  const [page, setPage] = useState(1)
  const [limit] = useState(12) 
  const [total, setTotal] = useState(0)

  const totalPages = Math.ceil(total / limit)

 const handleFetch = async () => {
  setLoading(true);
  const result = await fetchFilteredPolice({ filters, page, limit });
  if (result.success) {
    setPoliceList(result.police);
    setTotal(result.total);
  }
  setLoading(false);
};



  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = () => {
    setPage(1)
    handleFetch()
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-7">
      {/* Header */}
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
  className={`${
    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
  } text-white px-4 py-1.5 rounded-md font-medium transition-colors flex items-center gap-2 text-sm`}
>
  {loading ? (
    <div className="flex items-center gap-1">
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


            {/* Pagination in same line */}
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages} ({total} total)
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <input
                  type="number"
                  value={page}
                  onChange={(e) => setPage(Math.max(1, Math.min(Number.parseInt(e.target.value) || 1, totalPages)))}
                  className="w-12 text-center text-sm border border-gray-300 rounded px-1 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max={totalPages}
                />

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-1.5 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Personnel Grid */}
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
        {policeList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4
">
            {policeList.map((officer, index) => (
              <div key={officer.id || index} className="transform hover:scale-105 transition-transform duration-200">
                <PersonnelCard policePersonal={officer} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Personnel Found</h3>
            <p className="text-gray-500 text-center max-w-md">
              No police personnel match your current filters. Try adjusting your search criteria or clearing some
              filters.
            </p>
            <button
              onClick={() => {
                setFilters({
                  rank: "",
                  pincode: "",
                  gender: "",
                  badge_number: "",
                  station_code: "",
                })
                setPage(1)
                handleFetch()
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPersonnel;
