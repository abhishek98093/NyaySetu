import React from "react";
import { Mail, Shield, MapPin, Calendar, User, Barcode, Badge, Hash } from "lucide-react";

const PersonnelCard = ({ policePersonal }) => {
  const {
    name,
    rank,
    dob,
    created_at,
    station_name,
    station_code,
    station_address,
    official_email,
    badge_number,
    profile_picture_url,
  } = policePersonal;

 const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
const onlyDate = new Date(created_at).toISOString().split("T")[0]; // "2025-06-23"

const age = calculateAge(dob);
const yearsOfService=calculateAge(onlyDate);



  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 w-full max-w-5xl mx-auto p-6 border border-slate-200/50 group overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-2xl"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0 overflow-hidden">
            {profile_picture_url ? (
              <img 
                src={profile_picture_url} 
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentElement.classList.add("bg-gradient-to-br", "from-blue-500", "to-indigo-600");
                  e.target.parentElement.innerHTML = '<User className="h-8 w-8 text-white" />';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors duration-300">
              {name}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              {rank}
            </p>
          </div>
        </div>

        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm flex-shrink-0">
          <Badge className="h-3 w-3" />
          ACTIVE
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-200/50 hover:bg-white/80 transition-colors duration-200">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <User className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-lg font-bold text-slate-800">{age}</p>
          <p className="text-xs text-slate-500">Years Old</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-200/50 hover:bg-white/80 transition-colors duration-200">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Calendar className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-lg font-bold text-slate-800">{yearsOfService}</p>
          <p className="text-xs text-slate-500">Years Service</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-200/50 hover:bg-white/80 transition-colors duration-200">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Hash className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-sm font-bold text-slate-800">{badge_number}</p>
          <p className="text-xs text-slate-500">Badge No.</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-200/50 hover:bg-white/80 transition-colors duration-200">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Barcode className="h-4 w-4 text-gray-600" />
          </div>
          <p className="text-sm font-bold text-slate-800">{station_code}</p>
          <p className="text-xs text-slate-500">Station Code</p>
        </div>
      </div>

      {/* Station and Contact Info */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            Station Details
          </h3>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-800">{station_name}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{station_address}</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            Contact
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm text-slate-700 font-medium truncate">{official_email}</span>
          </div>
        </div>
      </div>

      {/* Decorative Bubbles */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl"></div>
    </div>
  );
};

export default PersonnelCard;