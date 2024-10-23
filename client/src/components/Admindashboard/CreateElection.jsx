import React, { useContext, useState } from 'react'
import { AppContext } from '../../../AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CreateElection = () => {
  const value=useContext(AppContext)
  const subDiv=value.subNav
  const navigate=useNavigate()
  let regions=value.regions
  const [electionForm,setElectionForm]=useState({
    name:"",
    type:"",
    region:"",
    election_date:""
  })
  const elections=value.elections
  const [updateStatus,setUpdateStatus]=useState("")
  //function to navigate to dashboard
  function navigates(){
    navigate(`/admin/dashboard/${value.userId}`)
    window.location.reload()
  }
  //function to handle changes in election form
  function handleChangeElection(event){
    const {name,value}=event.target
    setElectionForm({
      ...electionForm,
      [name]:value,
    })
  }
  //function to handle create election
  function createElectionFn(event){
    event.preventDefault()
    fetch("http://127.0.0.1:5555/elections",{
      method:"POST",
      body:JSON.stringify(electionForm),
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res=>{
      if(res.ok){toast.success("Election added successfully")
        navigates()
        return res.json()
      }else{
        return res.json().then(errorData=>{
          toast.error(errorData.error[0])
        })
      }
    })
  }
  //function to update status of an election
  function submitStatus(id){
    let obj={status:updateStatus}
    if(obj.status !==""){
    fetch(`http://127.0.0.1:5555/election/${id}`,{
      method:"PATCH",
      body:JSON.stringify(obj),
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res=>{
      if(res.ok){toast.success("Updated successfully")
        return(res.json())
      }else{
        return res.json().then(errorData=>{
          toast.error(errorData.error[0])
        })
      }
    })
  }else{
      toast.error("Select a value to update an election status")
    }

  }
  return (
    <div>
      {subDiv==="View Elections" && 
      <section>
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-5">Manage Elections Status</h2>

          <table className="min-w-full bg-white border border-gray-200 shadow-md">
            <thead>
              <tr>
                <th className="p-3 border">Election Name</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Current Status</th>
                <th className="p-3 border">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => (
                <tr key={election.id}>
                  <td className="p-3 border">{election.name}</td>
                  <td className="p-3 border">{election.election_date}</td>
                  <td className="p-3 border">{election.type}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded ${
                        election.status === 'Pending'
                          ? 'bg-yellow-500 text-white'
                          : election.status === 'Ongoing'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {election.status}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <select className="px-2 py-1 border rounded" onChange={(e)=>setUpdateStatus(e.target.value)}>
                      <option value="">Select status</option>
                      {["Pending","Closed","Ongoing"].filter((option)=>{
                        if(option!==election.status){return(option)}
                      }).map((choice,index)=>{
                        return(<option key={index} value={choice}>{choice}</option>)
                      })}
                     
                    </select>
                    <button className="ml-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={()=>submitStatus(election.id)}>
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>}
      {subDiv==="Create An Election" && <section className="mb-6">
           <h2 className="text-2xl font-bold mb-4">Create an Election</h2>
           <form onSubmit={createElectionFn}>
             <input type="text" placeholder="Enter election name" className="border p-2 rounded-lg w-full mb-2" 
             name='name'
             value={electionForm.name}
             onChange={handleChangeElection}
             required/>
             <select className="border p-2 rounded-lg w-full mb-2"
             name='type'
             value={electionForm.type}
             onChange={handleChangeElection}
             required>
               <option value="">Select Election Type</option>
               <option value="General">General Election</option>
               {['President', 'Governor', 'Senator', 'MP',"MCA"].map((choice,index)=>{
                 return (
                   <option key={index} value={choice}>{choice}</option>
                 )
               })}
             </select>
            { electionForm.type!=="" &&  electionForm.type!=="General" && electionForm.type!=="President"?
             <select className="border p-2 rounded-lg w-full mb-2"
             name='region'
             onChange={handleChangeElection}
              required
             >
               <option value="">Select {electionForm.type==="Senator"?"County":electionForm.type==="Governor"?"County":electionForm.type==="MP"?"Constituency":"Ward"}</option>
               {electionForm.type==="Senator"? 
                 regions.counties.map((county,index)=>{return(<option key={index}>{county.name}</option>)})
               :
               electionForm.type==="Governor"? 
                 regions.counties.map((county,index)=>{return(<option key={index}>{county.name}</option>)})
               :electionForm.type==="MP"?
               regions.constituencies.map((county,index)=>{return(<option key={index}>{county.name}</option>)}):           
               regions.constituencies.map((county, index)=>{return(
                 county.wards.map((ward,index)=>{return(<option key={index}>{ward.name}</option>)})
               )})
             }
             </select>:null
           }
             <input type="date" className="border p-2 rounded-lg w-full mb-2" 
             name='election_date'
             value={electionForm.election_date}
             onChange={handleChangeElection}
             required/>
             <button className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700">Create Election</button>
           </form>
      </section>}
    </div>
  )
}

export default CreateElection
