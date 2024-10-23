// import React, { useContext } from 'react';
// import { AppContext } from '../../AppContext';
// import AdminNavbar from './Admindashboard/AdminNavbar';
// import { Outlet } from 'react-router-dom';
// import LoadingPage from '../pages/LoadingPage';

// const AdminDashboard = () => {
// const value=useContext(AppContext)

//   return (
//     <>{!value.userData.name?
//       <><LoadingPage /></>:
//       <>
//       <AdminNavbar />
//       <Outlet />
//       </>
//     }
//     </>
//   );
// };

// export default AdminDashboard;
import React, { useContext, useState } from "react";
import Dashboard1 from "./Admindashboard/Dashboard1";
import ManageRegions from "./Admindashboard/ManageRegions";
import RegisterCandidate from "./Admindashboard/RegisterCandidate";
import CreateElection from "./Admindashboard/CreateElection";
import ResultsDashboard from "./ResultsDashboard";
import { AppContext } from "../../AppContext";
import LoadingPage from "../pages/LoadingPage";

const AdminDashboard = () => {
  // State to track which section is active
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeNav,setActiveNav]=useState(["Dashboard"])

  const value=useContext(AppContext)
  const subNav=value.subNav
  const setSubNav=value.setSubNav

  // Function to render content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <Dashboard1/>
          </div>
        );
      case "manageRegions":
        return (
          <div>
            <ManageRegions />
          </div>
        );
      case "registerCandidates":
        return (
          <div>
            <RegisterCandidate />
          </div>
        );
      case "manageElections":
        return(
          <div>
            <CreateElection />
          </div>
        )
      case "electionResults":
        return (
          <div>
            <ResultsDashboard />
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <>
    {value.userData.email?<div className="flex ">
      {/* Static Left Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white p-6 fixed h-full"> {/* Increased padding */}
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2> {/* Increased font size */}
        <ul className="space-y-6"> {/* Increased space between list items */}
          <li
            className={`cursor-pointer transition duration-200 hover:text-blue-400 text-xl py-4`} 
            onClick={() => {setActiveSection("dashboard")
              setActiveNav(["Dashboard"])
            }}
          >
            Overview
          </li>
          <li
            className={`cursor-pointer transition duration-200 hover:text-blue-400 text-xl py-4`}
            onClick={() => {setActiveSection("manageRegions")
              setActiveNav(["Add Region"])
              setSubNav("Add Region")
            }}
          >
            Manage Regions
          </li>
          <li
            className={`cursor-pointer transition duration-200 hover:text-blue-400 text-xl py-4`}
            onClick={() => {setActiveSection("registerCandidates")
              setActiveNav(["View Candidates","Register Candidate","Delete Candidate"])
              setSubNav("View Candidates")
            }}
          >
            Manage Candidates
          </li>
          <li
            className={`cursor-pointer transition duration-200 hover:text-blue-400 text-xl py-4`}
            onClick={() => {setActiveSection("manageElections")
              setActiveNav(['View Elections','Create An Election'])
              setSubNav("View Elections")
            }
          }
          >
            Create and Manage Elections
          </li>
          <li
            className={`cursor-pointer transition duration-200 hover:text-blue-400 text-xl py-4`}
            onClick={() => {setActiveSection("electionResults")
              setActiveNav(["View election Results from past elections. Selecct an election and navigate through regions"])
            }}
          >
            View Election Results
          </li>
        </ul>
      </div>
      {/* Main Body Content */}
      <div className="w-4/5 ml-auto mt-16">
        {/* Static Top Navbar (specific to the active section) */}
        <div className="sticky top-0 bg-white p-4 shadow-md mb-6">
          {/* {activeSection !== "dashboard" && ( */}
            <div className="flex justify-between">
              {activeNav.map((item,index)=>{
                return (
                  <h2 key={index} className="text-lg font-semibold capitalize" onClick={()=>setSubNav(item)}>
                    {item}
                  </h2>
                )
              })}
            </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-auto">{renderContent()}</div>
      </div>
    </div>:<LoadingPage />}
    </>
  );
};

export default AdminDashboard;
