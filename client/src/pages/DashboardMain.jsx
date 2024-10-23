import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { AppContext } from '../../AppContext'
import LoadingPage from './LoadingPage'

const DashboardMain = () => {
    const value=useContext(AppContext)
  return (
    <>
    {value.userData.email?<div className='mt-16'>
      <Outlet />
    </div>:<LoadingPage />}
    </>
  )
}

export default DashboardMain
