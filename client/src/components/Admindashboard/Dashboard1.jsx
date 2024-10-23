import React, { useContext, useState } from 'react';
import { AppContext } from '../../../AppContext';
import { FaPoll, FaTrash, FaUserCheck, FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const Dashboard1 = () => {
  const value = useContext(AppContext);

  // Filtering elections based on status
  const filteredOngoing = value.elections.filter((election) => election.status === "Ongoing");
  const filterPending = value.elections.filter((election) => election.status === "Pending");

  // State variable to track the visible section
  const [activeSection, setActiveSection] = useState(null);
  const [selectCounty,setSelectCounty]=useState("")
  const [selectConstituency,setselectConstituency]=useState("")
  const [selectWard,setselectWard]=useState("")

  const filteredConstituencies=value.regions.counties.filter((region)=>{
    if(selectCounty===""){return true}
    else{return selectCounty===region.name}
  })
  const filteredWards=value.regions.constituencies.filter((constituency)=>{
    if(selectConstituency==="")return constituency.wards
    else{return selectConstituency===constituency.name}
  })
  const filteredVoters=value.voters.filter((voter)=>{
    if(selectCounty==="" &&selectConstituency==="" && selectWard===""){return true}
    if(selectCounty!=="" && selectWard==="" && selectConstituency===""){return voter.county.name===selectCounty}
    if(selectConstituency!=="" && selectCounty!=="" &&selectWard===""){return voter.constituency.name===selectConstituency}
    if(selectWard!=="" && selectConstituency!=="" && selectCounty!==""){return voter.ward.name===selectWard}
    // else{return voter.constituency.name===selectConstituency && voter.county.name===selectCounty}
  })
  const toggleSection = (section) => {
    // Toggle the clicked section and hide others
    setActiveSection(prevSection => (prevSection === section ? null : section));
  };

  function deleteVoter(id,name){
    Swal.fire({
      title: 'Warning!',
      text: `You are about to delete ${name} from the voters list!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Cancel'
  }).then(result=>{
    if(result.isConfirmed){
      fetch(`http://127.0.0.1:5555/add-voter-details/${id}`,{
        method:"DELETE"
      })
      .then(res=>{
        if(res.ok){
          toast.success("Voter deleted successfully")
          window.location.reload()
        }
        return res.json()
      })
    }
  })
  }
  return (
    <div>
      <section className="mt-6">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Registered Voters */}
          <div
            className="bg-blue-100 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => toggleSection('voters')}
          >
            <FaUserCheck className="text-3xl mb-2" />
            <h2 className="text-2xl font-bold">{value.voters.length}</h2>
            <p>Registered Voters</p>
          </div>

          {/* Ongoing Elections */}
          <div
            className="bg-green-100 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => toggleSection('ongoing')}
          >
            <FaPoll className="text-3xl mb-2" />
            <h2 className="text-2xl font-bold">{filteredOngoing.length}</h2>
            <p>Ongoing Elections</p>
          </div>

          {/* Upcoming Elections */}
          <div
            className="bg-yellow-100 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => toggleSection('upcoming')}
          >
            <FaUsers className="text-3xl mb-2" />
            <h2 className="text-2xl font-bold">{filterPending.length}</h2>
            <p>Upcoming Elections</p>
          </div>
        </div>

        {/* Conditionally render section details */}
        <div>
          {activeSection === 'voters' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className='mt-0'>
                <h2 className='text-2xl font-bold mb-6'>Filter Voters</h2>
                <div className='flex space-x-4'>
                  <div className='flex-1'>
                    <label>Select County</label>
                    <select className='w-full p-2 border border-gray-300 rounded-md' onChange={(e)=>{setSelectCounty(e.target.value); setselectConstituency(""); setselectWard("")}}>
                      <option value="">Select County</option>
                      {value.regions.counties.map((county,index)=>{return (
                        <option key={index} value={county.name}>{county.name}</option>
                      )})}
                    </select>
                  </div>
                  <div className='flex-1'>
                    <label>Select Constituency</label>
                    <select className='w-full p-2 border border-gray-300 rounded-md'value={selectConstituency} onChange={(e)=>{setselectConstituency(e.target.value); setselectWard("")}}>
                      <option value="">Select Constituency</option>
                      {filteredConstituencies.map((county)=>{return (
                        county.constituencies.map((constituency,index)=>{return (
                          <option key={index} value={constituency.name}>{constituency.name}</option>
                        )})
                      )})}
                    </select>
                  </div>
                  <div className='flex-1'>
                    <label>Select Ward</label>
                    <select value={selectWard} className='w-full p-2 border border-gray-300 rounded-md' onChange={(e)=>setselectWard(e.target.value)}>
                      <option value="">Select Ward</option>
                      {filteredWards.map((constituency)=>{return (
                        constituency.wards.map((ward,index)=>{return(
                          <option key={index} value={ward.name}>{ward.name}</option>
                        )})
                      )})}
                    </select>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-4">Registered Voters:</h3>
              {filteredVoters.length>0?
              <div className='overflow-y-auto max-h-80'>
                <table className="min-w-full bg-white border table-auto">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">National ID</th>
                    <th className="py-2 px-4 border">Registration Date</th>
                    <th className="py-2 px-4 border">County</th>
                    <th className="py-2 px-4 border">Constituency</th>
                    <th className="py-2 px-4 border">Ward</th>
                    <th  className="py-2 px-4 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVoters.map((voter, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">{voter.user.name}</td> 
                      <td className="py-2 px-4 border">{voter.national_id}</td> {/* Get voters national id */} 
                      <td className="py-2 px-4 border">{new Date(voter.registration_date).toLocaleDateString()}</td> {/*Get voters registration date*/}
                      <td className="py-2 px-4 border">{voter.county.name}</td> {/*Get county voter belongs to*/}
                      <td className="py-2 px-4 border">{voter.constituency.name}</td> {/*Get constituency voter belongs to*/}
                      <td className="py-2 px-4 border">{voter.ward.name}</td> {/*Get ward voter belongs to*/}
                      <td className="py-2 px-4 border">
                        <button className="text-red-500 hover:text-red-700" onClick={()=>deleteVoter(voter.id,voter.user.name)}>
                          <FaTrash className="inline-block mr-2" />
                          Delete
                        </button>
                      </td></tr>
                  ))}
                </tbody>
              </table></div>
              :<p className='text-center text-gray-600 mt-4'>No voters for the selected regions</p>}
            </div>
          )}

          {activeSection === 'ongoing' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Ongoing Elections:</h3>
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Election Name</th>
                    <th className="py-2 px-4 border">Type</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Region</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOngoing.map((election) => (
                    <tr key={election.id}>
                      <td className="py-2 px-4 border">{election.name}</td>   {/*Get the name of the election*/}
                      <td className="py-2 px-4 border">{election.type}</td>   {/*Get the type of the election*/}
                      <td className="py-2 px-4 border">{election.status}</td> {/*Get the status of the election*/}
                      <td className="py-2 px-4 border">{new Date(election.date).toLocaleDateString()}</td> {/*Get the date of the election*/}
                      <td className="py-2 px-4 border">{election.region}</td> {/*Get the region of the election*/}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'upcoming' && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Upcoming Elections:</h3>
              <ul>
                {filterPending.map((election) => (
                  <li key={election.id}>{election.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard1;
