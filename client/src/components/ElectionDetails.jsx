import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { toast } from 'react-toastify';
import politician from '../assets/politician.jpeg'
import Swal from 'sweetalert2';
const ElectionDetails = () => {
    const [selectedPosition, setSelectedPosition] = useState('');
    const [election,setElection]=useState({})
    const [myVotes,setMyvotes]=useState({})
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const params=useParams()
    let params1=params.electionId
    const value=useContext(AppContext)
    const navigate=useNavigate()
    //fetch the specific elections data
    useEffect(()=>{
        fetch(`http://127.0.0.1:5555/election/${params1}`)
        .then(res=>res.json())
        .then(data=>{setElection(data)
        })
    },[])
    const positions=["President","Governor","Senator","MP","MCA"]
    const handleVote = (name,position) => {
        // Check if the user already voted
        setMyvotes(myVotes=>({
            ...myVotes,[position]:name
        }))
        if (myVotes[position]) {
            toast.success(`Your vote for ${position} position has been updated.`);
        }
    };
    function successfn(){
        Swal.fire({
            title:"Success!",
            text:'Your vote has been submitted successfully.',
            icon:'success',
            confirmButtonText: "OK"
        }).then((result)=>{
            if(result.isConfirmed){
                successs()
            }
        })
    }
    function successs(){
        navigate(`/dashboard/user/${localStorage.getItem("userId")}`)
        window.location.reload()
    }
    function submitVote() {
        let votesArray = [];
        for (let items in myVotes) {
            let obj = {
                candidate: myVotes[items],
                election: election.name,
                voter: value.userData.voter[0].national_id
            };
            votesArray.push(obj);
        }
        Swal.fire({
            title: 'Submit your vote?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                let fetchPromises = [];
    
                for (let item of votesArray) {
                    // Push the fetch promise to the array
                    fetchPromises.push(
                        fetch("http://127.0.0.1:5555/vote", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(item)
                        })
                    );
                }
    
                // Wait for all fetch requests to complete
                Promise.all(fetchPromises)
                    .then((responses) => {
                        // Check if all the responses were successful
                        let success = responses.every(res => res.ok);
                        if (success) {
                            successfn()
                        } else {
                            Swal.fire('Error!', 'Some votes could not be submitted. Please try again.', 'error');
                        }
                    })
                    .catch((error) => {
                        Swal.fire('Error!', 'An error occurred while submitting your vote. Please try again.', 'error');
                        console.error('Error submitting votes:', error);
                    });
            }
        });
    }

    const NavBar = () => (
        <nav className="relative mb-4 max-w-7xl sm:px-6 lg:px-8">
        {/* Dropdown Button for Small Screens */}
        <div className="sm:hidden mb-2">
            <button
                className="w-full p-3 border rounded-lg bg-blue-600 text-white font-semibold"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Toggle positions"
            >
                Select Position
            </button>
            {isDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10">
                    {positions.map((position, index) => (
                        <button
                            key={index}
                            className={`block w-full text-left p-3 border-b last:border-b-0 ${
                                myVotes[position]
                                    ? 'bg-green-600 text-white' // If vote exists, make button green
                                    : selectedPosition === position
                                    ? 'bg-blue-600 text-white' // Otherwise, if selected, make button blue
                                    : 'bg-white text-gray-800' // Default style
                            } ${myVotes[position] ? '' : 'hover:bg-blue-600'} hover:text-white transition-colors duration-200`}
                            onClick={() => {
                                setSelectedPosition(position);
                                setIsDropdownOpen(false); // Close the dropdown after selection
                            }}
                            aria-label={`Select ${position}`}
                        >
                            {position}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Display Buttons on Larger Screens */}
        <div className="hidden sm:flex items-center justify-center space-x-4">
            {election.type==="General"?<>{positions.map((position, index) => (
                <button
                    key={index}
                    className={`p-3 border rounded-lg ${
                        myVotes[position]
                            ? 'bg-green-600 text-white' // If vote exists, make button green
                            : selectedPosition === position
                            ? 'bg-blue-600 text-white' // Otherwise, if selected, make button blue
                            : 'bg-white text-gray-800' // Default style
                    } ${myVotes[position] ? '' : 'hover:bg-blue-600'} hover:text-white transition-colors duration-200`}
                    onClick={() => setSelectedPosition(position)}
                    aria-label={`Select ${position}`}
                >
                    {position}
                </button>
            ))}</>:<button
            className={`p-3 border rounded-lg ${
                myVotes[election.type]
                    ? 'bg-green-600 text-white' // If vote exists, make button green
                    : selectedPosition === election.type
                    ? 'bg-blue-600 text-white' // Otherwise, if selected, make button blue
                    : 'bg-white text-gray-800' // Default style
            } ${myVotes[election.type] ? '' : 'hover:bg-blue-600'} hover:text-white transition-colors duration-200`}
            onClick={() => setSelectedPosition(election.type)}
            aria-label={`Select ${election.type}`}
        >
            {election.type}
        </button>
            }
            {/* Confirm Vote Button */}
            {election.type === 'General' && Object.keys(myVotes).length===5 || election.type !== 'General' && Object.keys(myVotes).length!==0?<button
                className="p-3 border rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                onClick={submitVote}
                aria-label="Confirm Vote"
            >
                Confirm Vote
            </button>:null}
        </div>

        {/* Confirm Vote Button for Small Screens */}
        {election.type === 'General' && Object.keys(myVotes).length===5 ?
        <button
            className="sm:hidden w-full mt-2 p-3 border rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            onClick={submitVote}
            aria-label="Confirm Vote"
        >
            Confirm Vote
        </button>:null}
    </nav>

    );
    return (
        <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg flex flex-col">
            <header className="text-center mb-6">
                <h1 className="text-5xl font-bold mb-4 text-gray-800">{election.name} Details</h1>
                <p className="text-gray-600 mb-4">{election.type === 'General'?"Select a category to vote for your preferred candidate.":`Select your preferred ${election.type} candidate to cast your vote`}</p>
            </header>
            {/* Show NavBar only if General Election is selected */}
            {<NavBar />}
            <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-700 mb-4">{election.type==="General"?selectedPosition:election.type}</h2>
            <main className="w-full">
                {election.type === 'General' && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 "> {/* Grid container */}
                        {election.candidates
                            .filter(position => position.position === selectedPosition)
                            .filter(position => {
                                if (position.position === "Governor") { return position.region === value.userData.voter[0].county.name; }
                                if (position.position === "Senator") { return position.region === value.userData.voter[0].county.name; }
                                if (position.position === "MP") { return position.region === value.userData.voter[0].constituency.name; }
                                if (position.position === "MCA") { return position.region === value.userData.voter[0].ward.name; }
                                if (position.position === "President") { return position; }
                            })
                            .map((position, index) => (
                                <section key={index} className={`mb-4  ${position.id===myVotes[position.position]? 'border border-green-500':"transition-shadow duration-200 ease-in-out transform hover:scale-105"}`}> 
                                    <div className={`bg-white p-4 rounded-lg shadow-md ${position.id === myVotes[selectedPosition] ?"hover:shadow-lg":null}  flex flex-col items-center`}>
                                        <img
                                            src={politician}
                                            alt={position.voter.user.name}
                                            className="h-40 w-40 rounded-full mx-auto mb-2 border-4 border-gray-300 shadow-lg"
                                        />
                                        <h3 className="text-xl font-semibold text-center text-gray-800">{position.voter.user.name}</h3>
                                        <p className="text-sm italic text-center text-gray-500">{position.party}</p>
                                        <p className="mt-2 text-gray-700 text-sm">{position.description}</p>
                                        <button
                                            className={`mt-4 ${position.id === myVotes[selectedPosition] ? 'bg-gray-400 ' : 'bg-blue-600 hover:bg-blue-800'} text-white px-6 py-2 rounded-lg  transition-colors shadow-md`}
                                            onClick={() => handleVote(position.id, position.position)}
                                            disabled={position.id === myVotes[selectedPosition]}
                                            // aria-label={`Vote for ${position.voter.user.name}`}
                                        >
                                            {position.id === myVotes[selectedPosition] ? 'Voted' : 'Vote'}
                                        </button>
                                    </div>
                                </section>
                            ))}
                    </div> // This div is now wrapping around the mapped sections to create the grid layout
                )}
                {
                    election.type!=="General" &&election.candidates&&(
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 "> {/* Grid container */}
                        {election.candidates
                          
                            .map((position, index) => (
                                <section key={index} className={`mb-4 transition-shadow duration-200 ease-in-out transform  ${position.id===myVotes[position.position]? 'border border-green-500':"hover:scale-105"}`}> 
                                    <div className={`bg-white p-4 rounded-lg shadow-md ${position.id===myVotes[position.position]?null:"hover:shadow-lg"}  flex flex-col items-center`}>
                                        <img
                                            src={politician}
                                            alt={position.voter.user.name}
                                            className="h-40 w-40 rounded-full mx-auto mb-2 border-4 border-gray-300 shadow-lg"
                                        />
                                        <h3 className="text-xl font-semibold text-center text-gray-800">{position.voter.user.name}</h3>
                                        <p className="text-sm italic text-center text-gray-500">{position.party}</p>
                                        <p className="mt-2 text-gray-700 text-sm">{position.description}</p>
                                        <button
                                            className={`mt-4 ${position.id===myVotes[position.position]? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-lg  transition-colors shadow-md`}
                                            onClick={() => handleVote(position.id, position.position)}
                                            disabled={position.id===myVotes[position.position]}
                                            // aria-label={`Vote for ${position.voter.user.name}`}
                                        >
                                            {position.id===myVotes[position.position] ? 'Voted' : 'Vote'}
                                        </button>
                                    </div>
                                </section>
                            ))}
                            {/* <button>Confirm</button> */}
                    </div>
                    )
                }
            </main>
            </div>
        </div>
    );
};

export default ElectionDetails;
