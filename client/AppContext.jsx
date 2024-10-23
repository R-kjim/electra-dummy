import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';



export const AppContext=createContext()

const AppContextProvider = (props) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [updateStatus,setUpdateStatus]=useState(false)
    const [userData,setUserData]=useState([])
    const [param,setParam]=useState(null)
    const [isRegisteredVoter, setIsRegisteredVoter] = useState(false)
    const [regions,setRegions]=useState([])
    const [elections,setElections]=useState([])
    const [voters,setVoters]=useState([])
    const [filteredConstituencies,setConstituencies]=useState([])
    const [addWardData,setAddWard]=useState({county:"",constituency:"",name:""})
    const [subNav,setSubNav]=useState("")
    const userId=localStorage.getItem("userId")
    const[candidates,setCandidates]=useState([])
    

    //fetch functionalities
    useEffect(()=>{
       //refresh token method
       const accessToken = localStorage.getItem("accessToken");

      // Fetch user data
        const fetchUserData = async () => {
          const refreshToken=localStorage.getItem("refreshToken")
          try {
            let response = await fetch("https://electra-dummy.onrender.com/user", {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUserData(data);
              if (data.voter.length > 0) {
                setIsRegisteredVoter(true);
              }
            } else if (response.status === 401) {
              // If access token is expired (401), call refreshToken function
              await refreshToken();
              // Retry fetching the user data after refreshing the token
              // return fetchUserData();
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };

        // Refresh token method
        const refreshToken = async () => {
          const refreshToken = localStorage.getItem("refreshToken");
      
          if (!refreshToken) {
              toast.error("Login to proceed");
              return;
          }
      
          try {
              let response = await fetch("https://electra-dummy.onrender.com/refresh", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ refresh_token: refreshToken }) // Include the refresh token in the body
              });
      
              if (response.ok) {
                  const data = await response.json();
                  localStorage.setItem("accessToken", data.access_token);
                  fetchUserData()
                  console.log("Access token refreshed");
              } else {
                  const errorData = await response.json();
                  toast.error(`Failed to refresh token: ${errorData.msg || response.statusText}`);
                  console.log("Failed to refresh token", errorData);
              }
          } catch (error) {
              console.error("Error refreshing token:", error);
          }
      };
      

      
        //fetch regions data
        fetch("https://electra-dummy.onrender.com/get-boundaries")
        .then(res=>res.json())
        .then(data=>setRegions(data))

        //fetch elections
        fetch("https://electra-dummy.onrender.com/elections")
        .then(res=>res.json())
        .then(data=>setElections(data))

        //fetch voters data
        fetch("https://electra-dummy.onrender.com/voters",{
          method:"GET",
          headers:{
            "Authorization":`Bearer ${localStorage.getItem("accessToken")}`
          }
        })
        .then(res=>res.json())
        .then(data=>setVoters(data))

        //fetch  candidates data
        fetch("https://electra-dummy.onrender.com/candidates")
        .then(res=>res.json())
        .then(data=>setCandidates(data))
        fetchUserData()
    },[userId])
    //update data used in other pages once userData is updated
    useEffect(()=>{
      if(addWardData.county!==""){
      const filteredConstituencies=value.regions.counties.filter((region)=>{
        return region.name===addWardData.county
      })

      setConstituencies(filteredConstituencies)
    }
    },[addWardData])
    const value={
        isRegistering, setIsRegistering,userData,setUserData,param,setParam,
        isRegisteredVoter, setIsRegisteredVoter,regions,setRegions,userId,
        updateStatus,setUpdateStatus,elections,voters,filteredConstituencies,
        addWardData,setAddWard,subNav,setSubNav,candidates,setCandidates

    }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider >
  )
}

export default AppContextProvider
