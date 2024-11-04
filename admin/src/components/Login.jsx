import React, { useState } from 'react'
import { url } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.post(`${url}/api/user/admin`, {
        email, password
      })

      if (response.data.success) {
        setToken(response.data.token)
      } else {
        toast.error("Invalid email or password")
      }


    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
            <input onChange={(e) => setEmail(e.target.value)}
              value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email"
              placeholder='your@email.com' required />
          </div>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input onChange={(e) => setPassword(e.target.value)}
              value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Password' required />
          </div>
          <button type='submit' className='bg-black  w-full text-white rounded-md px-3 py-2'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
