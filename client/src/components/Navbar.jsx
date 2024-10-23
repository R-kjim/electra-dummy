import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContext';
import {Link, useNavigate} from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate=useNavigate()
  // useEffect(()=>{
  //   localStorage.setItem("userId",value.userId)
  // },[])

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const value=useContext(AppContext)
  const setIsRegistering=value.setIsRegistering
  const isLoggedIn=value.userId

  function handleLogin(){
    localStorage.removeItem("userId")
    navigate('/')
    window.location.reload()
  }
  function loginFN(){
    let user=value.userData
    if (user.role==="Admin"){
      navigate(`/admin/dashboard/${localStorage.getItem("userId")}`)}
    else if(user.role==="Voter"){navigate(`/dashboard/user/${localStorage.getItem("userId")}`)}
  }
  return (
    <nav className="bg-blue-700 fixed w-full top-0 left-0 z-10">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-bold">
              Electra-Vote
            </Link>
            <p className="text-sm text-gray-200">Building Democracy</p>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-orange-400">
                Home
              </Link>
              <Link to="/results" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-orange-400">
                View Results
              </Link>
             { value.userId?
             <>
             <button onClick={loginFN} className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-orange-400">Dashboard</button>
             <Link to="/" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-orange-400" onClick={handleLogin}>
             Logout
            </Link></>:
             <><Link to="/login" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-orange-400" onClick={()=>setIsRegistering(true)}>
             Register
           </Link>
           <Link to="/login" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-orange-400" onClick={()=>setIsRegistering(false)}>
             Login
           </Link></>}
              
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block text-white px-3 py-2 rounded-md text-base font-medium hover:text-orange-400">
              Home
            </Link>
            <Link to="/results" className="block text-white px-3 py-2 rounded-md text-base font-medium hover:text-orange-400">
              View Results
            </Link>
            {isLoggedIn?
            <><Link to="/" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-orange-400" onClick={()=>{localStorage.removeItem("userId")
            }}>
            Logout
           </Link></>
            :<><Link to="/login" className="block text-white px-3 py-2 rounded-md text-base font-medium hover:text-orange-400" onClick={()=>setIsRegistering(true)}>
              Register
            </Link>
            <Link to="/login" className="block text-white px-3 py-2 rounded-md text-base font-medium hover:text-orange-400">
              Login
            </Link></>}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
