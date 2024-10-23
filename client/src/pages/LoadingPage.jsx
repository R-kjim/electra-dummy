import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Loading User Data...</h1>
        <p className="text-gray-700 mb-4">Please wait a moment while we fetch your information.</p>
        <div className="flex justify-center">
          <div className="loader border-t-4 border-purple-600 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
