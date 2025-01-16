import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <p className="text-lg mt-4 text-gray-300">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="mt-8 flex space-x-4">
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
        >
          Go Back
        </button>
        <button
          onClick={handleGoHome}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
