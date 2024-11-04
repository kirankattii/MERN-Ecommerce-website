import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { currency, url } from '../App'
import { toast } from 'react-toastify'


const List = () => {
  const [list, setList] = useState([])
  const fetchList = async () => {
    try {
      const responce = await axios.get(`${url}/api/product/list`)
      if (responce.data.success) {
        setList(responce.data.products)
      } else {
        toast.error(responce.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  console.log(list);

  useEffect(() => {
    fetchList()
  }, [])
  return (
    <>
      <p className='mb-2'>All Product List</p>
      <div className='flex flex-col gap-2'>
        {/* {list table title} */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* {Product list} */}
        {
          list.map((item, index) => (
            <div key={index} className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
              <img className='w-12' src={item?.image[0]} alt="" />
              <p>{item?.name}</p>
              <p>{item?.category}</p>
              <p>{currency}{item?.price}</p>
              <p className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default List
