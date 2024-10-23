import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate=useNavigate()
    function clickme(){
        localStorage.setItem("userId"," ")
        navigate('/')
        window.location.reload()
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-700 mb-4">Something went wrong while loading the data. Please try again later.</p>
        <Link 
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
          onClick={clickme}
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
