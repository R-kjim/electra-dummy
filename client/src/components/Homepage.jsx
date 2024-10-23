import React, { useContext, useEffect } from 'react';
import { FaUserPlus, FaVoteYea, FaCheckCircle, FaPoll } from 'react-icons/fa';
import kenya from '../assets/kenya.jpeg'
import { Link } from 'react-router-dom';
import { AppContext } from '../../AppContext';

const Homepage = () => {
  const value=useContext(AppContext)
  const setIsRegistering=value.setIsRegistering
  useEffect(()=>{
   
  },[value.userId])
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white text-blue-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Electra-Vote</h1>
          <p className="text-xl mb-6">Building Democracy with Secure, Online Elections</p>
          <Link to="/login" className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-6 rounded-md font-semibold" onClick={()=>setIsRegistering(true)}>
            Get Started
          </Link>
        </div>
        {/* <div className="mt-8">
          <img src={kenya} alt="Voting banner" className="mx-auto w-full h-auto" />
        </div> */}
      </section>
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <FaUserPlus className="text-blue-700 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Register</h3>
              <p className="mt-2 text-gray-600">Sign up and create your account to begin the voting process.</p>
            </div>
            <div>
              <FaCheckCircle className="text-blue-700 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Complete Registration</h3>
              <p className="mt-2 text-gray-600">Update your details to be fully eligible to vote.</p>
            </div>
            <div>
              <FaVoteYea className="text-blue-700 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Vote</h3>
              <p className="mt-2 text-gray-600">Cast your vote securely and easily.</p>
            </div>
            <div>
              <FaPoll className="text-blue-700 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">View Results</h3>
              <p className="mt-2 text-gray-600">Access the results of elections anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Electra-Vote?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <FaCheckCircle className="text-blue-700 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Secure Voting</h3>
              <p className="mt-2 text-gray-600">Your vote is protected with the highest level of encryption.</p>
            </div>
            <div>
              <FaPoll className="text-blue-700 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Transparency</h3>
              <p className="mt-2 text-gray-600">Election results are available to everyone without logging in.</p>
            </div>
            <div>
              <FaVoteYea className="text-blue-700 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Accessibility</h3>
              <p className="mt-2 text-gray-600">Participate in elections from any device, anywhere in Kenya.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Election Results Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Latest Election Results</h2>
          <img src="your-results-image-url-here" alt="Election Results" className="mx-auto w-full h-auto mb-8" />
          <a href="/results" className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-md font-semibold">
            View All Results
          </a>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
