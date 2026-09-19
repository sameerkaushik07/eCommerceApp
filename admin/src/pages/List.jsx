import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({token}) => {

  const[list,setList] = useState([])
  const getImageUrl = (image) => {
    if (!image) return ''
    return image.startsWith('http') ? image : `${backendUrl}${image.startsWith('/') ? image : `/${image}`}`
  }

  const fetchList = async () => {

    try {
      
      const response = await axios.get(backendUrl + '/api/product/list')
      if(response.data.success){
        setList(response.data.products)
      }else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const removeProduct = async (productId) =>{
    try {
      
      const response = await axios.post(backendUrl + '/api/product/remove',{productId},{headers:{token}})

      if(response.data.success){
        toast.success(response.data.message)
        await fetchList();
      }else{
        toast.error(response.data.message)
      }


    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchList()
  },[])


  return (
    <>
      <p className='mb-2'>All Products List</p>

      <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] text-sm items-center py-1 px-2 bg-slate-200'>
        {/* List table title */}
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b> 
        <b className='text-center'>Action</b>
      </div>

        {/* Product List */}

        {
          list.map((item,index)=>(
            <div key={index} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'>
              <img className='w-12 h-12 object-cover' src={getImageUrl(item.image?.[0])} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>

            </div>
          ))

        }
    </>
  )
}

export default List
