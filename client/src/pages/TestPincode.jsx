import React, { useState } from 'react';
import { getPincode } from '../utils/getPincode';

const TestPincode = () => {
  const [pincode, setPincode] = useState(null);

  const handleGetPincode = async () => {
    const pin = await getPincode();
    setPincode(pin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <button
          onClick={handleGetPincode}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Get My Indian Pincode
        </button>

        {pincode && (
          <p className="mt-3 text-green-700 font-semibold">
            Your current pincode is: {pincode}
          </p>
        )}
      </div>
    </div>
  );
};

export default TestPincode;
