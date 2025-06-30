import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PoliceDashboard = () => {
  const policeDetails = useSelector((state) => state.user.policeDetails);
  const navigate = useNavigate();
useEffect(() => {
  if (policeDetails === undefined) return; // Wait for redux load

  if (!policeDetails?.rank) {
    navigate("/landingpage");
    return;
  }

  const rank = policeDetails.rank;

  if (rank === "Inspector") {
    navigate("/inspectordashboard");
  } else if (rank === "Sub-Inspector") {
    navigate("/subinspectordashboard");
  } else {
    navigate("/landingpage");
  }
}, [policeDetails, navigate]);


  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Redirecting...</h1>
    </div>
  );
};

export default PoliceDashboard;
