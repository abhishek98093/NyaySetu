// UserProfileCard.jsx
import React from "react";
import { useSelector } from "react-redux";

const UserProfileCard = ({setShowProfile }) => {
    
    const user = useSelector(state => state.user.user);
    if (user?.role === "admin") {
    return (
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full border-4 border-white bg-gray-200 overflow-hidden">
              <img
                src={user?.profile_picture_url || "/src/assets/no-profile-pic.png"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/src/assets/no-profile-pic.png";
                }}
              />
            </div>
            <h2 className="text-xl font-semibold text-white mt-4">
              {user?.name || "Admin"}
            </h2>
            <p className="text-indigo-200">Administrator</p>
          </div>

          {/* Minimal Profile Details */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="text-gray-800">
                {user?.town || "City"}, {user?.district || "District"},{" "}
                {user?.state || "State"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full lg:w-1/3">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            <img
              src={user?.profile_picture_url || "/src/assets/no-profile-pic.png"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/src/assets/no-profile-pic.png";
              }}
            />
          </div>
          <h2 className="text-xl font-semibold text-white mt-4">
            {user?.name || "Citizen"}
          </h2>
          <p className="text-indigo-200 capitalize">{user?.role || "User"}</p>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-gray-800">{user?.email || "Not available"}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="text-gray-800">{user?.phone_number || "Not available"}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="text-gray-800">
              {user?.town || "City"}, {user?.district || "District"},{" "}
              {user?.state || "State"}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
            <p className="text-gray-800">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          {user?.verification_status === "unverified" && (
            <h2 className="font-medium text-red-500">
              Kindly verify your profile
            </h2>
          )}
          {user?.verification_status === "pending" && (
            <h2 className="font-medium text-blue-400 border border-green-600 rounded-sm p-3">
              Your profile is currently under review. <br />
              We’ll notify you once the verification process is complete.
            </h2>
          )}

          <button
            onClick={() => setShowProfile((prev) => !prev)}
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {user?.verification_status === "unverified"
              ? "Upload details for verification"
              : "View profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
