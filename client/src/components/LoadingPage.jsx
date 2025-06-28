import React from 'react';

const LoadingPage = ({ status, message }) => {
  // Array of 20 crime facts about India
  const crimeFacts = [
    "India reports a crime every 2 minutes on average (NCRB 2022).",
    "Delhi has the highest crime rate among Indian cities (NCRB 2022).",
    "Cyber crimes in India increased by 24% in 2022 compared to 2021.",
    "Only about 30% of reported crimes in India result in convictions.",
    "Uttar Pradesh records the highest number of crimes annually.",
    "Crime against women increased by 15% in India from 2021 to 2022.",
    "India ranks among top 5 countries for cybercrime globally.",
    "Financial fraud accounts for 75% of cyber crimes in India.",
    "Kerala has the highest rate of crimes against senior citizens.",
    "Vehicle theft occurs every 10 minutes in India (NCRB data).",
    "Only 1 in 4 sexual assault cases get reported in India.",
    "India's conviction rate for murder cases is about 42%.",
    "Mumbai records the highest number of white-collar crimes.",
    "Crime rate in India has increased by 28% in the last decade.",
    "40% of cybercrime victims in India are aged 20-30 years.",
    "India loses over ₹25,000 crores annually to financial fraud.",
    "Bengaluru has the highest rate of cyber crimes in India.",
    "1 in 3 Indian women face domestic violence (NFHS-5 data).",
    "Human trafficking cases increased by 27% in 2022 (NCRB).",
    "India ranks 133rd out of 167 countries in women's safety."
  ];

  // Get a random fact
  const randomFact = crimeFacts[Math.floor(Math.random() * crimeFacts.length)];

  let statusText = "";
  let colorClass = "";
  let spinnerColor = "";

  switch (status) {
    case "load":
      statusText = message || "Loading...";
      colorClass = "text-blue-600";
      spinnerColor = "border-blue-600";
      break;
    case "fetch":
      statusText = message || "Fetching data...";
      colorClass = "text-green-600";
      spinnerColor = "border-green-600";
      break;
    case "delete":
      statusText = message || "Deleting...";
      colorClass = "text-red-600";
      spinnerColor = "border-red-600";
      break;
    default:
      statusText = message || "Processing...";
      colorClass = "text-gray-600";
      spinnerColor = "border-gray-600";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50">
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-4">
        <div 
          className={`w-16 h-16 border-8 ${spinnerColor} border-t-transparent rounded-full animate-spin mb-6`}
          style={{ animationDuration: '1s' }}
        />
        <p className={`text-xl font-semibold ${colorClass} mb-6`}>{statusText}</p>
        
        <div className="text-center border-t pt-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Did you know?</p>
          <p className="text-gray-700">{randomFact}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;