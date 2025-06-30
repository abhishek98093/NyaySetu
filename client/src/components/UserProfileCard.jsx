import React from "react";
import { useSelector } from "react-redux";

const UserProfileCard = ({ setShowProfile }) => {
  const user = useSelector((state) => state.user.user);
  const policeDetails = useSelector((state) => state.user.policeDetails); // get from redux store

  if (!user) return null;

  if (user?.role === "admin") {
    return (
     <div className="w-full lg:w-1/3 p-4">
  {/* Card Container */}
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
    {/* Profile Header with Gradient Background & Subtle Pattern */}
    <div className="relative bg-gradient-to-br from-teal-700 to-cyan-600 p-8 text-center text-white overflow-hidden">
      {/* Abstract Background Pattern (Subtle Diagonal Lines) */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff33 25%, transparent 25%, transparent 75%, #ffffff33 75%, #ffffff33), linear-gradient(45deg, #ffffff33 25%, transparent 25%, transparent 75%, #ffffff33 75%, #ffffff33)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
      
      {/* Profile Picture */}
      <div className="w-32 h-32 mx-auto rounded-full border-5 border-white bg-gray-200 overflow-hidden relative z-10 shadow-lg ring-4 ring-teal-300/50">
        <img
          src={user?.profile_picture_url || "/src/assets/no-profile-pic.png"}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/src/assets/no-profile-pic.png";
          }}
        />
      </div>
      
      {/* Name and Role */}
      <h2 className="text-3xl font-extrabold mt-5 relative z-10 drop-shadow-md">
        {user?.name || "Admin"}
      </h2>
      <p className="text-teal-200 text-lg font-medium relative z-10 mt-1">
        Administrator
      </p>
    </div>

    {/* Profile Details Section */}
    <div className="p-8 space-y-7">
      {/* Location Details - styled as a full-width block */}
      <div className="bg-teal-50 bg-opacity-70 rounded-lg p-5 border border-teal-200 shadow-sm">
        <h3 className="text-md font-bold text-teal-800 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Location
        </h3>
        <p className="text-gray-900 font-semibold text-lg">
          {user?.town || "City"}, {user?.district || "District"}
        </p>
        <p className="text-gray-700 text-md mt-1">{user?.state || "State"}</p>
      </div>

      {/* Additional Admin-specific details could go here in a grid if available */}
      {/* Example: Contact Email, Last Login etc. (currently not in original snippet) */}
      {/*
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="border-l-4 border-emerald-500 pl-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Email</h3>
          <a href={`mailto:${user?.email}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg mt-1 block truncate">
            {user?.email || "N/A"}
          </a>
        </div>
        <div className="border-l-4 border-lime-500 pl-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Last Login</h3>
          <p className="text-gray-800 text-lg mt-1">
            {user?.last_login ? new Date(user.last_login).toLocaleString() : "N/A"}
          </p>
        </div>
      </div>
      */}

      {/* Button (if any actions are needed for admin, e.g., "Manage Users") */}
      {/* For this snippet, since there's no button in the original, I'll omit it, 
          but if you add one, style it like the previous cards. */}
      {/*
      <button
        className="w-full mt-6 bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition-colors duration-200 text-lg font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
      >
        Manage System
      </button>
      */}
    </div>
  </div>
</div>
    );
  }

  // ✅ Police card
  if (user?.role === "police" && policeDetails) {
    return(
      <div className="w-full lg:w-1/3 p-4"> {/* Added padding around the card */}
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
    {/* Profile Header with Gradient Background & Subtle Pattern */}
    <div className="relative bg-gradient-to-br from-blue-700 to-indigo-600 p-8 text-center text-white overflow-hidden">
      {/* Abstract Background Pattern (Dots) */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff33 1px, transparent 1px), radial-gradient(#ffffff33 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
      
      {/* Profile Picture */}
      <div className="w-32 h-32 mx-auto rounded-full border-5 border-white bg-gray-200 overflow-hidden relative z-10 shadow-lg ring-4 ring-blue-300/50">
        <img
          src={user?.profile_picture_url || "/src/assets/no-profile-pic.png"}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/src/assets/no-profile-pic.png";
          }}
        />
      </div>
      
      {/* Name and Rank */}
      <h2 className="text-3xl font-extrabold mt-5 relative z-10 drop-shadow-md">
        {user?.name || "Police Officer"}
      </h2>
      <p className="text-blue-200 text-lg font-medium relative z-10 mt-1">
        {policeDetails?.rank || "Rank not available"}
      </p>
    </div>

    {/* Profile Details Section */}
    <div className="p-8 space-y-7">
      {/* Grid for two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Badge Number */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Badge Number</h3>
          <p className="text-gray-900 text-lg font-bold mt-1">{policeDetails?.badge_number || "N/A"}</p>
        </div>

        {/* Shift Time */}
        <div className="border-l-4 border-indigo-500 pl-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Shift Time</h3>
          <p className="text-gray-800 text-lg mt-1">{policeDetails?.shift_time || "N/A"}</p>
        </div>

        {/* Official Email */}
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Official Email</h3>
          <a 
            href={`mailto:${policeDetails?.official_email}`} 
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg mt-1 block truncate"
          >
            {policeDetails?.official_email || "N/A"}
          </a>
        </div>

        {/* Emergency Contact */}
        <div className="border-l-4 border-red-500 pl-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Emergency Contact</h3>
          <p className="text-gray-800 text-lg mt-1">{policeDetails?.emergency_contact || "N/A"}</p>
        </div>
      </div>

      {/* Station Details - kept as a full-width block for address readability */}
      <div className="bg-blue-50 bg-opacity-70 rounded-lg p-5 border border-blue-200 shadow-sm">
        <h3 className="text-md font-bold text-blue-800 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Station Details
        </h3>
        <p className="text-gray-900 font-semibold text-lg">{policeDetails?.station_name || "N/A"}</p>
        <p className="text-gray-600 text-sm mt-1">Code: {policeDetails?.station_code || "N/A"}</p>
        <p className="text-gray-700 whitespace-pre-line mt-2">{policeDetails?.station_address || "N/A"}</p>
        <p className="text-gray-600 text-sm mt-1">Pincode: {policeDetails?.station_pincode || "N/A"}</p>
      </div>

      {/* Status and Availability with distinct styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Status */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</h3>
          <p className={`text-xl font-extrabold mt-1 uppercase ${
            policeDetails?.status === "active" ? "text-green-600" : "text-red-600"
          }`}>
            {policeDetails?.status || "N/A"}
          </p>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Availability</h3>
          <p className={`text-xl font-extrabold mt-1 uppercase ${
            policeDetails?.is_available ? 'text-green-700' : 'text-red-700'
          }`}>
            {policeDetails?.is_available ? "Available" : "Not Available"}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
    )
  }

  // ✅ Citizen card
  return (
    <div className="w-full lg:w-1/3 p-4">
  {/* Card Container */}
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
    {/* Profile Header with Gradient Background & Subtle Pattern */}
    <div className="relative bg-gradient-to-br from-purple-700 to-pink-600 p-8 text-center text-white overflow-hidden">
      {/* Abstract Background Pattern (Subtle Stripes/Waves) */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(135deg, #ffffff33 25%, transparent 25%), linear-gradient(225deg, #ffffff33 25%, transparent 25%), linear-gradient(45deg, #ffffff33 25%, transparent 25%), linear-gradient(315deg, #ffffff33 25%, transparent 25%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 0, 10px -10px, 0px 10px' }}></div>
      
      {/* Profile Picture */}
      <div className="w-32 h-32 mx-auto rounded-full border-5 border-white bg-gray-200 overflow-hidden relative z-10 shadow-lg ring-4 ring-purple-300/50">
        <img
          src={user?.profile_picture_url || "/src/assets/no-profile-pic.png"}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/src/assets/no-profile-pic.png";
          }}
        />
      </div>
      
      {/* Name and Role */}
      <h2 className="text-3xl font-extrabold mt-5 relative z-10 drop-shadow-md">
        {user?.name || "Citizen"}
      </h2>
      <p className="text-purple-200 text-lg font-medium relative z-10 mt-1 capitalize">
        {user?.role || "User"}
      </p>
    </div>

    {/* Profile Details Section */}
    <div className="p-8 space-y-7">
      {/* Grid for two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Email */}
        <div className="border-l-4 border-teal-500 pl-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email</h3>
          <a
            href={`mailto:${user?.email}`}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg mt-1 block truncate"
          >
            {user?.email || "N/A"}
          </a>
        </div>

        {/* Phone */}
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone</h3>
          <a
            href={`tel:${user?.phone_number}`}
            className="text-gray-800 text-lg mt-1 block hover:text-green-700 transition-colors duration-200"
          >
            {user?.phone_number || "N/A"}
          </a>
        </div>
      </div>

      {/* Location Details - kept as a full-width block for readability */}
      <div className="bg-purple-50 bg-opacity-70 rounded-lg p-5 border border-purple-200 shadow-sm">
        <h3 className="text-md font-bold text-purple-800 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Location
        </h3>
        <p className="text-gray-900 font-semibold text-lg">
          {user?.town || "City"}, {user?.district || "District"}
        </p>
        <p className="text-gray-700 text-md mt-1">{user?.state || "State"}</p>
      </div>

      {/* Member Since & Verification Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Member Since */}
        <div className="border-l-4 border-yellow-500 pl-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Member Since</h3>
          <p className="text-gray-800 text-lg mt-1">
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : "N/A"}
          </p>
        </div>
        <div><br /></div>

        {/* Verification Status - Ensured to display on a new line */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Verification Status</h3>
          <div className="mt-1"> {/* Added a div with mt-1 to ensure separation */}
            {/* Unverified State */}
            {user?.verification_status === "unverified" && (
              <p className="text-lg font-bold text-red-600">
                Unverified
              </p>
            )}
            {/* Pending State */}
            {user?.verification_status === "pending" && (
              <div className="bg-yellow-50 bg-opacity-70 rounded-lg p-3 border border-yellow-300 text-sm text-yellow-800 shadow-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.344a1 1 0 011.486 0l3.085 4.707A1 1 0 0113.882 9H6.118a1 1 0 01-.741-1.649l3.085-4.707z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.983 14.496A6.999 6.999 0 0110 18a7 7 0 01-2.983-3.504A3.998 3.998 0 016 11H5a1 1 0 00-1 1v4a1 1 0 001 1h10a1 1 0 001-1v-4a1 1 0 00-1-1h-1a3.998 3.998 0 01-1.017 3.496zM10 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Under Review.</span> We'll notify you once verified.
              </div>
            )}
            {/* Verified State */}
            {user?.verification_status === "verified" && (
              <p className="text-lg font-bold text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified
              </p>
            )}
            {/* Fallback for undefined/null/other status */}
            {!user?.verification_status && (
              <p className="text-lg font-bold text-gray-500">
                Status N/A
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => setShowProfile((prev) => !prev)}
        className="w-full mt-6 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors duration-200 text-lg font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        {user?.verification_status === "unverified"
          ? "Upload details for verification"
          : "View Profile"}
      </button>
    </div>
  </div>
</div>
  );
};

export default UserProfileCard;
