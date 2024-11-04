import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex justify-between items-center px-[4%]'>
      <img src={assets.logo} alt="logo" className='w-[max(10%,80px)] ' />
      <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm' onClick={() => setToken("")}>Logout</button>
    </div>
  )
}

export default Navbar
