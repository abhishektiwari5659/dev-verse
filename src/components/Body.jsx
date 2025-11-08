import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Login from './Login'

const Body = () => {
  return (
    <div>
      <Navbar />
      <Login />
      <Outlet />
    </div>
  )
}

export default Body
