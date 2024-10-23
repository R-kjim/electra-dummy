import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UpdateDetails = () => {
    const value=useContext(AppContext)
  const regions=value.regions
  const isUpdate=value.updateStatus
  const [filteredConstituencies,setConstituencies]=useState([])
  const [filteredWards,setWards]=useState([])
  const [formData, setFormData] = useState({
    county: '',
    constituency: '',
    ward: '',
    nationalId: '',
  });  
 const navigate=useNavigate()
  useEffect(()=>{
    if(formData.county!=='')
    {const filteredConstituencies=regions.counties.filter((county)=>{
        return county.name===formData.county
      })
      setConstituencies(filteredConstituencies)
    }
    if(formData.constituency!==''){
        const filteredWards=regions.constituencies.filter((constituency)=>{
                return constituency.name===formData.constituency
              })
        setWards(filteredWards)
    }
  },[formData])
  // Handle form data updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };  
  //form submission logic
  function handleSubmit(event){
    event.preventDefault()
    if (formData.nationalId.toString().length!==8 && isUpdate===false){
        toast.error("Ensure national id number has 8 digits")
    }else{
      if(isUpdate){
        let national_id=value.userData.voter[0].national_id
      formData.nationalId=national_id
        fetch(`https://electra-dummy.onrender.com/add-voter-details/${value.userId}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(formData)
        })
        .then(res=>{
            if(res.ok){
                toast.success("Voter details updated succesfully")
                // window.location.reload()
                navigate(`/dashboard/user/${value.userId}`)
                setIsRegisteredVoter(true)
                return res.json()
            }else{
                return res.json().then(errorData=>{
                  toast.error(errorData.error[0])
                })
              }
        })}else{
        formData.nationalId=parseInt(formData.nationalId)
        fetch(`https://electra-dummy.onrender.com/add-voter-details/${value.userId}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(formData)
        })
        .then(res=>{
            if(res.ok){
                toast.success("Voter details updated succesfully")
                // window.location.reload()
                navigate(`/dashboard/user/${value.userId}`)
                value.setIsRegisteredVoter(true)
                return res.json()
            }else{
                return res.json().then(errorData=>{
                  toast.error(errorData.error[0])
                })
              }
        })}
    }
  }
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Update Your Details</h1>
        {regions.counties?<form onSubmit={handleSubmit}>
          {/* County of Residence */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="county">
              County of Residence
            </label>
            <select
              id="county"
              name="county"
              value={formData.county}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select County</option>
                {
                    regions.counties.map((county,index)=>{
                        return (
                            <option key={index}>{county.name}</option>
                        )
                    })
                }
            </select>
          </div>

          {/* Constituency of Residence */}
          {formData.county && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="constituency">
                Constituency of Residence
              </label>
              {filteredConstituencies.length>0?<select
                id="constituency"
                name="constituency"
                value={formData.constituency}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Constituency</option>
                {
                    filteredConstituencies[0].constituencies.map((constituency,index)=>{
                        return(<option key={index}>{constituency.name}</option>)
                    })
                }
              </select>:null}
            </div>
          )}

          {/* Ward of Residence */}
          {formData.constituency && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ward">
                Ward of Residence
              </label>
              {filteredWards.length>0?<select
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Ward</option>
                {
                    filteredWards[0].wards.map((ward,index)=>{
                        return (<option key={index}>{ward.name}</option>)
                    })
                }
              </select>:null}
            </div>
          )}
          {/* National ID Number */}
          {isUpdate?<></>:<div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nationalId">
              National ID Number
            </label>
            <input
              type="text"
              id="nationalId"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Enter National ID Number"
              required
            />
          </div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Update Details
          </button>
        </form>:<p></p>}
      </div>
    </div>
  );
};

export default UpdateDetails;
