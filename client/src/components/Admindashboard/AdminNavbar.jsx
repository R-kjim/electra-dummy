import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../AppContext';

const AdminNavbar = ({ selectedSection, setSelectedSection }) => {
  const value=useContext(AppContext)
  return (
    <nav className="bg-gray-700 text-white py-2">
      <div className="container mx-auto flex space-x-4">
        <Link 
          to= {`/admin/dashboard/${value.userId}`}
          className={`hover:underline ${selectedSection === 'dashboard' ? 'font-bold' : ''}`} 
          onClick={() => setSelectedSection('dashboard')}
        >
          Dashboard
        </Link>
        <Link 
          to={`/admin/dashboard/${value.userId}/manage-regions`} 
          className={`hover:underline ${selectedSection === 'manage-regions' ? 'font-bold' : ''}`} 
          onClick={() => setSelectedSection('manage-regions')}
        >
          Manage Regions
        </Link>
        <Link 
          to={`/admin/dashboard/${value.userId}/register-candidate`} 
          className={`hover:underline ${selectedSection === 'register-candidate' ? 'font-bold' : ''}`} 
          onClick={() => setSelectedSection('register-candidate')}
        >
          Register a Candidate
        </Link>
        <Link 
          to={`/admin/dashboard/${value.userId}/create-election`} 
          className={`hover:underline ${selectedSection === 'create-election' ? 'font-bold' : ''}`} 
          onClick={() => setSelectedSection('create-election')}
        >
          Create an Election
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
