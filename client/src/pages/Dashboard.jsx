import React, { useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserIcon, CheckCircleIcon, ExclamationCircleIcon, CalendarIcon, ChartBarIcon, DocumentIcon } from '@heroicons/react/outline';
import { AppContext } from '../../AppContext';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheck, FaCheckCircle, FaCheckDouble, FaExclamationCircle} from 'react-icons/fa';
import LoadingPage from './LoadingPage';

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [voted,setVoted]=useState({})
  const value=useContext(AppContext)
  let params=useParams()
  params=params.id
  useEffect(()=>{
       value.setParam(params)
       if(value.userData.voter){
        if(value.userData.voter[0].vote)
       { let votes=value.userData.voter[0].vote
       const election_count=votes.reduce((acc,current)=>{
        const id = current.election_id;
        acc[id] = (acc[id] || 0) + 1; // Increment the count for each election_id
        return acc
      },{})
      setVoted(election_count)}}
    },[])
  const handleElectionClick = (electionId) => {
    let votes=value.userData.voter[0].vote
        const election_count=votes.reduce((acc,current)=>{
            const id = current.election_id;
            acc[id] = (acc[id] || 0) + 1; // Increment the count for each election_id
            return acc
          },{})
      if(election_count[electionId.id]){toast.error("You already participated in this election")}
      else{
    navigate(`/election-details/${electionId.id}`); // Navigate to ElectionDetails with the electionId
  }
  };

  const userData=value.userData
  const isRegisteredVoter=value.isRegisteredVoter
  let upcomingElections=value.elections.filter((election)=>{return election.status==="Pending"})
  let ongoingElections=value.elections.filter((election)=>{
    if(election.type==="General")
    {return election.status==="Ongoing"}else{
      let userRegions=userData.voter[0]
      if(election.region===userRegions.constituency.name || election.region===userRegions.county.name || election.region===userRegions.ward.name){
        return election.status==="Ongoing"
      }
    }
  })
  let closedElection=value.elections.filter((election)=>{return election.status==="Closed"})
  //calculate election results 
  function countWinner(index,type){
    let voteCount={}
    let key=''
    let value=0
    let totalVotes=0
    let candidates=[]
    if(type==="General"){
    candidates=closedElection[index].candidates.filter((candidate)=>{return(candidate.position==="President")})}
    else{candidates=closedElection[index].candidates}
    candidates.forEach((vote)=>{
      let candidateId=vote.voter.user.name
      voteCount[candidateId]=vote.votes.length
      totalVotes=totalVotes+vote.votes.length
    })
    for(let item in voteCount){
      if(voteCount[item]>value){
        key=item
        value=voteCount[item]
      }
    }
    return({candidate:key,winrate:((voteCount[key]/totalVotes)*100)+"%"})
  }
  return (
    <>    
    {value.userData.email?<div className="container mx-auto p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center">
          <UserIcon className="h-12 w-12 text-white mr-4" />
          <div>
            <h1 className="text-4xl font-bold">Welcome, {userData.name}!</h1>
            <p className="mt-2">
              {isRegisteredVoter
                ? "Thank you for being a registered voter!"
                : "Complete your registration to vote in upcoming elections."}
            </p>
          </div>
        </div>
      </div>

      {/* User Status */}
      <div className="mt-8">
        {isRegisteredVoter ? (
          <div className="flex items-center bg-green-500 p-4 rounded-lg shadow-md">
            <CheckCircleIcon className="h-8 w-8 text-white mr-4" />
            <div>
              <h2 className="text-2xl font-semibold text-white">You're a Registered Voter</h2>
              <p className="text-white mt-1">You can participate in upcoming elections and view your voting history below.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center bg-yellow-400 p-4 rounded-lg shadow-md">
            <ExclamationCircleIcon className="h-8 w-8 text-black mr-4" />
            <div>
              <h2 className="text-2xl font-semibold">Complete Your Registration</h2>
              <p className="mt-1">You need to complete your registration to vote in upcoming elections.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><Link to='/dashboard/update-details' >
                Complete Registration
              </Link></button>
            </div>
          </div>
        )}
      </div>

      {/* Ongoing Elections */}
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-5">Ongoing Elections</h2>

        {ongoingElections.length>0?<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ongoingElections.map((election) => (
            <div key={election.id} className={`bg-white border ${voted[election.id]?"border-green-700":"border-gray-200"} rounded-lg shadow-md p-4`}>
              <h3 className="text-xl font-semibold mb-3">{election.name}</h3>
              <p className="text-gray-600 mb-2">
                <strong>Date: </strong>{election.election_date}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Type: </strong>{election.type}
              </p>

              <div className="flex justify-center">
                {voted[election.id]?
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
                onClick={()=>toast.error("You already voted in this election")}
                >
                <FaCheckDouble className="mr-2" /> Voted
                </button>
                :<button className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-green-600" onClick={() => 
                  value.isRegisteredVoter?handleElectionClick(election):toast.error("Update voter details to participate in an election")}>
                  <FaExclamationCircle className="mr-2" /> Participate
                </button>}
              </div>
            </div>
          ))}
        </div>:<p className="text-center text-gray-500 bg-gray-100 p-4 rounded-lg">
  There are no ongoing elections at the moment.
</p>}
      </div>
      {/* Upcoming Elections */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Elections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample elections */}
          {upcomingElections.length>0?
            upcomingElections.map((election,index)=>{
              return (
                <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center"
                onClick={()=>toast.error("You can't participate in this election until it becomes active.")}
                >
            <CalendarIcon className="h-10 w-10 text-indigo-500 mr-4" />
            <div>
              <h3 className="text-xl font-semibold">{election.name}</h3>
              <p className="mt-2 text-gray-600">Date: {election.election_date}</p>
            </div>
          </div>
              )
            })
          :<p className="text-center text-gray-500 bg-gray-100 p-4 rounded-lg">
          There are currently no upcoming elections.
        </p>}
        </div>
      </div>

      {/* Election Results */}
      <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recent Election Results</h2>
      {closedElection.length>0?
      closedElection.map((election,index) => (
        <div key={election.id} className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center mb-4">
          <ChartBarIcon className="h-10 w-10 text-green-500 mr-4" />
          <div>
            <h3 className="text-xl font-semibold">{election.name}</h3>
            <p className="mt-2 text-gray-600">
              {/* {countWinner(index)} */}
              Winner: {countWinner(index,election.type).candidate} - {countWinner(index,election.type).winrate}
            </p>
          </div>
        </div>
      )):
      <p className="text-center text-gray-500 bg-gray-100 p-4 rounded-lg">
      There are currently no upcoming elections.
    </p>
      }
    </div>

      {/* User Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Actions</h2>
        <div className="flex space-x-4">
          {isRegisteredVoter ? (
            <>
              <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={()=>{
                value.setUpdateStatus(true)
                navigate(`/dashboard/update-details`)
              }}>
                <UserIcon className="h-6 w-6 mr-2" />
                Update Registration
              </button>
            </>
          ) : (
            <Link to='/dashboard/update-details' className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              <UserIcon className="h-6 w-6 mr-2" />
              Complete Voter Registration
            </Link>
          )}
        </div>
      </div>
    </div>:<LoadingPage />}
    </>

  );
};

export default Dashboard;
