import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import LoginSignup from './components/LoginSignup';
import Dashboard from './pages/Dashboard';
import ElectionDetails from './components/ElectionDetails'; // Import ElectionDetails
import { AppContext } from '../AppContext';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import UpdateDetails from './pages/UpdateDetails';
import DashboardMain from './pages/DashboardMain';
import Admin from './pages/Admin';
import AdminDashboard from './components/AdminDashboard';
import ResultsDashboard from './components/ResultsDashboard';
import ManageRegions from './components/Admindashboard/ManageRegions';
import RegisterCandidate from './components/Admindashboard/RegisterCandidate';
import CreateElection from './components/Admindashboard/CreateElection';
import Dashboard1 from './components/Admindashboard/Dashboard1';
import ResetPassword from './pages/ResetPassword';


const App = () => {
  const [isAdminAvailable, setIsAdminAvailable] = useState(false);
  const value = useContext(AppContext);

  useEffect(() => {
    // Simulate a check for admin availability
    const adminExists = true; // Replace this with actual logic to check if admin exists
    setIsAdminAvailable(adminExists);
  }, []);

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/reset-password' element={<ResetPassword />}/>
        <Route path="/election-details/:electionId" element={<ElectionDetails />} /> 
        <Route 
          path="/login"
          element={<LoginSignup />} 
        />
        <Route path='/dashboard/' element={<DashboardMain />} >
          <Route path='user/:id' element={<Dashboard />}/>
          <Route path='update-details' element={<UpdateDetails />} />
        </Route>
        <Route path='/admin' element={<Admin />}>
          <Route path='dashboard/:id' element={<AdminDashboard />}>
            <Route path='' element={<Dashboard1 />}/>
            <Route path='manage-regions' element={<ManageRegions />}/>
            <Route path='register-candidate' element={<RegisterCandidate />}/>
            <Route path='create-election' element={<CreateElection />}/>
          </Route>
        </Route>
        <Route path='/results' element={<ResultsDashboard />} /> {/* New route  */}
      </Routes>
    </div>

  );
};

export default App;

